// SVG 像素图标库 - 8-bit 风格音乐主题图标
// 所有图标用 shape-rendering="crispEdges" 保持像素锐利

interface IconProps {
  className?: string;
  size?: number;
}

function Svg({ children, size = 24, className }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

const P = "currentColor";

/** CD 光盘 */
export function CdIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <circle cx="8" cy="8" r="7" fill="none" stroke={P} strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3" fill="none" stroke={P} strokeWidth="1.5" />
      <rect x="7" y="7" width="2" height="2" fill={P} />
      <rect x="3" y="7" width="1" height="1" fill={P} opacity="0.5" />
      <rect x="12" y="8" width="1" height="1" fill={P} opacity="0.5" />
    </Svg>
  );
}

/** 麦克风 */
export function MicIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="6" y="1" width="4" height="7" fill={P} />
      <rect x="5" y="8" width="6" height="1" fill={P} />
      <rect x="7" y="9" width="2" height="3" fill={P} />
      <rect x="4" y="12" width="8" height="1" fill={P} />
      <rect x="3" y="3" width="1" height="4" fill={P} opacity="0.6" />
      <rect x="12" y="3" width="1" height="4" fill={P} opacity="0.6" />
    </Svg>
  );
}

/** 耳机 */
export function HeadphoneIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="2" y="7" width="2" height="5" fill={P} />
      <rect x="12" y="7" width="2" height="5" fill={P} />
      <rect x="3" y="5" width="10" height="2" fill={P} />
      <rect x="4" y="4" width="8" height="1" fill={P} />
      <rect x="4" y="11" width="1" height="1" fill={P} opacity="0.6" />
      <rect x="11" y="11" width="1" height="1" fill={P} opacity="0.6" />
    </Svg>
  );
}

/** 音符 */
export function NoteIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="4" y="2" width="1" height="9" fill={P} />
      <rect x="5" y="2" width="6" height="1" fill={P} />
      <rect x="10" y="2" width="1" height="9" fill={P} />
      <rect x="2" y="10" width="3" height="2" fill={P} />
      <rect x="8" y="10" width="3" height="2" fill={P} />
    </Svg>
  );
}

/** 双音符 */
export function DoubleNoteIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="4" y="2" width="1" height="10" fill={P} />
      <rect x="11" y="2" width="1" height="10" fill={P} />
      <rect x="4" y="2" width="8" height="1" fill={P} />
      <rect x="2" y="11" width="3" height="2" fill={P} />
      <rect x="9" y="11" width="3" height="2" fill={P} />
    </Svg>
  );
}

/** 星星 */
export function StarIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="7" y="1" width="2" height="2" fill={P} />
      <rect x="6" y="3" width="4" height="1" fill={P} />
      <rect x="1" y="4" width="14" height="2" fill={P} />
      <rect x="3" y="6" width="10" height="1" fill={P} />
      <rect x="4" y="7" width="8" height="1" fill={P} />
      <rect x="5" y="8" width="2" height="3" fill={P} />
      <rect x="9" y="8" width="2" height="3" fill={P} />
      <rect x="3" y="11" width="3" height="1" fill={P} />
      <rect x="10" y="11" width="3" height="1" fill={P} />
    </Svg>
  );
}

/** 爱心 */
export function HeartIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="3" y="3" width="3" height="1" fill={P} />
      <rect x="10" y="3" width="3" height="1" fill={P} />
      <rect x="2" y="4" width="5" height="2" fill={P} />
      <rect x="9" y="4" width="5" height="2" fill={P} />
      <rect x="2" y="6" width="12" height="3" fill={P} />
      <rect x="3" y="9" width="10" height="2" fill={P} />
      <rect x="5" y="11" width="6" height="1" fill={P} />
      <rect x="6" y="12" width="4" height="1" fill={P} />
      <rect x="7" y="13" width="2" height="1" fill={P} />
    </Svg>
  );
}

/** 闪光/十字星 */
export function SparkleIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="7" y="1" width="2" height="14" fill={P} />
      <rect x="1" y="7" width="14" height="2" fill={P} />
      <rect x="4" y="4" width="8" height="8" fill={P} opacity="0.4" />
      <rect x="6" y="2" width="4" height="1" fill={P} opacity="0.6" />
      <rect x="6" y="13" width="4" height="1" fill={P} opacity="0.6" />
      <rect x="2" y="6" width="1" height="4" fill={P} opacity="0.6" />
      <rect x="13" y="6" width="1" height="4" fill={P} opacity="0.6" />
    </Svg>
  );
}

