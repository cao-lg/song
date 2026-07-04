// 游戏内音频播放器
// 像素播放/暂停按钮 + 歌名（默认 ??? 答题结束揭晓）+ 进度条 + Apple Music 跳转
// 优先使用 localAudio（本地静态资源），失败回退到 previewUrl（在线）
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getAudio } from "@/lib/audio";
import { ClockIcon, PauseIcon, PlayIcon } from "./PixelIcons";

interface GameAudioPlayerProps {
  previewUrl: string; // 在线音频 URL（兜底）
  localAudio?: string; // 本地音频路径（如 "audio/xxx.m4a"），优先使用
  trackName: string;
  artistName: string;
  trackViewUrl?: string;
  reveal: boolean;
  replayKey: number;
  autoPlay?: boolean;
}

export function GameAudioPlayer({
  previewUrl,
  localAudio,
  trackName,
  artistName,
  trackViewUrl,
  reveal,
  replayKey,
  autoPlay = true,
}: GameAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(30);
  // 实际使用的 URL：优先 localAudio，失败回退 previewUrl
  const [actualUrl, setActualUrl] = useState<string>(
    localAudio ? `/${localAudio}` : previewUrl,
  );

  // 切换歌曲或重播时，重置并自动播放
  useEffect(() => {
    // 每次切换歌曲时，重置为优先 localAudio
    const url = localAudio ? `/${localAudio}` : previewUrl;
    setActualUrl(url);

    const audio = getAudio(url);
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
    // 本地音频加载失败时，回退到在线 URL
    const onError = () => {
      if (localAudio && actualUrl !== previewUrl) {
        setActualUrl(previewUrl);
        const onlineAudio = getAudio(previewUrl);
        audioRef.current = onlineAudio;
        onlineAudio.currentTime = 0;
        if (autoPlay) {
          onlineAudio
            .play()
            .then(() => setPlaying(true))
            .catch(() => setPlaying(false));
        }
      }
    };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);

    if (autoPlay) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl, localAudio, replayKey]);

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
