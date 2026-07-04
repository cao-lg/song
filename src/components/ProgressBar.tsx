// 像素进度条 - 红色填充 + 白色未完成 + 边框
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 当前值
  max: number; // 最大值
  className?: string;
  fillColor?: string; // 自定义填充色，默认红
  showLabel?: boolean; // 是否显示文字标签
  height?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max,
  className,
  fillColor = "bg-bad",
  showLabel = false,
  height = "md",
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const h = height === "sm" ? "h-3" : height === "lg" ? "h-6" : "h-4";

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("pixel-border-sm bg-white/95 relative overflow-hidden", h)}>
        <div
          className={cn("h-full transition-all duration-500 ease-out", fillColor)}
          style={{ width: `${pct}%` }}
        />
        {/* 像素纹理 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 4px, rgba(0,0,0,0.2) 4px 5px)",
          }}
        />
      </div>
      {showLabel && (
        <div className="font-gothic text-xs text-white/90 mt-1 text-center">
          {value} / {max}
        </div>
      )}
    </div>
  );
}