/** 收音机 */
export function RadioIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="2" y="6" width="12" height="7" fill="none" stroke={P} strokeWidth="1.5" />
      <rect x="2" y="6" width="12" height="7" fill={P} opacity="0.2" />
      <rect x="4" y="8" width="3" height="3" fill={P} />
      <rect x="9" y="9" width="4" height="1" fill={P} />
      <rect x="9" y="11" width="3" height="1" fill={P} />
      <rect x="3" y="3" width="1" height="4" fill={P} />
      <rect x="3" y="3" width="6" height="1" fill={P} transform="rotate(20 6 3)" />
    </Svg>
  );
}

/** iPod/MP3 播放器 */
export function IpodIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="4" y="1" width="8" height="14" fill="none" stroke={P} strokeWidth="1.5" />
      <rect x="4" y="1" width="8" height="14" fill={P} opacity="0.15" />
      <rect x="6" y="3" width="4" height="3" fill={P} opacity="0.6" />
      <circle cx="8" cy="10" r="2.5" fill="none" stroke={P} strokeWidth="1.2" />
      <rect x="7" y="9" width="2" height="2" fill={P} />
    </Svg>
  );
}

/** 问号气泡 */
export function QuestionIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="3" y="2" width="10" height="8" fill="none" stroke={P} strokeWidth="1.5" />
      <rect x="3" y="2" width="10" height="8" fill={P} opacity="0.15" />
      <rect x="5" y="10" width="2" height="2" fill={P} />
      <rect x="4" y="12" width="2" height="1" fill={P} />
      <rect x="6" y="4" width="4" height="1" fill={P} />
      <rect x="9" y="5" width="1" height="1" fill={P} />
      <rect x="8" y="6" width="2" height="1" fill={P} />
      <rect x="7" y="7" width="1" height="1" fill={P} />
    </Svg>
  );
}

/** 时钟 */
export function ClockIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <circle cx="8" cy="8" r="6" fill="none" stroke={P} strokeWidth="1.5" />
      <rect x="7" y="3" width="2" height="1" fill={P} />
      <rect x="7" y="12" width="2" height="1" fill={P} />
      <rect x="3" y="7" width="1" height="2" fill={P} />
      <rect x="12" y="7" width="1" height="2" fill={P} />
      <rect x="7" y="5" width="1" height="3" fill={P} />
      <rect x="8" y="8" width="2" height="1" fill={P} />
    </Svg>
  );
}

/** 播放三角 */
export function PlayIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="4" y="3" width="2" height="10" fill={P} />
      <rect x="6" y="4" width="2" height="8" fill={P} />
      <rect x="8" y="5" width="2" height="6" fill={P} />
      <rect x="10" y="6" width="2" height="4" fill={P} />
    </Svg>
  );
}

/** 暂停 */
export function PauseIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="4" y="3" width="3" height="10" fill={P} />
      <rect x="9" y="3" width="3" height="10" fill={P} />
    </Svg>
  );
}

/** 灯泡 */
export function BulbIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="5" y="2" width="6" height="6" fill="none" stroke={P} strokeWidth="1.5" />
      <rect x="5" y="2" width="6" height="6" fill={P} opacity="0.2" />
      <rect x="6" y="8" width="4" height="1" fill={P} />
      <rect x="6" y="9" width="4" height="1" fill={P} />
      <rect x="7" y="10" width="2" height="2" fill={P} />
      <rect x="6" y="12" width="4" height="1" fill={P} />
      <rect x="7" y="4" width="2" height="2" fill={P} opacity="0.6" />
    </Svg>
  );
}

/** 商店（购物袋） */
export function ShopIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="3" y="5" width="10" height="9" fill="none" stroke={P} strokeWidth="1.5" />
      <rect x="3" y="5" width="10" height="9" fill={P} opacity="0.15" />
      <rect x="5" y="3" width="1" height="2" fill={P} />
      <rect x="10" y="3" width="1" height="2" fill={P} />
      <rect x="5" y="3" width="6" height="1" fill="none" stroke={P} strokeWidth="1.2" />
      <rect x="6" y="8" width="4" height="1" fill={P} />
    </Svg>
  );
}

/** 单人 */
export function SingleIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="6" y="2" width="4" height="3" fill={P} />
      <rect x="4" y="5" width="8" height="5" fill={P} />
      <rect x="5" y="10" width="2" height="4" fill={P} />
      <rect x="9" y="10" width="2" height="4" fill={P} />
    </Svg>
  );
}

