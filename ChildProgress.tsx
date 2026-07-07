/** API Service - v1.0.2 - Fixed seeding and types */
import { apiFetch, apiFetchNoContent, apiUpload } from "./api";
import { Book, Question, Session, UserProfile, TrySummary, TryDetail, Assignment, Skill, Course, ParentDashboardData, WeakPointDetail, MistakeDetail, PdfResource, VideoResource, Topic } from "./types";
export type { Book, Question, Session, UserProfile, TrySummary, TryDetail, Assignment, Skill, Course, ParentDashboardData, WeakPointDetail, MistakeDetail, PdfResource, VideoResource, Topic };

/* ------------------------------------------------------------------ */
/*  Courses API                                                       */
/* ------------------------------------------------------------------ */

export interface BackendCourseListItem {
  id: number;
  title: string;
  deadline: string;
  isEnded: boolean;
}

export interface BackendCourseNameItem {
  id: number;
  title: string;
  isEnded: boolean;
}

export interface BackendCourseDetail {
  id: number;
  title: string;
  deadline: string;
  isEnded: boolean;
  books: any[] | null;
  questionGroups: any[] | null;
  sessions: any[] | null;
}

export interface CourseListItem {
  id: number;
  title: string;
  deadline: string;
  isEnded: boolean;
}

export interface CourseNameItem {
  id: number;
  title: string;
  isEnded: boolean;
}

export interface AdminCourse {
  id: string;
  name: string;
  year: number;
  examDate: string;
  isActive: boolean;
  description: string;
  createdAt: string;
  books?: any[];
  sessions?: any[];
  questionGroups?: any[];
  students?: any[];
}

function mapBackendCourseToAdminCourse(c: BackendCourseListItem | BackendCourseDetail): AdminCourse {
  return {
    id: String(c.id),
    name: c.title,
    year: new Date(c.deadline).getFullYear(),
    examDate: c.deadline,
    isActive: !c.isEnded,
    description: "",
    createdAt: new Date().toISOString(),
  };
}

export async function getCourses(): Promise<AdminCourse[]> {
  const data = await apiFetch<BackendCourseListItem[]>("/Courses");
  return data.map(mapBackendCourseToAdminCourse);
}

export async function getCourseNames(): Promise<CourseNameItem[]> {
  return await apiFetch<BackendCourseNameItem[]>("/Courses/names");
}

export async function getCourse(id: number): Promise<BackendCourseDetail> {
  return await apiFetch<BackendCourseDetail>(`/Courses/${id}`);
}

export async function createCourse(
  title: string,
  deadline?: string,
  bookIds: number[] = [],
  sessionIds: number[] = [],
  questionGroupIds: number[] = [],
  studentIds: string[] = []
): Promise<AdminCourse> {
  const data = await apiFetch<BackendCourseDetail>("/Courses", {
    method: "POST",
    body: JSON.stringify({
      id: 0,
      title,
      deadline: deadline || "2026-12-31",
      bookIds,
      sessionIds,
      questionGroupIds,
      studentIds
    })
  });
  return mapBackendCourseToAdminCourse(data);
}

