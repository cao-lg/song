// 答题核心页（单局 10 题）
// 音频播放 + 4 选项答题 + 道具系统 + 回合进度
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Loading } from "@/components/Loading";
import { GameAudioPlayer } from "@/components/GameAudioPlayer";
import { OptionButton } from "@/components/OptionButton";
import { PixelButton } from "@/components/PixelButton";
import {
  BulbIcon,
  CloseIcon,
  FiftyFiftyIcon,
  ReplayIcon,
  ShopIcon,
} from "@/components/PixelIcons";
import { fetchSongPool, generateQuestions } from "@/lib/itunes";
import { preloadSongs, releaseAllAudio } from "@/lib/audio";
import { clearSongPoolCache } from "@/lib/gameHelpers";
import { useGameStore } from "@/store/gameStore";
import type { Song } from "@/types";

const TOTAL_QUESTIONS = 10;
const OPTION_LABELS = ["A", "B", "C", "D"] as const;

export default function Game() {
  const navigate = useNavigate();
  const session = useGameStore((s) => s.session);
  const loading = useGameStore((s) => s.loading);
  const error = useGameStore((s) => s.error);
  const startGame = useGameStore((s) => s.startGame);
  const answer = useGameStore((s) => s.answer);
  const useFiftyFifty = useGameStore((s) => s.useFiftyFifty);
  const useReplay = useGameStore((s) => s.useReplay);
  const nextQuestion = useGameStore((s) => s.nextQuestion);
  const endGame = useGameStore((s) => s.endGame);
  const clearSession = useGameStore((s) => s.clearSession);
  const setError = useGameStore((s) => s.setError);
  const setLoading = useGameStore((s) => s.setLoading);
  const user = useGameStore((s) => s.user);

  // 用于触发音频重播：当前题已用重播时，replayKey 自增
  const replayKeyRef = useRef(0);
  const prevReplayedRef = useRef(false);
  const replayedThis = session
    ? session.replayed[session.currentIndex]
    : false;
  if (replayedThis && !prevReplayedRef.current) {
    replayKeyRef.current += 1;
  }
  prevReplayedRef.current = replayedThis;
  const replayKey = replayKeyRef.current;

  // 初始化：拉取歌曲池 + 生成题目
  const filter = useGameStore((s) => s.filter);
  useEffect(() => {
    if (session) return; // 已有会话
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const pool = await fetchSongPool(filter);
        const questions = generateQuestions(pool, TOTAL_QUESTIONS);
        if (questions.length < TOTAL_QUESTIONS) {
          throw new Error("題目數量不足，請調整篩選或選擇「全部」");
        }
        if (!mounted) return;
        startGame(questions);
        // 预加载前 3 题音频
        const songsToPreload: Song[] = questions
          .slice(0, 3)
          .map((q) => q.song);
        preloadSongs(songsToPreload);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "載入失敗");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 组件卸载时不释放音频，留给 round-result/settlement 后处理

  // 答题后自动切换下一题
  const answered = session
    ? session.answers[session.currentIndex] !== null
    : false;

  useEffect(() => {
    if (!session || !answered) return;
    const isLast = session.currentIndex >= session.questions.length - 1;
    const timer = window.setTimeout(
      () => {
        if (isLast) {
          // 完成所有题，进入成绩页
          releaseAllAudio();
          navigate("/round-result");
        } else {
          nextQuestion();
        }
      },
      isLast ? 2000 : 1500, // 最后一题多停留一会儿
    );
    return () => window.clearTimeout(timer);
  }, [session, answered, nextQuestion, navigate]);

  // 加载中
  if (loading || !session) {
    return (
      <PageShell decorationVariant="minimal">
        <header className="flex items-center justify-between mb-4">
          <button
            aria-label="返回"
            onClick={() => {
              clearSession();
              releaseAllAudio();
              navigate("/");
            }}
            className="pixel-border-sm bg-bad pixel-press p-2 text-white"
          >
            <CloseIcon size={20} />
          </button>
          <h1 className="font-pixel text-sm text-white pixel-text-shadow-sm">GAME</h1>
          <div className="w-9" />
        </header>
        {error ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <p className="font-gothic text-bad text-center px-4 leading-relaxed">
              {error}
            </p>
            <PixelButton
              variant="amber"
              onClick={() => {
                setError(null);
                clearSongPoolCache();
                window.location.reload();
              }}
            >
              清除緩存重試
            </PixelButton>
            <PixelButton variant="magenta" onClick={() => navigate("/level")}>
              調整篩選
            </PixelButton>
            <PixelButton variant="ghost" onClick={() => navigate("/")}>
              返回主頁
            </PixelButton>
          </div>
        ) : (
          <Loading text="正在拉取粵語歌曲池..." />
        )}
      </PageShell>
    );
  }

  const q = session.questions[session.currentIndex];
  const currentAnswer = session.answers[session.currentIndex];
  const eliminated = session.eliminatedOptions[session.currentIndex] ?? [];

  const handleAnswer = (idx: number) => {
    if (currentAnswer !== null) return;
    answer(idx);
  };

  const handleFiftyFifty = () => {
    if (user.items.fiftyFifty <= 0) return;
    if (session.usedFiftyFifty[session.currentIndex]) return;
    if (currentAnswer !== null) return;
    useFiftyFifty();
  };

  const handleReplay = () => {
    if (user.items.replay <= 0) return;
    if (replayedThis) return;
    if (currentAnswer !== null) return;
    useReplay();
  };

  return (
    <PageShell decorationVariant="minimal">
      {/* 顶部：退出按钮 + 回合信息 */}
      <header className="flex items-center justify-between">
        <button
          aria-label="退出"
          onClick={() => {
            clearSession();
            releaseAllAudio();
            navigate("/");
          }}
          className="pixel-border-sm bg-bad pixel-press p-2 text-white"
        >
          <CloseIcon size={18} />
        </button>
        <h1 className="font-pixel text-xs text-white pixel-text-shadow-sm">
          回合 {session.currentIndex + 1}/{TOTAL_QUESTIONS}
        </h1>
        <div className="w-9" />
      </header>

      {/* 回合进度点 */}
      <div className="mt-3 flex justify-center gap-1.5">
        {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => {
          const done = i < session.currentIndex || (i === session.currentIndex && answered);
          const correct = done && session.answers[i] === session.questions[i].correctIndex;
          const wrong = done && session.answers[i] !== null && !correct;
          return (
            <div
              key={i}
              className={`w-2.5 h-2.5 pixel-border-sm ${
                correct ? "bg-good" : wrong ? "bg-bad" : done ? "bg-white/50" : "bg-bgmid"
              }`}
            />
          );
        })}
      </div>

      {/* 音频播放区 */}
      <section className="mt-4">
        <GameAudioPlayer
          previewUrl={q.song.previewUrl}
          trackName={q.song.trackName}
          artistName={q.song.artistName}
          trackViewUrl={q.song.trackViewUrl}
          reveal={answered}
          replayKey={replayKey}
        />
      </section>

      {/* 选项区 */}
      <section className="mt-4 flex flex-col gap-2.5">
        {q.options.map((song, idx) => {
          const isCorrect = idx === q.correctIndex;
          let state: "idle" | "correct" | "wrong" | "eliminated" | "disabled-correct" = "idle";
          if (answered) {
            if (isCorrect) state = "correct";
            else if (idx === currentAnswer) state = "wrong";
            else state = "eliminated";
          } else if (eliminated.includes(idx)) {
            state = "eliminated";
          }
          return (
            <OptionButton
              key={`${q.id}-${song.trackId}`}
              label={OPTION_LABELS[idx]}
              song={song}
              state={state}
              disabled={answered}
              onClick={() => handleAnswer(idx)}
            />
          );
        })}
      </section>

      {/* 道具功能区 */}
      <section className="mt-auto pt-4">
        <div className="grid grid-cols-4 gap-2">
          <ItemButton
            icon={<FiftyFiftyIcon size={20} />}
            label="50/50"
            count={user.items.fiftyFifty}
            disabled={
              user.items.fiftyFifty <= 0 ||
              session.usedFiftyFifty[session.currentIndex] ||
              answered
            }
            onClick={handleFiftyFifty}
          />
          <ItemButton
            icon={<ReplayIcon size={20} />}
            label="重播"
            count={user.items.replay}
            disabled={
              user.items.replay <= 0 || replayedThis || answered
            }
            onClick={handleReplay}
          />
          <ItemButton
            icon={<BulbIcon size={20} />}
            label="提示"
            count={0}
            disabled
            onClick={() => {}}
            placeholder
          />
          <ItemButton
            icon={<ShopIcon size={20} />}
            label="商店"
            count={undefined}
            disabled
            onClick={() => {}}
            placeholder
          />
        </div>
      </section>
    </PageShell>
  );
}

interface ItemButtonProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  disabled: boolean;
  onClick: () => void;
  placeholder?: boolean;
}

function ItemButton({ icon, label, count, disabled, onClick, placeholder }: ItemButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`pixel-border-sm pixel-press font-gothic p-2 flex flex-col items-center gap-1 ${
        placeholder ? "bg-bgmid/50 text-white/30" : "bg-bgmid text-white"
      } ${disabled && !placeholder ? "opacity-40 grayscale" : ""}`}
    >
      <span className={placeholder ? "text-white/30" : "text-amber2"}>{icon}</span>
      <span className="text-[10px] tracking-wider">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] text-yellow2 font-bold">x{count}</span>
      )}
    </button>
  );
}
