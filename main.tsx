import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Language } from "../lib/types";

export type TranslationKey =
  | "appName"
  | "home"
  | "about"
  | "privacyPolicy"
  | "termsOfService"
  | "login"
  | "logout"
  | "dashboard"
  | "studentParentDashboard"
  | "books"
  | "assignments"
  | "skills"
  | "weakPoints"
  | "mistakeHistory"
  | "checkpoint"
  | "asks"
  | "sessions"
  | "sessionsTitle"
  | "sessionsSubtitle"
  | "noSessions"
  | "noSessionsDesc"
  | "materials"
  | "joinSession"
  | "students"
  | "parents"
  | "admins"
  | "courses"
  | "questions"
  | "resources"
  | "registerUser"
  | "parents"
  | "practiceQuestions"
  | "practiceAll"
  | "retake"
  | "videos"
  | "pdf"
  | "pending"
  | "answered"
  | "submitted"
  | "graded"
  | "active"
  | "inactive"
  | "published"
  | "draft"
  | "score"
  | "lastActive"
  | "accountExpiry"
  | "language"
  | "learningPortal"
  | "loginWelcome"
  | "username"
  | "password"
  | "rememberMe"
  | "forgotPassword"
  | "noAccount"
  | "createAccountLink"
  | "heroTitle"
  | "heroSubtitle"
  | "heroHighlight"
  | "heroTagline"
  | "featureRole"
  | "featureWeak"
  | "featureBilingual"
  | "newStudent"
  | "createAccount"
  | "registerSubtitle"
  | "fullName"
  | "accountType"
  | "student"
  | "parent"
  | "studentPhone"
  | "parentPhone"
  | "registerAction"
  | "alreadyHaveAccount"
  | "loginLink"
  | "signingIn"
  | "confirmPassword"
  | "creatingAccount"
  | "checkFields"
  | "resetPassword"
  | "resetSubtitle"
  | "resetSent"
  | "sending"
  | "sendResetLink"
  | "backToLogin"
  | "studentDashboard"
  | "keepStreak"
  | "expiryCountdown"
  | "noCoursesContactAdmin"
  | "accountNotActivated"
  | "totalScore"
  | "mistakes"
  | "completedAssignments"
  | "scoreTrend"
  | "weeklyProgress"
  | "recentActivity"
  | "whatChanged"
  | "noActivityFound"
  | "quickAccess"
  | "jumpBackIn"
  | "booksProgress"
  | "learnFromMiss"
  | "reviewExplanation"
  | "fixRepeatedMistakes"
  | "weakPointsSubtitle"
  | "practiceWeakPoints"
  | "yourAnswer"
  | "correctAnswer"
  | "weeklyCheckPoint"
  | "weeklyExam"
  | "performance"
  | "myCourses"
  | "noCoursesFound"
  | "viewCourse"
  | "courseEnded"
  | "courseMaterialsUnavailable"
  | "deadline"
  | "trackProgress"
  | "reviewPerformance"
  | "attemptHistory"
  | "noAttemptsFound"
  | "mistakeDetailSoon"
  | "xMistakes"
  | "homeHeroTitle"
  | "homeHeroSubtitle"
  | "homeGetStarted"
  | "homeLearnMore"
  | "homeFeatures"
  | "homeFeature1Title"
  | "homeFeature1Desc"
  | "homeFeature2Title"
  | "homeFeature2Desc"
  | "homeFeature3Title"
  | "homeFeature3Desc"
  | "homeFeature4Title"
  | "homeFeature4Desc"
  | "homeCtaTitle"
  | "homeCtaSubtitle"
  | "homeLogin"
  | "homeRegister"
  | "aboutTitle"
  | "aboutMissionTitle"
  | "aboutMissionDesc"
  | "aboutVisionTitle"
  | "aboutVisionDesc"
  | "aboutFeaturesTitle"
  | "aboutFeature1"
  | "aboutFeature2"
  | "aboutFeature3"
  | "aboutFeature4"
  | "aboutContactTitle"
  | "aboutContactDesc"
  | "privacyTitle"
  | "privacyIntro"
  | "privacyCollectTitle"
  | "privacyCollectDesc"
  | "privacyUseTitle"
  | "privacyUseDesc"
  | "privacyProtectTitle"
  | "privacyProtectDesc"
  | "privacyShareTitle"
  | "privacyShareDesc"
  | "privacyCookiesTitle"
  | "privacyCookiesDesc"
  | "privacyChangesTitle"
  | "privacyChangesDesc"
  | "privacyContactTitle"
  | "privacyContactDesc"
  | "termsTitle"
  | "termsIntro"
  | "termsAcceptTitle"
  | "termsAcceptDesc"
  | "termsUseTitle"
  | "termsUseDesc"
  | "termsConductTitle"
  | "termsConductDesc"
  | "termsContentTitle"
  | "termsContentDesc"
  | "termsPaymentTitle"
  | "termsPaymentDesc"
  | "termsTerminationTitle"
  | "termsTerminationDesc"
  | "termsLiabilityTitle"
  | "termsLiabilityDesc"
  | "termsChangesTitle"
  | "termsChangesDesc"
  | "termsContactTitle"
  | "termsContactDesc"
  | "footerRights"
  | "footerPrivacy"
  | "footerTerms"
  | "parentDashboard"
  | "childrenProgress"
  | "assignmentsAndSkills"
  | "phoneOnly"
  | "teacherDashboard"
  | "operationsSnapshot"
  | "trackCourseCoverage"
  | "todayStat"
  | "studentAttempts"
  | "learningHealth"
  | "registeredLearners"
  | "activeCoursesCount"
  | "endedCourses"
  | "averageScore"
  | "totalAttempts"
  | "liveContent"
  | "totalBooksCount"
  | "activityChart"
  | "dailyAttempts"
  | "coursesChart"
  | "activeCourseCoverage"
  | "enrollmentChart"
  | "studentsByCourse"
  | "coursePerformanceChart"
  | "averageScoreByCourse"
  | "performanceTrendChart"
  | "averageScoreTrend"
  | "guideLineTargetPercent"
  | "contentChart"
  | "teachingMix"
  | "materialBalance"
  | "noContentYet"
  | "percentOfContent"
  | "recentActivityLabel"
  | "latestAttempts"
  | "noRecentAttempts"
  | "strongPerformance"
  | "needsAttention"
  | "reviewUrgently"
  | "studentManagement"
  | "manageEnrollments"
  | "searchNameUsernamePhone"
  | "allCourses"
  | "enrolledCourses"
  | "loadingStudents"
  | "editStudent"
  | "deleteStudentConfirm"
  | "enterNewPassword"
  | "passwordMinChars"
  | "passwordHasBeenReset"
  | "couldNotResetPassword"
  | "loadingStudentProfile"
  | "studentProfileLabel"
  | "noPhone"
  | "editInfo"
  | "bookProgressApiPending"
  | "mistakeHistoryDb"
  | "homeworkGrading"
  | "failedToUpdateStudent"
  | "courseSetup"
  | "createCoursesAndTrack"
  | "createNewCourse"
  | "courseNamePlaceholder"
  | "egAdvancedMath"
  | "examDate"
  | "assignBooks"
  | "assignSessions"
  | "assignActivities"
  | "createCourseAndAssign"
  | "saveChanges"
  | "editDetailsAndAssignments"
  | "deleteCourseConfirm"
  | "courseYearLabel"
  | "examDateLabel"
  | "booksCount"
  | "sessionsCount"
  | "activitiesCount"
  | "assignmentBuilder"
  | "createAndManageQuestions"
  | "assignmentTitle"
  | "assignmentType"
  | "skillType"
  | "durationMinutes"
  | "skillsUnlimitedDuration"
  | "createAssignment"
  | "createSkill"
  | "noAssignmentsFound"
  | "questionsInAssignment"
  | "addQuestions"
  | "noQuestionsYetClickAdd"
  | "questionWithoutText"
  | "difficultyYearChoices"
  | "skillsSection"
  | "noSkillsFound"
  | "searchAssignments"
  | "searchSkills"
  | "noAssignmentsMatch"
  | "noSkillsMatch"
  | "unlimitedQuestions"
  | "questionsInSkill"
  | "questionPicker"
  | "hasImage"
  | "addQuestionsTo"
  | "searchQuestionsText"
  | "noQuestionsInBank"
  | "allQuestionsAdded"
  | "questionAddedSuccess"
  | "failedToAddQuestion"
  | "failedToRemoveQuestion"
  | "failedToReorderQuestions"
  | "deleteAssignmentConfirm"
  | "assignmentDeletedSuccess"
  | "skillDeletedSuccess"
  | "chapterLibrary"
  | "bookOrChapterTitle"
  | "addBook"
  | "dragToReorder"
  | "orderN"
  | "unknownCourse"
  | "pleaseEnterTitleFirst"
  | "failedToCreateBook"
  | "searchBooks"
  | "noBooksMatch"
  | "searchCourses"
  | "noCoursesMatch"
  | "questionBank"
  | "addQuestionsToBooks"
  | "allDifficulty"
  | "selectBook"
  | "questionText"
  | "orUploadQuestionImage"
  | "questionPreview"
  | "choicesSelectCorrect"
  | "choiceLetter"
  | "addChoice"
  | "difficultyEasy"
  | "difficultyMedium"
  | "difficultyHard"
  | "yearPlaceholder"
  | "monthPlaceholder"
  | "explanationOptional"
  | "orUploadExplanationImage"
  | "explanationPreview"
  | "updateQuestion"
  | "saveQuestion"
  | "deleteQuestion"
  | "deleteQuestionConfirm"
  | "pleaseProvideQuestionText"
  | "pleaseAddChoice"
  | "pleaseSelectCorrectAnswer"
  | "videosAndPdfs"
  | "attachYouTubeLinks"
  | "addVideo"
  | "youtubeSource"
  | "vdoCipherSource"
  | "youtubeUrl"
  | "vdoCipherVideoId"
  | "viewsPerUser"
  | "saveVideo"
  | "uploadPdfLabel"
  | "choosePdf"
  | "videosSection"
  | "noVideosYet"
  | "pdfSection"
  | "noPdfsYet"
  | "manageViews"
  | "searchStudentsPlaceholder"
  | "noUsersFound"
  | "failedToLoadResources"
  | "viewsUpdatedText"
  | "failedToUpdateViews"
  | "deleteVideoConfirm"
  | "deletePdfConfirm"
  | "liveSessions"
  | "addSession"
  | "addNewSession"
  | "sessionTitle"
  | "exactDateTime"
  | "noCourseOption"
  | "meetingLinkOptional"
  | "attachmentPdf"
  | "saveSession"
  | "meetingLink"
  | "noPdfsAttached"
  | "addPdf"
  | "createAndGradeHomework"
  | "publishInstructions"
  | "instructionsPlaceholder"
  | "publishLabel"
  | "submissionsSection"
  | "pendingSubmission"
  | "feedbackPlaceholder"
  | "gradeButton"
  | "noSubmissionsFound"
  | "parentManagement"
  | "viewAndManageParents"
  | "loadingParents"
  | "deleteParentConfirm"
  | "adminManagement"
  | "viewAndManageAdmins"
  | "loadingAdmins"
  | "deleteAdminConfirm"
  | "adminOnly"
  | "createsAccountsDirectly"
  | "phoneLabel"
  | "adminRole"
  | "parentsPhone"
  | "parentsPhoneNumber"
  | "createdAccountFor"
  | "createAccountButton"
  | "enterFullNameValidation"
  | "enterUsernameValidation"
  | "useAtLeastSixChars"
  | "failedToCreateAccount"
  | "loadingFamilyDashboard"
  | "familyProgress"
  | "trackScoresWeakPoints"
  | "activeStudent"
  | "updatingDataForChild"
  | "noDataAvailablePeriod"
  | "couldNotRetrieveStats"
  | "dailyActivity"
  | "solvingActivityPerDay"
  | "clickOnBar"
  | "attemptsCount"
  | "avgScoreColon"
  | "clickToViewDetails"
  | "noDailyActivityYet"
  | "weakPointsSection"
  | "areasNeedReview"
  | "activityOnDate"
  | "nAttemptsAvgScore"
  | "correctOfTotal"
  | "noDetailedRecords"
  | "weakPointsNeedsReview"
  | "currentAccuracy"
  | "mistakesCount"
  | "reviewSuggestedQuestions"
  | "recentMistakesSection"
  | "noRecentMistakes"
  | "everythingLooksPerfect"
  | "noWeakPointsDetected"
  | "greatJobAllGood"
  | "childProgress"
  | "childNotFound"
  | "booksOverview"
  | "skillsBreakdown"
  | "recentMistakesLabel"
  | "upcomingHomework"
  | "dueDateLabel"
  | "practiceAndResources"
  | "practiceAllQuestionsDesc"
  | "allBooks"
  | "allYears"
  | "allMonths"
  | "mainNavigation"
  | "footerNavigation"
  | "bulkUpload"
  | "bulkUploadHint"
  | "skillsAppearHere"
  | "nameColumn"
  | "modelAnswersColumn"
  | "degreeColumn"
  | "examColumn"
  | "videosColumn"
  | "pdfColumn"
  | "noTriesYet"
  | "startPracticing"
  | "viewModelAnswers"
  | "questionsCount"
  | "practiceAllQuestionsLink"
  | "tryDetail"
  | "scoreCorrectTotal"
  | "loadingTryDetails"
  | "weeklyExams"
  | "practiceWeeklyExams"
  | "noWeeklyExamsAvailable"
  | "weeklyExamsAppearHere"
  | "examResults"
  | "yourAttempts"
  | "completedAttemptsReadOnly"
  | "noExamsCompletedYet"
  | "readOnlyReview"
  | "questionCorrect"
  | "questionIncorrect"
  | "selectAnAttempt"
  | "chooseExamFromList"
  | "bookDetailLabel"
  | "resourcesSkillsAndPractice"
  | "nQuestionsDegree"
  | "durationLabel"
  | "nPagesSizeMB"
  | "examSkillWeighting"
  | "noQuestionsHereYet"
  | "practiceModeAppearsWhenPublished"
  | "submittingAnswers"
  | "thinkSolveSucceed"
  | "practiceComplete"
  | "youScored"
  | "retakeButton"
  | "previousButton"
  | "filterByBook"
  | "clearFilter"
  | "submitButton"
  | "showExplanation"
  | "finishButton"
  | "nextButton"
  | "finishMissingAnswersDesc"
  | "nextSession"
  | "correctAnswerHeading"
  | "tryThisIdeaAgain"
  | "explanationVideoTitle"
  | "browserNotSupportVideo"
  | "closeVideos"
  | "selectAVideo"
  | "autoPlayNext"
  | "loadingVideo"
  | "viewsRemaining"
  | "watchingConsumesView"
  | "watchNow"
  | "confirmCancel"
  | "noViewsRemaining"
  | "contactInstructorForViews"
  | "failedToLoadVideo"
  | "noVideosForBook"
  | "thinkingLabel"
  | "logoAlt"
  | "noCourseSelected"
  | "skillNotFound"
  | "backToSkills"
  | "assignmentNotFound"
  | "backToAssignments"
  | "weeklyExamNotFound"
  | "backToCheckpoint"
  | "loadingDots"
  | "savingDots"
  | "creatingDots"
  | "uploadingDots"
  | "submittingDots"
  | "deletingDots"
  | "actionSave"
  | "actionCancel"
  | "actionEdit"
  | "actionDelete"
  | "actionCreate"
  | "actionGrade"
  | "actionResetPassword"
  | "areYouSureDelete"
  | "cannotBeUndone"
  | "notAvailable"
  | "successCreated"
  | "successDeleted"
  | "successSaved"
  | "failedAction"
  | "noResultsFound"
  | "searchDots"
  // Validation & form messages
  | "usernameRequired"
  | "passwordMinLength"
  | "unableToLogin"
  | "wrongUsernameOrPassword"
  | "usernameExists"
  | "fullNameRequired"
  | "usernameInvalidChars"
  | "usernameMinLength"
  | "validPhoneNumber"
  | "validParentPhone"
  | "confirmPasswordRequired"
  | "passwordsDontMatch"
  | "phoneMustDifferFromParent"
  | "registrationFailed"
  | "checkHighlightedFields"
  | "enterFullName"
  | "enterUsername"
  | "useMinChars"
  | "studentLabel"
  | "parentLabel"
  | "togglePassword"
  | "levelUpMath"
  | "startJourney"
  | "successWord"
  | "createAccountDescription"
  | "assignmentsCount"
  | "excellence"
  // Student dashboard
  | "welcomeBackName"
  | "yourAverageScore"
  | "skillsNeedReview"
  | "storedForReview"
  | "acrossAllCategories"
  | "yourRankLabel"
  | "outOfStudents"
  | "noRankingYet"
  | "liveSession"
  | "targetSeventyPercent"
  | "scoreTooltip"
  | "attemptTooltip"
  | "startQuizToSeeTrend"
  | "accuracy"
  | "correctVsMissed"
  | "quickLookAtAttempts"
  | "noAttemptsYet"
  // Child dashboard
  | "overallPerformance"
  | "completionRate"
  | "engagementLevel"
  | "studentRankLabel"
  | "unranked"
  | "outOfRankedStudents"
  | "noScoredAttemptsYet"
  | "performanceLevelLow"
  | "performanceLevelMedium"
  | "performanceLevelHigh"
  | "performanceTrends"
  | "liveMetrics"
  // App shell
  | "roleNavigation"
  | "toggleLanguageLabel"
  | "languageAr"
  | "languageEn"
  | "courseEndedOn"
  // Splash
  | "interactiveLearning"
  // Account expiry
  | "accountExpiresIn"
  | "contactTeacher"
  | "accountExpired"
  | "studentAccountExpired"
  | "noAccessYet"
  // Home page
  | "liveAnalytics"
  | "smartPractice"
  | "parentVisibility"
  | "avgMastery"
  | "fasterReview"
  | "progressView"
  | "learningOs"
  | "studentCockpit"
  | "liveBadge"
  | "masteryCurve"
  | "dayStreak"
  | "feedbackLabel"
  | "reviewLinearEquations"
  | "tonight830"
  | "premiumTools"
  | "weakPointsBadge"
  | "scoreTrendBadge"
  | "mistakesBadge"
  | "personalizedSkillRoute"
  | "assignmentsInstantClarity"
  | "parentReadySnapshots"
  // About page
  | "diagnose"
  | "diagnoseDesc"
  | "reviewStep"
  | "reviewStepDesc"
  | "aboutThePlatform"
  | "avgClarityGain"
  | "fasterReviewLoop"
  | "learningJourney"
  | "openDashboard"
  | "startLearning"
  // Privacy page
  | "privacyHub"
  | "studentFirst"
  | "noDataSelling"
  | "secureByDesign"
  | "privacySectionLabel"
  | "privacySectionDesc"
  | "accessAware"
  | "minimalCollection"
  | "humanContactPath"
  | "sectionsLabel"
  // Privacy summaries
  | "privacyCollectSummary"
  | "privacyUseSummary"
  | "privacyProtectSummary"
  | "privacyShareSummary"
  | "privacyCookiesSummary"
  | "privacyChangesSummary"
  // Terms page
  | "interactiveTermsCenter"
  | "readableRules"
  | "readableRulesDesc"
  | "fairAccess"
  | "fairAccessDesc"
  | "termsMap"
  | "quickLegalSummary"
  | "quickLegalDesc"
  | "tagStartHere"
  | "tagAccounts"
  | "tagCommunity"
  | "tagMaterials"
  | "tagBilling"
  | "tagAccess"
  | "tagLimits"
  | "tagUpdates"
  // Public chrome
  | "brandDr"
  | "languageEnglish"
  | "copyrightFooter"
  // Teacher dashboard
  | "clearCountLabels"
  | "catalogAvailable"
  | "activeLower"
  | "horizontalBarsReadable"
  | "coursesLandingWell"
  | "dashboardAnalyticsError"
  // Teacher resources
  | "videoAddedSuccess"
  | "failedToAddVideo"
  | "pdfUploadedSuccess"
  | "failedToUploadPdf"
  | "videoDeleted"
  | "failedToDeleteVideo"
  | "pdfDeleted"
  | "failedToDeletePdf"
  | "failedToLoadUserViews"
  | "targetSection"
  | "noGroupSelected"
  | "labelManageViews"
  | "ariaDeleteVideo"
  | "ariaDeletePdf"
  // Teacher sessions
  | "courseOptional"
  | "failedToUploadPdfMessage"
  | "failedToDeletePdfMessage"
  // Teacher questions
  | "enterQuestionText"
  | "actions"
  | "explanationLabel"
  // Teacher assignments
  | "failedToDeleteMessage"
  | "createNew"
  | "questionsAvailable"
  // Shared alt/aria
  | "altExplanationFigure"
  | "altQuestionImage"
  | "altLogo"
  | "ariaClosePdf"
  | "correctLabel"
  | "missedLabel"
  | "last30Days"
  | "avgScore"
  | "questionXofY"
  | "questionNumber"
  | "allFilter"
  | "correctFilter"
  | "incorrectFilter"
  | "noQuestionsMatchFilter"
  | "clickToFilter"
  | "showingAll"
  | "showingCorrect"
  | "showingIncorrect"
  | "noWeakPointsYet"
  | "keepSolvingAssignments"
  // Topics
  | "topics"
  | "topicManagement"
  | "topicName"
  | "addTopic"
  | "editTopic"
  | "deleteTopic"
  | "deleteTopicConfirm"
  | "topicCreated"
  | "topicUpdated"
  | "topicDeleted"
  | "noTopicsFound"
  | "searchTopics"
  | "noTopicsMatch"
  | "selectTopic"
  | "noTopic"
  | "addQuestionsFromTopic"
  | "addFromTopicConfirm"
  | "questionsAddedFromTopic"
  | "selectAll"
  | "deselectAll"
  | "addSelected"
  | "searchByText"
  | "courseUpdated"
  | "failedToUpdateCourse"
  | "changeCourse"
  | "phoneInvalid"
  | "parentPhoneInvalid"
  | "fullscreenWarning"
  | "startPracticeFullscreen"
  | "fullscreenExitedTitle"
  | "fullscreenExitedDesc"
  | "secondsUntilSubmit"
  | "returnToFullscreen"
  | "tabSwitchWarningTitle"
  | "tabSwitchWarningDesc"
  | "tabSwitchContinue";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    appName: "Dr. Ziad Mohamed Math IG",
    home: "Home",
    about: "About",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    studentParentDashboard: "Parent Dashboard",
    books: "Books",
    assignments: "Assignments",
    skills: "Skills",
    weakPoints: "Weak Points",
    mistakeHistory: "Mistake History",
    checkpoint: "Checkpoint",
    asks: "Asks",
    sessions: "Sessions",
    sessionsTitle: "Your Sessions",
    sessionsSubtitle: "Watch recorded sessions and join live classes",
    noSessions: "No sessions available",
    noSessionsDesc: "Sessions will appear here once added by your teacher",
    materials: "Materials",
    joinSession: "Join Session",
    students: "Students",
    parents: "Parents",
    admins: "Admins",
    courses: "Courses",
    questions: "Questions",
    resources: "Resources",
    registerUser: "Register User",
    practiceQuestions: "Practice Questions",
    practiceAll: "Practice All",
    retake: "Retake",
    videos: "Videos",
    pdf: "PDF",
    pending: "Pending",
    answered: "Answered",
    submitted: "Submitted",
    graded: "Graded",
    active: "Active",
    inactive: "Inactive",
    published: "Published",
    draft: "Draft",
    score: "Score",
    lastActive: "Last Active",
    accountExpiry: "Account Expiry",
    language: "Language",
    learningPortal: "Learning portal",
    loginWelcome: "Welcome back! Please enter your credentials to access your dashboard.",
    username: "Username",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    createAccountLink: "Create Account",
    heroTitle: "A focused math workspace for",
    heroSubtitle: "Master mathematics with real-time feedback, personalized tasks, and professional teacher guidance.",
    heroHighlight: "excellence.",
    heroTagline: "THINK • SOLVE • SUCCEED",
    featureRole: "Role redirects",
    featureWeak: "Weak points",
    featureBilingual: "Bilingual",
    newStudent: "New Student",
    createAccount: "Create Account",
    registerSubtitle: "Join our math learning community today and start mastering skills.",
    fullName: "Full Name",
    accountType: "Account Type",
    student: "Student",
    parent: "Parent",
    studentPhone: "Student Phone",
    parentPhone: "Parent Phone",
    phoneOnly: "Phone",
    registerAction: "Register Account",
    alreadyHaveAccount: "Already have an account?",
    loginLink: "Login here",
    signingIn: "Signing in...",
    confirmPassword: "Confirm Password",
    creatingAccount: "Creating account...",
    checkFields: "Please check the highlighted fields.",
    resetPassword: "Reset password",
    resetSubtitle: "Enter your email and we'll send you a link to reset your password.",
    resetSent: "If this account exists, a reset instruction has been sent to your email.",
    sending: "Sending...",
    sendResetLink: "Send Reset Link",
    backToLogin: "Back to Login",
    studentDashboard: "Student dashboard",
    keepStreak: "Keep the streak going with one focused practice set today.",
    expiryCountdown: "Expiry countdown",
    noCoursesContactAdmin: "No courses - contact admin",
    accountNotActivated: "Account not activated, contact Dr. Ziad Mohamed",
    totalScore: "Total Score",
    mistakes: "Mistakes",
    completedAssignments: "Completed Assignments",
    scoreTrend: "Score trend",
    weeklyProgress: "Weekly progress",
    recentActivity: "Recent activity",
    whatChanged: "What changed",
    noActivityFound: "No recent activity found.",
    quickAccess: "Quick access",
    jumpBackIn: "Jump back in",
    booksProgress: "Books progress",
    learnFromMiss: "Learn from every miss",
    reviewExplanation: "Review your answer, the correct answer, and Dr. Ziad Mohamed's explanation.",
    fixRepeatedMistakes: "Fix repeated mistakes",
    weakPointsSubtitle: "Questions appear here after two or more wrong attempts in the same skill.",
    practiceWeakPoints: "Practice Weak Points",
    yourAnswer: "Your answer",
    correctAnswer: "Correct answer",
    weeklyCheckPoint: "Weekly Check Point",
    weeklyExam: "Weekly Exam",
    performance: "Performance",
    myCourses: "My Courses",
    noCoursesFound: "No Courses Found",
    viewCourse: "View Course",
    courseEnded: "Course Ended",
    courseMaterialsUnavailable: "This course ended on {date}. Course materials are no longer available.",
    deadline: "Deadline",
    trackProgress: "Track Your Progress",
    reviewPerformance: "Review your attempt history and performance trends.",
    attemptHistory: "Attempt History",
    noAttemptsFound: "You haven't made any attempts yet.",
    mistakeDetailSoon: "Detailed mistake analysis is coming soon.",
    xMistakes: "mistakes",
    homeHeroTitle: "Master Mathematics with Confidence",
    homeHeroSubtitle: "Your personalized learning platform with real-time feedback, interactive practice, and expert guidance from Dr. Ziad Mohamed.",
    homeGetStarted: "Get Started",
    homeLearnMore: "About Us",
    homeFeatures: "Why Choose Us",
    homeFeature1Title: "Personalized Learning",
    homeFeature1Desc: "Adaptive exercises that match your skill level and learning pace.",
    homeFeature2Title: "Real-time Feedback",
    homeFeature2Desc: "Instant explanations for every answer to accelerate your understanding.",
    homeFeature3Title: "Track Progress",
    homeFeature3Desc: "Monitor your improvement with detailed analytics and weekly checkpoints.",
    homeFeature4Title: "Bilingual Support",
    homeFeature4Desc: "Learn in both English and Arabic for better comprehension.",
    homeCtaTitle: "Ready to Start Your Journey?",
    homeCtaSubtitle: "Join thousands of students improving their math skills every day.",
    homeLogin: "Login",
    homeRegister: "Create Account",
    aboutTitle: "About Dr. Ziad Mohamed Math IG",
    aboutMissionTitle: "Our Mission",
    aboutMissionDesc: "We believe every student can excel in mathematics. Our platform provides the tools, guidance, and support needed to build confidence and achieve academic success.",
    aboutVisionTitle: "Our Vision",
    aboutVisionDesc: "To become the leading math learning platform in the Middle East, making quality math education accessible to every student.",
    aboutFeaturesTitle: "What We Offer",
    aboutFeature1: "Comprehensive math curriculum aligned with school standards",
    aboutFeature2: "Interactive learning materials and practice exercises",
    aboutFeature3: "Progress tracking and performance analytics",
    aboutFeature4: "Dedicated teacher support and mentorship",
    aboutContactTitle: "Contact Us",
    aboutContactDesc: "Have questions? We'd love to hear from you.",
    privacyTitle: "Privacy Policy",
    privacyIntro: "Your privacy is important to us. This policy explains how we collect, use, and protect your information.",
    privacyCollectTitle: "Information We Collect",
    privacyCollectDesc: "We collect information you provide during registration, your learning activity, and device information for analytics.",
    privacyUseTitle: "How We Use Your Information",
    privacyUseDesc: "We use your information to provide personalized learning experiences, track progress, and improve our services.",
    privacyProtectTitle: "How We Protect Your Information",
    privacyProtectDesc: "We implement industry-standard security measures to protect your data from unauthorized access.",
    privacyShareTitle: "Information Sharing",
    privacyShareDesc: "We do not share your personal information with third parties. Your data is used solely for educational purposes.",
    privacyCookiesTitle: "Cookies",
    privacyCookiesDesc: "We use cookies to enhance your experience. You can disable cookies in your browser settings.",
    privacyChangesTitle: "Changes to This Policy",
    privacyChangesDesc: "We may update this policy periodically. We will notify you of any significant changes.",
    privacyContactTitle: "Contact Us",
    privacyContactDesc: "If you have questions about this policy, please contact us.",
    termsTitle: "Terms of Service",
    termsIntro: "Welcome to Dr. Ziad Mohamed Math IG. By using our platform, you agree to these terms.",
    termsAcceptTitle: "Acceptance of Terms",
    termsAcceptDesc: "By accessing and using our platform, you accept and agree to be bound by the terms of this agreement.",
    termsUseTitle: "User Accounts",
    termsUseDesc: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities under your account.",
    termsConductTitle: "User Conduct",
    termsConductDesc: "You agree to use the platform only for lawful purposes and in a manner that does not infringe on the rights of others.",
    termsContentTitle: "Content and Materials",
    termsContentDesc: "All content on this platform is the property of Dr. Ziad Mohamed Math IG. You may not reproduce, distribute, or modify any materials without permission.",
    termsPaymentTitle: "Subscription and Payment",
    termsPaymentDesc: "Some features require a subscription. Payments are processed securely. Refund policies are available upon request.",
    termsTerminationTitle: "Termination",
    termsTerminationDesc: "We reserve the right to terminate your account if you violate these terms or engage in inappropriate behavior.",
    termsLiabilityTitle: "Limitation of Liability",
    termsLiabilityDesc: "The platform is provided 'as is'. We are not liable for any damages arising from your use of the platform.",
    termsChangesTitle: "Changes to Terms",
    termsChangesDesc: "We may modify these terms at any time. Continued use of the platform constitutes acceptance of new terms.",
    termsContactTitle: "Contact",
    termsContactDesc: "For questions about these terms, please contact us.",
    footerRights: "All rights reserved.",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
    parentDashboard: "Parent dashboard",
    childrenProgress: "Children progress",
    assignmentsAndSkills: "Assignments and Skills",
    teacherDashboard: "Teacher dashboard",
    operationsSnapshot: "Operations snapshot",
    trackCourseCoverage: "Track course coverage, student activity, and recent performance from one focused control surface.",
    todayStat: "Today",
    studentAttempts: "student attempts",
    learningHealth: "Learning health",
    registeredLearners: "Registered learners",
    activeCoursesCount: "Active courses",
    endedCourses: "ended",
    averageScore: "Average score",
    totalAttempts: "attempts",
    liveContent: "Live content",
    totalBooksCount: "books",
    activityChart: "Activity",
    dailyAttempts: "Daily attempts",
    coursesChart: "Courses",
    activeCourseCoverage: "Active course coverage",
    enrollmentChart: "Enrollment",
    studentsByCourse: "Students by course",
    coursePerformanceChart: "Course performance",
    averageScoreByCourse: "Average score by course",
    performanceTrendChart: "Performance",
    averageScoreTrend: "Average score trend",
    guideLineTargetPercent: "The guide line marks the 70% target.",
    contentChart: "Content",
    teachingMix: "Teaching mix",
    materialBalance: "Material balance across the admin workspace.",
    noContentYet: "No content yet",
    percentOfContent: "% of content",
    recentActivityLabel: "Recent activity",
    latestAttempts: "Latest attempts",
    noRecentAttempts: "No recent attempts",
    strongPerformance: "Strong performance",
    needsAttention: "Needs attention",
    reviewUrgently: "Review urgently",
    studentManagement: "Student management",
    manageEnrollments: "Manage student course enrollments.",
    searchNameUsernamePhone: "Search by name, username, or phone...",
    allCourses: "All courses",
    enrolledCourses: "Enrolled Courses",
    loadingStudents: "Loading students...",
    editStudent: "Edit Student",
    deleteStudentConfirm: "Are you sure you want to delete this student? This cannot be undone.",
    enterNewPassword: "Enter a new password",
    passwordMinChars: "Password must be at least 6 characters.",
    passwordHasBeenReset: "Password has been reset.",
    couldNotResetPassword: "Could not reset password.",
    loadingStudentProfile: "Loading student profile...",
    studentProfileLabel: "Student profile",
    noPhone: "No phone",
    editInfo: "Edit Info",
    bookProgressApiPending: "API integration pending",
    mistakeHistoryDb: "No mistakes recorded in database.",
    homeworkGrading: "Homework grading",
    failedToUpdateStudent: "Failed to update student.",
    courseSetup: "Course setup",
    createCoursesAndTrack: "Create courses, assign books, and track exam dates.",
    createNewCourse: "Create new course",
    courseNamePlaceholder: "Course Name",
    egAdvancedMath: "e.g. Advanced Math 101",
    examDate: "Exam Date",
    assignBooks: "Assign Books",
    assignSessions: "Assign Sessions",
    assignActivities: "Assign Activities",
    createCourseAndAssign: "Create Course & Assign Fields",
    saveChanges: "Save Changes",
    editDetailsAndAssignments: "Edit details & assignments",
    deleteCourseConfirm: "Are you sure you want to delete this course?",
    courseYearLabel: "Course year",
    examDateLabel: "Exam date",
    booksCount: "Books",
    sessionsCount: "Sessions",
    activitiesCount: "Activities",
    assignmentBuilder: "Assignment builder",
    createAndManageQuestions: "Create assignments and manage questions in each assignment.",
    assignmentTitle: "Title",
    assignmentType: "Assignment",
    skillType: "Skill",
    durationMinutes: "Duration (minutes)",
    skillsUnlimitedDuration: "Skills have unlimited duration",
    createAssignment: "Create Assignment",
    createSkill: "Create Skill",
    noAssignmentsFound: "No assignments found.",
    questionsInAssignment: "Questions in this assignment ({count})",
    addQuestions: "Add Questions",
    noQuestionsYetClickAdd: "No questions yet. Click \"Add Questions\" to get started.",
    questionWithoutText: "Question without text",
    difficultyYearChoices: "{difficulty} • Year {year} • {n} choices",
    skillsSection: "Skills",
    noSkillsFound: "No skills found.",
    searchAssignments: "Search assignments...",
    searchSkills: "Search skills...",
    noAssignmentsMatch: "No assignments match your search.",
    noSkillsMatch: "No skills match your search.",
    unlimitedQuestions: "Unlimited • {n} questions",
    questionsInSkill: "Questions in this skill ({count})",
    questionPicker: "Question Picker",
    hasImage: "Contains image",
    addQuestionsTo: "Add questions to: {title}",
    searchQuestionsText: "Search questions by text, difficulty, or year...",
    noQuestionsInBank: "No questions in the question bank. Create questions first.",
    allQuestionsAdded: "All questions have been added to this assignment.",
    questionAddedSuccess: "Question added successfully!",
    failedToAddQuestion: "Failed to add question",
    failedToRemoveQuestion: "Failed to remove question",
    failedToReorderQuestions: "Failed to reorder questions",
    deleteAssignmentConfirm: "Are you sure you want to delete this assignment? This cannot be undone.",
    assignmentDeletedSuccess: "Assignment deleted successfully!",
    skillDeletedSuccess: "Skill deleted successfully!",
    chapterLibrary: "Chapter library",
    bookOrChapterTitle: "Book or chapter title",
    addBook: "Add book",
    dragToReorder: "Drag to reorder",
    orderN: "Order {n}",
    unknownCourse: "Unknown course",
    pleaseEnterTitleFirst: "Please enter a book or chapter title first.",
    failedToCreateBook: "Failed to create the book.",
    searchBooks: "Search books...",
    noBooksMatch: "No books match your search.",
    searchCourses: "Search courses...",
    noCoursesMatch: "No courses match your search.",
    questionBank: "Question bank",
    addQuestionsToBooks: "Add questions to books. Questions can have text or image content.",
    allDifficulty: "All difficulty",
    selectBook: "Select Book",
    questionText: "Question Text",
    orUploadQuestionImage: "Or Upload Question Image",
    questionPreview: "Question preview",
    choicesSelectCorrect: "Choices (Select correct answer)",
    choiceLetter: "Choice {letter}",
    addChoice: "Add Choice",
    difficultyEasy: "Easy",
    difficultyMedium: "Medium",
    difficultyHard: "Hard",
    yearPlaceholder: "Year",
    monthPlaceholder: "Month",
    explanationOptional: "Explanation text (optional)",
    orUploadExplanationImage: "Or Upload Explanation Image",
    explanationPreview: "Explanation preview",
    updateQuestion: "Update question",
    saveQuestion: "Save question",
    deleteQuestion: "Delete Question",
    deleteQuestionConfirm: "Are you sure you want to delete this question? This action cannot be undone.",
    pleaseProvideQuestionText: "Please provide question text or upload a question image.",
    pleaseAddChoice: "Please add at least one choice.",
    pleaseSelectCorrectAnswer: "Please select the correct answer.",
    videosAndPdfs: "Videos and PDFs",
    attachYouTubeLinks: "Attach YouTube links and PDF files to assignments or skills.",
    addVideo: "Add video",
    youtubeSource: "YouTube",
    vdoCipherSource: "VdoCipher",
    youtubeUrl: "YouTube URL",
    vdoCipherVideoId: "VdoCipher Video ID",
    viewsPerUser: "views per user",
    saveVideo: "Save video",
    uploadPdfLabel: "Upload PDF",
    choosePdf: "Choose PDF",
    videosSection: "Videos",
    noVideosYet: "No videos yet.",
    pdfSection: "PDFs",
    noPdfsYet: "No PDFs yet.",
    manageViews: "Manage views",
    searchStudentsPlaceholder: "Search students...",
    noUsersFound: "No users found.",
    failedToLoadResources: "Failed to load resources.",
    viewsUpdatedText: "Views updated.",
    failedToUpdateViews: "Failed to update views.",
    deleteVideoConfirm: "Delete this video?",
    deletePdfConfirm: "Delete this PDF?",
    liveSessions: "Sessions",
    addSession: "Add Session",
    addNewSession: "Add New Session",
    sessionTitle: "Title",
    exactDateTime: "Exact date and time",
    noCourseOption: "No Course",
    meetingLinkOptional: "Meeting Link (Optional)",
    attachmentPdf: "Attachment (PDF)",
    saveSession: "Save Session",
    meetingLink: "Meeting Link",
    noPdfsAttached: "No PDFs attached.",
    addPdf: "Add PDF",
    createAndGradeHomework: "Create and grade homework",
    publishInstructions: "Publish instructions, review submissions, add scores, and write feedback.",
    instructionsPlaceholder: "Instructions",
    publishLabel: "Publish",
    submissionsSection: "Submissions",
    pendingSubmission: "Pending submission",
    feedbackPlaceholder: "Feedback",
    gradeButton: "Grade",
    noSubmissionsFound: "No submissions found.",
    parentManagement: "Parent management",
    viewAndManageParents: "View and manage parent accounts.",
    loadingParents: "Loading parents...",
    deleteParentConfirm: "Are you sure you want to delete this parent? This cannot be undone.",
    adminManagement: "Admin management",
    viewAndManageAdmins: "View and manage admin accounts.",
    loadingAdmins: "Loading admins...",
    deleteAdminConfirm: "Are you sure you want to delete this admin? This cannot be undone.",
    adminOnly: "Admin only",
    createsAccountsDirectly: "Creates new accounts directly in the database.",
    phoneLabel: "Phone",
    adminRole: "Admin",
    parentsPhone: "Parent's Phone",
    parentsPhoneNumber: "Parent's phone number",
    createdAccountFor: "Created account for {username}",
    createAccountButton: "Create account",
    enterFullNameValidation: "Enter the full name.",
    enterUsernameValidation: "Enter a username.",
    useAtLeastSixChars: "Use at least 6 characters.",
    failedToCreateAccount: "Failed to create account.",
    loadingFamilyDashboard: "Loading your family dashboard...",
    familyProgress: "Family progress",
    trackScoresWeakPoints: "Track each student's scores, weak points, and recent learning signals in one clear view.",
    activeStudent: "Active student",
    updatingDataForChild: "Updating data...",
    noDataAvailablePeriod: "No Data Available",
    couldNotRetrieveStats: "We couldn't retrieve statistics for this period.",
    dailyActivity: "Daily Activity",
    solvingActivityPerDay: "Solving activity per day",
    clickOnBar: "Click on a bar to see what your child solved that day",
    attemptsCount: "attempts",
    avgScoreColon: "Avg Score: {score}/800",
    clickToViewDetails: "Click to view details",
    noDailyActivityYet: "No daily activity recorded yet.",
    weakPointsSection: "Weak points",
    areasNeedReview: "Areas that need review",
    activityOnDate: "Activity on {date}",
    nAttemptsAvgScore: "{n} attempts, Avg: {score}/800",
    correctOfTotal: "{correct}/{total} correct",
    last30Days: "Last 28 days",
    avgScore: "avg score",
    questionXofY: "Question {current} of {total}",
    questionNumber: "Question {n}",
    noWeakPointsYet: "No weak points yet",
    keepSolvingAssignments: "Keep solving assignments and your repeated mistakes will appear here.",
    // Topics
    topics: "Topics",
    topicManagement: "Topic management",
    topicName: "Topic Name",
    addTopic: "Add Topic",
    editTopic: "Edit Topic",
    deleteTopic: "Delete Topic",
    deleteTopicConfirm: "Are you sure you want to delete this topic? This cannot be undone.",
    topicCreated: "Topic created successfully!",
    topicUpdated: "Topic updated successfully!",
    topicDeleted: "Topic deleted successfully!",
    noTopicsFound: "No topics found.",
    searchTopics: "Search topics...",
    noTopicsMatch: "No topics match your search.",
    selectTopic: "Select Topic",
    noTopic: "No Topic",
    addQuestionsFromTopic: "Add Questions from Topic",
    addFromTopicConfirm: "Add all questions from this topic?",
    questionsAddedFromTopic: "Questions added from topic successfully!",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    addSelected: "Add Selected ({count})",
    searchByText: "Search by text...",
    noDetailedRecords: "No detailed records for this day.",
    weakPointsNeedsReview: "Needs review",
    currentAccuracy: "Current Accuracy",
    mistakesCount: "Mistakes",
    reviewSuggestedQuestions: "Review suggested questions",
    recentMistakesSection: "Recent mistakes",
    noRecentMistakes: "No Recent Mistakes",
    everythingLooksPerfect: "Everything looks perfect!",
    noWeakPointsDetected: "No Weak Points Detected",
    greatJobAllGood: "Great job! Your child seems to be doing well across all categories.",
    childProgress: "Child progress",
    childNotFound: "Child not found.",
    booksOverview: "Books overview",
    skillsBreakdown: "Skills breakdown",
    recentMistakesLabel: "Recent mistakes",
    upcomingHomework: "Upcoming homework",
    dueDateLabel: "Due {date}",
    practiceAndResources: "Practice and resources",
    practiceAllQuestionsDesc: "Practice all questions, review your tries, and access chapter resources.",
    allBooks: "All books",
    allYears: "All years",
    allMonths: "All months",
    mainNavigation: "Main navigation",
    footerNavigation: "Footer navigation",
    bulkUpload: "Bulk Upload",
    bulkUploadHint: "Upload .json, .csv, .xlsx, .xls, or Gemini .py with questionText, choiceA/B/C/..., and answerLetter fields",
    skillsAppearHere: "Skills will appear here once your teacher creates them.",
    nameColumn: "Name",
    modelAnswersColumn: "Model answers",
    degreeColumn: "Degree",
    examColumn: "Exam",
    videosColumn: "Videos",
    pdfColumn: "PDF",
    noTriesYet: "No tries yet",
    startPracticing: "Start practicing to see your tries",
    viewModelAnswers: "View model answers",
    questionsCount: "questions",
    practiceAllQuestionsLink: "Practice All Questions",
    tryDetail: "Try Detail",
    scoreCorrectTotal: "Score: {correct}/{total} ({score}/800)",
    loadingTryDetails: "Loading try details...",
    weeklyExams: "Weekly Exams",
    practiceWeeklyExams: "Practice weekly exams and review your results below.",
    noWeeklyExamsAvailable: "No weekly exams available",
    weeklyExamsAppearHere: "Weekly exams will appear here when your teacher creates them.",
    examResults: "Exam Results",
    yourAttempts: "Your attempts",
    completedAttemptsReadOnly: "Completed attempts are read-only so you can review calmly.",
    noExamsCompletedYet: "No exams completed yet.",
    readOnlyReview: "Read-only review",
    questionCorrect: "Correct",
    questionIncorrect: "Incorrect",
    selectAnAttempt: "Select an attempt",
    chooseExamFromList: "Choose an exam from the list to see details.",
    bookDetailLabel: "Book detail",
    resourcesSkillsAndPractice: "Resources, skills, and practice actions for this chapter.",
    nQuestionsDegree: "{n} questions, {degree} degrees",
    durationLabel: "{duration}",
    nPagesSizeMB: "{n} pages, {size} MB",
    examSkillWeighting: "Exam skill weighting: {pct}%",
    noQuestionsHereYet: "No questions here yet",
    practiceModeAppearsWhenPublished: "This practice mode will appear when questions are published.",
    submittingAnswers: "Submitting your answers...",
    thinkSolveSucceed: "THINK • SOLVE • SUCCEED",
    practiceComplete: "Practice complete",
    youScored: "You scored {score} / {total}",
    retakeButton: "Retake",
    previousButton: "Previous",
    filterByBook: "Filter by book",
    clearFilter: "Clear filter",
    submitButton: "Submit",
    showExplanation: "Show explanation",
    finishButton: "Finish",
    nextButton: "Next",
    finishMissingAnswersDesc: "You still have {count} unanswered question(s) out of {total}. Please answer them before finishing.",
    correctAnswerHeading: "Correct answer",
    tryThisIdeaAgain: "Try this idea again",
    explanationVideoTitle: "Explanation Video",
    browserNotSupportVideo: "Your browser does not support the video tag.",
    closeVideos: "Close videos",
    selectAVideo: "Select a video",
    autoPlayNext: "Auto-play next",
    loadingVideo: "Loading video...",
    viewsRemaining: "You have {n} view(s) remaining.",
    watchingConsumesView: "Watching will consume one view.",
    watchNow: "Watch now",
    confirmCancel: "Cancel",
    noViewsRemaining: "No views remaining.",
    contactInstructorForViews: "Contact your instructor to get more views.",
    failedToLoadVideo: "Failed to load video.",
    noVideosForBook: "No videos have been uploaded for this book.",
    thinkingLabel: "THINKING...",
    logoAlt: "Logo",
    noCourseSelected: "No course selected.",
    skillNotFound: "Skill not found",
    backToSkills: "Back to skills",
    assignmentNotFound: "Assignment not found",
    backToAssignments: "Back to assignments",
    weeklyExamNotFound: "Weekly exam not found",
    backToCheckpoint: "Back to checkpoint",
    loadingDots: "Loading...",
    savingDots: "Saving...",
    creatingDots: "Creating...",
    uploadingDots: "Uploading...",
    submittingDots: "Submitting...",
    deletingDots: "Deleting...",
    actionSave: "Save",
    actionCancel: "Cancel",
    actionEdit: "Edit",
    actionDelete: "Delete",
    actionCreate: "Create",
    actionGrade: "Grade",
    actionResetPassword: "Reset password",
    areYouSureDelete: "Are you sure you want to delete? This cannot be undone.",
    cannotBeUndone: "This action cannot be undone.",
    notAvailable: "N/A",
    successCreated: "Created successfully!",
    successDeleted: "Deleted successfully!",
    successSaved: "Saved successfully!",
    failedAction: "Action failed.",
    noResultsFound: "No results found.",
    searchDots: "Search...",
    // Validation & form messages
    usernameRequired: "Username is required.",
    passwordMinLength: "Password must be at least 6 characters.",
    unableToLogin: "Unable to login.",
    wrongUsernameOrPassword: "Wrong username or password",
    usernameExists: "An account with this username exists",
    fullNameRequired: "Enter your full name.",
    usernameMinLength: "Username must be at least 3 characters.",
    usernameInvalidChars: "Username can only contain letters, numbers, and underscores",
    validPhoneNumber: "Enter a valid phone number.",
    validParentPhone: "Enter a valid parent phone number.",
    phoneInvalid: "Invalid phone number. Use a valid Egyptian number (e.g. 01234567890) or +[countryCode][number] for international.",
    parentPhoneInvalid: "Enter a valid phone number: Egyptian (e.g. 01234567890) or international with + prefix.",
    confirmPasswordRequired: "Confirm your password.",
    passwordsDontMatch: "Passwords don't match",
    phoneMustDifferFromParent: "Student phone must be different from parent phone",
    registrationFailed: "Registration failed.",
    checkHighlightedFields: "Please check the highlighted fields.",
    enterFullName: "Enter the full name.",
    enterUsername: "Enter a username.",
    useMinChars: "Use at least 6 characters.",
    studentLabel: "Student",
    parentLabel: "Parent",
    togglePassword: "Toggle password visibility",
    levelUpMath: "Level up your math",
    startJourney: "Start your journey to ",
    successWord: "success.",
    createAccountDescription: "Create an account to access customized assignments, track your progress, and get instant feedback.",
    assignmentsCount: "Assignments",
    excellence: "Excellence",
    // Student dashboard
    welcomeBackName: "Welcome back, {name}",
    yourAverageScore: "Your average score",
    skillsNeedReview: "Skills that need review",
    storedForReview: "Stored for review",
    acrossAllCategories: "Across all categories",
    yourRankLabel: "Your Rank",
    outOfStudents: "Out of {count} students",
    noRankingYet: "No ranking yet",
    liveSession: "Live session",
    nextSession: "Next session",
    targetSeventyPercent: "The orange line is your 70% target.",
    scoreTooltip: "Score",
    attemptTooltip: "Attempt",
    startQuizToSeeTrend: "Start a quiz to see your score trend",
    accuracy: "Accuracy",
    correctVsMissed: "Correct vs missed",
    quickLookAtAttempts: "A quick look at what happened in your latest attempts.",
    noAttemptsYet: "No attempts yet",
    // Child dashboard
    overallPerformance: "Overall academic performance",
    completionRate: "Completion Rate",
    engagementLevel: "Engagement level",
    studentRankLabel: "Student Rank",
    unranked: "Unranked",
    outOfRankedStudents: "Out of {count} ranked students",
    noScoredAttemptsYet: "No scored attempts yet",
    performanceLevelLow: "Your child's level is low, they need to study more.",
    performanceLevelMedium: "Your child's level is acceptable, they can do better.",
    performanceLevelHigh: "Your child's level is good, keep it up!",
    performanceTrends: "Performance trends over the last attempts",
    liveMetrics: "Live metrics",
    // App shell
    roleNavigation: "{role} navigation",
    toggleLanguageLabel: "Toggle language",
    languageAr: "AR",
    languageEn: "EN",
    courseEndedOn: "{course} ended on {date}",
    // Splash
    interactiveLearning: "Interactive Learning",
    // Account expiry
    accountExpiresIn: "Your account expires in {days} days: {date}",
    contactTeacher: "Call Dr. Ziad Mohamed (+20 123 456 7890)",
    accountExpired: "Account expired",
    studentAccountExpired: "This student account expired{date}. Please contact Dr. Ziad Mohamed to renew access.",
    noAccessYet: "You don't have access yet. Please wait for admin approval.",
    // Home page
    liveAnalytics: "Live analytics",
    smartPractice: "Smart practice",
    parentVisibility: "Parent visibility",
    avgMastery: "Avg mastery",
    fasterReview: "Faster review",
    progressView: "Progress view",
    learningOs: "Learning OS",
    studentCockpit: "Student cockpit",
    liveBadge: "Live",
    masteryCurve: "Mastery curve",
    dayStreak: "day streak",
    feedbackLabel: "Feedback",
    reviewLinearEquations: "Review linear equations before the next checkpoint.",
    tonight830: "Tonight, 8:30 PM",
    premiumTools: "Premium learning tools, designed for steady academic progress.",
    weakPointsBadge: "Weak points",
    scoreTrendBadge: "Score trend",
    mistakesBadge: "Mistakes",
    personalizedSkillRoute: "Personalized skill route",
    assignmentsInstantClarity: "Assignments with instant clarity",
    parentReadySnapshots: "Parent-ready progress snapshots",
    // About page
    diagnose: "Diagnose",
    diagnoseDesc: "Start from real student performance, not guesses.",
    reviewStep: "Review",
    reviewStepDesc: "Make mistakes visible, explainable, and fixable.",
    aboutThePlatform: "About the platform",
    avgClarityGain: "avg clarity gain",
    fasterReviewLoop: "faster review loop",
    learningJourney: "Learning journey",
    openDashboard: "Open dashboard",
    startLearning: "Start learning",
    // Privacy page
    privacyHub: "Privacy Hub",
    studentFirst: "Student-first",
    noDataSelling: "No data selling",
    secureByDesign: "Secure by design",
    privacySectionLabel: "Privacy",
    privacySectionDesc: "A clearer way to understand what happens with your learning data.",
    accessAware: "Access aware",
    minimalCollection: "Minimal collection",
    humanContactPath: "Human contact path",
    sectionsLabel: "Sections",
    // Privacy summaries
    privacyCollectSummary: "Only what is needed to run learning accounts and progress views.",
    privacyUseSummary: "Used to personalize practice, reporting, and platform quality.",
    privacyProtectSummary: "Protected through access control and careful data handling.",
    privacyShareSummary: "No third-party selling of student or family information.",
    privacyCookiesSummary: "Small browser helpers for a smoother signed-in experience.",
    privacyChangesSummary: "Important policy changes should be easy to notice.",
    // Terms page
    interactiveTermsCenter: "Interactive Terms Center",
    readableRules: "Readable rules",
    readableRulesDesc: "Clear expectations without turning the page into a wall of text.",
    fairAccess: "Fair access",
    fairAccessDesc: "Simple guidance for accounts, conduct, content, and updates.",
    termsMap: "Terms map",
    quickLegalSummary: "Quick legal summary",
    quickLegalDesc: "Use the platform for learning, protect your account, respect the content, and check updates when terms change.",
    tagStartHere: "Start here",
    tagAccounts: "Accounts",
    tagCommunity: "Community",
    tagMaterials: "Materials",
    tagBilling: "Billing",
    tagAccess: "Access",
    tagLimits: "Limits",
    tagUpdates: "Updates",
    // Public chrome
    brandDr: "Dr.",
    languageEnglish: "English",
    copyrightFooter: "© 2026 Craftpress. All rights reserved.",
    // Teacher dashboard
    clearCountLabels: "Clear count labels make low-volume days easier to scan.",
    catalogAvailable: "Shows how much of the catalog is still available to students.",
    activeLower: "active",
    horizontalBarsReadable: "Horizontal bars keep course names readable.",
    coursesLandingWell: "Shows which courses are landing well and which need attention.",
    dashboardAnalyticsError: "Dashboard analytics could not be loaded.",
    // Teacher resources
    videoAddedSuccess: "Video added successfully.",
    failedToAddVideo: "Failed to add video.",
    pdfUploadedSuccess: "PDF uploaded successfully.",
    failedToUploadPdf: "Failed to upload PDF.",
    videoDeleted: "Video deleted.",
    failedToDeleteVideo: "Failed to delete video.",
    pdfDeleted: "PDF deleted.",
    failedToDeletePdf: "Failed to delete PDF.",
    failedToLoadUserViews: "Failed to load user views.",
    targetSection: "Target",
    noGroupSelected: "No group selected",
    labelManageViews: "Manage views",
    ariaDeleteVideo: "Delete video",
    ariaDeletePdf: "Delete PDF",
    // Teacher sessions
    courseOptional: "Course (Optional)",
    failedToUploadPdfMessage: "Failed to upload PDF: {message}",
    failedToDeletePdfMessage: "Failed to delete PDF: {message}",
    // Teacher questions
    enterQuestionText: "Enter question text (or leave empty if using image below)",
    actions: "Actions",
    explanationLabel: "Explanation",
    // Teacher assignments
    failedToDeleteMessage: "Failed to delete",
    createNew: "Create new",
    questionsAvailable: "{count} questions available to add",
    courseUpdated: "Course updated successfully",
    failedToUpdateCourse: "Failed to update course",
    changeCourse: "Change course",
    // Shared alt/aria
    altExplanationFigure: "Explanation figure",
    altQuestionImage: "Question",
    altLogo: "Logo",
    ariaClosePdf: "Close PDF",
    correctLabel: "Correct",
    missedLabel: "Missed",
    allFilter: "All",
    correctFilter: "Correct",
    incorrectFilter: "Incorrect",
    noQuestionsMatchFilter: "No questions match this filter",
    clickToFilter: "Click to filter",
    showingAll: "Showing all",
    showingCorrect: "Correct only",
    showingIncorrect: "Incorrect only",
    fullscreenWarning: "This practice will be in fullscreen mode. Exiting fullscreen will automatically submit your answers.",
    startPracticeFullscreen: "Start Practice in Fullscreen",
    fullscreenExitedTitle: "Fullscreen Exited",
    fullscreenExitedDesc: "You exited fullscreen. Your answers will be submitted automatically.",
    secondsUntilSubmit: "seconds until submit",
    returnToFullscreen: "Return to Fullscreen",
    tabSwitchWarningTitle: "Practice Tab Switched",
    tabSwitchWarningDesc: "You switched away from the practice. If you do it again, your answers will be submitted automatically.",
    tabSwitchContinue: "Continue Practicing",
  },
  ar: {
    appName: "منصة د. زياد",
    home: "الرئيسية",
    about: "عن المنصة",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    dashboard: "الرئيسية",
    studentParentDashboard: "لوحة تحكم ولي الأمر",
    books: "الكتب",
    assignments: "الواجبات",
    skills: "المهارات",
    weakPoints: "نقاط الضعف",
    mistakeHistory: "سجل الأخطاء",
    checkpoint: "اختبار أسبوعي",
    asks: "اسأل",
    sessions: "الحصص",
    sessionsTitle: "حصصك",
    sessionsSubtitle: "شاهد الحصات المسجلة وانضم للحصص المباشرة",
    noSessions: "لا توجد حصص متاحة",
    noSessionsDesc: "ستظهر الحصص هنا عندما يضيفها المعلم",
    materials: "المواد",
    joinSession: "انضم للحصة",
    students: "الطلاب",
    parents: "أولياء الأمور",
    admins: "المسؤولين",
    courses: "الكورسات",
    questions: "الأسئلة",
    resources: "الموارد",
    registerUser: "إنشاء حساب",
    practiceQuestions: "تدريب أسئلة",
    practiceAll: "تدريب الكل",
    retake: "إعادة",
    videos: "فيديوهات",
    pdf: "ملف PDF",
    pending: "قيد الانتظار",
    answered: "تم الرد",
    submitted: "تم التسليم",
    graded: "تم التصحيح",
    active: "نشط",
    inactive: "غير نشط",
    published: "منشور",
    draft: "مسودة",
    score: "الدرجة",
    lastActive: "آخر نشاط",
    accountExpiry: "انتهاء الحساب",
    language: "اللغة",
    learningPortal: "بوابة التعلم",
    loginWelcome: "مرحباً بعودتك! يرجى إدخال بياناتك للوصول إلى لوحة التحكم الخاصة بك.",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    rememberMe: "تذكرني",
    forgotPassword: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    createAccountLink: "إنشاء حساب",
    heroTitle: "مساحة عمل مركزة للرياضيات من أجل",
    heroSubtitle: "أتقن الرياضيات مع ملاحظات فورية ومهام مخصصة وتوجيه مهني من المعلم.",
    heroHighlight: "التميز.",
    heroTagline: "فكر • حل • انجح",
    featureRole: "توجيه الأدوار",
    featureWeak: "نقاط الضعف",
    featureBilingual: "ثنائي اللغة",
    newStudent: "طالب جديد",
    createAccount: "إنشاء حساب",
    registerSubtitle: "انضم إلى مجتمع تعلم الرياضيات الخاص بنا اليوم وابدأ في إتقان المهارات.",
    fullName: "الاسم الكامل",
    accountType: "نوع الحساب",
    student: "طالب",
    parent: "ولي أمر",
    studentPhone: "هاتف الطالب",
    parentPhone: "هاتف ولي الأمر",
    phoneOnly: "الهاتف",
    registerAction: "تسجيل الحساب",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    loginLink: "سجل دخولك هنا",
    signingIn: "جاري تسجيل الدخول...",
    confirmPassword: "تأكيد كلمة المرور",
    creatingAccount: "جاري إنشاء الحساب...",
    checkFields: "يرجى مراجعة الحقول المميزة.",
    resetPassword: "إعادة تعيين كلمة المرور",
    resetSubtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة مرورك.",
    resetSent: "إذا كان هذا الحساب موجوداً، فقد تم إرسال تعليمات إعادة التعيين إلى بريدك الإلكتروني.",
    sending: "جاري الإرسال...",
    sendResetLink: "إرسال رابط الإعادة",
    backToLogin: "العودة لتسجيل الدخول",
    studentDashboard: "لوحة تحكم الطالب",
    keepStreak: "حافظ على التحفيز بحل تدريب واحد اليوم.",
    expiryCountdown: "العد التنازلي لانتهاء الحساب",
    noCoursesContactAdmin: "لا توجد دورس - تواصل مع المسؤول",
    accountNotActivated: "الحساب غير مفعل، تواصل مع د. زياد",
    totalScore: "إجمالي الدرجات",
    mistakes: "الأخطاء",
    completedAssignments: "الواجبات المكتملة",
    scoreTrend: "منحنى الدرجات",
    weeklyProgress: "التقدم الأسبوعي",
    recentActivity: "النشاط الأخير",
    whatChanged: "ما الذي تغير",
    noActivityFound: "لا يوجد نشاط حديث.",
    quickAccess: "وصول سريع",
    jumpBackIn: "عد للمذاكرة",
    booksProgress: "تقدم الكتب",
    learnFromMiss: "تعلم من كل خطأ",
    reviewExplanation: "راجع إجابتك، والإجابة الصحيحة، وشرح مستر زياد.",
    fixRepeatedMistakes: "عالج الأخطاء المتكررة",
    weakPointsSubtitle: "تظهر الأسئلة هنا بعد محاولتين خاطئتين أو أكثر في نفس المهارة.",
    practiceWeakPoints: "تدرب على نقاط الضعف",
    yourAnswer: "إجابتك",
    correctAnswer: "الإجابة الصحيحة",
    weeklyCheckPoint: "نقطة التحقق الأسبوعية",
    weeklyExam: "اختبار أسبوعي",
    performance: "الأداء",
    trackProgress: "تتبع تقدمك",
    reviewPerformance: "راجع سجل محاولاتك واتجاهات أدائك.",
    attemptHistory: "سجل المحاولات",
    noAttemptsFound: "لم تقم بأي محاولات بعد.",
    mistakeDetailSoon: "تحليل الأخطاء المفصل قريباً.",
    xMistakes: "أخطاء",
    homeHeroTitle: "أتقن الرياضيات بثقة",
    homeHeroSubtitle: "منصة التعلم الشخصية الخاصة بك مع ملاحظات فورية وتمارين تفاعلية وتوجيهات خبير من مستر زياد.",
    homeGetStarted: "ابدأ الآن",
    homeLearnMore: "اعرف المزيد",
    homeFeatures: "لماذا تختارنا",
    homeFeature1Title: "تعلم شخصي",
    homeFeature1Desc: "تمارين تكيفية تتناسب مع مستواك ووتيرة تعلمك.",
    homeFeature2Title: "ملاحظات فورية",
    homeFeature2Desc: "شروحات فورية لكل إجابة لتسريع فهمك.",
    homeFeature3Title: "تتبع التقدم",
    homeFeature3Desc: "راقب تحسنك مع تحليلات مفصلة واختبارات أسبوعية.",
    homeFeature4Title: "دعم ثنائي اللغة",
    homeFeature4Desc: "تعلم باللغة الإنجليزية والعربية لفهم أفضل.",
    homeCtaTitle: "هل أنت مستعد لبدء رحلتك؟",
    homeCtaSubtitle: "انضم إلى آلاف الطلاب الذين يحسنون مهاراتهم الرياضية كل يوم.",
    homeLogin: "تسجيل الدخول",
    homeRegister: "إنشاء حساب",
    myCourses: "دوراتي",
    noCoursesFound: "لم يتم العثور على دورات",
    viewCourse: "عرض الدورة",
    courseEnded: "انتهت الدورة",
    courseMaterialsUnavailable: "انتهت هذه الدورة في {date}. المواد التعليمية لم تعد متاحة.",
    deadline: "الموعد النهائي",
    aboutTitle: "عن منصة مستر زياد",
    aboutMissionTitle: "رسالتنا",
    aboutMissionDesc: "نؤمن أن كل طالب يمكنه التفوق في الرياضيات. منصتنا توفر الأدوات والإرشاد والدعم اللازم لبناء الثقة والنجاح الأكاديمي.",
    aboutVisionTitle: "رؤيتنا",
    aboutVisionDesc: "أن نكون المنصة التعليمية الرائدة للرياضيات في الشرق الأوسط، مما يجعل تعليم الرياضيات النوعي متاحاً لكل طالب.",
    aboutFeaturesTitle: "ماذا نقدم",
    aboutFeature1: "منهج شامل للرياضيات يتوافق مع المعايير المدرسية",
    aboutFeature2: "مواد تعليمية تفاعلية وتمارين تدريبية",
    aboutFeature3: "تتبع التقدم وتحليل الأداء",
    aboutFeature4: "دعم المعلم والإرشاد المتخصص",
    aboutContactTitle: "اتصل بنا",
    aboutContactDesc: "لديك أسئلة؟ نحب أن نسمع منك.",
    privacyTitle: "سياسة الخصوصية",
    privacyIntro: "خصوصيتك مهمة لنا. تشرح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك.",
    privacyCollectTitle: "المعلومات التي نجمعها",
    privacyCollectDesc: "نجمع المعلومات التي تقدمها أثناء التسجيل، نشاطك التعليمي، ومعلومات الجهاز للتحليلات.",
    privacyUseTitle: "كيف نستخدم معلوماتك",
    privacyUseDesc: "نستخدم معلوماتك لتوفير تجارب تعلم مخصصة، وتتبع تقدمك، وتحسين خدماتنا.",
    privacyProtectTitle: "كيف نحمي معلوماتك",
    privacyProtectDesc: "نطبق معايير أمان صناعية لحماية بياناتك من الوصول غير المصرح به.",
    privacyShareTitle: "مشاركة المعلومات",
    privacyShareDesc: "لا نشارك معلوماتك الشخصية مع أطراف ثالثة. بياناتك تستخدم فقط لأغراض تعليمية.",
    privacyCookiesTitle: "ملفات تعريف الارتباط",
    privacyCookiesDesc: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. يمكنك تعطيلها في إعدادات المتصفح.",
    privacyChangesTitle: "التغييرات على هذه السياسة",
    privacyChangesDesc: "قد نقوم بتحديث هذه السياسة بشكل دوري. سنعلمك بأي تغييرات جوهرية.",
    privacyContactTitle: "اتصل بنا",
    privacyContactDesc: "إذا كانت لديك أسئلة حول هذه السياسة، يرجى الاتصال بنا.",
    termsTitle: "شروط الخدمة",
    termsIntro: "مرحباً بك في مستر زياد. باستخدام منصتنا، أنت توافق على هذه الشروط.",
    termsAcceptTitle: "قبول الشروط",
    termsAcceptDesc: "بالوصول واستخدام منصتنا، أنت تقبل وتوافق على الالتزام بشروط هذه الاتفاقية.",
    termsUseTitle: "حسابات المستخدمين",
    termsUseDesc: "أنت مسؤول عن الحفاظ على سرية حسابك وكلمة مرورك. أنت توافق على تحمل المسؤولية عن جميع الأنشطة تحت حسابك.",
    termsConductTitle: "سلوك المستخدم",
    termsConductDesc: "توافق على استخدام المنصة لأغراض مشروعة فقط وبطريقة لا تنتهك حقوق الآخرين.",
    termsContentTitle: "المحتوى والمواد",
    termsContentDesc: "جميع المحتوى على هذه المنصة هو ملك لمستر زياد. لا يجوز لك إعادة إنتاج أو توزيع أو تعديل أي مواد بدون إذن.",
    termsPaymentTitle: "الاشتراك والدفع",
    termsPaymentDesc: "بعض الميزات تتطلب اشتراكاً. المدفوعات تتم بشكل آمن. سياسات الاسترداد متاحة عند الطلب.",
    termsTerminationTitle: "الإنهاء",
    termsTerminationDesc: "نحتفظ بالحق في إنهاء حسابك إذا انتهكت هذه الشروط أو تصرفت بشكل غير لائق.",
    termsLiabilityTitle: "تحديد المسؤولية",
    termsLiabilityDesc: "المنصة مقدمة كما هي. نحن لسنا مسؤولين عن أي أضرار ناتجة عن استخدامك للمنصة.",
    termsChangesTitle: "التغييرات على الشروط",
    termsChangesDesc: "قد نقوم بتعديل هذه الشروط في أي وقت. الاستخدام المستمر للمنصة يشكل قبولاً للشروط الجديدة.",
    termsContactTitle: "الاتصال",
    termsContactDesc: "لأسئلة حول هذه الشروط، يرجى الاتصال بنا.",
    footerRights: "جميع الحقوق محفوظة.",
    footerPrivacy: "سياسة الخصوصية",
    footerTerms: "شروط الخدمة",
    parentDashboard: "لوحة تحكم ولي الأمر",
    childrenProgress: "تقدم الأبناء",
    assignmentsAndSkills: "الواجبات والمهارات",
    teacherDashboard: "لوحة تحكم المعلم",
    operationsSnapshot: "نظرة عامة",
    trackCourseCoverage: "تابع تغطية الدروس ونشاط الطلاب والأداء الحديث من لوحة تحكم واحدة.",
    todayStat: "اليوم",
    studentAttempts: "محاولات الطلاب",
    learningHealth: "صحة التعلم",
    registeredLearners: "المتعلمين المسجلين",
    activeCoursesCount: "الدورات النشطة",
    endedCourses: "منتهية",
    averageScore: "متوسط الدرجات",
    totalAttempts: "محاولات",
    liveContent: "المحتوى المباشر",
    totalBooksCount: "كتب",
    activityChart: "النشاط",
    dailyAttempts: "المحاولات اليومية",
    coursesChart: "الدورات",
    activeCourseCoverage: "تغطية الدورة النشطة",
    enrollmentChart: "التسجيل",
    studentsByCourse: "الطلاب حسب الدورة",
    coursePerformanceChart: "أداء الدورة",
    averageScoreByCourse: "متوسط الدرجات حسب الدورة",
    performanceTrendChart: "الأداء",
    averageScoreTrend: "اتجاه متوسط الدرجات",
    guideLineTargetPercent: "الخط الإرشادي يحدد هدف 70%.",
    contentChart: "المحتوى",
    teachingMix: "مزيج التدريس",
    materialBalance: "توازن المواد عبر مساحة العمل الإدارية.",
    noContentYet: "لا يوجد محتوى بعد",
    percentOfContent: "% من المحتوى",
    recentActivityLabel: "النشاط الأخير",
    latestAttempts: "آخر المحاولات",
    noRecentAttempts: "لا توجد محاولات حديثة",
    strongPerformance: "أداء قوي",
    needsAttention: "بحاجة للانتباه",
    reviewUrgently: "مراجعة عاجلة",
    studentManagement: "إدارة الطلاب",
    manageEnrollments: "إدارة تسجيل الطلاب في الدورات.",
    searchNameUsernamePhone: "ابحث بالاسم أو اسم المستخدم أو الهاتف...",
    allCourses: "جميع الدورات",
    enrolledCourses: "الدورات المسجلة",
    loadingStudents: "جاري تحميل الطلاب...",
    editStudent: "تعديل الطالب",
    deleteStudentConfirm: "هل أنت متأكد من حذف هذا الطالب؟ لا يمكن التراجع.",
    enterNewPassword: "أدخل كلمة مرور جديدة",
    passwordMinChars: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
    passwordHasBeenReset: "تم إعادة تعيين كلمة المرور.",
    couldNotResetPassword: "تعذر إعادة تعيين كلمة المرور.",
    loadingStudentProfile: "جاري تحميل ملف الطالب...",
    studentProfileLabel: "ملف الطالب",
    noPhone: "لا يوجد هاتف",
    editInfo: "تعديل المعلومات",
    bookProgressApiPending: "تكامل API معلق",
    mistakeHistoryDb: "لا توجد أخطاء مسجلة في قاعدة البيانات.",
    homeworkGrading: "تصحيح الواجبات",
    failedToUpdateStudent: "فشل تحديث بيانات الطالب.",
    courseSetup: "إعداد الدورة",
    createCoursesAndTrack: "إنشاء الدورات، تعيين الكتب، وتتبع مواعيد الامتحانات.",
    createNewCourse: "إنشاء دورة جديدة",
    courseNamePlaceholder: "اسم الدورة",
    egAdvancedMath: "مثال: رياضيات متقدمة 101",
    examDate: "تاريخ الامتحان",
    assignBooks: "تعيين الكتب",
    assignSessions: "تعيين الحصص",
    assignActivities: "تعيين الأنشطة",
    createCourseAndAssign: "إنشاء الدورة وتعيين الحقول",
    saveChanges: "حفظ التغييرات",
    editDetailsAndAssignments: "تعديل التفاصيل والتعيينات",
    deleteCourseConfirm: "هل أنت متأكد من حذف هذه الدورة؟",
    courseYearLabel: "سنة الدورة",
    examDateLabel: "تاريخ الامتحان",
    booksCount: "الكتب",
    sessionsCount: "الحصص",
    activitiesCount: "الأنشطة",
    assignmentBuilder: "منشئ الواجبات",
    createAndManageQuestions: "إنشاء الواجبات وإدارة الأسئلة في كل واجب.",
    assignmentTitle: "العنوان",
    assignmentType: "واجب",
    skillType: "مهارة",
    durationMinutes: "المدة (دقائق)",
    skillsUnlimitedDuration: "المهارات لها مدة غير محدودة",
    createAssignment: "إنشاء واجب",
    createSkill: "إنشاء مهارة",
    noAssignmentsFound: "لم يتم العثور على واجبات.",
    questionsInAssignment: "الأسئلة في هذا الواجب ({count})",
    addQuestions: "إضافة أسئلة",
    noQuestionsYetClickAdd: "لا توجد أسئلة بعد. انقر 'إضافة أسئلة' للبدء.",
    questionWithoutText: "سؤال بدون نص",
    difficultyYearChoices: "{difficulty} • سنة {year} • {n} خيارات",
    skillsSection: "المهارات",
    noSkillsFound: "لم يتم العثور على مهارات.",
    searchAssignments: "ابحث عن الواجبات...",
    searchSkills: "ابحث عن المهارات...",
    noAssignmentsMatch: "لا توجد واجبات تطابق بحثك.",
    noSkillsMatch: "لا توجد مهارات تطابق بحثك.",
    unlimitedQuestions: "غير محدود • {n} سؤال",
    questionsInSkill: "الأسئلة في هذه المهارة ({count})",
    questionPicker: "اختيار الأسئلة",
    hasImage: "يحتوي على صورة",
    addQuestionsTo: "إضافة أسئلة إلى: {title}",
    searchQuestionsText: "ابحث في الأسئلة حسب النص أو الصعوبة أو السنة...",
    noQuestionsInBank: "لا توجد أسئلة في بنك الأسئلة. أنشئ أسئلة أولاً.",
    allQuestionsAdded: "تمت إضافة جميع الأسئلة إلى هذا الواجب.",
    questionAddedSuccess: "تمت إضافة السؤال بنجاح!",
    failedToAddQuestion: "فشل إضافة السؤال",
    failedToRemoveQuestion: "فشل إزالة السؤال",
    failedToReorderQuestions: "فشل إعادة ترتيب الأسئلة",
    deleteAssignmentConfirm: "هل أنت متأكد من حذف هذا الواجب؟ لا يمكن التراجع.",
    assignmentDeletedSuccess: "تم حذف الواجب بنجاح!",
    skillDeletedSuccess: "تم حذف المهارة بنجاح!",
    chapterLibrary: "مكتبة الفصول",
    bookOrChapterTitle: "عنوان الكتاب أو الفصل",
    addBook: "إضافة كتاب",
    dragToReorder: "اسحب لإعادة الترتيب",
    orderN: "ترتيب {n}",
    unknownCourse: "دورة غير معروفة",
    pleaseEnterTitleFirst: "الرجاء إدخال عنوان الكتاب أو الفصل أولاً.",
    failedToCreateBook: "فشل إنشاء الكتاب.",
    searchBooks: "ابحث عن الكتب...",
    noBooksMatch: "لا توجد كتب تطابق بحثك.",
    searchCourses: "ابحث عن الدورات...",
    noCoursesMatch: "لا توجد دورات تطابق بحثك.",
    questionBank: "بنك الأسئلة",
    addQuestionsToBooks: "إضافة أسئلة إلى الكتب. يمكن أن تحتوي الأسئلة على نص أو صورة.",
    allDifficulty: "كل المستويات",
    selectBook: "اختر كتاب",
    questionText: "نص السؤال",
    orUploadQuestionImage: "أو تحميل صورة السؤال",
    questionPreview: "معاينة السؤال",
    choicesSelectCorrect: "الخيارات (اختر الإجابة الصحيحة)",
    choiceLetter: "اختيار {letter}",
    addChoice: "إضافة خيار",
    difficultyEasy: "سهل",
    difficultyMedium: "متوسط",
    difficultyHard: "صعب",
    yearPlaceholder: "السنة",
    monthPlaceholder: "الشهر",
    explanationOptional: "نص الشرح (اختياري)",
    orUploadExplanationImage: "أو تحميل صورة الشرح",
    explanationPreview: "معاينة الشرح",
    updateQuestion: "تحديث السؤال",
    saveQuestion: "حفظ السؤال",
    deleteQuestion: "حذف السؤال",
    deleteQuestionConfirm: "هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع.",
    pleaseProvideQuestionText: "يرجى تقديم نص السؤال أو تحميل صورة.",
    pleaseAddChoice: "يرجى إضافة خيار واحد على الأقل.",
    pleaseSelectCorrectAnswer: "يرجى تحديد الإجابة الصحيحة.",
    videosAndPdfs: "فيديوهات وملفات PDF",
    attachYouTubeLinks: "إرفاق روابط يوتيوب وملفات PDF للواجبات أو المهارات.",
    addVideo: "إضافة فيديو",
    youtubeSource: "يوتيوب",
    vdoCipherSource: "VdoCipher",
    youtubeUrl: "رابط يوتيوب",
    vdoCipherVideoId: "معرف فيديو VdoCipher",
    viewsPerUser: "مشاهدة لكل مستخدم",
    saveVideo: "حفظ الفيديو",
    uploadPdfLabel: "رفع PDF",
    choosePdf: "اختر PDF",
    videosSection: "الفيديوهات",
    noVideosYet: "لا توجد فيديوهات بعد.",
    pdfSection: "ملفات PDF",
    noPdfsYet: "لا توجد ملفات PDF بعد.",
    manageViews: "إدارة المشاهدات",
    searchStudentsPlaceholder: "ابحث عن الطلاب...",
    noUsersFound: "لم يتم العثور على مستخدمين.",
    failedToLoadResources: "فشل تحميل الموارد.",
    viewsUpdatedText: "تم تحديث المشاهدات.",
    failedToUpdateViews: "فشل تحديث المشاهدات.",
    deleteVideoConfirm: "حذف هذا الفيديو؟",
    deletePdfConfirm: "حذف ملف PDF هذا؟",
    liveSessions: "الحصص",
    addSession: "إضافة حصة",
    addNewSession: "إضافة حصة جديدة",
    sessionTitle: "العنوان",
    exactDateTime: "التاريخ والوقت بالضبط",
    noCourseOption: "بدون دورة",
    meetingLinkOptional: "رابط الاجتماع (اختياري)",
    attachmentPdf: "مرفق (PDF)",
    saveSession: "حفظ الحصة",
    meetingLink: "رابط الاجتماع",
    noPdfsAttached: "لا توجد ملفات PDF مرفقة.",
    addPdf: "إضافة PDF",
    createAndGradeHomework: "إنشاء وتصحيح الواجبات",
    publishInstructions: "انشر التعليمات، راجع التسليمات، أضف الدرجات، واكتب ملاحظات.",
    instructionsPlaceholder: "التعليمات",
    publishLabel: "نشر",
    submissionsSection: "التسليمات",
    pendingSubmission: "تسليم معلق",
    feedbackPlaceholder: "ملاحظات",
    gradeButton: "تصحيح",
    noSubmissionsFound: "لم يتم العثور على تسليمات.",
    parentManagement: "إدارة أولياء الأمور",
    viewAndManageParents: "عرض وإدارة حسابات أولياء الأمور.",
    loadingParents: "جاري تحميل أولياء الأمور...",
    deleteParentConfirm: "هل أنت متأكد من حذف ولي الأمر هذا؟ لا يمكن التراجع.",
    adminManagement: "إدارة المسؤولين",
    viewAndManageAdmins: "عرض وإدارة حسابات المسؤولين.",
    loadingAdmins: "جاري تحميل المسؤولين...",
    deleteAdminConfirm: "هل أنت متأكد من حذف هذا المسؤول؟ لا يمكن التراجع.",
    adminOnly: "للمسؤول فقط",
    createsAccountsDirectly: "إنشاء حسابات جديدة مباشرة في قاعدة البيانات.",
    phoneLabel: "الهاتف",
    adminRole: "مسؤول",
    parentsPhone: "هاتف ولي الأمر",
    parentsPhoneNumber: "رقم هاتف ولي الأمر",
    createdAccountFor: "تم إنشاء حساب لـ {username}",
    createAccountButton: "إنشاء حساب",
    enterFullNameValidation: "أدخل الاسم الكامل.",
    enterUsernameValidation: "أدخل اسم المستخدم.",
    useAtLeastSixChars: "استخدم 6 أحرف على الأقل.",
    failedToCreateAccount: "فشل إنشاء الحساب.",
    loadingFamilyDashboard: "جاري تحميل لوحة العائلة...",
    familyProgress: "تقدم العائلة",
    trackScoresWeakPoints: "تابع درجات ونقاط ضعف كل طالب وإشارات التعلم الحديثة في نظرة واحدة.",
    activeStudent: "الطالب النشط",
    updatingDataForChild: "جاري تحديث البيانات...",
    noDataAvailablePeriod: "لا توجد بيانات متاحة",
    couldNotRetrieveStats: "تعذر استرداد الإحصائيات لهذه الفترة.",
    dailyActivity: "النشاط اليومي",
    solvingActivityPerDay: "نشاط الحل يومياً",
    clickOnBar: "انقر على الشريط لترى ما حله طفلك في ذلك اليوم",
    attemptsCount: "محاولات",
    avgScoreColon: "متوسط الدرجات: {score}/800",
    clickToViewDetails: "انقر لعرض التفاصيل",
    noDailyActivityYet: "لم يتم تسجيل نشاط يومي بعد.",
    weakPointsSection: "نقاط الضعف",
    areasNeedReview: "المجالات التي تحتاج مراجعة",
    activityOnDate: "نشاط في {date}",
    nAttemptsAvgScore: "{n} محاولات، متوسط: {score}/800",
    correctOfTotal: "{correct}/{total} صحيح",
    last30Days: "آخر 28 يوماً",
    avgScore: "متوسط الدرجات",
    questionXofY: "سؤال {current} من {total}",
    questionNumber: "سؤال {n}",
    noWeakPointsYet: "لا توجد نقاط ضعف بعد",
    keepSolvingAssignments: "استمر في حل الواجبات وستظهر أخطاؤك المتكررة هنا.",
    // Topics
    topics: "الموضوعات",
    topicManagement: "إدارة الموضوعات",
    topicName: "اسم الموضوع",
    addTopic: "إضافة موضوع",
    editTopic: "تعديل الموضوع",
    deleteTopic: "حذف الموضوع",
    deleteTopicConfirm: "هل أنت متأكد من حذف هذا الموضوع؟ لا يمكن التراجع.",
    topicCreated: "تم إنشاء الموضوع بنجاح!",
    topicUpdated: "تم تحديث الموضوع بنجاح!",
    topicDeleted: "تم حذف الموضوع بنجاح!",
    noTopicsFound: "لم يتم العثور على موضوعات.",
    searchTopics: "ابحث عن الموضوعات...",
    noTopicsMatch: "لا توجد موضوعات تطابق بحثك.",
    selectTopic: "اختر موضوع",
    noTopic: "بدون موضوع",
    addQuestionsFromTopic: "إضافة أسئلة من موضوع",
    addFromTopicConfirm: "إضافة جميع الأسئلة من هذا الموضوع؟",
    questionsAddedFromTopic: "تمت إضافة الأسئلة من الموضوع بنجاح!",
    selectAll: "تحديد الكل",
    deselectAll: "إلغاء تحديد الكل",
    addSelected: "إضافة المختار ({count})",
    searchByText: "ابحث...",
    noDetailedRecords: "لا توجد سجلات مفصلة لهذا اليوم.",
    weakPointsNeedsReview: "بحاجة مراجعة",
    currentAccuracy: "الدقة الحالية",
    mistakesCount: "الأخطاء",
    reviewSuggestedQuestions: "مراجعة الأسئلة المقترحة",
    recentMistakesSection: "الأخطاء الأخيرة",
    noRecentMistakes: "لا توجد أخطاء حديثة",
    everythingLooksPerfect: "كل شيء يبدو مثالياً!",
    noWeakPointsDetected: "لم يتم اكتشاف نقاط ضعف",
    greatJobAllGood: "عمل رائع! يبدو أن طفلك يؤدي بشكل جيد في جميع المجالات.",
    childProgress: "تقدم الطفل",
    childNotFound: "الطفل غير موجود.",
    booksOverview: "نظرة عامة على الكتب",
    skillsBreakdown: "تحليل المهارات",
    recentMistakesLabel: "الأخطاء الأخيرة",
    upcomingHomework: "الواجبات القادمة",
    dueDateLabel: "مستحق {date}",
    practiceAndResources: "الممارسة والموارد",
    practiceAllQuestionsDesc: "تمرن على جميع الأسئلة، راجع محاولاتك، واطلع على موارد الفصل.",
    allBooks: "جميع الكتب",
    allYears: "جميع السنوات",
    allMonths: "جميع الأشهر",
    mainNavigation: "القائمة الرئيسية",
    footerNavigation: "قائمة التذييل",
    bulkUpload: "رفع ملف",
    bulkUploadHint: ".json أو .csv أو .xlsx أو .xls أو Gemini .py قم برفع ملف بالحقول questionText, choiceA/B/C/..., answerLetter",
    skillsAppearHere: "ستظهر المهارات هنا عندما يضيفها المعلم.",
    nameColumn: "الاسم",
    modelAnswersColumn: "الإجابات النموذجية",
    degreeColumn: "الدرجة",
    examColumn: "الامتحان",
    videosColumn: "فيديوهات",
    pdfColumn: "PDF",
    noTriesYet: "لا توجد محاولات بعد",
    startPracticing: "ابدأ التدريب لترى محاولاتك",
    viewModelAnswers: "عرض الإجابات النموذجية",
    questionsCount: "سؤال",
    practiceAllQuestionsLink: "تمرن على جميع الأسئلة",
    tryDetail: "تفاصيل المحاولة",
    scoreCorrectTotal: "النتيجة: {correct}/{total} ({score}/800)",
    loadingTryDetails: "جاري تحميل تفاصيل المحاولة...",
    weeklyExams: "الامتحانات الأسبوعية",
    practiceWeeklyExams: "تمرن على الامتحانات الأسبوعية وراجع نتائجك أدناه.",
    noWeeklyExamsAvailable: "لا توجد امتحانات أسبوعية متاحة",
    weeklyExamsAppearHere: "ستظهر الامتحانات الأسبوعية هنا عندما يضيفها المعلم.",
    examResults: "نتائج الامتحان",
    yourAttempts: "محاولاتك",
    completedAttemptsReadOnly: "المحاولات المكتملة للقراءة فقط لتتمكن من المراجعة بهدوء.",
    noExamsCompletedYet: "لم يتم إكمال أي امتحان بعد.",
    readOnlyReview: "مراجعة للقراءة فقط",
    questionCorrect: "صحيح",
    questionIncorrect: "خطأ",
    selectAnAttempt: "اختر محاولة",
    chooseExamFromList: "اختر امتحاناً من القائمة لرؤية التفاصيل.",
    bookDetailLabel: "تفاصيل الكتاب",
    resourcesSkillsAndPractice: "الموارد والمهارات وتمارين هذا الفصل.",
    nQuestionsDegree: "{n} سؤال، {degree} درجة",
    durationLabel: "{duration}",
    nPagesSizeMB: "{n} صفحة، {size} MB",
    examSkillWeighting: "وزن مهارة الامتحان: {pct}%",
    noQuestionsHereYet: "لا توجد أسئلة هنا بعد",
    practiceModeAppearsWhenPublished: "سيظهر وضع التدريب هذا عندما يتم نشر الأسئلة.",
    submittingAnswers: "جاري إرسال إجاباتك...",
    thinkSolveSucceed: "فكر • حل • انجح",
    practiceComplete: "اكتمل التدريب",
    youScored: "حصلت على {score} / {total}",
    retakeButton: "إعادة",
    previousButton: "السابق",
    filterByBook: "تصفية حسب الكتاب",
    clearFilter: "مسح التصفية",
    submitButton: "إرسال",
    showExplanation: "عرض الشرح",
    finishButton: "إنهاء",
    nextButton: "التالي",
    finishMissingAnswersDesc: "ما زال لديك {count} سؤال غير مُجاب من أصل {total}. من فضلك أجب عنها قبل الإنهاء.",
    correctAnswerHeading: "إجابة صحيحة",
    tryThisIdeaAgain: "حاول مرة أخرى",
    explanationVideoTitle: "فيديو الشرح",
    browserNotSupportVideo: "متصفحك لا يدعم تشغيل الفيديو.",
    closeVideos: "إغلاق الفيديوهات",
    selectAVideo: "اختر فيديو",
    autoPlayNext: "تشغيل تلقائي للتالي",
    loadingVideo: "جاري تحميل الفيديو...",
    viewsRemaining: "لديك {n} مشاهدة متبقية.",
    watchingConsumesView: "المشاهدة ستستهلك مشاهدة واحدة.",
    watchNow: "شاهد الآن",
    confirmCancel: "إلغاء",
    noViewsRemaining: "لا توجد مشاهدات متبقية.",
    contactInstructorForViews: "اتصل بمعلمك للحصول على المزيد من المشاهدات.",
    failedToLoadVideo: "فشل تحميل الفيديو.",
    noVideosForBook: "لم يتم رفع فيديوهات لهذا الكتاب.",
    thinkingLabel: "جارٍ التفكير...",
    logoAlt: "الشعار",
    noCourseSelected: "لم يتم اختيار دورة.",
    skillNotFound: "لم يتم العثور على المهارة",
    backToSkills: "العودة إلى المهارات",
    assignmentNotFound: "لم يتم العثور على الواجب",
    backToAssignments: "العودة إلى الواجبات",
    weeklyExamNotFound: "لم يتم العثور على الامتحان الأسبوعي",
    backToCheckpoint: "العودة إلى الاختبار الأسبوعي",
    loadingDots: "جاري التحميل...",
    savingDots: "جاري الحفظ...",
    creatingDots: "جاري الإنشاء...",
    uploadingDots: "جاري الرفع...",
    submittingDots: "جاري الإرسال...",
    deletingDots: "جاري الحذف...",
    actionSave: "حفظ",
    actionCancel: "إلغاء",
    actionEdit: "تعديل",
    actionDelete: "حذف",
    actionCreate: "إنشاء",
    actionGrade: "تصحيح",
    actionResetPassword: "إعادة تعيين كلمة المرور",
    areYouSureDelete: "هل أنت متأكد من الحذف؟ لا يمكن التراجع.",
    cannotBeUndone: "لا يمكن التراجع عن هذا الإجراء.",
    notAvailable: "غير متوفر",
    successCreated: "تم الإنشاء بنجاح!",
    successDeleted: "تم الحذف بنجاح!",
    successSaved: "تم الحفظ بنجاح!",
    failedAction: "فشلت العملية.",
    noResultsFound: "لم يتم العثور على نتائج.",
    searchDots: "بحث...",
    // Validation & form messages
    usernameRequired: "اسم المستخدم مطلوب.",
    passwordMinLength: "الباسورد لازم يكون 6 حروف أو أكتر.",
    unableToLogin: "مقدرناش نسجل دخول.",
    wrongUsernameOrPassword: "اسم المستخدم أو كلمة السر غلط",
    usernameExists: "في حساب بنفس اسم المستخدم ده",
    fullNameRequired: "اكتب اسمك بالكامل.",
    usernameMinLength: "اسم المستخدم لازم يكون 3 حروف أو أكتر.",
    usernameInvalidChars: "اسم المستخدم يمكن أن يحتوي فقط على حروف وأرقام وشرطة سفلية",
    validPhoneNumber: "اكتب رقم تليفون صح.",
    validParentPhone: "اكتب رقم تليفون ولي الأمر صح.",
    phoneInvalid: "رقم الهاتف غير صحيح. استخدم رقم مصري (مثل 01234567890) أو +[مفتاح الدولة][الرقم] للدولي.",
    parentPhoneInvalid: "ادخل رقم صحيح: مصري (مثل 01234567890) أو دولي بعلامة +.",
    confirmPasswordRequired: "اكتب الباسورد تاني.",
    passwordsDontMatch: "الباسورد مش مطابق",
    phoneMustDifferFromParent: "رقم تليفون الطالب يجب أن يختلف عن رقم تليفون ولي الأمر",
    registrationFailed: "التسجيل فشل.",
    checkHighlightedFields: "من فضلك راجع الحقول اللي مميزة.",
    enterFullName: "اكتب الاسم بالكامل.",
    enterUsername: "اكتب اسم المستخدم.",
    useMinChars: "استخدم 6 حروف أو أكتر.",
    studentLabel: "طالب",
    parentLabel: "ولى أمر",
    togglePassword: "أظهر/أخفي الباسورد",
    levelUpMath: "حسّن مستواك في الرياضة",
    startJourney: "ابدأ مشوارك لـ ",
    successWord: "النجاح.",
    createAccountDescription: "اعمل حساب عشان تشوف الواجبات المخصصة وتتابع تقدمك وتاخد تقييم فوري.",
    assignmentsCount: "واجبات",
    excellence: "تميز",
    // Student dashboard
    welcomeBackName: "أهلاً بيك تاني، {name}",
    yourAverageScore: "متوسط درجتك",
    skillsNeedReview: "مهارات محتاجة مراجعة",
    storedForReview: "متخزنة للمراجعة",
    acrossAllCategories: "على كل التصنيفات",
    yourRankLabel: "ترتيبك",
    outOfStudents: "من ضمن {count} طالب",
    noRankingYet: "لسه مفيش ترتيب",
    liveSession: "حصة لايف",
    nextSession: "الجلسة القادمة",
    targetSeventyPercent: "الخط البرتقالي ده هدف 70% بتاعك.",
    scoreTooltip: "الدرجة",
    attemptTooltip: "محاولة",
    startQuizToSeeTrend: "ابدأ كويز عشان تشوف اتجاه درجتك",
    accuracy: "الدقة",
    correctVsMissed: "الصح مقابل الغلط",
    quickLookAtAttempts: "نظرة سريعة على آخر محاولاتك.",
    noAttemptsYet: "لسه مفيش محاولات",
    // Child dashboard
    overallPerformance: "المستوى العام",
    completionRate: "نسبة الإنجاز",
    engagementLevel: "مستوى التفاعل",
    studentRankLabel: "ترتيب الطالب",
    unranked: "مفيش ترتيب",
    outOfRankedStudents: "من ضمن {count} طالب",
    noScoredAttemptsYet: "لسه مفيش محاولات مصححة",
    performanceLevelLow: "مستوى ابنك ضعيف، محتاج يذاكر أكتر.",
    performanceLevelMedium: "مستوى ابنك مقبول، يقدر يعمل أفضل.",
    performanceLevelHigh: "مستوى ابنك ممتاز، استمر!",
    performanceTrends: "تطور المستوى على آخر المحاولات",
    liveMetrics: "مقاييس لايف",
    // App shell
    roleNavigation: "شريط {role}",
    toggleLanguageLabel: "بدّل اللغة",
    languageAr: "AR",
    languageEn: "EN",
    courseEndedOn: "{course} خلص في {date}",
    // Splash
    interactiveLearning: "تعلم تفاعلي",
    // Account expiry
    accountExpiresIn: "حسابك هينتهي بعد {days} يوم: {date}",
    contactTeacher: "اتصل بدكتور زياد (+20 123 456 7890)",
    accountExpired: "الحساب خلص",
    studentAccountExpired: "حساب الطالب ده خلص{date}. من فضلك كلم د. زياد عشان تجدد الاشتراك.",
    noAccessYet: "مفيش صلاحية لسه. استنى موافقة الأدمن.",
    // Home page
    liveAnalytics: "تحليلات لايف",
    smartPractice: "تدريب ذكي",
    parentVisibility: "متابعة ولي الأمر",
    avgMastery: "متوسط الإتقان",
    fasterReview: "مراجعة أسرع",
    progressView: "عرض التقدم",
    learningOs: "نظام التعلم",
    studentCockpit: "لوحة الطالب",
    liveBadge: "لايف",
    masteryCurve: "منحنى الإتقان",
    dayStreak: "يوم متواصل",
    feedbackLabel: "تعليق",
    reviewLinearEquations: "راجع المعادلات الخطية قبل الاختبار الجاي.",
    tonight830: "الليلة، 8:30",
    premiumTools: "أدوات تعلم بريميوم، مصممة عشان تطورك باستمرار.",
    weakPointsBadge: "نقاط الضعف",
    scoreTrendBadge: "اتجاه النتيجة",
    mistakesBadge: "الأخطاء",
    personalizedSkillRoute: "طريق مهارات مخصص ليك",
    assignmentsInstantClarity: "واجبات بوضوح فوري",
    parentReadySnapshots: "ملخصات تقدم لولى الأمر",
    // About page
    diagnose: "تشخيص",
    diagnoseDesc: "ابدأ من مستوى الطالب الحقيقي، مش تخمين.",
    reviewStep: "مراجعة",
    reviewStepDesc: "خلي الأخطاء واضحة ومفهومة وقابلة للتصليح.",
    aboutThePlatform: "عن المنصة",
    avgClarityGain: "متوسط الوضوح",
    fasterReviewLoop: "مراجعة أسرع",
    learningJourney: "رحلة التعلم",
    openDashboard: "افتح لوحة التحكم",
    startLearning: "ابدأ التعلم",
    // Privacy page
    privacyHub: "مركز الخصوصية",
    studentFirst: "الطالب أولاً",
    noDataSelling: "مفيش بيع بيانات",
    secureByDesign: "آمن بالتصميم",
    privacySectionLabel: "الخصوصية",
    privacySectionDesc: "طريقة أوضح عشان تفهم إللي بيحصل لبياناتك.",
    accessAware: "الوصول مدرك",
    minimalCollection: "تجميع بسيط",
    humanContactPath: "طريق التواصل",
    sectionsLabel: "الأقسام",
    // Privacy summaries
    privacyCollectSummary: "فقط إللي محتاجه عشان تشغل حسابات التعلم وتشوف التقدم.",
    privacyUseSummary: "بيتستخدم عشان تخصيص التدريب وجودة المنصة.",
    privacyProtectSummary: "محمي بواسطة التحكم في الدخول والتعامل الدقيق مع البيانات.",
    privacyShareSummary: "مفيش بيع لمعلومات الطالب أو العائلة لأي حد تاني.",
    privacyCookiesSummary: "حاجات متصفح صغيرة عشان تجربة دخولك تكون أحسن.",
    privacyChangesSummary: "التغييرات المهمة في السياسة لازم تكون واضحة.",
    // Terms page
    interactiveTermsCenter: "مركز الشروط التفاعلي",
    readableRules: "قواعد واضحة",
    readableRulesDesc: "توقعات واضحة من غير ما الصفحة تبقي كومة نص.",
    fairAccess: "وصول عادل",
    fairAccessDesc: "إرشادات بسيطة للحسابات والسلوك والمحتوى.",
    termsMap: "خريطة الشروط",
    quickLegalSummary: "ملخص قانوني سريع",
    quickLegalDesc: "استخدم المنصة للتعلم، واحمي حسابك، واحترم المحتوى، وتابع التحديثات.",
    tagStartHere: "ابدأ هنا",
    tagAccounts: "الحسابات",
    tagCommunity: "المجتمع",
    tagMaterials: "المواد",
    tagBilling: "الفوترة",
    tagAccess: "الوصول",
    tagLimits: "الحدود",
    tagUpdates: "التحديثات",
    // Public chrome
    brandDr: "د.",
    languageEnglish: "English",
    copyrightFooter: "© 2026 كرافت برس. كل الحقوق محفوظة.",
    // Teacher dashboard
    clearCountLabels: "الأرقام الواضحة تخلي الأيام القليلة أسهل في المسح.",
    catalogAvailable: "بيوفر قد إيه من المحتوى لسه متاح للطلاب.",
    activeLower: "نشط",
    horizontalBarsReadable: "الأشرطة الأفقية تخلي أسماء الكورسات واضحة.",
    coursesLandingWell: "بيظهر أي كورسات ماشية كويس وأيها محتاجة اهتمام.",
    dashboardAnalyticsError: "تحليلات لوحة التحكم مقدرتش تتحمل.",
    // Teacher resources
    videoAddedSuccess: "اتضاف الفيديو بنجاح.",
    failedToAddVideo: "فشلت إضافة الفيديو.",
    pdfUploadedSuccess: "اترفع الـ PDF بنجاح.",
    failedToUploadPdf: "فشل رفع الـ PDF.",
    videoDeleted: "اتحذف الفيديو.",
    failedToDeleteVideo: "فشل حذف الفيديو.",
    pdfDeleted: "اتحذف الـ PDF.",
    failedToDeletePdf: "فشل حذف الـ PDF.",
    failedToLoadUserViews: "فشل تحميل مشاهدات اليوزر.",
    targetSection: "الهدف",
    noGroupSelected: "مفيش مجموعة مختارة",
    labelManageViews: "إدارة المشاهدات",
    ariaDeleteVideo: "احذف الفيديو",
    ariaDeletePdf: "احذف PDF",
    // Teacher sessions
    courseOptional: "الكورس (اختياري)",
    failedToUploadPdfMessage: "فشل رفع PDF: {message}",
    failedToDeletePdfMessage: "فشل حذف PDF: {message}",
    // Teacher questions
    enterQuestionText: "اكتب نص السؤال (أو سيبه فاضي لو بتستخدم صورة)",
    actions: "الإجراءات",
    explanationLabel: "الشرح",
    // Teacher assignments
    failedToDeleteMessage: "فشل الحذف",
    createNew: "إنشاء جديد",
    questionsAvailable: "{count} سؤال متاحين للإضافة",
    courseUpdated: "تم تحديث المادة بنجاح",
    failedToUpdateCourse: "فشل تحديث المادة",
    changeCourse: "تغيير المادة",
    // Shared alt/aria
    altExplanationFigure: "صورة توضيحية",
    altQuestionImage: "سؤال",
    altLogo: "الشعار",
    ariaClosePdf: "قفل PDF",
    correctLabel: "صح",
    missedLabel: "غلط",
    allFilter: "الكل",
    correctFilter: "صحيح",
    incorrectFilter: "خطأ",
    noQuestionsMatchFilter: "لا توجد أسئلة تطابق هذا الفلتر",
    clickToFilter: "اضغط للتصفية",
    showingAll: "عرض الكل",
    showingCorrect: "الصحيح فقط",
    showingIncorrect: "الخطأ فقط",
    fullscreenWarning: "سيتم فتح هذا التدريب في وضع ملء الشاشة. الخروج من وضع ملء الشاشة سيؤدي إلى إرسال إجاباتك تلقائياً.",
    startPracticeFullscreen: "ابدأ التدريب في ملء الشاشة",
    fullscreenExitedTitle: "تم الخروج من ملء الشاشة",
    fullscreenExitedDesc: "لقد خرجت من وضع ملء الشاشة. سيتم إرسال إجاباتك تلقائياً.",
    secondsUntilSubmit: "ثوانٍ حتى الإرسال",
    returnToFullscreen: "العودة إلى ملء الشاشة",
    tabSwitchWarningTitle: "تم تبديل علامة التبويب",
    tabSwitchWarningDesc: "لقد انتقلت بعيداً عن التمرين. إذا قمت بذلك مرة أخرى، سيتم إرسال إجاباتك تلقائياً.",
    tabSwitchContinue: "مواصلة التمرين",
  },
};