/** 多人 */
export function GroupIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="2" y="3" width="3" height="2" fill={P} />
      <rect x="1" y="5" width="5" height="3" fill={P} />
      <rect x="11" y="3" width="3" height="2" fill={P} />
      <rect x="10" y="5" width="5" height="3" fill={P} />
      <rect x="6" y="2" width="4" height="3" fill={P} />
      <rect x="4" y="6" width="8" height="6" fill={P} />
      <rect x="5" y="12" width="2" height="3" fill={P} />
      <rect x="9" y="12" width="2" height="3" fill={P} />
    </Svg>
  );
}

/** 关闭叉号 */
export function CloseIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="3" y="3" width="2" height="2" fill={P} />
      <rect x="11" y="3" width="2" height="2" fill={P} />
      <rect x="5" y="5" width="2" height="2" fill={P} />
      <rect x="9" y="5" width="2" height="2" fill={P} />
      <rect x="7" y="7" width="2" height="2" fill={P} />
      <rect x="5" y="9" width="2" height="2" fill={P} />
      <rect x="9" y="9" width="2" height="2" fill={P} />
      <rect x="3" y="11" width="2" height="2" fill={P} />
      <rect x="11" y="11" width="2" height="2" fill={P} />
    </Svg>
  );
}

/** 汉堡菜单 */
export function MenuIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="2" y="4" width="12" height="2" fill={P} />
      <rect x="2" y="7" width="12" height="2" fill={P} />
      <rect x="2" y="10" width="12" height="2" fill={P} />
    </Svg>
  );
}

/** 对勾 */
export function CheckIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="2" y="8" width="2" height="2" fill={P} />
      <rect x="4" y="10" width="2" height="2" fill={P} />
      <rect x="6" y="12" width="2" height="2" fill={P} />
      <rect x="8" y="10" width="2" height="2" fill={P} />
      <rect x="10" y="8" width="2" height="2" fill={P} />
      <rect x="12" y="6" width="2" height="2" fill={P} />
      <rect x="14" y="4" width="1" height="2" fill={P} />
    </Svg>
  );
}

/** 右箭头 */
export function ArrowRightIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="10" y="7" width="2" height="2" fill={P} />
      <rect x="8" y="5" width="2" height="6" fill={P} />
      <rect x="6" y="3" width="2" height="10" fill={P} />
      <rect x="2" y="6" width="4" height="4" fill={P} />
    </Svg>
  );
}

/** 分享 */
export function ShareIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="6" y="2" width="4" height="4" fill="none" stroke={P} strokeWidth="1.5" />
      <rect x="6" y="2" width="4" height="4" fill={P} opacity="0.2" />
      <rect x="2" y="9" width="4" height="4" fill="none" stroke={P} strokeWidth="1.5" />
      <rect x="2" y="9" width="4" height="4" fill={P} opacity="0.2" />
      <rect x="10" y="9" width="4" height="4" fill="none" stroke={P} strokeWidth="1.5" />
      <rect x="10" y="9" width="4" height="4" fill={P} opacity="0.2" />
      <rect x="8" y="5" width="1" height="6" fill={P} transform="rotate(20 8 8)" />
      <rect x="8" y="5" width="1" height="6" fill={P} transform="rotate(-20 8 8)" />
    </Svg>
  );
}

/** 50/50 图标 */
export function FiftyFiftyIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="2" y="3" width="5" height="5" fill={P} opacity="0.5" />
      <rect x="9" y="3" width="5" height="5" fill={P} opacity="0.5" />
      <rect x="2" y="3" width="5" height="5" fill="none" stroke={P} strokeWidth="1" />
      <rect x="9" y="3" width="5" height="5" fill="none" stroke={P} strokeWidth="1" />
      <rect x="2" y="9" width="12" height="4" fill="none" stroke={P} strokeWidth="1" />
      <rect x="2" y="9" width="6" height="4" fill={P} opacity="0.6" />
      <rect x="8" y="9" width="1" height="4" fill={P} />
    </Svg>
  );
}

/** 重播图标 */
export function ReplayIcon({ className, size }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M 4 8 A 4 4 0 1 1 8 12" fill="none" stroke={P} strokeWidth="1.5" />
      <rect x="2" y="6" width="3" height="2" fill={P} />
      <rect x="2" y="6" width="3" height="2" fill={P} transform="rotate(-45 3 7)" />
      <rect x="6" y="11" width="2" height="2" fill={P} opacity="0.6" />
      <rect x="10" y="6" width="1" height="1" fill={P} opacity="0.6" />
    </Svg>
  );
}
