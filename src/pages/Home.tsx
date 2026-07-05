// 首页（主菜单）
// 顶部信息区 + 品牌展示 + 角色展示 + 模式选择
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { PixelButton } from "@/components/PixelButton";
import { LevelBadge } from "@/components/LevelBadge";
import { PixelCharacter } from "@/components/PixelCharacter";
import {
  CdIcon,
  GroupIcon,
  IpodIcon,
  MenuIcon,
  MicIcon,
  QuestionIcon,
  RadioIcon,
  SingleIcon,
} from "@/components/PixelIcons";
import { useGameStore } from "@/store/gameStore";

export default function Home() {
  const navigate = useNavigate();
  const user = useGameStore((s) => s.user);
  const isNewPlayer = user.totalGames === 0;
  const xpToNext = Math.max(0, user.levelUpXP - user.currentXP);

  return (
    <PageShell decorationVariant="default">
      {/* 顶部信息区 */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <LevelBadge level={user.level} size="sm" shape="square" />
          <div className="font-gothic text-xs text-white leading-relaxed">
            {isNewPlayer && (
              <p className="text-yellow2 pixel-text-shadow-sm">新玩家，快的註冊啦！</p>
            )}
            <p className="text-white/85">
              距離下一級還差 <span className="text-amber2 font-bold">{xpToNext}</span> XP
            </p>
          </div>
        </div>
        <button
          aria-label="選單"
          className="pixel-border-sm bg-bgmid pixel-press p-2 text-white"
        >
          <MenuIcon size={18} />
        </button>
      </header>

      {/* 品牌展示区 */}
      <section className="mt-6 flex flex-col items-center text-center">
        <div className="relative">
          <div className="absolute -top-3 -left-6 text-magenta animate-spin-slow">
            <CdIcon size={32} />
          </div>
          <div className="absolute -top-2 -right-6 text-sky2 animate-floaty">
            <CdIcon size={24} />
          </div>
          <h1 className="font-pixel text-3xl sm:text-4xl text-amber2 pixel-text-shadow leading-tight">
            粵歌仔
          </h1>
          <p className="font-gothic text-xs text-white/70 mt-2 tracking-widest">
            像素風粵語歌猜歌
          </p>
        </div>
      </section>

      {/* 角色展示区 */}
      <section className="mt-4 flex justify-center">
        <div className="relative">
          {/* 环绕装饰 */}
          <div className="absolute -top-4 -left-8 text-amber2 animate-floaty">
            <IpodIcon size={28} />
          </div>
          <div className="absolute top-8 -right-10 text-sky2 animate-wiggle">
            <RadioIcon size={32} />
          </div>
          <div className="absolute bottom-2 -left-10 text-magenta animate-floaty" style={{ animationDelay: "0.5s" }}>
            <MicIcon size={28} />
          </div>
          <div className="absolute -bottom-2 -right-8 text-yellow2 animate-twinkle">
            <QuestionIcon size={32} />
          </div>

          {/* 像素人物 */}
          <div className="pixel-border-sm bg-bgmid/40 backdrop-blur-sm p-3 rounded-lg">
            <PixelCharacter size={180} className="animate-floaty" />
          </div>
        </div>
      </section>

      {/* 模式选择按钮 */}
      <section className="mt-auto pt-6 flex flex-col gap-4">
        <PixelButton
          variant="magenta"
          size="lg"
          fullWidth
          onClick={() => navigate("/level")}
          className="flex items-center justify-center gap-3"
        >
          <SingleIcon size={20} />
          <span className="text-lg">單人模式</span>
        </PixelButton>

        <PixelButton
          variant="sky"
          size="lg"
          fullWidth
          disabled
          className="flex items-center justify-center gap-3 relative"
        >
          <GroupIcon size={20} />
          <span className="text-lg">派對模式</span>
          <span className="absolute -top-3 right-2 font-gothic text-[10px] bg-yellow2 text-ink px-2 py-0.5 pixel-border-sm rotate-6">
            即將上線
          </span>
        </PixelButton>
      </section>
    </PageShell>
  );
}
