// 全局类型定义

/** iTunes Search API 返回的单首歌曲 */
export interface Song {
  trackId: number;
  trackName: string; // 歌曲名（繁中）
  artistName: string; // 歌手名（繁中）
  previewUrl: string; // 30 秒 m4a 预览音频（在线）
  artworkUrl100: string; // 专辑封面
  primaryGenreName: string; // 流派
  releaseDate?: string; // 发行日期 ISO 字符串，用于年代筛选
  collectionName?: string; // 专辑名
  trackViewUrl?: string; // Apple Music 跳转链接
  localAudio?: string; // 本地音频路径（如 "audio/xxx.m4a"），优先使用
}

/** 单道题目 */
export interface Question {
  id: number;
  song: Song; // 正确答案歌曲
  options: Song[]; // 4 个选项（含正确答案，已打乱）
  correctIndex: number; // 正确答案在 options 中的索引
}

/** 单局游戏会话 */
export interface GameSession {
  questions: Question[]; // 10 道题
  currentIndex: number; // 当前题号 0-9
  correctCount: number; // 本局答对数
  usedFiftyFifty: boolean[]; // 每题是否用过 50/50
  replayed: boolean[]; // 每题是否用过重播
  answers: (number | null)[]; // 每题用户选择
  eliminatedOptions: (number[] | null)[]; // 50/50 后被剔除的选项索引
}

/** 用户本地数据 */
export interface UserData {
  level: number; // 当前等级，初始 1
  currentXP: number; // 当前累计 XP，初始 0
  levelUpXP: number; // 当前等级升级所需总 XP
  totalGames: number; // 累计游戏局数
  totalCorrect: number; // 累计答对题数
  totalAnswered: number; // 累计答题数（用于计算准确率）
  audioSource: "local-first" | "online-first"; // 音频源偏好
  items: {
    fiftyFifty: number; // 50/50 道具，初始 3
    replay: number; // 重播道具，初始 3
  };
}

/** 单局结算结果 */
export interface GameResult {
  correctCount: number; // 本局答对数
  xpEarned: number; // 本局获得 XP
  questions: Question[]; // 10 道题
  answers: (number | null)[]; // 每题用户选择
  levelBefore: number; // 结算前等级
  levelAfter: number; // 结算后等级
  leveledUp: boolean; // 是否升级
  xpBefore: number; // 结算前 currentXP
  xpAfter: number; // 结算后 currentXP
  levelUpXPAfter: number; // 结算后升级所需 XP
}
