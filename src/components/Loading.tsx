// 像素加载动画
import { CdIcon } from "./PixelIcons";

interface LoadingProps {
  text?: string;
}

export function Loading({ text = "載入中..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="text-magenta animate-spin-slow">
        <CdIcon size={56} />
      </div>
      <p className="font-gothic text-sm text-white/80 animate-pulse">{text}</p>
    </div>
  );
}