export async function updateCourse(
  id: string | number,
  title: string,
  deadline?: string,
  bookIds: number[] = [],
  sessionIds: number[] = [],
  questionGroupIds: number[] = [],
  studentIds: string[] = []
): Promise<void> {
  await apiFetchNoContent(`/Courses/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      id: Number(id),
      title,
      deadline: deadline || "2026-12-31",
      bookIds,
      sessionIds,
      questionGroupIds,
      studentIds
    })
  });
}

export async function deleteCourse(id: string | number): Promise<void> {
  await apiFetchNoContent(`/Courses/${id}`, { method: "DELETE" });
}

export async function addBookToCourse(courseId: string | number, bookId: string | number): Promise<void> {
  await apiFetchNoContent(`/Courses/${courseId}/add-book/${bookId}`, { method: "POST" });
}

export async function removeBookFromCourse(courseId: string | number, bookId: string | number): Promise<void> {
  await apiFetchNoContent(`/Courses/${courseId}/remove-book/${bookId}`, { method: "POST" });
}

export async function addSessionToCourse(courseId: string | number, sessionId: string | number): Promise<void> {
  await apiFetchNoContent(`/Courses/${courseId}/add-session/${sessionId}`, { method: "POST" });
}

export async function removeSessionFromCourse(courseId: string | number, sessionId: string | number): Promise<void> {
  await apiFetchNoContent(`/Courses/${courseId}/remove-session/${sessionId}`, { method: "POST" });
}

export async function addQuestionGroupToCourse(courseId: string | number, groupId: string | number): Promise<void> {
  await apiFetchNoContent(`/Courses/${courseId}/add-questiongroup/${groupId}`, { method: "POST" });
}

export async function removeQuestionGroupFromCourse(courseId: string | number, groupId: string | number): Promise<void> {
  await apiFetchNoContent(`/Courses/${courseId}/remove-questiongroup/${groupId}`, { method: "POST" });
}

interface BackendBook {
  id: number;
  title: string;
  year?: number;
  course?: { id: number; title: string };
}

export function mapBook(b: BackendBook): Book {
  return {
    id: String(b.id),
    title: b.title,
    orderIndex: 0,
    year: b.year || new Date().getFullYear(),
    courseId: b.course ? String(b.course.id) : undefined,
  };
}

export async function getBooks(): Promise<Book[]> {
  const data = await apiFetch<BackendBook[]>("/Books");
  return data.map(mapBook);
}

export async function getBook(id: string | number): Promise<Book> {
  const data = await apiFetch<BackendBook>(`/Books/${id}`);
  return mapBook(data);
}


export async function getAssignments(courseId?: string): Promise<Assignment[]> {
  let url = `/QuestionGroups/assignments`;
  if (courseId) {
    url += `?courseId=${courseId}`;
  }
  const data = await apiFetch<any[]>(url);
  return data.map((qg: any) => ({
    id: String(qg.id),
    title: qg.title,
    type: qg.type === 2 ? 'exam' : 'practice',
    bookId: qg.book ? String(qg.book.id) : undefined,
    courseId: qg.course ? String(qg.course.id) : "1",
    durationInMinutes: qg.durationInMinutes,
    dueDate: qg.dueDate || new Date().toISOString(),
    isPublished: qg.isPublished ?? true,
    degree: Number(qg.degree || 100),
    totalQuestions: qg.questionBelongings?.length || 0,
    videos: mapGroupVideos(qg.videos || qg.questionGroupVideos || [], qg.id),
    pdfs: mapGroupPdfs(qg.pdfs || qg.questionGroupPDFs || qg.questionGroupPdfs || qg.pdFs || [], qg.id),
    questionBelongings: qg.questionBelongings || []
  }));
}

export async function getWeeklyExams(courseId?: string): Promise<Assignment[]> {
  let url = `/QuestionGroups/weekly-exams`;
  if (courseId) {
    url += `?courseId=${courseId}`;
  }
  const data = await apiFetch<any[]>(url);
  return data.map((qg: any) => ({
    id: String(qg.id),
    title: qg.title,
    type: 'exam' as const,
    bookId: qg.book ? String(qg.book.id) : undefined,
    courseId: qg.courseId ? String(qg.courseId) : "1",
    durationInMinutes: qg.durationInMinutes,
    dueDate: qg.dueDate || new Date().toISOString(),
    isPublished: qg.isPublished ?? true,
    degree: Number(qg.degree || 100),
    totalQuestions: qg.questionBelongings?.length || 0,
    videos: mapGroupVideos(qg.videos || qg.questionGroupVideos || [], qg.id),
    pdfs: mapGroupPdfs(qg.pdfs || qg.questionGroupPDFs || qg.questionGroupPdfs || qg.pdFs || [], qg.id),
    questionBelongings: qg.questionBelongings || []
  }));
}

export async function getSkills(courseId?: string): Promise<Skill[]> {
  let url = "/QuestionGroups/skills";
  if (courseId) {
    url += `?courseId=${courseId}`;
  }
  const data = await apiFetch<any[]>(url);
  return data.map(s => ({
    id: String(s.id),
    name: String(s.title || ""),
    description: String(s.description || ""),
    bookId: s.bookId ? String(s.bookId) : undefined,
    courseId: s.course ? String(s.course.id) : undefined,
    examSkillWeighting: Number(s.examSkillWeighting || 0),
    videos: mapGroupVideos(s.videos || s.questionGroupVideos || [], s.id),
    pdfs: mapGroupPdfs(s.pdfs || s.questionGroupPDFs || s.questionGroupPdfs || s.pdFs || [], s.id),
    questionBelongings: (s.questionBelongings || []).map((qb: any) => ({
      id: qb.id,
        question: {
          id: qb.question?.id,
          text: qb.question?.text,
          difficulty: qb.question?.difficulty,
          yearAppeared: qb.question?.yearAppeared,
          questionImageUrl: qb.question?.questionImageUrl,
          choices: qb.question?.choices || []
        }
    }))
  } as Skill));
}

function fileNameFromUrl(url: string): string {
  try {
    const path = new URL(url, "http://dragon.local").pathname;
    return decodeURIComponent(path.split("/").pop() || "Resource");
  } catch {
    return url.split("/").pop() || "Resource";
  }
}

function mapGroupVideos(videos: any[], questionGroupId: string | number): VideoResource[] {
  return videos.map((video, index) => ({
    id: String(video.id ?? `${questionGroupId}-video-${index}`),
    questionGroupId: String(questionGroupId),
    title: video.title || `Video ${index + 1}`,
    url: video.url || "",
    provider: video.provider === 1 ? 'vdocipher' as const : 'youtube' as const,
    thumbnailUrl: video.thumbnailUrl,
    durationSec: video.durationSec,
    orderIndex: Number(video.orderIndex ?? index),
    defaultViews: video.defaultViews,
  }));
}

function mapGroupPdfs(pdfs: any[], questionGroupId: string | number): PdfResource[] {
  return pdfs.map((pdf, index) => {
    const fileUrl = pdf.fileUrl || pdf.url || "";
    return {
      id: String(pdf.id ?? `${questionGroupId}-pdf-${index}`),
      questionGroupId: String(questionGroupId),
      title: pdf.title || fileNameFromUrl(fileUrl) || `PDF ${index + 1}`,
      fileUrl,
      pagesCount: pdf.pagesCount,
      sizeKb: pdf.sizeKb,
      orderIndex: Number(pdf.orderIndex ?? index),
      allowDownload: pdf.allowDownload ?? true,
    };
  });
}

export async function getMyWeakPoints(): Promise<WeakPointDetail[]> {
  return await apiFetch<WeakPointDetail[]>("/Analytics/my-weak-points");
}

export async function getMyMistakes(): Promise<MistakeDetail[]> {
  return await apiFetch<MistakeDetail[]>("/Analytics/my-mistakes");
}

export interface AdminDashboardSeriesPoint {
  label: string;
  value: number;
}

export interface AdminRecentAttempt {
  id: number;
  studentName: string;
  activityTitle: string;
  submittedAt: string;
  score: number;
}

export interface AdminDashboardData {
  totalStudents: number;
  totalCourses: number;
  activeCourses: number;
  endedCourses: number;
  totalBooks: number;
  totalSessions: number;
  totalAssignments: number;
  totalSkills: number;
  totalWeeklyExams: number;
  totalAttempts: number;
  averageScore: number;
  attemptsToday: number;
  attemptTrend: AdminDashboardSeriesPoint[];
  scoreTrend: AdminDashboardSeriesPoint[];
  courseDistribution: AdminDashboardSeriesPoint[];
  averageScoreByCourse: AdminDashboardSeriesPoint[];
  courseStatus: AdminDashboardSeriesPoint[];
  contentMix: AdminDashboardSeriesPoint[];
  recentAttempts: AdminRecentAttempt[];
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  return await apiFetch<AdminDashboardData>("/Analytics/admin-dashboard");
}

export interface AverageScoreTrendDto {
  date: string;
  averageScore: number;
}

export interface StudentCourseDto {
  id: string;
  name: string;
  username: string;
  phoneNumber: string;
}

export async function getAverageScoreTrendByCourse(courseId: number): Promise<AverageScoreTrendDto[]> {
  return await apiFetch<AverageScoreTrendDto[]>(`/Analytics/average-score-trend?courseId=${courseId}`);
}

export async function getStudentsByCourse(courseId: number): Promise<StudentCourseDto[]> {
  return await apiFetch<StudentCourseDto[]>(`/Analytics/students-by-course?courseId=${courseId}`);
}

export async function createAssignment(title: string, bookId: number, durationInMinutes: number, courseId?: string): Promise<any> {
  const url = "/QuestionGroups/assignment";
  const data = await apiFetch<any>(url, {
    method: "POST",
    body: JSON.stringify({
      title,
      durationInMinutes,
      bookId,
      courseId: courseId ? Number(courseId) : undefined
    })
  });
  return data;
}

export async function createSkill(title: string, courseId?: string): Promise<any> {
  const url = courseId ? `/QuestionGroups/skill?courseId=${courseId}` : "/QuestionGroups/skill";
  const data = await apiFetch<any>(url, {
    method: "POST",
    body: JSON.stringify({
      id: 0,
      title
    })
  });
  return data;
}

export async function getTries(): Promise<TrySummary[]> {
  const data = await apiFetch<any[]>("/QuestionGroups/tries");
  return data.map((t: any) => ({
    id: t.id,
    questionGroupTitle: t.questionGroupTitle,
    questionGroupId: t.questionGroupId,
    submittedAt: t.submittedAt,
    totalQuestions: t.totalQuestions,
    correctAnswers: t.correctAnswers,
    scorePercentage: t.scorePercentage
  }));
}

export async function getTriesByAssignment(assignmentId: string | number): Promise<TrySummary[]> {
  const data = await apiFetch<any[]>(`/QuestionGroups/${assignmentId}/tries`);
  return data.map((t: any) => ({
    id: t.id,
    questionGroupTitle: t.questionGroupTitle,
    questionGroupId: t.questionGroupId,
    submittedAt: t.submittedAt,
    totalQuestions: t.totalQuestions,
    correctAnswers: t.correctAnswers,
    scorePercentage: t.scorePercentage
  }));
}

export async function getTriesBySkill(skillId: string | number): Promise<TrySummary[]> {
  return getTriesByAssignment(skillId);
}

export async function addQuestionToAssignment(assignmentId: string | number, questionId: string | number): Promise<void> {
  const data = await apiFetch<any>(`/QuestionGroups/${assignmentId}/add-question`, {
    method: "POST",
    body: JSON.stringify(Number(questionId))
  });
  return data;
}

export async function removeQuestionFromAssignment(assignmentId: string | number, questionId: string | number): Promise<void> {
  await apiFetchNoContent(`/QuestionGroups/${assignmentId}/remove-question/${questionId}`, {
    method: "DELETE"
  });
}

export async function deleteQuestionGroup(id: string | number): Promise<void> {
  await apiFetchNoContent(`/QuestionGroups/${id}`, { method: "DELETE" });
}

export async function updateQuestionGroupCourse(id: string | number, courseId?: string): Promise<void> {
  await apiFetchNoContent(`/QuestionGroups/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      courseId: courseId ? Number(courseId) : null
    })
  });
}

