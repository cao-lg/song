// HTML5 audio 元素管理：预加载 + 切换无缝衔接
// 优先使用本地音频（localAudio），失败回退在线（previewUrl）
import type { Song } from "@/types";

const audioCache = new Map<string, HTMLAudioElement>();

/** 获取或创建音频实例（同一 url 复用） */
export function getAudio(url: string): HTMLAudioElement {
  let audio = audioCache.get(url);
  if (!audio) {
    audio = new Audio(url);
    audio.preload = "auto";
    audioCache.set(url, audio);
  }
  return audio;
}

/** 获取实际播放的 URL（优先 localAudio，否则 previewUrl） */
export function getPlayUrl(song: Song): string {
  return song.localAudio ? `/${song.localAudio}` : song.previewUrl;
}

/** 预加载多首歌曲音频（优先预加载本地音频） */
export function preloadSongs(songs: Song[]): void {
  for (const s of songs) {
    getAudio(getPlayUrl(s));
  }
}

/** 释放所有音频缓存（局结束时调用） */
export function releaseAllAudio(): void {
  for (const audio of audioCache.values()) {
    audio.pause();
    audio.src = "";
  }
  audioCache.clear();
}

/** 停止除指定 url 外的所有音频 */
export function stopAllExcept(url: string): void {
  for (const [u, audio] of audioCache) {
    if (u !== url) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
}
