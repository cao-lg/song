// 最终结算页
// 评价横幅 + 等级结算区（徽章 + 本局XP + 升级进度 + 分享） + 再玩一次/主页按钮
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { PixelButton } from "@/components/PixelButton";
import { LevelBadge } from "@/components/LevelBadge";
import { ProgressBar } from "@/components/ProgressBar";
import {
  ShareIcon,
  SparkleIcon,
  StarIcon,
} from "@/components/PixelIcons";
import { useGameStore } from "@/store/gameStore";
import { getEvaluation } from "@/data/constants";
import { clearSongPoolCache } from "@/lib/gameHelpers";

export default function Settlement() {
  const navigate = useNavigate();
  const endGame = useGameStore((s) => s.endGame);
  const clearSession = useGameStore((s) => s.clearSession);
  const user = useGameStore((s) => s.user);
  const [result, setResult] = useState(() => endGame());
  const [copied, setCopied] = useState(false);

  const evaluation = getEvaluation(result.correctCount);
  const xpToNext = Math.max(0, result.levelUpXPAfter - result.xpAfter);

  const handleShare = async () => {
    const text = `我在 Canto Party 今 Round 答對 ${result.correctCount}/${result.questions.length} 題，獲得 ${result.xpEarned} XP！${evaluation}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Canto Party", text, url: window.location.origin });
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // 用户取消，忽略
    }
  };

  const handleReplay = () => {
    clearSongPoolCache();
    clearSession();
    navigate("/game");
  };

  const handleHome = () => {
    clearSession();
    navigate("/");
  };

  return (
    <PageShell decorationVariant="default">
      {/* 顶部标题 */}
      <header className="text-center mt-2">
        <h1 className="font-pixel text-2xl text-amber2 pixel-text-shadow">遊戲結果</h1>
      </header>

      {/* 评价横幅 */}
      <section className="mt-6 text-center">
        <div className="relative inline-block">
          <div className="absolute -top-4 -left-8 text-yellow2 animate-twinkle">
            <StarIcon size={22} />
          </div>
          <div className="absolute -top-3 -right-8 text-magenta animate-twinkle" style={{ animationDelay: "0.4s" }}>
            <SparkleIcon size={20} />
          </div>
          <div
            className={`pixel-border px-6 py-3 font-pixel text-lg ${
              result.correctCount < 4
                ? "bg-bad text-white"
                : result.correctCount <= 8
                ? "bg-amber2 text-ink"
                : "bg-good text-white"
            } ${result.leveledUp ? "animate-pop-in" : ""}`}
          >
            {evaluation}
          </div>
        </div>
        {result.leveledUp && (
          <p className="mt-3 font-gothic text-sm text-yellow2 animate-pulse">
            ★ LEVEL UP！升到 LV.{result.levelAfter} ★
          </p>
        )}
      </section>

      {/* 等级结算区 */}
      <section className="mt-6 flex flex-col items-center">
        <LevelBadge level={result.levelAfter} size="lg" shape="round" />
      </section>

      {/* 本局 XP */}
      <section className="mt-5 px-2">
        <div className="pixel-border bg-bgmid/80 p-4 flex items-center justify-between">
          <span className="font-gothic text-sm text-white/80">本局獲得</span>
          <span className="font-pixel text-2xl text-good pixel-text-shadow-sm">
            +{result.xpEarned} XP
          </span>
        </div>
      </section>

      {/* 升级进度 */}
      <section className="mt-4 px-2">
        <p className="font-gothic text-xs text-white text-center mb-2">
          距離下一級還差 <span className="text-amber2 font-bold text-base">{xpToNext}</span> XP
        </p>
        <ProgressBar
          value={result.xpAfter}
          max={result.levelUpXPAfter}
          fillColor="bg-bad"
          height="md"
        />
        <p className="font-gothic text-[10px] text-white/60 text-center mt-1">
          {result.xpAfter} / {result.levelUpXPAfter} XP
        </p>
      </section>

      {/* 分享按钮 */}
      <section className="mt-4">
        <PixelButton
          variant="ghost"
          fullWidth
          onClick={handleShare}
          className="flex items-center justify-center gap-2"
        >
          <ShareIcon size={18} />
          <span>{copied ? "已複製到剪貼簿" : "分享"}</span>
        </PixelButton>
      </section>

      {/* 底部双按钮 */}
      <section className="mt-auto pt-6 flex flex-col gap-3">
        <PixelButton variant="magenta" size="lg" fullWidth onClick={handleReplay}>
          再玩一次
        </PixelButton>
        <PixelButton variant="ghost" size="lg" fullWidth onClick={handleHome}>
          主頁
        </PixelButton>
      </section>
    </PageShell>
  );
}