export async function reorderQuestions(assignmentId: string | number, belongingIds: number[]): Promise<void> {
  await apiFetchNoContent(`/QuestionGroups/${assignmentId}/reorder-questions`, {
    method: "PUT",
    body: JSON.stringify(belongingIds),
  });
}

export async function addVideoToQuestionGroup(groupId: string | number, url: string, provider: 'youtube' | 'vdocipher' = 'youtube', defaultViews?: number): Promise<void> {
  await apiFetchNoContent(`/QuestionGroups/${groupId}/add-video`, {
    method: "POST",
    body: JSON.stringify({ url, provider: provider === 'vdocipher' ? 1 : 0, defaultViews }),
  });
}

export async function getVideoPlayUrl(videoId: string | number): Promise<{ url: string; playerType: string }> {
  return await apiFetch<{ url: string; playerType: string }>(`/QuestionGroups/${videoId}/play`);
}

export async function getVideoRemainingViews(videoId: string | number): Promise<number> {
  const data = await apiFetch<{ remainingViews: number }>(`/QuestionGroups/${videoId}/remaining-views`);
  return data.remainingViews;
}

export interface VideoUserView {
  userId: string;
  userName: string;
  views: number;
}

export async function getVideoUserViews(videoId: string | number): Promise<VideoUserView[]> {
  return await apiFetch<VideoUserView[]>(`/QuestionGroups/${videoId}/user-views`);
}

