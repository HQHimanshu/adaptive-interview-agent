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

# Sprint 2 – Data Layer

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

# Sprint 5 – Groq LLM Service Integration

SPRINT 5 — GROQ LLM SERVICE INTEGRATION

You are continuing the existing Adaptive Interview Agent project.

IMPORTANT:
Do not redesign the architecture.
Do not rewrite working Sprint 0–4 code.
Do not start frontend work.
Do not implement Breeth/MCP in this sprint.
Do not invent APIs, schemas, or project requirements.

First inspect the existing repository and understand:
- AI_PROJECT_CONTEXT.md
- technical-spec.md
- docs/01_ARCHITECTURE.md
- docs/02_PROJECT_MEMORY.md
- docs/03_BACKEND_API.md
- docs/04_AI_USAGE_LOG.md
- docs/05_GIT_WORKFLOW.md
- PROMPTS.md
- backend/src/services/
- backend/src/routes/
- backend/src/middleware/
- backend/app.js
- backend/server.js
- backend/package.json
- backend/.env
- the existing Prompt Builder from Sprint 4

The existing Prompt Builder is already implemented and exports:
- buildInitialInterviewPrompt
- buildInterviewTurnPrompt
- buildFinalEvaluationPrompt

SPRINT OBJECTIVE

Implement the LLM Service layer using Groq's official JavaScript SDK (`groq-sdk`).

The service must sit between the interview/application logic and the Groq API.

Architecture:

POST /api/interview
        ↓
Interview Controller
        ↓
Session Manager
        ↓
Prompt Builder
        ↓
Groq LLM Service
        ↓
Groq API
        ↓
Generated response
        ↓
Session updated
        ↓
API response

REQUIREMENTS

1. Create a dedicated LLM service, for example:

backend/src/services/llmService.js

Use the already installed `groq-sdk`.

2. Load credentials only from environment variables:

GROQ_API_KEY
GROQ_MODEL

Never hardcode the API key.
Never log the API key.
Never expose the API key to the frontend.

The API key is located in:
backend/.env

The repository already ignores `.env`.

3. Use the Groq SDK rather than manually constructing HTTP requests.

4. Use the configured model from:

process.env.GROQ_MODEL

If the project already has a sensible fallback model, document it rather than silently inventing one.

5. Implement a clean service API such as:

generateInterviewResponse(prompt)

The exact interface should fit the existing architecture rather than forcing unnecessary changes.

6. The service should accept the structured prompt generated by Prompt Builder.

The Prompt Builder currently returns sections such as:
- system
- candidateContext
- curriculumContext
- interviewState
- conversationHistory
- instruction

Convert these sections into the appropriate LLM messages without losing context.

7. Support:
- initial interview generation
- interview turn generation
- final evaluation generation

Do not duplicate prompt-building logic inside the LLM service.

8. Handle failures properly.

The service should distinguish reasonable categories such as:
- missing API key
- invalid configuration
- Groq/API failure
- malformed/empty model response

Do not expose raw secrets or unnecessarily sensitive provider details in API responses.

9. Do not silently swallow errors.

Errors should propagate to the existing backend error-handling middleware.

10. Keep the service testable.

If appropriate, structure the implementation so the Groq client can be mocked/tested without making real API calls.

11. Do not implement session management in this sprint unless existing code requires a minimal integration point.

12. Do not change the required API contract from technical-spec.md:

POST /api/interview

The final API contract must eventually return:

{
  "reply": "...",
  "done": false
}

or when complete:

{
  "reply": "Interview completed.",
  "done": true,
  "feedback": {
    "summary": "...",
    "strengths": [],
    "gaps": [],
    "next": []
  }
}

For this sprint, focus on the LLM service rather than completing the entire interview controller.

TESTING

Create or update a small backend test/manual test that verifies:

1. The service can initialize with the environment configuration.
2. A structured Prompt Builder output can be converted into LLM messages.
3. A real Groq request works when GROQ_API_KEY is available.
4. The generated response is returned as a string.
5. Configuration/API errors are handled cleanly.

Do not print the API key.

If a real API call is used for testing, clearly document that it is an integration test.

DOCUMENTATION

After implementation:

1. Update docs/02_PROJECT_MEMORY.md:
   - mark LLM Service as completed
   - record the chosen Groq model
   - record the current Sprint 5 status
   - record the next sprint

2. Update docs/03_BACKEND_API.md only where the LLM integration affects the API contract.

3. Add a Sprint 5 entry to docs/04_AI_USAGE_LOG.md containing:
   - time
   - AI tool
   - purpose
   - output
   - human review/changes

4. Update PROMPTS.md with this Sprint 5 prompt or a concise record of the prompt used.

5. Do not fabricate testing results. Only document tests that were actually run.

GIT WORKFLOW

Before changing files:
- inspect the repository
- explain which files you intend to create/modify

After implementation:
- run the relevant tests
- inspect git diff
- summarize what changed
- explain how to manually test the Groq integration
- provide ONE suggested Git commit message

IMPORTANT DEVELOPMENT RULE

Work incrementally.

Do not generate unrelated files.
Do not proceed to Sprint 6.
Stop after Sprint 5 LLM Service Integration and documentation.

Before making changes, briefly state:
1. What you found.
2. Which files you will modify/create.
3. How the implementation will fit the existing architecture.

Then implement the sprint.