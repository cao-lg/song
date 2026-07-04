// iTunes Search API 调用 + 题目生成
// 主方案：同域 /api/get-songs（Cloudflare Pages Functions 代理）
// 备选方案：JSONP 直连 iTunes（开发环境或 Functions 未就绪时）
import type { Song, Question } from "@/types";
import {
  ARTISTS,
  LS_SONG_POOL_KEY,
  SONG_POOL_TTL,
  DEFAULT_FILTER,
  getArtistGender,
  type SongFilter,
} from "@/data/constants";

interface ItunesRawResult {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
  artworkUrl100?: string;
  primaryGenreName?: string;
  releaseDate?: string;
  collectionName?: string;
  trackViewUrl?: string;
  kind?: string;
  isStreamable?: boolean;
}

interface ItunesResponse {
  resultCount: number;
  results: ItunesRawResult[];
}

/** 将 iTunes 原始结果清洗为 Song */
function toSong(raw: ItunesRawResult): Song | null {
  if (!raw.trackId || !raw.trackName || !raw.artistName || !raw.previewUrl) return null;
  return {
    trackId: raw.trackId,
    trackName: raw.trackName,
    artistName: raw.artistName,
    previewUrl: raw.previewUrl,
    artworkUrl100: raw.artworkUrl100 ?? "",
    primaryGenreName: raw.primaryGenreName ?? "",
    releaseDate: raw.releaseDate,
    collectionName: raw.collectionName,
    trackViewUrl: raw.trackViewUrl,
  };
}

/** 主方案：通过同域代理拉取（Cloudflare Pages Functions） */
async function fetchViaProxy(term: string, limit: number): Promise<Song[]> {
  const url = `/api/get-songs?term=${encodeURIComponent(term)}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`proxy ${res.status}`);
  const data = (await res.json()) as { songs?: ItunesRawResult[] };
  return (data.songs ?? []).map(toSong).filter((s): s is Song => s !== null);
}

/** 备选方案：JSONP 直连 iTunes（开发环境或 Functions 未就绪时） */
function fetchViaJsonp(term: string, limit: number): Promise<Song[]> {
  return new Promise((resolve, reject) => {
    const cbName = `__itunes_cb_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    const script = document.createElement("script");
    const win = window as unknown as Record<string, unknown>;
    const cleanup = () => {
      delete win[cbName];
      script.remove();
    };
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("JSONP timeout"));
    }, 8000);
    win[cbName] = (data: ItunesResponse) => {
      window.clearTimeout(timer);
      cleanup();
      const songs = (data.results ?? []).map(toSong).filter((s): s is Song => s !== null);
      resolve(songs);
    };
    script.onerror = () => {
      window.clearTimeout(timer);
      cleanup();
      reject(new Error("JSONP error"));
    };
    const params = new URLSearchParams({
      term,
      media: "music",
      country: "hk",
      lang: "zh_hk",
      limit: String(limit),
      callback: cbName,
    });
    script.src = `https://itunes.apple.com/search?${params.toString()}`;
    document.body.appendChild(script);
  });
}

/** 拉取单个歌手的歌曲，先试代理，失败回退 JSONP */
export async function fetchSongsByArtist(term: string, limit = 25): Promise<Song[]> {
  try {
    return await fetchViaProxy(term, limit);
  } catch (e) {
    console.warn("[itunes] proxy failed, fallback to JSONP:", e);
    return await fetchViaJsonp(term, limit);
  }
}

/** 风格匹配：大小写不敏感精确比对 primaryGenreName */
function matchGenre(primaryGenreName: string | undefined, genre: string): boolean {
  if (genre === "all") return true;
  if (!primaryGenreName) return false;
  return primaryGenreName.toLowerCase() === genre.toLowerCase();
}

/** 年代匹配：按 releaseDate 年份分桶 */
function matchEra(releaseDate: string | undefined, era: string): boolean {
  if (era === "all") return true;
  if (!releaseDate) return false;
  const year = parseInt(releaseDate.slice(0, 4), 10);
  if (Number.isNaN(year)) return false;
  switch (era) {
    case "90s":
      return year >= 1990 && year < 2000;
    case "00s":
      return year >= 2000 && year < 2010;
    case "10s":
      return year >= 2010 && year < 2020;
    case "20s":
      return year >= 2020 && year < 2030;
    default:
      return true;
  }
}