export async function updateVideoUserView(videoId: string | number, userId: string, views: number): Promise<void> {
  await apiFetchNoContent(`/QuestionGroups/${videoId}/user-views/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ views }),
  });
}

export async function removeVideoFromQuestionGroup(groupId: string | number, videoId: string | number): Promise<void> {
  await apiFetchNoContent(`/QuestionGroups/${groupId}/videos/${videoId}`, { method: "DELETE" });
}

export async function removePdfFromQuestionGroup(groupId: string | number, pdfId: string | number): Promise<void> {
  await apiFetchNoContent(`/QuestionGroups/${groupId}/pdfs/${pdfId}`, { method: "DELETE" });
}

export async function addPdfToQuestionGroup(groupId: string | number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  await apiUpload(`/QuestionGroups/${groupId}/add-pdf`, formData);
}

export async function getTryDetail(tryId: number): Promise<TryDetail> {
  const data = await apiFetch<TryDetail>(`/QuestionGroups/tries/${tryId}`);
  return data;
}

export interface SubmissionAnswer {
  questionId: number;
  choiceId: number;
}

export interface SubmissionResult {
  tryId: number;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
}

export async function submitQuestionGroup(id: string | number, answers: SubmissionAnswer[]): Promise<SubmissionResult> {
  return await apiFetch<SubmissionResult>(`/QuestionGroups/${id}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers })
  });
}

