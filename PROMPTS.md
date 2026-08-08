# Prompt Log

---

# Sprint 5 – Groq LLM Service Integration

Implemented a Groq SDK-backed backend LLM service that accepts structured prompt sections from the prompt builder and sends them as chat completion messages to `groq-sdk`.

Key prompt design:
- system instructions for technical interview behavior
- candidate and curriculum context
- interview state and conversation history
- explicit instruction to continue conversation or evaluate interview

This prompt record documents the structure converted by the LLM service rather than the final model response.

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

# Sprint 4 – Prompt Builder

Feature 4 – Prompt Builder

You are implementing Sprint 4 of the Adaptive Interview Agent.

Before making any changes, read these files:

- AI_PROJECT_CONTEXT.md
- technical-spec.md
- docs/01_ARCHITECTURE.md
- docs/02_PROJECT_MEMORY.md
- docs/03_BACKEND_API.md

Also inspect the existing implementation of:

- backend/src/services/sessionManager.js
- backend/src/data/candidateLoader.js
- backend/src/data/curriculumLoader.js
- backend/src/data/dataCache.js
- backend/src/utils/fileReader.js
- backend/src/config/paths.js

The existing implementation and official technical specification are the source of truth.

Do not invent fields that are not supported by the existing data or specification.

--------------------------------------------------
TASK
--------------------------------------------------

Implement Sprint 4: Prompt Builder.

Create:

backend/src/services/promptBuilder.js

The Prompt Builder is responsible ONLY for constructing structured prompts/context for the future LLM service.

It must NOT call an LLM.

It must NOT call Breeth.

It must NOT make HTTP requests.

It must NOT create Express routes.

It must NOT modify the Session Manager unless there is a genuine compatibility problem.

--------------------------------------------------
INPUT CONTEXT
--------------------------------------------------

The Prompt Builder should be able to construct prompts using the information available to the interview system, including where applicable:

- candidate information
- candidate's completed missions
- candidate signals
- relevant curriculum information
- current session state
- conversation history
- previously asked questions
- candidate answers
- interview progress

Use the actual candidate.json and curriculum.json structures present in the repository.

Do not assume fields that do not exist.

--------------------------------------------------
REQUIRED FUNCTIONS
--------------------------------------------------

Implement reusable functions for at least:

1. Initial interview prompt

2. Continuation/interview-turn prompt

3. Final evaluation/feedback prompt

Use clear function names and keep the public API of the module small.

The functions should accept structured data rather than relying on global variables.

--------------------------------------------------
INITIAL INTERVIEW
--------------------------------------------------

The initial prompt should provide the future LLM with enough context to:

- understand who the candidate is
- understand the candidate's relevant learning/missions context
- understand the relevant curriculum
- begin a technical interview
- behave conversationally
- avoid immediately generating final feedback
- ask an appropriate first question

Do not hardcode a particular candidate.

--------------------------------------------------
CONTINUATION TURN
--------------------------------------------------

The continuation prompt should provide:

- candidate context
- relevant curriculum context
- previous conversation
- questions already asked
- latest candidate response
- interview progress

The prompt should instruct the future LLM to continue the interview rather than restart it.

The generated context must preserve conversational continuity.

--------------------------------------------------
FINAL EVALUATION
--------------------------------------------------

The final evaluation prompt should provide enough context for a future LLM to produce the API's required feedback structure:

{
  "summary": "...",
  "strengths": [],
  "gaps": [],
  "next": []
}

The Prompt Builder must NOT itself generate or fabricate feedback.

It only constructs the evaluation prompt.

--------------------------------------------------
PROMPT DESIGN
--------------------------------------------------

Keep the prompt structure explicit and maintainable.

Separate:

1. System/interviewer instructions
2. Candidate context
3. Curriculum context
4. Interview state
5. Conversation history
6. Current task/instruction

Avoid unnecessary duplication.

Avoid embedding implementation details that the future LLM does not need.

Do not expose internal backend implementation details unnecessarily.

--------------------------------------------------
ENGINEERING REQUIREMENTS
--------------------------------------------------

- Use modular JavaScript.
- Use pure/deterministic functions wherever practical.
- Do not mutate the supplied candidate or session objects.
- Validate required input arguments.
- Throw descriptive errors for invalid input.
- Handle empty conversation history.
- Handle an initial session with no previous questions.
- Handle missing optional curriculum information gracefully.
- Keep prompt construction independent of the LLM provider.
- Keep prompt construction independent of Breeth.
- Do not put API keys or secrets anywhere in the prompt builder.
- Do not introduce a database.
- Do not introduce authentication.

Use the existing project conventions where applicable.

Add JSDoc comments to public functions.

--------------------------------------------------
IMPORTANT ARCHITECTURAL RULE
--------------------------------------------------

Do not implement the /api/interview endpoint in this sprint.

Do not implement the Interview Controller.

Do not implement the LLM Service.

Do not implement Breeth integration.

Do not implement feedback generation.

Do not modify frontend code.

Stop after the Prompt Builder is complete.

--------------------------------------------------
BEFORE WRITING CODE
--------------------------------------------------

First inspect the existing project and explain:

1. What data the Session Manager currently stores.
2. What candidate fields are actually available.
3. What curriculum fields are actually available.
4. What information the Prompt Builder should consume.
5. The proposed function signatures.
6. Which files will be created or modified.

Do not make changes until this analysis is complete.

--------------------------------------------------
AFTER IMPLEMENTATION
--------------------------------------------------

Provide:

1. Files created/modified.
2. Function signatures.
3. How each function works.
4. Example usage with existing project data.
5. How to test the functions locally.
6. Edge cases handled.
7. Any assumptions made.
8. Suggested Git commit message.
9. AI usage log entry.

Suggested commit:

feat: implement interview prompt builder

Stop after Sprint 4.