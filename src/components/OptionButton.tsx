// 答题选项按钮
import { cn } from "@/lib/utils";
import type { Song } from "@/types";
import { CheckIcon, CloseIcon } from "./PixelIcons";

interface OptionButtonProps {
  label: "A" | "B" | "C" | "D";
  song: Song;
  state: "idle" | "correct" | "wrong" | "eliminated" | "disabled-correct";
  disabled: boolean;
  onClick: () => void;
}

const STATE_CLASS: Record<OptionButtonProps["state"], string> = {
  idle: "bg-yellow2 text-ink",
  correct: "bg-good text-white animate-flash-good",
  wrong: "bg-bad text-white animate-flash-bad",
  eliminated: "bg-bgmid text-white/30 line-through",
  "disabled-correct": "bg-good/70 text-white/90",
};

export function OptionButton({ label, song, state, disabled, onClick }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || state === "eliminated"}
      className={cn(
        "pixel-border pixel-press font-gothic w-full flex items-center gap-3 p-3 text-left",
        "disabled:cursor-not-allowed disabled:grayscale",
        STATE_CLASS[state],
      )}
    >
      {/* 标识 A/B/C/D */}
      <span className="pixel-border-sm bg-ink/30 w-7 h-7 flex items-center justify-center font-pixel text-xs text-white shrink-0">
        {label}
      </span>

      <span className="flex-1 min-w-0">
        <span className="block text-sm font-bold truncate">《{song.trackName}》</span>
        <span className="block text-xs opacity-80 truncate">{song.artistName}</span>
      </span>

      {/* 答题后状态图标 */}
      {state === "correct" && (
        <span className="shrink-0">
          <CheckIcon size={18} />
        </span>
      )}
      {state === "wrong" && (
        <span className="shrink-0">
          <CloseIcon size={18} />
        </span>
      )}
      {state === "disabled-correct" && (
        <span className="shrink-0">
          <CheckIcon size={18} />
        </span>
      )}
    </button>
  );
}