export async function getQuestionsByGroup(groupId: string): Promise<Question[]> {
  const data = await apiFetch<BackendQuestion[]>(`/QuestionGroups/${groupId}/questions`);
  return data.map(mapQuestion);
}


export async function createBook(title: string, courseId?: string): Promise<Book> {
  const url = courseId ? `/Books?courseId=${courseId}` : "/Books";
  const data = await apiFetch<BackendBook>(url, {
    method: "POST",
    body: JSON.stringify({ id: 0, title, bookQuestions: [] }),
  });
  return mapBook(data);
}

export async function updateBook(id: string | number, title: string, courseId?: string | number): Promise<void> {
  await apiFetchNoContent(`/Books/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id: Number(id), title, courseId: courseId ? Number(courseId) : null, bookQuestions: [] }),
  });
}

export async function deleteBook(id: string | number): Promise<void> {
  await apiFetchNoContent(`/Books/${id}`, { method: "DELETE" });
}

/* ------------------------------------------------------------------ */
/*  Questions API                                                     */
/* ------------------------------------------------------------------ */

interface BackendChoice {
  id: number;
  text: string;
  isCorrect: boolean;
  choiceImageUrl?: string;
}

interface BackendQuestion {
  id: number;
  text: string;
  questionImageUrl?: string;
  expanationImageUrl?: string;
  explanationVideoUrl?: string;
  difficulty?: string;
  yearAppeared: number;
  monthAppeared?: number;
  explanation?: string;
  orderIndex: number;
  topicId?: number;
  topic?: { id: number; name: string };
  choices: BackendChoice[];
  bookQuestions?: { book: { id: number; title: string } }[];
  questionBelongings?: { questionGroup: { id: number; title: string; type: number } }[];
}

function mapQuestion(q: BackendQuestion): Question {
  const labels = q.choices.map((_, i) => String.fromCharCode(65 + i));
  const correctIdx = q.choices.findIndex(c => c.isCorrect);
  
  const skill = q.questionBelongings?.find(b => b.questionGroup.type === 1)?.questionGroup; // Type 1 is Skills
  const bookId = q.bookQuestions?.[0]?.book?.id ? String(q.bookQuestions[0].book.id) : undefined;
  const bookTitle = q.bookQuestions?.[0]?.book?.title || undefined;
  const skillId = skill ? String(skill.id) : undefined;

  return {
    id: String(q.id),
    assignmentId: undefined,
    skillId: skillId,
    bookId: bookId,
    bookTitle: bookTitle,
    content: q.text || "",
    options: q.choices.map((c, i) => ({ id: String(c.id), label: labels[i] || "?", content: c.text, imageUrl: c.choiceImageUrl })),
    correctAnswer: labels[correctIdx] || "A",
    difficulty: (q.difficulty as any) || "medium",
    yearAppeared: q.yearAppeared,
    monthAppeared: q.monthAppeared,
    questionImageUrl: q.questionImageUrl,
    expanationImageUrl: q.expanationImageUrl,
    explanationVideoUrl: q.explanationVideoUrl,
    explanation: q.explanation || "",
    orderIndex: q.orderIndex,
    topicId: q.topicId,
    topic: q.topic,
  };
}

export async function getQuestions(): Promise<Question[]> {
  const data = await apiFetch<BackendQuestion[]>("/Questions");
  return data.map(mapQuestion);
}

export async function deleteQuestion(id: string | number): Promise<void> {
  await apiFetchNoContent(`/Questions/${id}`, { method: "DELETE" });
}

export async function updateQuestion(id: string | number, data: Partial<Question> & { choices: any[] }): Promise<Question> {
  const response = await apiFetch<BackendQuestion>(`/Questions/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      id: Number(id),
      text: data.content,
      difficulty: data.difficulty,
      yearAppeared: data.yearAppeared,
      monthAppeared: data.monthAppeared,
      explanation: data.explanation,
      questionImageUrl: data.questionImageUrl,
      expanationImageUrl: data.expanationImageUrl,
      explanationVideoUrl: data.explanationVideoUrl,
      orderIndex: data.orderIndex || 0,
      topicId: data.topicId || null,
      choices: data.choices.map((c: any) => ({
        id: c.id || c.choiceId || 0,
        text: c.text,
        isCorrect: c.isCorrect,
        choiceImageUrl: c.choiceImageUrl || undefined
      }))
    })
  });
  return mapQuestion(response);
}