const egyptianArabic: Partial<Record<TranslationKey, string>> = {
  appName: "منصة د. زياد",
  home: "الرئيسية",
  about: "عن المنصة",
  privacyPolicy: "سياسة الخصوصية",
  termsOfService: "شروط الاستخدام",
  login: "دخول",
  logout: "خروج",
  dashboard: "لوحة التحكم",
  studentParentDashboard: "لوحة تحكم ولي الأمر",
  books: "الكتب",
  assignments: "الواجبات",
  skills: "المهارات",
  weakPoints: "نقاط الضعف",
  mistakeHistory: "الأخطاء السابقة",
  checkpoint: "اختبار الأسبوع",
  asks: "اسأل",
  sessions: "الحصص",
  sessionsTitle: "حصصك",
  sessionsSubtitle: "شوف الحصص المسجلة وادخل الحصص اللايف",
  noSessions: "مفيش حصص متاحة",
  noSessionsDesc: "الحصص هتظهر هنا أول ما المدرس يضيفها",
  materials: "المحتوى",
  joinSession: "ادخل الحصة",
  students: "الطلاب",
  parents: "أولياء الأمور",
  admins: "الأدمن",
  courses: "الكورسات",
  questions: "الأسئلة",
  resources: "المصادر",
  registerUser: "إنشاء حساب",
  practiceQuestions: "تدريب أسئلة",
  practiceAll: "حل الكل",
  retake: "إعادة الحل",
  videos: "فيديوهات",
  pdf: "PDF",
  pending: "مستني",
  answered: "اترد عليه",
  submitted: "اتسلم",
  graded: "اتصحح",
  active: "نشط",
  inactive: "مش نشط",
  published: "منشور",
  draft: "مسودة",
  score: "الدرجة",
  lastActive: "آخر نشاط",
  accountExpiry: "انتهاء الحساب",
  language: "اللغة",
  learningPortal: "بوابة التعلم",
  loginWelcome: "نورت تاني! اكتب بياناتك عشان تدخل على حسابك.",
  username: "اسم المستخدم",
  password: "كلمة السر",
  rememberMe: "افتكرني",
  forgotPassword: "نسيت كلمة السر؟",
  noAccount: "لسه معندكش حساب؟",
  createAccountLink: "اعمل حساب",
  newStudent: "طالب جديد",
  createAccount: "إنشاء حساب",
  registerSubtitle: "انضم لمنصة الرياضيات وابدأ ظبط مستواك خطوة بخطوة.",
  fullName: "الاسم بالكامل",
  accountType: "نوع الحساب",
  student: "طالب",
  parent: "ولي أمر",
  studentPhone: "موبايل الطالب",
  parentPhone: "موبايل ولي الأمر",
  phoneOnly: "الموبايل",
  registerAction: "سجل الحساب",
  alreadyHaveAccount: "عندك حساب؟",
  loginLink: "ادخل من هنا",
  signingIn: "جاري الدخول...",
  confirmPassword: "أكد كلمة السر",
  creatingAccount: "جاري إنشاء الحساب...",
  checkFields: "تأكد من الخانات المظللة.",
  resetPassword: "إعادة تعيين كلمة السر",
  resetSubtitle: "اكتب إيميلك وهنبعتلك لينك تغيير كلمة السر.",
  resetSent: "لو الحساب موجود، هتوصلك تعليمات إعادة التعيين.",
  sending: "جاري الإرسال...",
  sendResetLink: "ابعت لينك التغيير",
  backToLogin: "ارجع للدخول",
  studentDashboard: "لوحة الطالب",
  keepStreak: "كمل بنفس التركيز وحل تدريب واحد النهارده.",
  expiryCountdown: "الوقت المتبقي للحساب",
  noCoursesContactAdmin: "مفيش كورسات - كلم الأدمن",
  accountNotActivated: "الحساب مش مفعل، كلم د. زياد",
  totalScore: "إجمالي الدرجة",
  mistakes: "الأخطاء",
  completedAssignments: "واجبات اتحلت",
  scoreTrend: "تطور الدرجة",
  weeklyProgress: "تقدم الأسبوع",
  recentActivity: "آخر نشاط",
  whatChanged: "إيه اللي اتغير",
  noActivityFound: "مفيش نشاط حديث.",
  quickAccess: "وصول سريع",
  jumpBackIn: "كمل من مكانك",
  booksProgress: "تقدم الكتب",
  learnFromMiss: "اتعلم من كل غلطة",
  reviewExplanation: "راجع إجابتك والإجابة الصح وشرح د. زياد.",
  fixRepeatedMistakes: "صلح الأخطاء المتكررة",
  weakPointsSubtitle: "الأسئلة بتظهر هنا بعد غلطتين أو أكتر في نفس المهارة.",
  practiceWeakPoints: "تدرب على نقاط الضعف",
  yourAnswer: "إجابتك",
  correctAnswer: "الإجابة الصح",
  weeklyCheckPoint: "اختبار الأسبوع",
  weeklyExam: "اختبار أسبوعي",
  performance: "الأداء",
  myCourses: "كورساتي",
  noCoursesFound: "مفيش كورسات",
  viewCourse: "افتح الكورس",
  courseEnded: "الكورس انتهى",
  courseMaterialsUnavailable: "الكورس انتهى يوم {date}. المحتوى مش متاح دلوقتي.",
  deadline: "آخر معاد",
  trackProgress: "تابع تقدمك",
  reviewPerformance: "راجع محاولاتك وتطور أدائك.",
  attemptHistory: "سجل المحاولات",
  noAttemptsFound: "لسه مفيش محاولات.",
  mistakeDetailSoon: "تحليل الأخطاء التفصيلي قريب.",
  xMistakes: "أخطاء",
  homeHeroTitle: "اتقن الرياضيات بثقة",
  homeHeroSubtitle: "منصة تدريب ومتابعة شخصية بشرح واضح وتصحيح فوري من د. زياد.",
  homeGetStarted: "ابدأ",
  homeLearnMore: "اعرف أكتر",
  homeFeatures: "ليه تختارنا",
  homeLogin: "دخول",
  homeRegister: "اعمل حساب",
  footerRights: "كل الحقوق محفوظة.",
  footerPrivacy: "الخصوصية",
  footerTerms: "الشروط",
  parentDashboard: "لوحة ولي الأمر",
  childrenProgress: "تقدم الأبناء",
  assignmentsAndSkills: "الواجبات والمهارات",
  heroTitle: "مساحة مذاكرة رياضيات مركزة عشان توصل لـ",
  heroSubtitle: "اتدرب، راجع أخطاءك، وتابع تقدمك مع شرح واضح ومتابعة من د. زياد.",
  heroHighlight: "أفضل مستوى.",
  heroTagline: "فكّر • حل • انجح",
  featureRole: "كل حساب بيفتح مكانه",
  featureWeak: "نقاط ضعفك قدام عنيك",
  featureBilingual: "عربي وإنجليزي",
  homeFeature1Title: "تدريب على مستواك",
  homeFeature1Desc: "أسئلة وتمارين بتتحرك مع مستواك عشان تركز على اللي محتاجه فعلًا.",
  homeFeature2Title: "تصحيح وفهم أسرع",
  homeFeature2Desc: "تعرف إجابتك صح ولا غلط وتشوف السبب عشان الغلطة متتكررش.",
  homeFeature3Title: "متابعة تقدم واضحة",
  homeFeature3Desc: "درجات، محاولات، ونقاط ضعف بتظهر بشكل بسيط للطالب وولي الأمر.",
  homeFeature4Title: "محتوى منظم",
  homeFeature4Desc: "كتب، واجبات، حصص، وامتحانات أسبوعية في مكان واحد.",
  homeCtaTitle: "جاهز تبدأ تذاكر بتركيز؟",
  homeCtaSubtitle: "ادخل على حسابك أو اعمل حساب جديد وابدأ من آخر نقطة وقفت عندها.",
  aboutTitle: "عن Dr. Ziad Mohamed Math IG",
  aboutMissionTitle: "هدفنا",
  aboutMissionDesc: "بنُساعد كل طالب إنه يفهم الرياضيات بثقة، بتدريب واضح ومتابعة حقيقية لنقاط القوة والضعف.",
  aboutVisionTitle: "رؤيتنا",
  aboutVisionDesc: "بنبني تجربة تعلم رياضيات سهلة ومنظمة ومفهومة للطلاب وأولياء الأمور.",
  aboutFeaturesTitle: "إحنا بنقدّم إيه",
  aboutFeature1: "منهج منظم للرياضيات مع تدريب عملي",
  aboutFeature2: "مواد شرح، PDFs، وفيديوهات مرتبطة بالكورس",
  aboutFeature3: "متابعة للدرجات والمحاولات ونقاط الضعف",
  aboutFeature4: "حصص ومواعيد واضحة بروابط مباشرة",
  aboutContactTitle: "تواصل معانا",
  aboutContactDesc: "لو عندك أي سؤال، ابعتلنا وهنرد عليك.",
  privacyTitle: "سياسة الخصوصية",
  privacyIntro: "خصوصيتك مهمة عندنا. هنا بنوضح بنجمع إيه وبنستخدمه إزاي.",
  privacyCollectTitle: "المعلومات اللي بنجمعها",
  privacyCollectDesc: "بنجمع بيانات التسجيل ونشاط التعلم عشان نشغل المنصة ونحسن التجربة.",
  privacyUseTitle: "بنستخدم بياناتك إزاي",
  privacyUseDesc: "بنستخدمها لعرض المحتوى المناسب، متابعة التقدم، وتحسين الخدمة.",
  privacyProtectTitle: "بنحمي بياناتك إزاي",
  privacyProtectDesc: "بنستخدم إجراءات أمان مناسبة عشان نحافظ على بياناتك من الوصول غير المصرح به.",
  privacyShareTitle: "مشاركة البيانات",
  privacyShareDesc: "مش بنشارك بياناتك الشخصية مع أطراف خارجية إلا لو كان مطلوب قانونيًا.",
  privacyCookiesTitle: "ملفات الكوكيز",
  privacyCookiesDesc: "بنستخدم كوكيز بسيطة لتحسين تجربة الاستخدام، وتقدر تتحكم فيها من المتصفح.",
  privacyChangesTitle: "تغييرات السياسة",
  privacyChangesDesc: "ممكن نحدّث السياسة من وقت للتاني، وأي تغيير مهم هيبقى واضح للمستخدمين.",
  privacyContactTitle: "تواصل بخصوص الخصوصية",
  privacyContactDesc: "لو عندك سؤال عن الخصوصية، تواصل معانا.",
  termsTitle: "شروط الاستخدام",
  termsIntro: "باستخدامك Dr. Ziad Mohamed Math IG، أنت موافق على الشروط دي.",
  termsAcceptTitle: "قبول الشروط",
  termsAcceptDesc: "استخدام المنصة معناه موافقتك على الالتزام بالشروط والقواعد الموجودة هنا.",
  termsUseTitle: "حسابات المستخدمين",
  termsUseDesc: "أنت مسؤول عن سرية بيانات حسابك وعن أي نشاط بيتم من خلاله.",
  termsConductTitle: "سلوك المستخدم",
  termsConductDesc: "استخدم المنصة بشكل محترم وقانوني ومن غير إساءة أو تعطيل للخدمة.",
  termsContentTitle: "المحتوى والمواد",
  termsContentDesc: "محتوى المنصة مملوك لـ Dr. Ziad Mohamed Math IG، ومينفعش نسخه أو توزيعه من غير إذن.",
  termsPaymentTitle: "الاشتراك والدفع",
  termsPaymentDesc: "بعض الخدمات ممكن تحتاج اشتراك، وتفاصيل الدفع والاسترداد بتكون حسب النظام المعلن.",
  termsTerminationTitle: "إيقاف الحساب",
  termsTerminationDesc: "ممكن يتم إيقاف الحساب لو حصل خرق للشروط أو استخدام غير مناسب.",
  termsLiabilityTitle: "حدود المسؤولية",
  termsLiabilityDesc: "المنصة بتقدم الخدمة بأفضل شكل ممكن، واحنا مش مسؤولين عن أي استخدام خارج الغرض التعليمي.",
  termsChangesTitle: "تغيير الشروط",
  termsChangesDesc: "ممكن نحدّث الشروط، والاستمرار في استخدام المنصة معناه قبول التحديثات.",
  termsContactTitle: "التواصل",
  termsContactDesc: "لو عندك سؤال عن الشروط، تواصل معانا.",
  teacherDashboard: "لوحة المعلم",
  operationsSnapshot: "نظرة سريعة",
  trackCourseCoverage: "تابع تغطية الدروس ونشاط الطلاب والأداء من لوحة تحكم واحدة.",
  todayStat: "النهارده",
  studentAttempts: "محاولات طلاب",
  learningHealth: "صحة التعلم",
  registeredLearners: "الطلاب المسجلين",
  activeCoursesCount: "كورسات نشطة",
  endedCourses: "خلصت",
  averageScore: "متوسط الدرجات",
  totalAttempts: "محاولات",
  liveContent: "محتوى مباشر",
  totalBooksCount: "كتب",
  activityChart: "النشاط",
  dailyAttempts: "المحاولات اليومية",
  coursesChart: "الكورسات",
  activeCourseCoverage: "تغطية الكورسات النشطة",
  enrollmentChart: "التسجيل",
  studentsByCourse: "الطلاب حسب الكورس",
  coursePerformanceChart: "أداء الكورس",
  averageScoreByCourse: "متوسط الدرجات حسب الكورس",
  performanceTrendChart: "الأداء",
  averageScoreTrend: "اتجاه متوسط الدرجات",
  guideLineTargetPercent: "الخط الإرشادي بيحدد هدف 70%.",
  contentChart: "المحتوى",
  teachingMix: "مزيج التدريس",
  materialBalance: "توازن المحتوى عبر مساحة العمل.",
  noContentYet: "لسه مفيش محتوى",
  percentOfContent: "% من المحتوى",
  recentActivityLabel: "آخر نشاط",
  latestAttempts: "آخر المحاولات",
  noRecentAttempts: "مفيش محاولات حديثة",
  strongPerformance: "أداء قوي",
  needsAttention: "محتاج متابعة",
  reviewUrgently: "مراجعة عاجلة",
  studentManagement: "إدارة الطلاب",
  manageEnrollments: "إدارة تسجيل الطلاب في الكورسات.",
  searchNameUsernamePhone: "ابحث بالاسم أو اسم المستخدم أو الموبايل...",
  allCourses: "كل الكورسات",
  enrolledCourses: "الكورسات المسجل فيها",
  loadingStudents: "بنجيب الطلاب...",
  editStudent: "تعديل الطالب",
  deleteStudentConfirm: "متأكد إنك عايز تحذف الطالب ده؟ مش هتقدر ترجع تاني.",
  enterNewPassword: "اكتب كلمة سر جديدة",
  passwordMinChars: "كلمة السر لازم تكون 6 أحرف على الأقل.",
  passwordHasBeenReset: "تم تغيير كلمة السر.",
  couldNotResetPassword: "مقدرناش نغير كلمة السر.",
  loadingStudentProfile: "بنجلب ملف الطالب...",
  studentProfileLabel: "ملف الطالب",
  noPhone: "مفيش رقم",
  editInfo: "تعديل البيانات",
  bookProgressApiPending: "الربط بالكتب قيد التطوير",
  mistakeHistoryDb: "مفيش أخطاء مسجلة.",
  homeworkGrading: "تصحيح الواجبات",
  failedToUpdateStudent: "فشل تحديث بيانات الطالب.",
  courseSetup: "إعداد الكورس",
  createCoursesAndTrack: "اعمل كورسات، حدد الكتب، وتابع مواعيد الامتحانات.",
  createNewCourse: "إنشاء كورس جديد",
  courseNamePlaceholder: "اسم الكورس",
  egAdvancedMath: "مثل: رياضيات متقدمة 101",
  examDate: "تاريخ الامتحان",
  assignBooks: "إضافة كتب",
  assignSessions: "إضافة حصص",
  assignActivities: "إضافة أنشطة",
  createCourseAndAssign: "إنشاء الكورس وتعيين الحقول",
  saveChanges: "حفظ التعديلات",
  editDetailsAndAssignments: "تعديل التفاصيل والتعيينات",
  deleteCourseConfirm: "متأكد إنك عايز تحذف الكورس ده؟",
  courseYearLabel: "سنة الكورس",
  examDateLabel: "تاريخ الامتحان",
  booksCount: "الكتب",
  sessionsCount: "الحصص",
  activitiesCount: "الأنشطة",
  assignmentBuilder: "منشئ الواجبات",
  createAndManageQuestions: "اعمل واجبات وإدارة الأسئلة في كل واجب.",
  assignmentTitle: "العنوان",
  assignmentType: "واجب",
  skillType: "مهارة",
  durationMinutes: "المدة (بالدقائق)",
  skillsUnlimitedDuration: "المهارات مدتهم مش محدودة",
  createAssignment: "إنشاء واجب",
  createSkill: "إنشاء مهارة",
  noAssignmentsFound: "مفيش واجبات.",
  questionsInAssignment: "الأسئلة في الواجب ده ({count})",
  addQuestions: "إضافة أسئلة",
  noQuestionsYetClickAdd: "لسه مفيش أسئلة. اضغط 'إضافة أسئلة' عشان تبدأ.",
  questionWithoutText: "سؤال من غير نص",
  difficultyYearChoices: "{difficulty} • سنة {year} • {n} اختيارات",
  skillsSection: "المهارات",
  noSkillsFound: "مفيش مهارات.",
  searchAssignments: "دوّر على الواجبات...",
  searchSkills: "دوّر على المهارات...",
  noAssignmentsMatch: "مفيش واجبات مطابقة لبحثك.",
  noSkillsMatch: "مفيش مهارات مطابقة لبحثك.",
  unlimitedQuestions: "غير محدود • {n} سؤال",
  questionsInSkill: "الأسئلة في المهارة دي ({count})",
  questionPicker: "اختيار الأسئلة",
  hasImage: "فيه صورة",
  addQuestionsTo: "إضافة أسئلة إلى: {title}",
  searchQuestionsText: "دوّر في الأسئلة حسب النص أو الصعوبة أو السنة...",
  noQuestionsInBank: "مفيش أسئلة في البنك. اعمل أسئلة الأول.",
  allQuestionsAdded: "كل الأسئلة اتحطت في الواجب ده.",
  questionAddedSuccess: "السؤال اتضاف بنجاح!",
  failedToAddQuestion: "فشل إضافة السؤال",
  failedToRemoveQuestion: "فشل إزالة السؤال",
  failedToReorderQuestions: "فشل إعادة ترتيب الأسئلة",
  deleteAssignmentConfirm: "متأكد إنك عايز تحذف الواجب ده؟ مش هتقدر ترجع تاني.",
  assignmentDeletedSuccess: "الواجب اتحذف بنجاح!",
  skillDeletedSuccess: "المهارة اتحذفت بنجاح!",
  chapterLibrary: "مكتبة الفصول",
  bookOrChapterTitle: "عنوان الكتاب أو الفصل",
  addBook: "إضافة كتاب",
  dragToReorder: "اسحب عشان تعيد الترتيب",
  orderN: "ترتيب {n}",
  unknownCourse: "كورس مش معروف",
  pleaseEnterTitleFirst: "اكتب عنوان الكتاب أو الفصل الأول.",
  failedToCreateBook: "فشل إنشاء الكتاب.",
  searchBooks: "دوّر على الكتب...",
  noBooksMatch: "مفيش كتب مطابقة لبحثك.",
  searchCourses: "دوّر على الكورسات...",
  noCoursesMatch: "مفيش كورسات مطابقة لبحثك.",
  questionBank: "بنك الأسئلة",
  addQuestionsToBooks: "ضيف أسئلة للكتب. الأسئلة ممكن تكون نص أو صورة.",
  allDifficulty: "كل المستويات",
  selectBook: "اختر كتاب",
  questionText: "نص السؤال",
  orUploadQuestionImage: "أو رفع صورة السؤال",
  questionPreview: "معاينة السؤال",
  choicesSelectCorrect: "الاختيارات (حدد الإجابة الصح)",
  choiceLetter: "اختيار {letter}",
  addChoice: "إضافة اختيار",
  difficultyEasy: "سهل",
  difficultyMedium: "متوسط",
  difficultyHard: "صعب",
  yearPlaceholder: "السنة",
  monthPlaceholder: "الشهر",
  explanationOptional: "نص الشرح (اختياري)",
  orUploadExplanationImage: "أو رفع صورة الشرح",
  explanationPreview: "معاينة الشرح",
  updateQuestion: "تحديث السؤال",
  saveQuestion: "حفظ السؤال",
  deleteQuestion: "حذف السؤال",
  deleteQuestionConfirm: "متأكد إنك عايز تحذف السؤال ده؟ مش هتقدر ترجع تاني.",
  pleaseProvideQuestionText: "اكتب نص السؤال أو ارفع صورة.",
  pleaseAddChoice: "ضيف اختيار واحد على الأقل.",
  pleaseSelectCorrectAnswer: "حدد الإجابة الصح.",
  videosAndPdfs: "فيديوهات و PDF",
  attachYouTubeLinks: "إضافة روابط يوتيوب و PDF للواجبات أو المهارات.",
  addVideo: "إضافة فيديو",
  youtubeSource: "يوتيوب",
  vdoCipherSource: "VdoCipher",
  youtubeUrl: "رابط يوتيوب",
  vdoCipherVideoId: "ID فيديو VdoCipher",
  viewsPerUser: "مشاهدة لكل مستخدم",
  saveVideo: "حفظ الفيديو",
  uploadPdfLabel: "رفع PDF",
  choosePdf: "اختر PDF",
  videosSection: "الفيديوهات",
  noVideosYet: "لسه مفيش فيديوهات.",
  pdfSection: "ملفات PDF",
  noPdfsYet: "لسه مفيش PDF.",
  manageViews: "إدارة المشاهدات",
  searchStudentsPlaceholder: "دوّر على الطلاب...",
  noUsersFound: "مفيش مستخدمين.",
  failedToLoadResources: "فشل تحميل المصادر.",
  viewsUpdatedText: "تم تحديث المشاهدات.",
  failedToUpdateViews: "فشل تحديث المشاهدات.",
  deleteVideoConfirm: "تحذف الفيديو ده؟",
  deletePdfConfirm: "تحذف ملف PDF ده؟",
  liveSessions: "الحصص",
  addSession: "إضافة حصة",
  addNewSession: "إضافة حصة جديدة",
  sessionTitle: "العنوان",
  exactDateTime: "التاريخ والوقت بالظبط",
  noCourseOption: "من غير كورس",
  meetingLinkOptional: "رابط الاجتماع (اختياري)",
  attachmentPdf: "مرفق (PDF)",
  saveSession: "حفظ الحصة",
  meetingLink: "رابط الاجتماع",
  noPdfsAttached: "مفيش PDF مرفق.",
  addPdf: "إضافة PDF",
  createAndGradeHomework: "إنشاء وتصحيح الواجبات",
  publishInstructions: "انشر التعليمات، راجع التسليمات، ضيف درجات، واكتب ملاحظات.",
  instructionsPlaceholder: "التعليمات",
  publishLabel: "نشر",
  submissionsSection: "التسليمات",
  pendingSubmission: "تسليم معلق",
  feedbackPlaceholder: "ملاحظات",
  gradeButton: "تصحيح",
  noSubmissionsFound: "مفيش تسليمات.",
  parentManagement: "إدارة أولياء الأمور",
  viewAndManageParents: "عرض وإدارة حسابات أولياء الأمور.",
  loadingParents: "بنجيب أولياء الأمور...",
  deleteParentConfirm: "متأكد إنك عايز تحذف ولي الأمر ده؟ مش هتقدر ترجع تاني.",
  adminManagement: "إدارة الأدمن",
  viewAndManageAdmins: "عرض وإدارة حسابات الأدمن.",
  loadingAdmins: "بنجيب الأدمن...",
  deleteAdminConfirm: "متأكد إنك عايز تحذف الأدمن ده؟ مش هتقدر ترجع تاني.",
  adminOnly: "لأدمن فقط",
  createsAccountsDirectly: "إنشاء حسابات جديدة مباشرة في قاعدة البيانات.",
  phoneLabel: "الموبايل",
  adminRole: "أدمن",
  parentsPhone: "موبايل ولي الأمر",
  parentsPhoneNumber: "رقم موبايل ولي الأمر",
  createdAccountFor: "اتعمل حساب لـ {username}",
  createAccountButton: "إنشاء حساب",
  enterFullNameValidation: "اكتب الاسم بالكامل.",
  enterUsernameValidation: "اكتب اسم المستخدم.",
  useAtLeastSixChars: "استخدم 6 أحرف على الأقل.",
  failedToCreateAccount: "فشل إنشاء الحساب.",
  loadingFamilyDashboard: "بنجيب لوحة العائلة...",
  familyProgress: "تقدم الأبناء",
  trackScoresWeakPoints: "تابع درجات ونقاط ضعف كل طالب في نظرة واحدة واضحة.",
  activeStudent: "الطالب النشط",
  updatingDataForChild: "بنجدد البيانات...",
  noDataAvailablePeriod: "مفيش بيانات",
  couldNotRetrieveStats: "مقدرناش نجيب الإحصائيات للفترة دي.",
  dailyActivity: "النشاط اليومي",
  solvingActivityPerDay: "نشاط الحل يوم بيوم",
  clickOnBar: "اضغط على الشريط عشان تشوف ابنك حل إيه في اليوم ده",
  attemptsCount: "محاولات",
  avgScoreColon: "متوسط الدرجات: {score}/800",
  clickToViewDetails: "اضغط عشان تشوف التفاصيل",
  noDailyActivityYet: "لسه مفيش نشاط يومي.",
  weakPointsSection: "نقاط الضعف",
  areasNeedReview: "المجالات اللي محتاجة متابعة",
  activityOnDate: "نشاط في {date}",
  nAttemptsAvgScore: "{n} محاولات، متوسط: {score}/800",
  correctOfTotal: "{correct}/{total} صح",
  last30Days: "آخر 28 يوم",
  avgScore: "متوسط الدرجات",
  questionXofY: "سؤال {current} من {total}",
  questionNumber: "سؤال {n}",
  noWeakPointsYet: "لسه مفيش نقاط ضعف",
  keepSolvingAssignments: "كمل حل واجبات و هتظهر أخطائك المتكررة هنا.",
  // Topics
  topics: "الموضوعات",
  topicManagement: "إدارة الموضوعات",
  topicName: "اسم الموضوع",
  addTopic: "إضافة موضوع",
  editTopic: "تعديل الموضوع",
  deleteTopic: "حذف الموضوع",
  deleteTopicConfirm: "هل أنت متأكد من حذف هذا الموضوع؟ لا يمكن التراجع.",
  topicCreated: "تم إنشاء الموضوع بنجاح!",
  topicUpdated: "تم تحديث الموضوع بنجاح!",
  topicDeleted: "تم حذف الموضوع بنجاح!",
  noTopicsFound: "لم يتم العثور على موضوعات.",
  searchTopics: "دوّر على الموضوعات...",
  noTopicsMatch: "مفيش موضوعات مطابقة لبحثك.",
  selectTopic: "اختر موضوع",
  noTopic: "بدون موضوع",
  addQuestionsFromTopic: "إضافة أسئلة من موضوع",
  addFromTopicConfirm: "إضافة جميع الأسئلة من هذا الموضوع؟",
  questionsAddedFromTopic: "تمت إضافة الأسئلة من الموضوع بنجاح!",
  selectAll: "تحديد الكل",
  deselectAll: "إلغاء تحديد الكل",
  addSelected: "إضافة المختار ({count})",
  searchByText: "ابحث...",
  noDetailedRecords: "مفيش سجلات مفصلة لليوم ده.",
  weakPointsNeedsReview: "محتاج متابعة",
  currentAccuracy: "الدقة الحالية",
  mistakesCount: "الأخطاء",
  reviewSuggestedQuestions: "راجع الأسئلة المقترحة",
  recentMistakesSection: "الأخطاء الأخيرة",
  noRecentMistakes: "مفيش أخطاء أخيرة",
  everythingLooksPerfect: "كل شيء تمام!",
  noWeakPointsDetected: "مفيش نقاط ضعف",
  greatJobAllGood: "أحسنت! ابنك شغال كويس في كل المجالات.",
  childProgress: "تقدم الطالب",
  childNotFound: "الطالب مش موجود.",
  booksOverview: "نظرة على الكتب",
  skillsBreakdown: "تفصيل المهارات",
  recentMistakesLabel: "الأخطاء الأخيرة",
  upcomingHomework: "الواجبات الجاية",
  dueDateLabel: "مستحق {date}",
  practiceAndResources: "تدريب ومصادر",
  practiceAllQuestionsDesc: "تمرن على كل الأسئلة، راجع محاولاتك، وشوف مصادر الفصل.",
  allBooks: "كل الكتب",
    allYears: "كل السنين",
    allMonths: "كل الشهور",
    mainNavigation: "القائمة الرئيسية",
    footerNavigation: "قائمة التذييل",
    bulkUpload: "رفع ملف",
    bulkUploadHint: ".json أو .csv أو .xlsx أو .xls أو Gemini .py ارفع ملف بالحقول questionText, choiceA/B/C/..., answerLetter",
    skillsAppearHere: "المهارات هتظهر هنا أول ما المدرس يضيفها.",
  nameColumn: "الاسم",
  modelAnswersColumn: "الإجابات النموذجية",
  degreeColumn: "الدرجة",
  examColumn: "الامتحان",
  videosColumn: "فيديوهات",
  pdfColumn: "PDF",
  noTriesYet: "لسه مفيش محاولات",
  startPracticing: "ابدأ التدريب عشان تشوف محاولاتك",
  viewModelAnswers: "عرض الإجابات النموذجية",
  questionsCount: "سؤال",
  practiceAllQuestionsLink: "تمرن على كل الأسئلة",
  tryDetail: "تفاصيل المحاولة",
  scoreCorrectTotal: "النتيجة: {correct}/{total} ({score}/800)",
  loadingTryDetails: "بنجيب تفاصيل المحاولة...",
  weeklyExams: "الامتحانات الأسبوعية",
  practiceWeeklyExams: "تمرن على الامتحانات الأسبوعية وراجع نتايجك تحت.",
  noWeeklyExamsAvailable: "مفيش امتحانات أسبوعية",
  weeklyExamsAppearHere: "الامتحانات الأسبوعية هتظهر هنا أول ما المدرس يضيفها.",
  examResults: "نتايج الامتحان",
  yourAttempts: "محاولاتك",
  completedAttemptsReadOnly: "المحاولات المكتملة للقراءة فقط عشان تراجع بهدوء.",
  noExamsCompletedYet: "لسه مفيش امتحانات متكاملة.",
  readOnlyReview: "مراجعة للقراءة فقط",
  questionCorrect: "صح",
  questionIncorrect: "غلط",
  selectAnAttempt: "اختار محاولة",
  chooseExamFromList: "اختار امتحان من اللستة عشان تشوف التفاصيل.",
  bookDetailLabel: "تفاصيل الكتاب",
  resourcesSkillsAndPractice: "المصادر والمهارات والتمارين بتاعة الفصل ده.",
  nQuestionsDegree: "{n} سؤال، {degree} درجة",
  durationLabel: "{duration}",
  nPagesSizeMB: "{n} صفحة، {size} MB",
  examSkillWeighting: "وزن مهارة الامتحان: {pct}%",
  noQuestionsHereYet: "لسه مفيش أسئلة هنا",
  practiceModeAppearsWhenPublished: "وضع التدريب هيظهر هنا أول ما الأسئلة تتنشر.",
  submittingAnswers: "بنيحفظ إجاباتك...",
  thinkSolveSucceed: "فكّر • حل • انجح",
  practiceComplete: "التدريب خلص",
  youScored: "جبت {score} / {total}",
  retakeButton: "إعادة الحل",
  previousButton: "السابق",
  filterByBook: "تصفية حسب الكتاب",
  clearFilter: "مسح التصفية",
  submitButton: "إرسال",
  showExplanation: "عرض الشرح",
  finishButton: "إنهاء",
  nextButton: "التالي",
  finishMissingAnswersDesc: "لسه سايب {count} سؤال من أصل {total}. جاوب عليهم الأول قبل ما تنهي.",
  correctAnswerHeading: "إجابة صح",
  tryThisIdeaAgain: "حاول تاني",
  explanationVideoTitle: "فيديو الشرح",
  browserNotSupportVideo: "المتصفح بتاعك مش شغال مع الفيديو.",
  closeVideos: "إغلاق الفيديوهات",
  selectAVideo: "اختار فيديو",
  autoPlayNext: "تشغيل تلقائي",
  loadingVideo: "بنجيب الفيديو...",
  viewsRemaining: "فاضلك {n} مشاهدة.",
  watchingConsumesView: "المشاهدة هتستهلك مشاهدة واحدة.",
  watchNow: "شاهد دلوقتي",
  confirmCancel: "إلغاء",
  noViewsRemaining: "مفيش مشاهدات متبقية.",
  contactInstructorForViews: "كلم مدرسك عشان يزودلك مشاهدات.",
  failedToLoadVideo: "فشل تحميل الفيديو.",
  noVideosForBook: "مفيش فيديوهات مرفوعة للكتاب ده.",
  thinkingLabel: "بفكّر...",
  logoAlt: "الشعار",
  noCourseSelected: "مفيش كورس مختار.",
  skillNotFound: "المهارة مش موجودة",
  backToSkills: "رجوع للمهارات",
  assignmentNotFound: "الواجب مش موجود",
  backToAssignments: "رجوع للواجبات",
  weeklyExamNotFound: "الامتحان الأسبوعي مش موجود",
  backToCheckpoint: "رجوع للاختبار الأسبوعي",
  loadingDots: "بنجلب...",
  savingDots: "بنيحفظ...",
  creatingDots: "بنيخلق...",
  uploadingDots: "بيرفع...",
  submittingDots: "بنيبعت...",
  deletingDots: "بنيحذف...",
  actionSave: "حفظ",
  actionCancel: "إلغاء",
  actionEdit: "تعديل",
  actionDelete: "حذف",
  actionCreate: "إنشاء",
  actionGrade: "تصحيح",
  actionResetPassword: "إعادة تعيين كلمة السر",
  areYouSureDelete: "متأكد إنك عايز تحذف؟ مش هتقدر ترجع تاني.",
  cannotBeUndone: "الإجراء ده مش هيتلغي.",
  notAvailable: "غير متاح",
  successCreated: "اتعمل بنجاح!",
  successDeleted: "اتحذف بنجاح!",
  successSaved: "اتحفظ بنجاح!",
  failedAction: "العملية فشلت.",
  noResultsFound: "مفيش نتايج.",
  searchDots: "دوّر...",
  phoneInvalid: "رقم الموبايل غلط. استخدم رقم مصري (زي 01234567890) أو +[مفتاح البلد][الرقم] للدولي.",
  parentPhoneInvalid: "ادخل رقم صح: مصري (زي 01234567890) أو دولي بعلامة +.",
  fullscreenWarning: "التدريب ده هيفتح في وضع ملء الشاشة. لو خرجت من ملء الشاشة، إجاباتك هتتبعت تلقائي.",
  startPracticeFullscreen: "ابدأ التدريب بملء الشاشة",
  fullscreenExitedTitle: "خروج من ملء الشاشة",
  fullscreenExitedDesc: "إنت خرجت من وضع ملء الشاشة. إجاباتك هتتبعت تلقائي.",
  secondsUntilSubmit: "ثوانٍ على الإرسال",
  returnToFullscreen: "ارجع لملء الشاشة",
  tabSwitchWarningTitle: "تم تبديل التبويب",
  tabSwitchWarningDesc: "إنت حولت من التمرين. لو عملت كده تاني، إجاباتك هتتبعت تلقائي.",
  tabSwitchContinue: "كمل تمرين",
};

interface I18nContextValue {
  language: Language;
  direction: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("ziad-language");
    return stored === "ar" ? "ar" : "en";
  });

  const direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem("ziad-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [direction, language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      direction,
      setLanguage: setLanguageState,
      toggleLanguage: () => setLanguageState((current) => (current === "en" ? "ar" : "en")),
      t: (key) => (language === "ar" ? egyptianArabic[key] : undefined) ?? translations[language][key],
    }),
    [direction, language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
};

