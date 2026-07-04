// 像素等级徽章 - 方形（小）和圆形（大）两种
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
  shape?: "square" | "round";
  className?: string;
}

export function LevelBadge({
  level,
  size = "md",
  shape = "square",
  className,
}: LevelBadgeProps) {
  const sizeClass =
    size === "sm"
      ? "w-12 h-12 text-sm"
      : size === "lg"
      ? "w-32 h-32 text-3xl"
      : "w-16 h-16 text-base";

  const shapeClass = shape === "round" ? "rounded-full" : "rounded-md";

  return (
    <div
      className={cn(
        "pixel-border flex items-center justify-center",
        "bg-gradient-to-br from-amber2 to-magenta",
        "font-pixel text-white pixel-text-shadow-sm",
        sizeClass,
        shapeClass,
        className,
      )}
    >
      <div className="flex flex-col items-center leading-none">
        <span className="text-[0.5em] opacity-90">LV.</span>
        <span className="text-[1.4em]">{level}</span>
      </div>
    </div>
  );
}
