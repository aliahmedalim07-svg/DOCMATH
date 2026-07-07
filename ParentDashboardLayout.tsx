import type { LucideIcon } from "lucide-react";

export type Role = "student" | "admin" | "parent";
export type Language = "en" | "ar";
export type AssignmentType = "exam" | "homework" | "practice" | "checkpoint" | "weeklyExam";
export type Difficulty = "easy" | "medium" | "hard";
export type HomeworkStatus = "pending" | "submitted" | "graded";
export type PracticeModeType = "questions" | "all" | "retake" | "weak";

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  accountType: AccountType;
  avatarUrl?: string;

}

export interface ParentStudent {
  id: string;
  parentId: string;
  studentId: string;
}

export interface Course {
  id: string;
  name: string;
  teacherId: string;
  year: number;
  examDate: string;
  isActive: boolean;
  description: string;
  createdAt: string;
}

export interface Book {
  id: string;
  courseId?: string;
  title: string;
  orderIndex: number;
  coverImageUrl?: string;
  year: number;
}

export interface Skill {
  id: string;
  bookId?: string;
  courseId?: string;
  name: string;
  description: string;
  examSkillWeighting: number;
  videos?: VideoResource[];
  pdfs?: PdfResource[];
  questionBelongings?: any[];
}

export interface Assignment {
  id: string;
  bookId?: string;
  courseId: string;
  type: AssignmentType;
  title: string;
  dueDate: string;
  totalQuestions: number;
  degree: number;
  isPublished: boolean;
  durationInMinutes?: number;
  videos?: VideoResource[];
  pdfs?: PdfResource[];
  questionBelongings?: any[];
}

export interface QuestionOption {
  id: string;
  label: string;
  content?: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  assignmentId?: string;
  skillId?: string;
  bookId?: string;
  bookTitle?: string;
  content: string;
  options: QuestionOption[];
  correctAnswer: string;
  difficulty: Difficulty;
  yearAppeared: number;
  monthAppeared?: number;
  questionImageUrl?: string;
  expanationImageUrl?: string;
  explanationVideoUrl?: string;
  explanation: string;
  orderIndex: number;
  topicId?: number;
  topic?: { id: number; name: string };
}

export interface StudentAnswer {
  id: string;
  studentId: string;
  questionId: string;
  assignmentId: string;
  studentAnswer: string;
  isCorrect: boolean;
  attemptNumber: number;
  timeSpentSec: number;
  answeredAt: string;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  courseId: string;
  bookId: string;
  skillId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  lastActivityAt: string;
}

export interface MistakeHistoryItem {
  id: string;
  studentId: string;
  questionId: string;
  sourceType: "assignment" | "skill" | "checkpoint" | "weeklyExam";
  studentAnswer: string;
  recordedAt: string;
}

export interface TrySummary {
  id: number;
  questionGroupTitle: string;
  questionGroupId: number;
  submittedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
}

export interface QuestionAnswer {
  questionId: number;
  questionText: string;
  questionImageUrl?: string;
  explanation?: string;
  explanationImageUrl?: string;
  selectedChoiceId: number | null;
  selectedChoiceText: string | null;
  selectedChoiceImageUrl?: string;
  correctChoiceId: number | null;
  correctChoiceText: string | null;
  correctChoiceImageUrl?: string;
  isCorrect: boolean;
}

export interface TryDetail {
  tryId: number;
  questionGroupTitle: string;
  questionGroupId: number;
  submittedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  answers: QuestionAnswer[];
}

export interface WeakPoint {
  id: string;
  studentId: string;
  skillId: string;
  mistakeCount: number;
  lastUpdated: string;
}

export interface VideoResource {
  id: string;
  bookId?: string;
  questionGroupId?: string;
  title: string;
  url: string;
  provider: 'youtube' | 'vdocipher';
  embedUrl?: string;
  thumbnailUrl?: string;
  durationSec?: number;
  orderIndex: number;
  defaultViews?: number;
}

export interface PdfResource {
  id: string;
  bookId?: string;
  questionGroupId?: string;
  title: string;
  fileUrl: string;
  pagesCount?: number;
  sizeKb?: number;
  orderIndex: number;
  allowDownload?: boolean;
}

export interface Checkpoint {
  id: string;
  courseId: string;
  studentId: string;
  title: string;
  score: number;
  maxScore: number;
  completedAt: string;
}
export interface Homework {
  id: string;
  courseId: string;
  bookId: string;
  title: string;
  instructions: string;
  dueDate: string;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
}

export interface StudentHomework {
  id: string;
  homeworkId: string;
  studentId: string;
  submissionUrl?: string;
  score?: number;
  feedback?: string;
  submittedAt?: string;
  status: HomeworkStatus;
}

export interface Topic {
  id: string;
  name: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface CreateAccountInput {
  username: string;
  name: string;
  phone?: string;
  accountType: AccountType; // 1 for student, 2 for parent
  parentPhone?: string; // Only for students
  tempPassword: string;
  courseId?: string;
  linkedStudentId?: string;
}

export enum AccountType {
  Student = 1,
  Parent = 2,
  Admin = 3,
}

export interface Session {
  id: string;
  courseId?: string;
  startTime: string;
  title?: string;
  url: string;
  sessionPDFs?: {
    id: string;
    title: string;
    url: string;
  }[];
}

export interface StudentStats {
  studentId: string;
  studentName: string;
  studentPhone: string | null;
  totalScore: number;
  weakPointsCount: number;
  mistakeCount: number;
  completedAssignments: number;
  lastActivity: string | null;
  recentTries: TrySummary[];
}

export interface ParentChild {
  id: string;
  name: string;
  phone: string | null;
  lastActivity: string | null;
}

export interface ScoreTrendItem {
  date: string;
  score: number;
}

export interface GeneralProgress {
  averageScore: number;
  completedAssignments: number;
  totalAssignments: number;
  studentRank: number;
  rankedStudents: number;
  scoreTrend: ScoreTrendItem[];
}

export interface WeakPointDetail {
  categoryName: string;
  mistakeCount: number;
  accuracy: number;
}

export interface MistakeDetail {
  questionId: number;
  questionText: string;
  questionImageUrl?: string;
  selectedChoiceText: string;
  correctChoiceText: string;
  date: string;
}

export interface DailyActivityDetail {
  tryId: number;
  activityTitle: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  submittedAt: string;
}

export interface DailyActivity {
  date: string;
  attemptsCount: number;
  averageScore: number;
  details: DailyActivityDetail[];
}

export interface ParentDashboardData {
  generalProgress: GeneralProgress;
  weakPoints: WeakPointDetail[];
  mistakes: MistakeDetail[];
  dailyActivity: DailyActivity[];
}
