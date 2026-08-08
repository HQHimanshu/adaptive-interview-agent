const {
  buildInitialInterviewPrompt,
  buildInterviewTurnPrompt,
  buildFinalEvaluationPrompt,
} = require("./src/services/promptBuilder");

const candidate = {
  member: {
    id: "CAND-001",
    name: "Sarah Johnson",
    jobRole: "Senior Data Engineer",
    yearsExperience: 9,
    education: "MS Computer Science",
    status: "COMPLETED",
  },
  missions: [
    {
      day: 7,
      title: "Embeddings Explained",
      passed: true,
      attempts: 1,
    },
    {
      day: 23,
      title: "Model Context Protocol (MCP)",
      passed: true,
      attempts: 2,
    },
  ],
  signals: {
    commitDays: 28,
    missionsCompleted: 30,
    missionsFirstTry: 20,
  },
};

const curriculumData = require("../curriculum.json");

const session = {
  sessionId: "test-session-001",
  candidate,
  status: "ACTIVE",

  conversationHistory: [
    {
      role: "assistant",
      message: "Welcome. Let's begin your interview.",
    },
    {
      role: "user",
      message: "I have worked with vector databases.",
    },
  ],

  askedQuestions: [
    "Explain how vector databases are used in retrieval systems.",
  ],

  answers: [
    "I have worked with vector databases for semantic search.",
  ],

  progress: {
    currentQuestion: 2,
    totalQuestions: 5,
    answeredQuestions: 1,
  },
};

console.log("\n===== INITIAL INTERVIEW PROMPT =====\n");

const initialPrompt = buildInitialInterviewPrompt({
  candidate,
  curriculumData,
  session,
});

console.dir(initialPrompt, { depth: null });

console.log("\n===== INTERVIEW TURN PROMPT =====\n");

const turnPrompt = buildInterviewTurnPrompt({
  candidate,
  curriculumData,
  session,
  latestMessage: "How would you improve retrieval accuracy?",
});

console.dir(turnPrompt, { depth: null });

console.log("\n===== FINAL EVALUATION PROMPT =====\n");

const finalPrompt = buildFinalEvaluationPrompt({
  candidate,
  curriculumData,
  session,
});

console.dir(finalPrompt, { depth: null });