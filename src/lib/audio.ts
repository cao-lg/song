// HTML5 audio 元素管理：预加载 + 切换无缝衔接
import type { Song } from "@/types";
import type { AudioSource } from "@/data/constants";

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

/** 根据音频源偏好获取优先 URL */
export function getPlayUrl(song: Song, source: AudioSource = "local-first"): string {
  if (source === "online-first") return song.previewUrl;
  return song.localAudio ? `/${song.localAudio}` : song.previewUrl;
}

/** 获取备选 URL（主源失败时回退） */
export function getFallbackUrl(song: Song, source: AudioSource = "local-first"): string | null {
  if (source === "online-first") {
    return song.localAudio ? `/${song.localAudio}` : null;
  }
  return song.previewUrl;
}

/** 预加载多首歌曲音频（根据音频源偏好选择预加载哪个） */
export function preloadSongs(songs: Song[], source: AudioSource = "local-first"): void {
  for (const s of songs) {
    getAudio(getPlayUrl(s, source));
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
