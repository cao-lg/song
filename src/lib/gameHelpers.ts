// 游戏辅助工具函数
import { LS_SONG_POOL_KEY } from "@/data/constants";

/** 清除 localStorage 中的歌曲池缓存（再玩一次时调用，确保刷新歌曲） */
export function clearSongPoolCache(): void {
  try {
    localStorage.removeItem(LS_SONG_POOL_KEY);
  } catch {
    // 忽略
  }
}
