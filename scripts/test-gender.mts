// 驗證同性別干擾項 + 歌手分散邏輯（自包含，不依賴 @/ 別名）
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

// 复刻新版 pickDistractors：同歌手最多 1 首 + 优先全局使用次数少的歌手
function pickDistractors(
  candidates: Song[],
  n: number,
  usage: Map<string, number>,
): Song[] {
  const shuffled = shuffle(candidates);
  const sorted = shuffled.sort(
    (a, b) => (usage.get(a.artistName) ?? 0) - (usage.get(b.artistName) ?? 0),
  );
  const picked: Song[] = [];
  const pickedArtists = new Set<string>();
  for (const s of sorted) {
    if (picked.length >= n) break;
    if (pickedArtists.has(s.artistName)) continue;
    picked.push(s);
    pickedArtists.add(s.artistName);
  }
  for (const s of sorted) {
    if (picked.length >= n) break;
    if (picked.includes(s)) continue;
    picked.push(s);
  }
  for (const s of picked) {
    usage.set(s.artistName, (usage.get(s.artistName) ?? 0) + 1);
  }
  return picked;
}

// 复刻新版 generateQuestions：正确答案歌手不重复 + 干扰项同歌手最多1首
function generateQuestions(pool: Song[], count = 10): Question[] {
  const questions: Question[] = [];
  const usedCorrectIds = new Set<number>();
  const usedCorrectArtists = new Set<string>();
  const distractorArtistUsage = new Map<string, number>();

  const artistCount = new Set(pool.map((s) => s.artistName)).size;
  const enforceUniqueArtist = artistCount >= count;

  for (let i = 0; i < count; i++) {
    const shuffledPool = shuffle(pool);

    let correctSong: Song | undefined = shuffledPool.find(
      (s) =>
        !usedCorrectIds.has(s.trackId) &&
        (!enforceUniqueArtist || !usedCorrectArtists.has(s.artistName)),
    );
    if (!correctSong) {
      correctSong = shuffledPool.find((s) => !usedCorrectIds.has(s.trackId));
    }
    if (!correctSong) break;
    usedCorrectIds.add(correctSong.trackId);
    usedCorrectArtists.add(correctSong.artistName);

    const correctGender = getArtistGender(correctSong.artistName);

    let distractorCandidates: Song[] = [];
    if (correctGender !== null) {
      distractorCandidates = shuffledPool.filter(
        (s) =>
          s.trackId !== correctSong!.trackId &&
          s.trackName !== correctSong!.trackName &&
          getArtistGender(s.artistName) === correctGender,
      );
    }
    if (distractorCandidates.length < 3) {
      distractorCandidates = shuffledPool.filter(
        (s) =>
          s.trackId !== correctSong!.trackId &&
          s.trackName !== correctSong!.trackName,
      );
    }

    const distractors = pickDistractors(distractorCandidates, 3, distractorArtistUsage);
    const options = shuffle([correctSong, ...distractors]);
    questions.push({
      id: i,
      song: correctSong,
      options,
      correctIndex: options.findIndex((o) => o.trackId === correctSong!.trackId),
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

// 張敬軒偏多池：模擬用戶反饋的「都是張敬軒」場景（張敬軒 5 首 + 其他歌手各 1-2 首）
const zhangPool: Song[] = [
  mockSong("張敬軒", "春秋", 1),
  mockSong("張敬軒", "Blessing", 2),
  mockSong("張敬軒", "櫻花樹下", 3),
  mockSong("張敬軒", "酷刑", 4),
  mockSong("張敬軒", "塵埃", 5),
  mockSong("陳奕迅", "K歌之王", 6),
  mockSong("張學友", "李香蘭", 7),
  mockSong("李克勤", "月半小夜曲", 8),
  mockSong("古巨基", "愛得太遲", 9),
  mockSong("林奕匡", "高山低谷", 10),
  mockSong("陳奕迅", "沙龍", 11),
  mockSong("李克勤", "大會堂演奏廳", 12),
];

// 極端情況：僅 4 首女歌手 + 8 首男歌手
const extremePool: Song[] = [
  mockSong("陳奕迅", "K歌之王", 1),
  mockSong("張敬軒", "春秋", 2),
  mockSong("張學友", "李香蘭", 3),
  mockSong("李克勤", "月半小夜曲", 4),
  mockSong("古巨基", "愛得太遲", 5),
  mockSong("林奕匡", "高山低谷", 6),
  mockSong("陳奕迅", "沙龍", 7),
  mockSong("李克勤", "大會堂演奏廳", 8),
  mockSong("鄭秀文", "終身美麗", 11),
  mockSong("容祖兒", "心之科學", 12),
  mockSong("楊千嬅", "少女的祈禱", 13),
  mockSong("謝安琪", "鍾無艷", 14),
];

const runs = 100;

interface TestResult {
  genderViolations: number;
  totalQuestions: number;
  // 正确答案同歌手重复次数（同一局内）
  correctArtistDup: number;
  // 同一题干扰项同歌手重复次数（同一题 3 个干扰项中有同歌手）
  sameQDistractorDup: number;
  // 出现「整局 10 题正确答案都是同一歌手」的局数
  allSameArtistRounds: number;
}

function runPool(testPool: Song[], label: string): TestResult {
  const r: TestResult = {
    genderViolations: 0,
    totalQuestions: 0,
    correctArtistDup: 0,
    sameQDistractorDup: 0,
    allSameArtistRounds: 0,
  };
  for (let i = 0; i < runs; i++) {
    const questions = generateQuestions(testPool, 10);
    const correctArtistsThisRound = new Set<string>();
    let allSame = true;
    const firstArtist = questions[0]?.song.artistName;
    for (const q of questions) {
      r.totalQuestions++;
      // 性别一致性
      const correctGender = getArtistGender(q.song.artistName);
      if (correctGender !== null) {
        for (const opt of q.options) {
          if (opt.trackId === q.song.trackId) continue;
          const optGender = getArtistGender(opt.artistName);
          if (optGender !== null && optGender !== correctGender) {
            r.genderViolations++;
          }
        }
      }
      // 正确答案歌手重复
      if (correctArtistsThisRound.has(q.song.artistName)) {
        r.correctArtistDup++;
      }
      correctArtistsThisRound.add(q.song.artistName);
      if (q.song.artistName !== firstArtist) allSame = false;
      // 同题干扰项同歌手重复
      const distractorArtists = q.options
        .filter((o) => o.trackId !== q.song.trackId)
        .map((o) => o.artistName);
      const distractorArtistSet = new Set(distractorArtists);
      if (distractorArtistSet.size < distractorArtists.length) {
        r.sameQDistractorDup++;
      }
    }
    if (allSame && questions.length > 1) r.allSameArtistRounds++;
  }
  console.log(`[${label}] ${runs} 輪 × 10 題 = ${r.totalQuestions} 題`);
  console.log(`  性別違規：${r.genderViolations} 次`);
  console.log(`  正確答案同歌手重複：${r.correctArtistDup} 次`);
  console.log(`  同題干擾項同歌手重複：${r.sameQDistractorDup} 次`);
  console.log(`  整局正確答案全同歌手：${r.allSameArtistRounds} 局`);
  return r;
}

console.log("=== 歌手分散 + 性别一致性測試 ===\n");
const r1 = runPool(zhangPool, "張敬軒偏多池（5/12）");
const r2 = runPool(extremePool, "極端池 8男+4女");
console.log();

const totalGender = r1.genderViolations + r2.genderViolations;
const totalAllSame = r1.allSameArtistRounds + r2.allSameArtistRounds;

let pass = true;
if (totalGender > 0) {
  console.log(`✗ 失敗：存在跨性別干擾項（${totalGender} 次）`);
  pass = false;
}
if (totalAllSame > 0) {
  console.log(`✗ 失敗：存在整局正確答案全同歌手（${totalAllSame} 局）`);
  pass = false;
}
if (pass) {
  console.log("✓ 通過：");
  console.log("  - 男歌手歌曲的干擾項均為男歌手，女歌手歌曲的干擾項均為女歌手");
  console.log("  - 整局 10 題正確答案不會都是同一歌手");
  console.log(`  - 張敬軒偏多池：正確答案同歌手重複 ${r1.correctArtistDup} 次（歌手數 < 10 時允許少量重複）`);
  console.log(`  - 同題干擾項同歌手重複：張池 ${r1.sameQDistractorDup} 次 / 極端池 ${r2.sameQDistractorDup} 次（候選不足時回退）`);
  process.exit(0);
} else {
  process.exit(1);
}
