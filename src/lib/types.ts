// Tipos do aplicativo de estudos

export type LearningStyle = 'visual' | 'auditivo' | 'cinestesico' | 'leitura';
export type EducationLevel = 'fundamental' | 'medio' | 'superior' | 'tecnico';
export type Difficulty = 'tdah' | 'dislexia' | 'ansiedade' | 'nenhuma' | 'outra';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  educationLevel: EducationLevel;
  learningStyle: LearningStyle[];
  difficulties: Difficulty[];
  otherDifficulty?: string;
  favoriteSubjects: string[];
  studyGoals: string;
  createdAt: string;
}

export interface StudyProgress {
  userId: string;
  subjectId: string;
  subjectName: string;
  progress: number; // 0-100
  completedLessons: string[];
  totalLessons: number;
  lastAccessed: string;
}

export interface GameScore {
  userId: string;
  gameId: string;
  gameName: string;
  score: number;
  points: number;
  completedAt: string;
}

export interface UserStats {
  userId: string;
  totalPoints: number;
  level: number;
  streak: number; // dias consecutivos
  badges: string[];
  friendsInvited: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  totalLessons: number;
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  contentType: 'texto' | 'video' | 'audio' | 'interativo';
  content: string;
  duration: number; // minutos
  difficulty: 'facil' | 'medio' | 'dificil';
}
