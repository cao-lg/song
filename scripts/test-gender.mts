// 驗證同性別干擾項邏輯（自包含，不依賴 @/ 別名）
// 運行：node --experimental-strip-types scripts/test-gender.mts

type Gender = "male" | "female";

const ARTIST_GENDER: Record<string, Gender> = {
  鄭秀文: "female",
  陳奕迅: "male",
  張敬軒: "male",
  容祖兒: "female",
  古巨基: "male",
  楊千嬅: "female",
  謝安琪: "female",
  林奕匡: "male",
  張學友: "male",
  李克勤: "male",
  衛蘭: "female",
};

function getArtistGender(artistName: string): Gender | null {
  if (!artistName) return null;
  if (ARTIST_GENDER[artistName]) return ARTIST_GENDER[artistName];
  for (const [name, gender] of Object.entries(ARTIST_GENDER)) {
    if (artistName.includes(name)) return gender;
  }
  return null;
}

interface Song {
  trackId: number;
  trackName: string;
  artistName: string;
  previewUrl: string;
  artworkUrl100: string;
  primaryGenreName: string;
  releaseDate?: string;
}

interface Question {
  id: number;
  song: Song;
  options: Song[];
  correctIndex: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 復刻 src/lib/itunes.ts 中的 generateQuestions 同性別邏輯（干擾項允許跨題復用，每次循環重新打亂）
function generateQuestions(pool: Song[], count = 10): Question[] {
  const questions: Question[] = [];
  const usedCorrectIds = new Set<number>();

  for (let i = 0; i < count; i++) {
    const shuffledPool = shuffle(pool);

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

function mockSong(artist: string, title: string, id: number): Song {
  return {
    trackId: id,
    trackName: title,
    artistName: artist,
    previewUrl: `https://example.com/${id}.m4a`,
    artworkUrl100: "",
    primaryGenreName: "Cantopop",
    releaseDate: "2020-01-01T00:00:00Z",
  };
}

const pool: Song[] = [
  // 10 男
  mockSong("陳奕迅", "K歌之王", 1),
  mockSong("陳奕迅", "富土山下", 2),
  mockSong("張敬軒", "春秋", 3),
  mockSong("張學友", "李香蘭", 4),
  mockSong("李克勤", "月半小夜曲", 5),
  mockSong("古巨基", "愛得太遲", 6),
  mockSong("林奕匡", "高山低谷", 7),
  mockSong("張敬軒", "Blessing", 8),
  mockSong("陳奕迅", "沙龍", 9),
  mockSong("李克勤", "大會堂演奏廳", 10),
  // 6 女
  mockSong("鄭秀文", "終身美麗", 11),
  mockSong("容祖兒", "心之科學", 12),
  mockSong("楊千嬅", "少女的祈禱", 13),
  mockSong("謝安琪", "鍾無艷", 14),
  mockSong("衛蘭", "大哥", 15),
  mockSong("鄭秀文", "不要驚動愛情", 16),
];

// 極端情況：僅 4 首女歌手 + 8 首男歌手，驗證女歌手題目（最多 1 題正確答案，因需 3 個同性干擾項）
const extremePool: Song[] = [
  mockSong("陳奕迅", "K歌之王", 1),
  mockSong("張敬軒", "春秋", 2),
  mockSong("張學友", "李香蘭", 3),
  mockSong("李克勤", "月半小夜曲", 4),
  mockSong("古巨基", "愛得太遲", 5),
  mockSong("林奕匡", "高山低谷", 6),
  mockSong("陳奕迅", "沙龍", 7),
  mockSong("李克勤", "大會堂演奏廳", 8),
  // 僅 4 女
  mockSong("鄭秀文", "終身美麗", 11),
  mockSong("容祖兒", "心之科學", 12),
  mockSong("楊千嬅", "少女的祈禱", 13),
  mockSong("謝安琪", "鍾無艷", 14),
];

let violations = 0;
let totalQuestions = 0;
const runs = 100;

function runPool(testPool: Song[], label: string) {
  let v = 0;
  let t = 0;
  for (let r = 0; r < runs; r++) {
    const questions = generateQuestions(testPool, 10);
    for (const q of questions) {
      t++;
      const correctGender = getArtistGender(q.song.artistName);
      if (correctGender === null) continue;
      for (const opt of q.options) {
        if (opt.trackId === q.song.trackId) continue;
        const optGender = getArtistGender(opt.artistName);
        if (optGender !== null && optGender !== correctGender) {
          v++;
        }
      }
    }
  }
  console.log(`[${label}] ${runs} 輪 × 10 題 = ${t} 題，性別違規：${v} 次`);
  return v;
}

const v1 = runPool(pool, "標準池 10男+6女");
const v2 = runPool(extremePool, "極端池 8男+4女");
violations = v1 + v2;

console.log(`\n總計性別違規：${violations} 次`);
if (violations === 0) {
  console.log("✓ 通過：所有男歌手歌曲的干擾項均為男歌手，女歌手歌曲的干擾項均為女歌手");
  process.exit(0);
} else {
  console.log("✗ 失敗：存在跨性別干擾項");
  process.exit(1);
}