export async function addQuestionToBook(questionId: string | number, bookId: string | number): Promise<void> {
  await apiFetchNoContent(`/Questions/${questionId}/add-to-books`, {
    method: "POST",
    body: JSON.stringify([Number(bookId)])
  });
}

export async function addQuestionToSkill(skillId: string | number, questionId: string | number): Promise<void> {
  await apiFetchNoContent(`/QuestionGroups/${skillId}/add-question`, {
    method: "POST",
    body: JSON.stringify(Number(questionId))
  });
}

export async function uploadQuestionImage(questionId: string | number, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("imageFile", file);
  const result = await apiUpload<{ url: string }>(`/Questions/${questionId}/upload-question-image`, formData);
  return result.url;
}

export async function uploadExplanationImage(questionId: string | number, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("imageFile", file);
  const result = await apiUpload<{ url: string }>(`/Questions/${questionId}/upload-explanation-image`, formData);
  return result.url;
}

export async function uploadChoiceImage(questionId: string | number, choiceId: number, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("imageFile", file);
  const result = await apiUpload<{ url: string }>(`/Questions/${questionId}/choices/${choiceId}/upload-image`, formData);
  return result.url;
}

export async function createQuestion(data: { 
  text: string; 
  choices: { text: string; isCorrect: boolean }[]; 
  difficulty: string;
  yearAppeared: number;
  monthAppeared?: number;
  explanation: string;
  orderIndex?: number;
  topicId?: number | null;
}): Promise<Question> {
  const response = await apiFetch<BackendQuestion>("/Questions", {
    method: "POST",
    body: JSON.stringify({
      id: 0,
      text: data.text,
      difficulty: data.difficulty,
      yearAppeared: data.yearAppeared,
      monthAppeared: data.monthAppeared,
      explanation: data.explanation,
      orderIndex: data.orderIndex || 0,
      topicId: data.topicId || null,
      choices: data.choices.map(c => ({ id: 0, text: c.text, isCorrect: c.isCorrect }))
    })
  });
  return mapQuestion(response);
}

export interface UserProfileDto {
  id: string;
  name: string;
  userName?: string;
  phone: string | null;
  parentPhone?: string | null;
  role: string;
  courseIds: number[];
  createdAt?: string;
}

export async function getStudents(): Promise<UserProfileDto[]> {
  return await apiFetch<UserProfileDto[]>("/Auth/students");
}

export async function getStudent(id: string): Promise<UserProfileDto> {
  return await apiFetch<UserProfileDto>(`/Auth/profile/${id}`);
}

export async function activateAccount(id: string): Promise<void> {
  await apiFetchNoContent(`/Auth/activate-account/${id}`, { method: "POST" });
}

export async function deactivateAccount(id: string): Promise<void> {
  await apiFetchNoContent(`/Auth/deactivate-account/${id}`, { method: "POST" });
}

export async function addStudentToCourse(studentId: string, courseId: number): Promise<void> {
  await apiFetchNoContent(`/Auth/students/${studentId}/add-course/${courseId}`, { method: "POST" });
}

export async function removeStudentFromCourse(studentId: string, courseId: number): Promise<void> {
  await apiFetchNoContent(`/Auth/students/${studentId}/remove-course/${courseId}`, { method: "POST" });
}

