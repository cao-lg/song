// 粤语歌手列表 - 用于拉取歌曲池
// 繁体中文歌手名以提高 iTunes HK 区命中率
export const ARTISTS: string[] = [
  "鄭秀文",
  "陳奕迅",
  "張敬軒",
  "Dear Jane",
  "容祖兒",
  "古巨基",
  "楊千嬅",
  "謝安琪",
  "林奕匡",
  "張學友",
  "李克勤",
  "衛蘭",
  "Gareth.T",
  "柳應廷",
  "MIRROR",
  "ERROR",
];

/** 歌手性别（男團/樂隊歸入 male，保證男歌手歌曲的干擾項不會出現女歌手） */
export type Gender = "male" | "female";

export const ARTIST_GENDER: Record<string, Gender> = {
  鄭秀文: "female",
  陳奕迅: "male",
  張敬軒: "male",
  "Dear Jane": "male", // 樂隊
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
  MIRROR: "male", // 男團
  ERROR: "male", // 男團
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
export const LS_KEY = "canto_party_user_v1";
export const LS_SONG_POOL_KEY = "canto_party_songpool_v1";
export const SONG_POOL_TTL = 60 * 60 * 1000; // 1 小时
