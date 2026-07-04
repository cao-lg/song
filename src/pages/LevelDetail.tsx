// 等级详情页
// 返回按钮 + 大圆形等级徽章 + 经验进度条 + 准确率/游戏次数统计
// + 風格/年代篩選 chips + 开始游戏按钮
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { PixelButton } from "@/components/PixelButton";
import { LevelBadge } from "@/components/LevelBadge";
import { ProgressBar } from "@/components/ProgressBar";
import {
  ArrowRightIcon,
  CloseIcon,
  SparkleIcon,
  StarIcon,
} from "@/components/PixelIcons";
import { useGameStore } from "@/store/gameStore";
import { GENRE_OPTIONS, ERA_OPTIONS } from "@/data/constants";
import { cn } from "@/lib/utils";

export default function LevelDetail() {
  const navigate = useNavigate();
  const user = useGameStore((s) => s.user);
  const filter = useGameStore((s) => s.filter);
  const setFilter = useGameStore((s) => s.setFilter);
  const xpToNext = Math.max(0, user.levelUpXP - user.currentXP);
  const accuracy =
    user.totalAnswered > 0
      ? Math.round((user.totalCorrect / user.totalAnswered) * 100)
      : 0;

  return (
    <PageShell decorationVariant="minimal">
      {/* 顶部：返回按钮 */}
      <header className="flex items-center justify-between">
        <button
          aria-label="返回"
          onClick={() => navigate("/")}
          className="pixel-border-sm bg-bad pixel-press p-2 text-white"
        >
          <CloseIcon size={20} />
        </button>
        <h1 className="font-pixel text-sm text-white pixel-text-shadow-sm">LEVEL</h1>
        <div className="w-9" />
      </header>

      {/* 大圆形像素等级徽章 */}
      <section className="mt-6 flex flex-col items-center">
        <div className="relative">
          {/* 环绕星星箭头装饰 */}
          <div className="absolute -top-3 -left-8 text-yellow2 animate-twinkle">
            <StarIcon size={20} />
          </div>
          <div className="absolute -top-5 -right-6 text-amber2 animate-twinkle" style={{ animationDelay: "0.3s" }}>
            <SparkleIcon size={18} />
          </div>
          <div className="absolute -bottom-2 -left-10 text-magenta animate-floaty">
            <StarIcon size={16} />
          </div>
          <div className="absolute -bottom-3 -right-8 text-sky2 animate-floaty" style={{ animationDelay: "0.5s" }}>
            <SparkleIcon size={18} />
          </div>

          <LevelBadge level={user.level} size="lg" shape="round" />
        </div>
        <p className="font-pixel text-[10px] text-white/70 mt-3 tracking-widest">
          CURRENT LEVEL
        </p>
      </section>

      {/* 经验进度条 */}
      <section className="mt-4 px-2">
        <p className="font-gothic text-xs text-white text-center mb-2">
          距離下一級還差 <span className="text-amber2 font-bold text-base">{xpToNext}</span> XP
        </p>
        <ProgressBar
          value={user.currentXP}
          max={user.levelUpXP}
          fillColor="bg-bad"
          height="md"
        />
        <p className="font-gothic text-[10px] text-white/60 text-center mt-1">
          {user.currentXP} / {user.levelUpXP} XP
        </p>
      </section>

      {/* 数据统计区 */}
      <section className="mt-4 grid grid-cols-2 gap-3">
        <div className="pixel-border bg-bgmid/70 p-3 text-center">
          <p className="font-pixel text-xl text-good pixel-text-shadow-sm">{accuracy}%</p>
          <p className="font-gothic text-[11px] text-white/80 mt-1 tracking-wider">準確率</p>
        </div>
        <div className="pixel-border bg-bgmid/70 p-3 text-center">
          <p className="font-pixel text-xl text-sky2 pixel-text-shadow-sm">{user.totalGames}</p>
          <p className="font-gothic text-[11px] text-white/80 mt-1 tracking-wider">遊戲次數</p>
        </div>
      </section>

      {/* 歌曲篩選區 */}
      <section className="mt-4">
        <p className="font-gothic text-xs text-white/70 mb-2 px-1 flex items-center gap-1">
          <span className="text-amber2">♬</span> 歌曲篩選
        </p>

        {/* 風格 */}
        <div className="pixel-border-sm bg-bgmid/50 p-2.5 mb-2">
          <p className="font-gothic text-[11px] text-white/60 mb-1.5">風格</p>
          <div className="flex flex-wrap gap-1.5">
            {GENRE_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                active={filter.genre === opt.value}
                onClick={() => setFilter({ ...filter, genre: opt.value })}
              />
            ))}
          </div>
        </div>

        {/* 年代 */}
        <div className="pixel-border-sm bg-bgmid/50 p-2.5">
          <p className="font-gothic text-[11px] text-white/60 mb-1.5">年代</p>
          <div className="flex flex-wrap gap-1.5">
            {ERA_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                active={filter.era === opt.value}
                onClick={() => setFilter({ ...filter, era: opt.value })}
              />
            ))}
          </div>
        </div>

        <p className="font-gothic text-[10px] text-white/45 mt-1.5 px-1">
          ※ 選項自動匹配同性別歌手，男歌手歌曲不會出現女歌手干擾項
        </p>
      </section>

      {/* 开始游戏按钮 */}
      <section className="mt-auto pt-4">
        <PixelButton
          variant="amber"
          size="lg"
          fullWidth
          onClick={() => navigate("/game")}
          className="flex items-center justify-center gap-3"
        >
          <span className="text-lg">開始遊戲</span>
          <ArrowRightIcon size={20} />
        </PixelButton>
      </section>
    </PageShell>
  );
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "pixel-border-sm pixel-press font-gothic text-xs px-2.5 py-1.5 transition-colors",
        active
          ? "bg-magenta text-white"
          : "bg-bgmid text-white/70 hover:text-white",
      )}
    >
      {label}
    </button>
  );
}
