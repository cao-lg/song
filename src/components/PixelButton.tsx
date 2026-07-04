// 像素风按钮 - 带描边阴影 + 按压反馈
import { cn } from "@/lib/utils";

type Variant = "magenta" | "sky" | "amber" | "yellow" | "good" | "bad" | "ghost";

const VARIANT_CLASS: Record<Variant, string> = {
  magenta: "bg-magenta text-white",
  sky: "bg-sky2 text-white",
  amber: "bg-amber2 text-white",
  yellow: "bg-yellow2 text-ink",
  good: "bg-good text-white",
  bad: "bg-bad text-white",
  ghost: "bg-bgmid text-white",
};

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function PixelButton({
  variant = "magenta",
  size = "md",
  fullWidth = false,
  className,
  children,
  disabled,
  ...rest
}: PixelButtonProps) {
  const sizeClass =
    size === "sm"
      ? "px-3 py-2 text-xs"
      : size === "lg"
      ? "px-6 py-4 text-base"
      : "px-4 py-3 text-sm";

  return (
    <button
      {...rest}
      disabled={disabled}
      className={cn(
        "pixel-border pixel-press font-gothic font-bold uppercase tracking-wider",
        "select-none active:translate-y-0.5",
        VARIANT_CLASS[variant],
        sizeClass,
        fullWidth ? "w-full" : "",
        disabled && "opacity-50 cursor-not-allowed grayscale",
        className,
      )}
    >
      {children}
    </button>
  );
}