export async function deleteStudent(id: string): Promise<void> {
  await apiFetchNoContent(`/Auth/students/${id}`, { method: "DELETE" });
}

export async function resetUserPassword(userId: string, newPassword: string): Promise<void> {
  await apiFetchNoContent(`/Auth/users/${userId}/reset-password`, {
    method: "POST",
    body: JSON.stringify({ newPassword }),
  });
}

export async function getParents(): Promise<UserProfileDto[]> {
  return await apiFetch<UserProfileDto[]>("/Auth/parents");
}

export async function deleteParent(id: string): Promise<void> {
  await apiFetchNoContent(`/Auth/parents/${id}`, { method: "DELETE" });
}

export async function getAdmins(): Promise<UserProfileDto[]> {
  return await apiFetch<UserProfileDto[]>("/Auth/admins");
}

export async function deleteAdmin(id: string): Promise<void> {
  await apiFetchNoContent(`/Auth/admins/${id}`, { method: "DELETE" });
}

export async function updateStudent(id: string, data: { name?: string; phone?: string | null; parentPhone?: string | null }): Promise<UserProfileDto> {
  return await apiFetch<UserProfileDto>(`/Auth/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ------------------------------------------------------------------ */
/*  Sessions API                                                      */
/* ------------------------------------------------------------------ */

export async function getSessions(): Promise<Session[]> {
  return await apiFetch<Session[]>("/Sessions");
}

export async function getSessionsByCourse(courseId: number | string): Promise<Session[]> {
  return await apiFetch<Session[]>(`/Sessions/by-course/${courseId}`);
}

export async function createSession(session: Partial<Session>, courseId?: string): Promise<Session> {
  const url = courseId ? `/Sessions?courseId=${courseId}` : "/Sessions";
  return await apiFetch<Session>(url, {
    method: "POST",
    body: JSON.stringify(session),
  });
}

export async function addPdfToSession(sessionId: number | string, file: File, title: string): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  await apiUpload(`/Sessions/pdf/${sessionId}`, formData);
}

export async function removePdfFromSession(sessionId: number | string, pdfId: number | string): Promise<void> {
  await apiFetchNoContent(`/Sessions/pdf/${sessionId}/${pdfId}`, { method: "DELETE" });
}

/* ------------------------------------------------------------------ */
/*  Parent API                                                         */
/* ------------------------------------------------------------------ */

export interface ParentChild {
  id: string;
  name: string;
  phone: string | null;
  lastActivity: string | null;
}

export interface StudentStats {
  studentId: string;
  studentName: string;
  studentPhone: string | null;
  totalScore: number;
  totalScoreOutOf800: number;
  weakPointsCount: number;
  mistakeCount: number;
  completedAssignments: number;
  studentRank: number;
  rankedStudents: number;
  lastActivity: string | null;
  recentTries: TrySummary[];
}

export async function getMyChildren(): Promise<ParentChild[]> {
  const data = await apiFetch<any[]>("/Auth/my-children");
  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    lastActivity: c.lastActivity
  }));
}

export async function getStudentStats(studentId: string): Promise<StudentStats> {
  return await apiFetch<StudentStats>(`/Auth/student/${studentId}/stats`);
}

export async function getChildDashboardStats(childId: string, courseId?: string): Promise<ParentDashboardData> {
  const params = courseId ? `?courseId=${courseId}` : "";
  return await apiFetch<ParentDashboardData>(`/Parent/child-stats/${childId}${params}`);
}

/* ------------------------------------------------------------------ */
/*  Topics API                                                        */
/* ------------------------------------------------------------------ */

interface BackendTopic {
  id: number;
  name: string;
}

function mapTopic(t: BackendTopic): Topic {
  return { id: String(t.id), name: t.name };
}

export async function getTopics(): Promise<Topic[]> {
  const data = await apiFetch<BackendTopic[]>("/Topics");
  return data.map(mapTopic);
}

export async function createTopic(name: string): Promise<Topic> {
  const data = await apiFetch<BackendTopic>("/Topics", {
    method: "POST",
    body: JSON.stringify({ id: 0, name })
  });
  return mapTopic(data);
}

export async function updateTopic(id: string | number, name: string): Promise<void> {
  await apiFetchNoContent(`/Topics/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id: Number(id), name })
  });
}

export async function deleteTopic(id: string | number): Promise<void> {
  await apiFetchNoContent(`/Topics/${id}`, { method: "DELETE" });
}
