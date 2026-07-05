// localStorage 用户数据读写
import type { UserData } from "@/types";
import { LS_KEY, calcLevelUpXP, DEFAULT_ITEMS } from "@/data/constants";

const DEFAULT_DATA: UserData = {
  level: 1,
  currentXP: 0,
  levelUpXP: calcLevelUpXP(1),
  totalGames: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  audioSource: "local-first",
  items: { ...DEFAULT_ITEMS },
};

/** 读取用户数据，缺失字段用默认值补齐，levelUpXP 永远根据 level 重新计算 */
export function loadUserData(): UserData {
  if (typeof window === "undefined") return { ...DEFAULT_DATA, items: { ...DEFAULT_DATA.items } };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_DATA, items: { ...DEFAULT_DATA.items } };
    const parsed = JSON.parse(raw) as Partial<UserData>;
    const level = parsed.level ?? 1;
    return {
      ...DEFAULT_DATA,
      ...parsed,
      level,
      levelUpXP: calcLevelUpXP(level),
      items: {
        ...DEFAULT_DATA.items,
        ...(parsed.items ?? {}),
      },
    };
  } catch {
    return { ...DEFAULT_DATA, items: { ...DEFAULT_DATA.items } };
  }
}

/** 写入用户数据 */
export function saveUserData(data: UserData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // 忽略写入错误
  }
}

/** 重置用户数据（开发调试用） */
export function resetUserData(): UserData {
  const fresh = { ...DEFAULT_DATA, items: { ...DEFAULT_DATA.items } };
  saveUserData(fresh);
  return fresh;
}
