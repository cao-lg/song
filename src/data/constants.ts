// 粤语歌手列表 - 用于后台更新歌曲池
// 繁体中文歌手名以提高 iTunes HK 区命中率
export const ARTISTS: string[] = [
  "鄭秀文", "陳奕迅", "張敬軒", "Dear Jane", "容祖兒", "古巨基", "楊千嬅",
  "謝安琪", "林奕匡", "張學友", "李克勤", "衛蘭", "Gareth.T", "柳應廷",
  "MIRROR", "ERROR", "周國賢", "陳柏宇", "許廷鏗", "鄭欣宜", "連詩雅",
  "JW", "吳若希", "菊梓喬", "譚詠麟", "張國榮", "梅艷芳", "Beyond",
  "達明一派", "盧冠廷", "葉蒨文", "林憶蓮", "王菲", "劉德華", "黎明",
  "郭富城", "鄭中基", "方力申", "側田", "關心妍", "陳慧琳", "梁詠琪",
  "蔡卓妍", "鍾欣潼", "Twins", "Shine", "Boy'z", "陳曉東", "蘇永康",
  "許志安", "梁漢文", "陳百強", "羅文", "甄妮", "徐小鳳", "鄧麗君",
  "草蜢", "黃家駒", "黃耀明", "劉美君", "陳慧嫻", "關淑怡", "彭羚",
  "鄭伊健", "陳小春", "謝霆鋒", "張智霖", "林家謙", "張天賦", "陳蕾",
  "姜濤", "呂爵安", "盧瀚霆", "C AllStar", "Supper Moment", "RubberBand",
  "ToNick", "Kolor", "觸執毛", "朱豔強", "Serrini", "陳葦璇", "黃淑蔓",
  "鍾柔美", "姚焯菲", "炎明熹",
];

/** 歌手性别（男團/樂隊歸入 male，保證男歌手歌曲的干擾項不會出現女歌手） */
export type Gender = "male" | "female";

export const ARTIST_GENDER: Record<string, Gender> = {
  鄭秀文: "female",
  陳奕迅: "male",
  張敬軒: "male",
  "Dear Jane": "male",
  容祖兒: "female",
  古巨基: "male",
  楊千嬅: "female",
  謝安琪: "female",
  林奕匡: "male",
  張學友: "male",
  李克勤: "male",
  衛蘭: "female",
  "Gareth.T": "male",
  柳應廷: "male",
  MIRROR: "male",
  ERROR: "male",
  周國賢: "male",
  陳柏宇: "male",
  許廷鏗: "male",
  鄭欣宜: "female",
  連詩雅: "female",
  JW: "female",
  吳若希: "female",
  菊梓喬: "female",
  譚詠麟: "male",
  張國榮: "male",
  梅艷芳: "female",
  Beyond: "male",
  達明一派: "male",
  盧冠廷: "male",
  葉蒨文: "female",
  林憶蓮: "female",
  王菲: "female",
  劉德華: "male",
  黎明: "male",
  郭富城: "male",
  鄭中基: "male",
  方力申: "male",
  側田: "male",
  關心妍: "female",
  陳慧琳: "female",
  梁詠琪: "female",
  蔡卓妍: "female",
  鍾欣潼: "female",
  Twins: "female",
  Shine: "male",
  "Boy'z": "male",
  陳曉東: "male",
  蘇永康: "male",
  許志安: "male",
  梁漢文: "male",
  陳百強: "male",
  羅文: "male",
  甄妮: "female",
  徐小鳳: "female",
  鄧麗君: "female",
  草蜢: "male",
  黃家駒: "male",
  黃耀明: "male",
  劉美君: "female",
  陳慧嫻: "female",
  關淑怡: "female",
  彭羚: "female",
  鄭伊健: "male",
  陳小春: "male",
  謝霆鋒: "male",
  張智霖: "male",
  林家謙: "male",
  張天賦: "male",
  陳蕾: "female",
  姜濤: "male",
  呂爵安: "male",
  盧瀚霆: "male",
  "C AllStar": "male",
  "Supper Moment": "male",
  RubberBand: "male",
  ToNick: "male",
  Kolor: "male",
  觸執毛: "male",
  朱豔強: "male",
  Serrini: "female",
  陳葦璇: "female",
  黃淑蔓: "female",
  鍾柔美: "female",
  姚焯菲: "female",
  炎明熹: "female",
};

/** 根據 artistName 查詢性别（容忍 iTunes 返回的微小差異，如「鄭秀文 (Sammi Cheng)」） */
export function getArtistGender(artistName: string): Gender | null {
  if (!artistName) return null;
  // 精確匹配優先
  if (ARTIST_GENDER[artistName]) return ARTIST_GENDER[artistName];
  // 子串匹配（任一預設歌手名出現在 artistName 中）
  for (const [name, gender] of Object.entries(ARTIST_GENDER)) {
    if (artistName.includes(name)) return gender;
  }
  return null;
}

/** 歌曲篩選條件 */
export interface SongFilter {
  genre: string; // "all" | "Cantopop" | "Pop" | "Rock" | "R&B/Soul"
  era: string; // "all" | "90s" | "00s" | "10s" | "20s"
}

export const DEFAULT_FILTER: SongFilter = { genre: "all", era: "all" };

/** 風格選項（value 對應 iTunes primaryGenreName，大小寫不敏感比對） */
export const GENRE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "Cantopop", label: "廣東歌" },
  { value: "Pop", label: "流行" },
  { value: "Rock", label: "搖滾" },
  { value: "R&B/Soul", label: "R&B" },
];

/** 年代選項 */
export const ERA_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "90s", label: "90年代" },
  { value: "00s", label: "00年代" },
  { value: "10s", label: "10年代" },
  { value: "20s", label: "20年代" },
];

/** 道具图标 ID */
export type ItemId = "fiftyFifty" | "replay" | "hint" | "shop";

/** 道具中文名 */
export const ITEM_LABEL: Record<ItemId, string> = {
  fiftyFifty: "剔除兩個",
  replay: "重播一次",
  hint: "提示",
  shop: "商店",
};

/** 评价横幅文案 */
export function getEvaluation(score: number): string {
  if (score < 4) return "繼續努力！";
  if (score <= 8) return "不錯喔！";
  return "太厲害了！";
}

/** 等级升级所需 XP：1 级 10 XP，每级 +5 */
export function calcLevelUpXP(level: number): number {
  return 10 + (level - 1) * 5;
}

/** localStorage key */
export const LS_KEY = "yuegezai_user_v1";
export const LS_SONG_POOL_KEY = "yuegezai_songpool_v1";
export const SONG_POOL_TTL = 60 * 60 * 1000; // 1 小时
