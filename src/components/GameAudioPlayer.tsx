// 游戏内音频播放器
// 像素播放/暂停按钮 + 歌名（默认 ??? 答题结束揭晓）+ 进度条 + Apple Music 跳转
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getAudio } from "@/lib/audio";
import { ClockIcon, PauseIcon, PlayIcon } from "./PixelIcons";

interface GameAudioPlayerProps {
  previewUrl: string;
  trackName: string; // 真实歌名
  artistName: string;
  trackViewUrl?: string;
  reveal: boolean; // 是否揭晓歌名（答题后）
  replayKey: number; // 重播时 +1 触发重新播放
  autoPlay?: boolean;
}

export function GameAudioPlayer({
  previewUrl,
  trackName,
  artistName,
  trackViewUrl,
  reveal,
  replayKey,
  autoPlay = true,
}: GameAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const [duration, setDuration] = useState(30);

  // 切换歌曲或重播时，重置并自动播放
  useEffect(() => {
    const audio = getAudio(previewUrl);
    audioRef.current = audio;
    audio.currentTime = 0;
    setProgress(0);
    setPlaying(false);

    const onLoaded = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const onTime = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
      audio.currentTime = 0;
    };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    if (autoPlay) {
      // 少量延迟确保 audio 已就绪
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl, replayKey]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  return (
    <div className="pixel-border bg-bgmid/80 p-4">
      {/* 顶部播放按钮 + 歌名 */}
      <div className="flex items-center gap-3">
        <button
          aria-label={playing ? "暫停" : "播放"}
          onClick={togglePlay}
          className="pixel-border-sm bg-amber2 pixel-press p-3 text-ink shrink-0"
        >
          {playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
        </button>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-gothic text-lg font-bold truncate",
              reveal ? "text-white" : "text-yellow2",
            )}
          >
            {reveal ? trackName : "???"}
          </p>
          <p className="font-gothic text-xs text-white/60 truncate">
            {reveal ? artistName : "??? —— ???"}
          </p>
        </div>
        <div className="text-amber2 shrink-0">
          <ClockIcon size={20} />
        </div>
      </div>

      {/* 进度条 */}
      <div className="mt-3">
        <div className="pixel-border-sm bg-white h-3 relative overflow-hidden">
          <div
            className="h-full bg-bad transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 font-gothic text-[10px] text-white/60">
          <span>
            {Math.floor((duration * progress) / 100 / 60)}:
            {String(Math.floor((duration * progress) / 100) % 60).padStart(2, "0")}
          </span>
          <span>
            {Math.floor(duration / 60)}:{String(Math.floor(duration) % 60).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Apple Music 跳转 */}
      {trackViewUrl && (
        <a
          href={trackViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 font-gothic text-[11px] text-sky2 hover:text-sky2/80 underline"
        >
          在 Apple Music 播放 →
        </a>
      )}
    </div>
  );
}