/** 应用筛选条件到歌曲池 */
function applyFilter(pool: Song[], filter: SongFilter): Song[] {
  return pool.filter(
    (s) => matchGenre(s.primaryGenreName, filter.genre) && matchEra(s.releaseDate, filter.era),
  );
}

/**
 * 拉取全量歌曲池（多歌手并发 + cantopop 热门补充），并按筛选条件过滤
 * - 全量池 localStorage 缓存 1 小时（key 固定，不隨 filter 變化）
 * - 篩選在全量池上做，避免切換篩選重複請求 iTunes
 */
export async function fetchSongPool(filter: SongFilter = DEFAULT_FILTER): Promise<Song[]> {
  // 1. 先看本地全量缓存
  let fullPool: Song[] = [];
  try {
    const cached = localStorage.getItem(LS_SONG_POOL_KEY);
    if (cached) {
      const { ts, songs } = JSON.parse(cached) as { ts: number; songs: Song[] };
      if (Date.now() - ts < SONG_POOL_TTL && Array.isArray(songs) && songs.length >= 8) {
        fullPool = songs;
      }
    }
  } catch {
    // 缓存损坏，忽略
  }

  // 2. 缓存失效则并发拉取所有歌手 + cantopop 热门补充
  if (fullPool.length === 0) {
    const searchTerms = [...ARTISTS, "cantopop", "廣東歌"];
    const results = await Promise.allSettled(searchTerms.map((a) => fetchSongsByArtist(a, 50)));
    const seenIds = new Set<number>();
    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      for (const s of r.value) {
        if (!seenIds.has(s.trackId)) {
          seenIds.add(s.trackId);
          fullPool.push(s);
        }
      }
    }
    if (fullPool.length < 8) {
      throw new Error("歌曲池數量不足，請檢查網絡或稍後重試");
    }
    // 写入全量缓存
    try {
      localStorage.setItem(LS_SONG_POOL_KEY, JSON.stringify({ ts: Date.now(), songs: fullPool }));
    } catch {
      // localStorage 满了，忽略
    }
  }

  // 3. 应用筛选
  const filtered = applyFilter(fullPool, filter);
  if (filtered.length < 8) {
    throw new Error("此篩選條件下歌曲不足，請調整篩選或選擇「全部」");
  }
  return filtered;
}

/** 打乱数组（Fisher-Yates） */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 从歌曲池生成 10 道不重复题目
 * - 正确答案不可重複（每首歌只作為正確答案一次）
 * - 干扰项优先與正確答案歌手同性別（男歌手歌曲的干擾項不會出現女歌手）
 * - 干擾項允許跨題復用（僅排除當前正確答案），以最大化同性別匹配率
 * - 僅當同性別干擾項 < 3 時才回退到任意歌曲，保證題目可生成
 * - 每次循环重新打乱池，确保题目多样性（避免缓存后每次相同）
 */
export function generateQuestions(pool: Song[], count = 10): Question[] {
  if (pool.length < 4) throw new Error("歌曲池不足 4 首");
  const questions: Question[] = [];
  const usedCorrectIds = new Set<number>();

  for (let i = 0; i < count; i++) {
    // 每次循环重新打乱，确保随机选到不同歌手的歌曲
    const shuffledPool = shuffle(pool);

    // 从打乱后的池中找第一首未用作正確答案的歌曲
    const correctSong = shuffledPool.find((s) => !usedCorrectIds.has(s.trackId));
    if (!correctSong) break;
    usedCorrectIds.add(correctSong.trackId);

    const correctGender = getArtistGender(correctSong.artistName);

    let distractorCandidates: Song[] = [];
    if (correctGender !== null) {
      distractorCandidates = shuffledPool.filter(
        (s) =>
          s.trackId !== correctSong.trackId &&
          s.trackName !== correctSong.trackName &&
          getArtistGender(s.artistName) === correctGender,
      );
    }
    if (distractorCandidates.length < 3) {
      distractorCandidates = shuffledPool.filter(
        (s) =>
          s.trackId !== correctSong.trackId &&
          s.trackName !== correctSong.trackName,
      );
    }

    const distractors = shuffle(distractorCandidates).slice(0, 3);
    const options = shuffle([correctSong, ...distractors]);
    questions.push({
      id: i,
      song: correctSong,
      options,
      correctIndex: options.findIndex((o) => o.trackId === correctSong.trackId),
    });
  }
  return questions;
}
