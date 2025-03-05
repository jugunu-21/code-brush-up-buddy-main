
import { UserProgress } from "./types";

const PROGRESS_KEY = "code-brush-up-progress";

export const saveUserProgress = (progress: UserProgress): void => {
  try {
    const existingProgressJSON = localStorage.getItem(PROGRESS_KEY);
    const existingProgress: UserProgress[] = existingProgressJSON ? JSON.parse(existingProgressJSON) : [];
    
    const existingIndex = existingProgress.findIndex(p => p.questionId === progress.questionId);
    
    if (existingIndex >= 0) {
      existingProgress[existingIndex] = progress;
    } else {
      existingProgress.push(progress);
    }
    
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(existingProgress));
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
};

export const getUserProgress = (questionId?: string): UserProgress | UserProgress[] | null => {
  try {
    const progressJSON = localStorage.getItem(PROGRESS_KEY);
    
    if (!progressJSON) return null;
    
    const progress: UserProgress[] = JSON.parse(progressJSON);
    
    if (questionId) {
      return progress.find(p => p.questionId === questionId) || null;
    }
    
    return progress;
  } catch (error) {
    console.error("Failed to get progress from localStorage:", error);
    return null;
  }
};

export const getAllUserProgress = (): UserProgress[] => {
  try {
    const progressJSON = localStorage.getItem(PROGRESS_KEY);
    return progressJSON ? JSON.parse(progressJSON) : [];
  } catch (error) {
    console.error("Failed to get all progress from localStorage:", error);
    return [];
  }
};

export const clearUserProgress = (questionId?: string): void => {
  try {
    if (questionId) {
      const existingProgressJSON = localStorage.getItem(PROGRESS_KEY);
      if (existingProgressJSON) {
        const existingProgress: UserProgress[] = JSON.parse(existingProgressJSON);
        const filteredProgress = existingProgress.filter(p => p.questionId !== questionId);
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(filteredProgress));
      }
    } else {
      localStorage.removeItem(PROGRESS_KEY);
    }
  } catch (error) {
    console.error("Failed to clear progress from localStorage:", error);
  }
};
