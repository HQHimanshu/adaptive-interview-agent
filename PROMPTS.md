# Prompt Log

---

# Sprint 1 – Backend Initialization

You are the Backend Engineer of our hackathon team.

Before making any changes, read and follow these project documents:

- AI_PROJECT_CONTEXT.md
- docs/01_ARCHITECTURE.md
- docs/02_PROJECT_MEMORY.md

These documents are the source of truth.

Do not invent architecture.

Do not rename folders.

Do not modify documentation.

Task:

Initialize the backend project only.

Requirements:

- Initialize a Node.js project inside the backend directory.
- Install Express and only the dependencies required for a production-ready backend foundation.
- Configure dotenv.
- Configure helmet.
- Configure cors.
- Configure morgan.
- Configure Express app.
- Create src folder structure.
- Create app.js.
- Create server.js.
- Create GET /health endpoint.
- Create .env.example.
- Configure package.json scripts.

Rules:

- Do not implement interview logic.
- Do not implement Breeth.
- Do not implement Claude/Gemini.
- Do not implement routes except /health.
- Do not create placeholder code for future features.

Before editing files:

Explain

- what files will be created
- why each file exists

After editing:

Explain

- how to run
- how to test
- suggested git commit
- AI usage log entry

Stop after Backend Initialization.

# Sprint 1 – Data Layer

Feature 2 – Data Layer

Context:

Read and follow:

- AI_PROJECT_CONTEXT.md
- docs/01_ARCHITECTURE.md
- docs/02_PROJECT_MEMORY.md

Do not modify architecture.

Task:

Implement the data layer.

Requirements:

1. Create src/data/
2. Implement candidateLoader.js
3. Implement curriculumLoader.js
4. Implement dataCache.js
5. Create src/utils/fileReader.js
6. Create src/config/paths.js

Requirements:

- Load JSON safely.
- Validate files exist.
- Handle invalid JSON gracefully.
- Cache parsed data.
- Export helper functions.
- Use async/await.
- Do not implement interview logic.
- Do not implement sessions.
- Do not call any LLM.
- Do not implement Breeth.

Before writing code:

Explain every file.

After writing:

Explain testing.

Generate git commit.

Generate AI usage log.

Stop after Feature 2.

# Sprint 3 - Session Management

Feature 3 – Session Manager

Context

Before making any changes, read the following project documents:

- AI_PROJECT_CONTEXT.md
- docs/01_ARCHITECTURE.md
- docs/02_PROJECT_MEMORY.md
- docs/03_BACKEND_API.md

These documents define the project architecture and API contract.

Follow them exactly.

Additionally, follow the official technical specification:

- The backend exposes only POST /api/interview.
- The client supplies the sessionId.
- The backend must maintain interview state using the supplied sessionId.
- Do NOT generate new session IDs.
- Do NOT modify the API contract.

------------------------------------------------------------

Task

Implement the Session Manager.

The Session Manager is responsible only for storing and maintaining interview sessions in memory across multiple requests.

Create:

backend/src/services/sessionManager.js

------------------------------------------------------------

Requirements

Use an in-memory Map keyed by sessionId.

The Session Manager must expose reusable methods such as:

- createSession(sessionId, candidate)
- getSession(sessionId)
- hasSession(sessionId)
- updateSession(sessionId, updates)
- appendConversation(sessionId, role, message)
- addAskedQuestion(sessionId, question)
- addCandidateAnswer(sessionId, answer)
- updateProgress(sessionId, progress)
- markCompleted(sessionId)
- deleteSession(sessionId)

------------------------------------------------------------

Session Object

Store information similar to:

{
  sessionId,
  candidate,
  startedAt,
  updatedAt,
  status,
  conversationHistory,
  askedQuestions,
  answers,
  progress,
  metadata
}

where

status:

ACTIVE
COMPLETED

conversationHistory:

[
  {
    role,
    message,
    timestamp
  }
]

progress:

{
  currentQuestion,
  totalQuestions,
  answeredQuestions
}

------------------------------------------------------------

Engineering Requirements

- Use clean modular JavaScript.
- Use JSDoc comments for all public methods.
- Update updatedAt whenever the session changes.
- Throw meaningful errors when sessionId is invalid.
- Validate duplicate session creation.
- Keep the implementation independent from Express routes.
- Keep the implementation independent from Breeth.
- Keep the implementation independent from any LLM.

------------------------------------------------------------

Do NOT implement

- Interview Controller
- Express routes
- Prompt Builder
- Candidate Loader changes
- Curriculum Loader changes
- Breeth integration
- Claude/Gemini calls
- Feedback generation

------------------------------------------------------------

Before generating code

Explain

1. Why a Session Manager is required.
2. Session lifecycle.
3. Session object design.
4. How interview state survives multiple HTTP requests.

------------------------------------------------------------

After generating code

Provide

1. Testing instructions.
2. Edge cases handled.
3. Suggested Git commit.

Example:

feat: implement interview session manager

4. AI Usage Log entry.

Example:

Sprint 3 – Session Manager

Implemented an in-memory session manager that maintains interview state using the client-provided sessionId, including conversation history, interview progress, candidate responses, and session lifecycle management.

Stop after completing the Session Manager.

Do not implement any additional features.