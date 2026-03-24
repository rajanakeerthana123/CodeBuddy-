export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  illustration: string; // Lucide icon name or emoji
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  question: string;
  type: 'drag-and-drop' | 'coding' | 'multiple-choice';
  options?: string[]; // For drag-and-drop or multiple-choice
  correctAnswer: string | string[];
  explanation: string;
  hint?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  streak: number;
  xp: number;
  lastActive: string;
  completedLessons: string[];
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
