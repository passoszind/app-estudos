// Gerenciamento de Local Storage

import { UserProfile, StudyProgress, GameScore, UserStats } from './types';

const KEYS = {
  USER_PROFILE: 'studyapp_user_profile',
  STUDY_PROGRESS: 'studyapp_study_progress',
  GAME_SCORES: 'studyapp_game_scores',
  USER_STATS: 'studyapp_user_stats',
  ONBOARDING_COMPLETED: 'studyapp_onboarding_completed',
};

// User Profile
export const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  }
};

export const getUserProfile = (): UserProfile | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// Study Progress
export const saveStudyProgress = (progress: StudyProgress[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.STUDY_PROGRESS, JSON.stringify(progress));
  }
};

export const getStudyProgress = (): StudyProgress[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(KEYS.STUDY_PROGRESS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const updateSubjectProgress = (subjectId: string, lessonId: string): void => {
  const progress = getStudyProgress();
  const subjectProgress = progress.find(p => p.subjectId === subjectId);
  
  if (subjectProgress) {
    if (!subjectProgress.completedLessons.includes(lessonId)) {
      subjectProgress.completedLessons.push(lessonId);
      subjectProgress.progress = Math.round(
        (subjectProgress.completedLessons.length / subjectProgress.totalLessons) * 100
      );
      subjectProgress.lastAccessed = new Date().toISOString();
    }
  }
  
  saveStudyProgress(progress);
};

export const updateStudyProgress = (progress: StudyProgress): void => {
  const allProgress = getStudyProgress();
  const index = allProgress.findIndex(p => p.subjectId === progress.subjectId);
  
  if (index !== -1) {
    allProgress[index] = progress;
  } else {
    allProgress.push(progress);
  }
  
  saveStudyProgress(allProgress);
};

// Game Scores
export const saveGameScore = (score: GameScore): void => {
  if (typeof window !== 'undefined') {
    const scores = getGameScores();
    scores.push(score);
    localStorage.setItem(KEYS.GAME_SCORES, JSON.stringify(scores));
  }
};

export const getGameScores = (): GameScore[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(KEYS.GAME_SCORES);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

// User Stats
export const saveUserStats = (stats: UserStats): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.USER_STATS, JSON.stringify(stats));
  }
};

export const getUserStats = (): UserStats | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(KEYS.USER_STATS);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const updateUserStats = (stats: UserStats): void => {
  saveUserStats(stats);
};

export const addPoints = (points: number): void => {
  const stats = getUserStats();
  if (stats) {
    stats.totalPoints += points;
    stats.level = Math.floor(stats.totalPoints / 1000) + 1;
    saveUserStats(stats);
  }
};

// Onboarding
export const setOnboardingCompleted = (completed: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.ONBOARDING_COMPLETED, JSON.stringify(completed));
  }
};

export const isOnboardingCompleted = (): boolean => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(KEYS.ONBOARDING_COMPLETED);
    return data ? JSON.parse(data) : false;
  }
  return false;
};

// Initialize default stats for new users
export const initializeUserStats = (userId: string): void => {
  const stats: UserStats = {
    userId,
    totalPoints: 0,
    level: 1,
    streak: 0,
    badges: [],
    friendsInvited: 0,
  };
  saveUserStats(stats);
};
