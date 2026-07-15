// 本局成绩页
// 标题 + 大字号得分 + 答题详情列表（对错区分色）+ 继续按钮
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { PixelButton } from "@/components/PixelButton";
import { ArrowRightIcon, CheckIcon, CloseIcon } from "@/components/PixelIcons";
import { useGameStore } from "@/store/gameStore";

export default function RoundResult() {
  const navigate = useNavigate();
  const session = useGameStore((s) => s.session);

  useEffect(() => {
    if (!session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  if (!session) {
    return null; // 等待导航完成
  }

  const correctCount = session.correctCount;
  const total = session.questions.length;

  return (
    <PageShell decorationVariant="minimal">
      {/* 顶部标题 */}
      <header className="text-center mt-2">
        <h1 className="font-pixel text-xl text-amber2 pixel-text-shadow">今Round</h1>
        <h1 className="font-pixel text-xl text-magenta pixel-text-shadow mt-1">成績</h1>
      </header>

      {/* 大字号得分 */}
      <section className="mt-6 flex justify-center">
        <div className="pixel-border bg-bgmid/80 px-8 py-6 flex items-baseline gap-2">
          <span className="font-pixel text-6xl text-good pixel-text-shadow animate-pop-in">
            {correctCount}
          </span>
          <span className="font-pixel text-2xl text-white/60">/</span>
          <span className="font-pixel text-3xl text-white/80">{total}</span>
        </div>
      </section>

      {/* 答题详情列表 */}
      <section className="mt-6 flex-1 overflow-y-auto no-scrollbar">
        <p className="font-gothic text-xs text-white/70 mb-2 tracking-wider px-1">
          答題詳情
        </p>
        <div className="flex flex-col gap-2">
          {session.questions.map((q, i) => {
            const ans = session.answers[i];
            const isCorrect = ans === q.correctIndex;
            return (
              <div
                key={q.id}
                className={`pixel-border-sm p-3 flex items-center gap-3 ${
                  isCorrect ? "bg-good/20" : "bg-bad/20"
                }`}
              >
                {/* 左上角对错图标 */}
                <span
                  className={`pixel-border-sm w-8 h-8 flex items-center justify-center shrink-0 ${
                    isCorrect ? "bg-good text-white" : "bg-bad text-white"
                  }`}
                >
                  {isCorrect ? <CheckIcon size={16} /> : <CloseIcon size={16} />}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="font-gothic text-sm text-white font-bold truncate">
                    {q.song.trackName}
                  </p>
                  <p className="font-gothic text-xs text-white/70 truncate">
                    {q.song.artistName}
                  </p>
                </div>

                {/* 题号 */}
                <span className="font-pixel text-[10px] text-white/50 shrink-0">
                  Q{i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 继续按钮 */}
      <section className="mt-4">
        <PixelButton
          variant="amber"
          size="lg"
          fullWidth
          onClick={() => navigate("/settlement")}
          className="flex items-center justify-center gap-3"
        >
          <span className="text-lg">繼續</span>
          <ArrowRightIcon size={20} />
        </PixelButton>
      </section>
    </PageShell>
  );
}
