// 背景散点装饰 - 音符、爱心、星星、闪光像素元素
import { cn } from "@/lib/utils";
import {
  CdIcon,
  DoubleNoteIcon,
  HeartIcon,
  NoteIcon,
  SparkleIcon,
  StarIcon,
  MicIcon,
  HeadphoneIcon,
} from "./PixelIcons";

interface DecorationsProps {
  variant?: "default" | "minimal";
  className?: string;
}

interface DecoItem {
  Icon: React.ComponentType<{ className?: string; size?: number }>;
  top: string;
  left: string;
  size: number;
  color: string;
  anim: string;
  delay?: string;
}

const DECOS: DecoItem[] = [
  { Icon: NoteIcon, top: "8%", left: "5%", size: 20, color: "text-magenta", anim: "animate-floaty" },
  { Icon: HeartIcon, top: "12%", left: "85%", size: 18, color: "text-bad", anim: "animate-floaty", delay: "0.5s" },
  { Icon: StarIcon, top: "22%", left: "92%", size: 16, color: "text-yellow2", anim: "animate-twinkle" },
  { Icon: SparkleIcon, top: "30%", left: "3%", size: 18, color: "text-sky2", anim: "animate-twinkle", delay: "0.8s" },
  { Icon: DoubleNoteIcon, top: "45%", left: "8%", size: 22, color: "text-amber2", anim: "animate-floaty", delay: "1s" },
  { Icon: CdIcon, top: "55%", left: "90%", size: 24, color: "text-magenta", anim: "animate-spin-slow" },
  { Icon: StarIcon, top: "70%", left: "5%", size: 14, color: "text-amber2", anim: "animate-twinkle", delay: "1.2s" },
  { Icon: HeartIcon, top: "82%", left: "92%", size: 16, color: "text-magenta", anim: "animate-floaty", delay: "0.3s" },
  { Icon: NoteIcon, top: "88%", left: "10%", size: 18, color: "text-sky2", anim: "animate-floaty", delay: "1.5s" },
  { Icon: SparkleIcon, top: "65%", left: "95%", size: 14, color: "text-yellow2", anim: "animate-twinkle", delay: "0.6s" },
];

const MINIMAL_DECOS: DecoItem[] = [
  { Icon: NoteIcon, top: "10%", left: "6%", size: 18, color: "text-magenta/70", anim: "animate-floaty" },
  { Icon: StarIcon, top: "18%", left: "92%", size: 14, color: "text-yellow2/70", anim: "animate-twinkle" },
  { Icon: HeartIcon, top: "80%", left: "4%", size: 14, color: "text-bad/70", anim: "animate-floaty", delay: "0.5s" },
  { Icon: SparkleIcon, top: "75%", left: "94%", size: 14, color: "text-sky2/70", anim: "animate-twinkle", delay: "0.8s" },
];

const EXTRA_DECOS: DecoItem[] = [
  { Icon: MicIcon, top: "92%", left: "50%", size: 16, color: "text-amber2/60", anim: "animate-wiggle" },
  { Icon: HeadphoneIcon, top: "5%", left: "50%", size: 16, color: "text-sky2/60", anim: "animate-floaty", delay: "1.2s" },
];

export function Decorations({ variant = "default", className }: DecorationsProps) {
  const items = variant === "minimal" ? MINIMAL_DECOS : [...DECOS, ...EXTRA_DECOS];
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden z-0",
        className,
      )}
      aria-hidden="true"
    >
      {items.map((d, i) => {
        const { Icon } = d;
        return (
          <div
            key={i}
            className={cn("absolute", d.anim, d.color)}
            style={{
              top: d.top,
              left: d.left,
              animationDelay: d.delay,
            }}
          >
            <Icon size={d.size} />
          </div>
        );
      })}
    </div>
  );
}
