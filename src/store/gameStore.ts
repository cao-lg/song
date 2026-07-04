// 全局状态：用户数据 + 游戏会话 + 歌曲筛选
import { create } from "zustand";
import type { GameResult, GameSession, Question, UserData } from "@/types";
import { calcLevelUpXP, DEFAULT_FILTER, type SongFilter } from "@/data/constants";
import { loadUserData, saveUserData } from "@/lib/storage";

interface GameState {
  // 用户数据
  user: UserData;
  // 当前游戏会话
  session: GameSession | null;
  // 上一局结算结果（结算页展示）
  lastResult: GameResult | null;
  // 歌曲筛选条件（風格 + 年代）
  filter: SongFilter;
  // 加载状态
  loading: boolean;
  error: string | null;

  // 用户数据操作
  refreshUser: () => void;
  consumeItem: (itemId: "fiftyFifty" | "replay") => void;

  // 筛选操作
  setFilter: (f: SongFilter) => void;

  // 游戏会话操作
  startGame: (questions: Question[]) => void;
  answer: (optionIndex: number) => void;
  useFiftyFifty: () => number[] | null;
  useReplay: () => boolean;
  nextQuestion: () => void;
  endGame: () => GameResult;
  clearSession: () => void;
  setError: (msg: string | null) => void;
  setLoading: (v: boolean) => void;
}

function createInitialSession(questions: Question[]): GameSession {
  return {
    questions,
    currentIndex: 0,
    correctCount: 0,
    usedFiftyFifty: questions.map(() => false),
    replayed: questions.map(() => false),
    answers: questions.map(() => null),
    eliminatedOptions: questions.map(() => null),
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  user: loadUserData(),
  session: null,
  lastResult: null,
  filter: { ...DEFAULT_FILTER },
  loading: false,
  error: null,

  refreshUser: () => set({ user: loadUserData() }),

  consumeItem: (itemId) => {
    const { user } = get();
    if (user.items[itemId] <= 0) return;
    const next = { ...user, items: { ...user.items, [itemId]: user.items[itemId] - 1 } };
    saveUserData(next);
    set({ user: next });
  },

  setFilter: (f) => set({ filter: f }),

  startGame: (questions) => {
    set({ session: createInitialSession(questions), error: null });
  },

  answer: (optionIndex) => {
    const { session } = get();
    if (!session) return;
    if (session.answers[session.currentIndex] !== null) return; // 已答过

    const q = session.questions[session.currentIndex];
    const isCorrect = optionIndex === q.correctIndex;
    const answers = [...session.answers];
    answers[session.currentIndex] = optionIndex;

    set({
      session: {
        ...session,
        answers,
        correctCount: session.correctCount + (isCorrect ? 1 : 0),
      },
    });
  },

  useFiftyFifty: () => {
    const { session, user } = get();
    if (!session) return null;
    if (user.items.fiftyFifty <= 0) return null;
    const idx = session.currentIndex;
    if (session.usedFiftyFifty[idx]) return null;

    const q = session.questions[idx];
    // 随机剔除 2 个错误选项
    const wrongIndices = q.options
      .map((_, i) => i)
      .filter((i) => i !== q.correctIndex);
    // Fisher-Yates 取前 2
    for (let i = wrongIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wrongIndices[i], wrongIndices[j]] = [wrongIndices[j], wrongIndices[i]];
    }
    const eliminated = wrongIndices.slice(0, 2);

    const usedFiftyFifty = [...session.usedFiftyFifty];
    usedFiftyFifty[idx] = true;
    const eliminatedOptions = [...session.eliminatedOptions];
    eliminatedOptions[idx] = eliminated;

    const nextUser = {
      ...user,
      items: { ...user.items, fiftyFifty: user.items.fiftyFifty - 1 },
    };
    saveUserData(nextUser);

    set({
      session: { ...session, usedFiftyFifty, eliminatedOptions },
      user: nextUser,
    });
    return eliminated;
  },

  useReplay: () => {
    const { session, user } = get();
    if (!session) return false;
    if (user.items.replay <= 0) return false;
    const idx = session.currentIndex;
    if (session.replayed[idx]) return false;

    const replayed = [...session.replayed];
    replayed[idx] = true;
    const nextUser = {
      ...user,
      items: { ...user.items, replay: user.items.replay - 1 },
    };
    saveUserData(nextUser);

    set({ session: { ...session, replayed }, user: nextUser });
    return true;
  },

  nextQuestion: () => {
    const { session } = get();
    if (!session) return;
    if (session.currentIndex >= session.questions.length - 1) return;
    set({ session: { ...session, currentIndex: session.currentIndex + 1 } });
  },

  endGame: () => {
    const { session, user } = get();
    if (!session) throw new Error("no active session");

    const correctCount = session.correctCount;
    const xpEarned = correctCount; // 每答对 1 题得 1 XP

    const levelBefore = user.level;
    const xpBefore = user.currentXP;
    let levelAfter = user.level;
    let xpAfter = user.currentXP + xpEarned;
    let levelUpXPAfter = user.levelUpXP;
    let leveledUp = false;

    // 处理升级（可能跨多级）
    while (xpAfter >= levelUpXPAfter) {
      xpAfter -= levelUpXPAfter;
      levelAfter += 1;
      levelUpXPAfter = calcLevelUpXP(levelAfter);
      leveledUp = true;
    }

    const nextUser: UserData = {
      ...user,
      level: levelAfter,
      currentXP: xpAfter,
      levelUpXP: levelUpXPAfter,
      totalGames: user.totalGames + 1,
      totalCorrect: user.totalCorrect + correctCount,
      totalAnswered: user.totalAnswered + session.questions.length,
      items: { ...user.items },
    };
    saveUserData(nextUser);

    const result: GameResult = {
      correctCount,
      xpEarned,
      questions: session.questions,
      answers: session.answers,
      levelBefore,
      levelAfter,
      leveledUp,
      xpBefore,
      xpAfter,
      levelUpXPAfter,
    };

    set({ user: nextUser, lastResult: result });
    return result;
  },

  clearSession: () => set({ session: null }),

  setError: (msg) => set({ error: msg }),
  setLoading: (v) => set({ loading: v }),
}));
