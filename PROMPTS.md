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

# SPRINT 6 — BREETH MEMORY SERVICE

You are working inside the existing Adaptive Interview Agent repository.

IMPORTANT:
This is Sprint 6 only.
Do NOT implement Sprint 7 or any later feature.
Do NOT implement the interview controller.
Do NOT implement frontend code.
Do NOT implement deployment.
Do NOT rewrite existing working services unnecessarily.

Before making changes:

1. Read:
   - AI_PROJECT_CONTEXT.md
   - technical-spec.md
   - docs/01_ARCHITECTURE.md
   - docs/02_PROJECT_MEMORY.md
   - docs/03_BACKEND_API.md
   - docs/04_AI_USAGE_LOG.md
   - PROMPTS.md
   - backend/package.json
   - backend/src/services/sessionManager.js
   - backend/src/services/promptBuilder.js
   - backend/src/services/llmService.js
   - existing backend tests

2. Understand the existing architecture before writing code.

CURRENT ARCHITECTURE:

Frontend:
- React
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express
- REST API

Data:
- candidates.json
- curriculum.json

Services already implemented:
- Candidate Loader
- Curriculum Loader
- Data Cache
- Session Manager
- Prompt Builder
- Groq LLM Service

LLM:
- Groq
- Configurable model through environment variables
- GROQ_API_KEY must never be hardcoded

Memory:
- Breeth MCP
- Sprint 6 will implement the Breeth integration layer.

OBJECTIVE:

Create a reusable Breeth memory service that allows the backend to persist and retrieve interview-related memory using Breeth.

The service must be isolated from Express routes and the Interview Controller.

The service should provide a clean abstraction such as:

- initialize/configure Breeth connection
- save interview/session memory
- retrieve memory for a session
- optionally update existing session memory
- handle unavailable/malformed Breeth responses safely

IMPORTANT BREETH REQUIREMENT:

The organizers have provided Breeth API access and an MCP configuration.

Use the provided Breeth integration mechanism/documentation rather than inventing undocumented endpoints or request formats.

Do NOT assume a REST endpoint exists if the supplied Breeth MCP interface does not expose one.

First inspect the available Breeth MCP tools/integration information and determine the correct mechanism for:
- storing memory
- retrieving memory
- identifying the interview/session memory

If the MCP integration is not directly callable from the Node.js backend yet, do NOT fake an implementation.

Instead:
1. Create the service abstraction/interface.
2. Document exactly what Breeth operation is required.
3. Add a clearly isolated adapter/integration point.
4. Keep the rest of the backend independent of the transport mechanism.

SESSION MEMORY MODEL:

Use the existing sessionId as the primary interview-session identifier.

Do NOT generate a second unrelated interview identifier.

Breeth memory should conceptually contain information such as:

{
  sessionId,
  candidateId,
  candidateProfile,
  interviewState,
  askedQuestions,
  answers,
  conversationHistory,
  progress,
  createdAt,
  updatedAt
}

Do not store secrets in memory.

Do not store the GROQ_API_KEY.

Do not store the Breeth API key.

SERVICE DESIGN:

Create a dedicated service, for example:

backend/src/services/breethService.js

Use the project's existing module style and naming conventions.

The service should expose a small, stable interface.

Prefer functions such as:

- saveSessionMemory(...)
- getSessionMemory(...)
- updateSessionMemory(...)

Use appropriate validation.

Handle:
- missing sessionId
- missing candidateId where required
- malformed memory payload
- unavailable Breeth integration
- empty memory results
- provider/API errors

Do not expose provider-specific details to callers unnecessarily.

ERROR HANDLING:

Errors should be descriptive but must never expose:
- API keys
- authorization headers
- secrets
- full sensitive provider responses

TESTING:

Create a focused Breeth service test.

The test must distinguish between:

1. configuration/validation testing
2. real Breeth integration testing

Do NOT silently claim a real Breeth call succeeded if it was only mocked.

If the provided MCP environment cannot be invoked from the Node.js test environment, create a safe adapter-level test and clearly document that the real MCP operation still requires integration through the supported runtime.

Do not introduce a fake Breeth API.

Do not invent URLs.

ENVIRONMENT:

If configuration is required, use environment variables.

Never commit actual credentials.

Update/create an appropriate .env.example if needed.

Do not modify .gitignore unless necessary.

DOCUMENTATION:

Update:

docs/02_PROJECT_MEMORY.md
docs/04_AI_USAGE_LOG.md
PROMPTS.md

Record:
- Sprint 6 objective
- Breeth integration architecture
- files created/modified
- testing performed
- whether the Breeth call was real, mocked, or adapter-only
- human verification performed

IMPORTANT:

Do not mark Sprint 6 as completed until the implementation and tests have actually been verified.

Do not modify the existing Groq LLM implementation unless required for compatibility.

Do not modify the Prompt Builder unless absolutely necessary.

Do not modify the frontend.

Do not create the Interview Controller.

STOP CONDITION:

After implementing and testing the Breeth service, stop.

Then report:

1. Files created
2. Files modified
3. Breeth integration mechanism used
4. Whether a real Breeth operation was successfully tested
5. Test commands executed
6. Test results
7. Any limitations
8. Suggested Git commit message

Do not continue to Sprint 7.

The hackathon organizers provided the following Breeth MCP configuration:

{
  "mcpServers": {
    "breeth": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.thebreeth.com/mcp",
        "--header",
        "Authorization: APIKey <REDACTED>"
      ]
    }
  }
}

This is the MCP configuration supplied by the organizers.

Use it as the reference for understanding how Breeth is intended to be accessed.

IMPORTANT:
- The actual API key is stored locally and must never be included in source code, prompts, Git commits, logs, or documentation.
- Do not invent Breeth endpoints or MCP tool names.
- Inspect/verify the available Breeth MCP interface before implementing calls.
- If the current Node.js backend cannot directly invoke MCP tools using the available project setup, create a clean adapter boundary rather than faking the integration.

Your application
      ↓
MCP Remote
      ↓
https://mcp.thebreeth.com/mcp
      ↓
Breeth

# SPRINT 6.1 — COMPLETE THE REAL BREETH MCP ADAPTER

Sprint 6 previously created the Breeth service abstraction, but the current
Breeth command adapter intentionally contains placeholder notImplemented()
methods.

We now have the official Breeth MCP tool definitions.

DO NOT invent tool names or payload formats.

Official Breeth MCP tools:

1. add_episode
   Arguments:
   - content: string, required
   - group_id: string, optional, default "default"
   - extract_intent: boolean, optional, default false

2. record_fact
   Arguments:
   - subject: string, required
   - predicate: string, required
   - object: string, required
   - group_id: string, optional, default "default"
   - extract_intent: boolean, optional, default false

3. search
   Arguments:
   - query: string, required
   - group_id: string, optional, default "default"
   - limit: integer, optional, 1–100

4. retract
   Arguments:
   - edge_uuid: string, required
   - reason: string, optional

For our interview agent we primarily need:

add_episode
search

Do not implement retract unless it is genuinely useful and easy to isolate.
Do not use record_fact unless there is a clear structured-memory use case.


OBJECTIVE :


Replace the placeholder Breeth MCP adapter with a real MCP client
implementation.

Current architecture:

Interview/session logic
        ↓
Breeth Service
        ↓
Breeth Memory Adapter
        ↓
MCP Client
        ↓
Breeth MCP server

The Breeth service API must remain stable:

- saveSessionMemory(memory)
- getSessionMemory(sessionId)
- updateSessionMemory(sessionId, memory)

Do not rewrite BreethService validation unnecessarily.


MCP CONNECTION :


The Breeth MCP endpoint is:

https://mcp.thebreeth.com/mcp

The hackathon-provided configuration uses:

npx
mcp-remote
https://mcp.thebreeth.com/mcp
--header
Authorization: APIKey <credential>

The actual API key must NEVER be hardcoded.

Use the local environment variable:

BREETH_API_KEY

If the current MCP client implementation can connect directly to the remote
Streamable HTTP endpoint while attaching the Authorization header, prefer that.

Use the official MCP TypeScript client SDK.

Do not create custom JSON-RPC code unless the SDK cannot support the required
operation.


DEPENDENCY :


Use:

@modelcontextprotocol/client

Do not use a random third-party MCP client.

Inspect the installed package/API before implementing.


AUTHENTICATION :


The real API key must come from:

process.env.BREETH_API_KEY

Never log it.

Never include it in:
- source files
- tests
- PROMPTS.md
- README
- Git commits
- error messages

The MCP endpoint URL may be configured using:

BREETH_SERVER

with this default:

https://mcp.thebreeth.com/mcp


MCP CLIENT BEHAVIOR :


The adapter should:

1. Create an MCP Client.
2. Connect using Streamable HTTP transport.
3. Attach the Breeth API key as the Authorization header.
4. Optionally discover available tools using listTools().
5. Verify that required tools exist:
   - add_episode
   - search
6. Call the appropriate tool using callTool().
7. Normalize the returned result for the Breeth service.

Do not blindly assume the tools exist.
If listTools() reports that add_episode or search is missing,
return a clear integration error.


MEMORY MAPPING :


Our existing memory object contains:

{
  sessionId,
  candidateId,
  candidateProfile,
  conversationHistory,
  askedQuestions,
  answers,
  progress
}

Breeth add_episode expects prose content.

Therefore convert the session memory into concise, meaningful prose.

For example:

"Interview session <sessionId> for candidate <candidateId>.
Candidate profile: ...
Interview progress: ...
Questions asked: ...
Candidate answers: ...
Conversation history: ..."

Do NOT dump arbitrary JavaScript objects into Breeth.

Do NOT store:
- GROQ_API_KEY
- BREETH_API_KEY
- Authorization headers
- system secrets

Use a stable group_id such as:

interview:<sessionId>

if Breeth accepts that value as a group namespace.

However, verify the group_id format supported by the actual tool and
keep it deterministic.


SAVE :


saveSessionMemory(memory) should call:

add_episode

with:

{
  content: <serialized interview memory>,
  group_id: <stable session group>,
  extract_intent: false
}

Do not enable extract_intent for every interview turn.

This is an interview memory system, not an intent-analysis experiment.


RETRIEVAL :


getSessionMemory(sessionId) should call:

search

with a focused natural-language query containing the session identifier,
for example:

"Interview session <sessionId> candidate interview history questions answers progress"

Use the appropriate group_id and a reasonable limit.

Do not assume the returned search structure is identical to the original
memory object.

Normalize the returned Breeth result into a useful memory representation.

If no memory is found, return null or the project's established empty-memory
convention.


UPDATE :


Breeth's documented MCP tools do not expose an "update episode" tool.

Therefore DO NOT invent updateSessionMemory as a Breeth update API.

For updateSessionMemory():

Option A:
Store a new episode representing the updated interview state.

Option B:
If the existing architecture makes update unnecessary at this stage,
document that update is implemented as an append-only memory event.

Prefer append-only memory because Breeth is an episode/memory system.

The important requirement is:
DO NOT pretend an update endpoint exists.


TESTING :


Create two test layers.

1. Unit/adapter tests:
   Mock the MCP client's:
   - connect()
   - listTools()
   - callTool()

   Verify:
   - add_episode is called with the expected payload.
   - search is called with the expected payload.
   - missing tools are detected.
   - provider errors are converted into controlled errors.
   - secrets are never included in errors.

2. REAL INTEGRATION TEST:

Create a clearly separated test that runs only when:

BREETH_API_KEY

is available.

The integration test must:

1. Connect to the real Breeth MCP endpoint.
2. List available tools.
3. Confirm add_episode exists.
4. Confirm search exists.
5. Write ONE small test memory using add_episode.
6. Search for that test memory.
7. Print only safe response information.
8. Never print the API key.

Do not run this integration test automatically as part of normal unit tests.

Use a separate command such as:

node test-breeth-integration.js

The integration test should clearly state that it performs a real Breeth
write/read operation.


SAFETY :


Do not use real candidate data for the first Breeth integration test.

Use a synthetic test candidate such as:

candidateId:
BREETH-TEST-001

sessionId:
breeth-test-session-001

Do not use Sarah Johnson or any organizer-provided candidate for the
integration test.


ENVIRONMENT :


Update:

backend/.env.example

with:

BREETH_API_KEY=
BREETH_SERVER=https://mcp.thebreeth.com/mcp

Do not modify backend/.env with fake values.

Do not expose the real API key.


DOCUMENTATION :


Update:

docs/02_PROJECT_MEMORY.md
docs/04_AI_USAGE_LOG.md
PROMPTS.md

Record:

- Breeth MCP tools discovered.
- add_episode selected for writes.
- search selected for retrieval.
- MCP client implementation.
- Whether real integration testing succeeded.
- The exact test command used.
- Any limitations.

Do not claim Breeth integration is complete until the real integration test
has actually succeeded.


IMPORTANT :


Do not modify:

- frontend
- Groq LLM service
- Prompt Builder
- Interview Controller
- Express API routes

unless a minimal compatibility change is absolutely required.

Do not proceed to Sprint 7.

STOP after:

1. MCP client implementation
2. Breeth adapter implementation
3. Unit tests

# Sprint 7 – Interview Orchestration

This sprint implements the interview orchestration layer in the backend using the existing service stack.
The implementation exposes `POST /api/interview` and coordinates:
- Session Manager
- Candidate and curriculum loader
- Prompt Builder
- Groq LLM Service
- Breeth memory persistence

Testing and verification:
- Added integration tests for start, continue, and unknown session flows
- Confirmed the existing backend test suite still passes
- Ensured the API returns the required `reply`, `done`, and final feedback fields without exposing internal prompts or secrets
4. Separate real integration test
5. Documentation

Then report:

- files created
- files modified
- installed dependencies
- discovered MCP tools
- exact MCP transport used
- unit test results
- real Breeth integration test result
- limitations
- suggested Git commit message

# Sprint 7.1 – Interview Agent Tuning & Hardening

SPRINT 7.1 — COMPLETE INTERVIEW ORCHESTRATION TEST COVERAGE

The core Interview Controller has been implemented and the current tests
successfully verify:

- START interview
- CONTINUE interview
- UNKNOWN SESSION -> 404

However, Sprint 7 is NOT complete because the completion/final-feedback
path and validation behavior have not been tested.

The current test runner also does not terminate cleanly unless
--test-force-exit is used.

DO NOT redesign the Interview Controller.
DO NOT change the existing service architecture.
DO NOT start frontend or deployment work.


OBJECTIVE


Complete Sprint 7 testing and fix the test lifecycle issue.


1. FIX TEST CLEANUP


Inspect backend/test-interview-orchestration.js.

Ensure every test properly cleans up its HTTP server and any resources it
creates.

Prefer:

await new Promise((resolve, reject) => {
    server.close((error) => {
        if (error) reject(error);
        else resolve();
    });
});

or an equivalent clean async shutdown.

Do not use process.exit() or test-force-exit as the solution.

The normal command:

node --test test-interview-orchestration.js

must terminate naturally.


2. ADD COMPLETION TEST


Add a test that drives an interview until completion.

Use a synthetic candidate.

Use the existing DEFAULT_TOTAL_QUESTIONS behavior.

Stub generateInterviewResponse so that:

- the first call returns an interview question
- the next interview call returns another question
- the final evaluation call returns valid JSON:

{
  "summary": "Test interview completed.",
  "strengths": ["Strong communication"],
  "gaps": ["Needs more system design depth"],
  "next": ["Practice system design interviews"]
}

The test must verify:

HTTP status = 200

done === true

reply === "Interview completed."

feedback exists

feedback.summary is a string

feedback.strengths is an array

feedback.gaps is an array

feedback.next is an array

The session must have status COMPLETED.


3. TEST COMPLETED SESSION


After completing an interview, send another:

POST /api/interview

{
  "sessionId": "<completed-session>",
  "message": "Can I continue?"
}

Verify:

HTTP 400

Do not create another question.


4. TEST INVALID REQUESTS


Add tests for:

A.

{}

Expected:

400

B.

{
  "message": "hello"
}

Expected:

400 or the appropriate existing validation response because
sessionId is missing.

C.

{
  "sessionId": ""
}

Expected:

400

D.

{
  "sessionId": "some-session",
  "message": ""
}

Expected:

400

Do not change the project's established error format merely for the tests.


5. VERIFY BREETH IS MOCKED


The automated orchestration tests must NOT consume real Breeth API calls.

Use the existing Breeth adapter mocking approach.

Verify that the test does not require:

BREETH_API_KEY

and does not contact:

https://mcp.thebreeth.com/mcp

The real Breeth integration remains in:

test-breeth-integration.js


6. VERIFY GROQ IS MOCKED


The automated orchestration tests must not consume real Groq API calls.

Use the existing llmService.generateInterviewResponse stubbing.

Do not remove the existing real test:

test-llm-service.js


7. TEST STATE


Verify that after a continuation:

- candidate answer is recorded
- assistant response is recorded
- progress is updated
- conversation history is preserved

Verify that completion stores feedback in the session.


8. TEST ISOLATION


Each test must use a unique sessionId.

Tests must restore:

llmService.generateInterviewResponse

and:

breethServiceModule.createBreethCommandAdapter

even if an assertion fails.

Prefer try/finally where appropriate.


9. RUN TESTS


Run:

node --test test-interview-orchestration.js

The expected final result should be:

tests: all expected tests
pass: all expected tests
fail: 0
cancelled: 0

And the process must return to the shell naturally without Ctrl+C.

Do NOT use:

--test-force-exit

as the permanent solution.


10. DOCUMENTATION


Do NOT mark Sprint 7 completed until all tests pass normally.

After the tests pass, update:

docs/02_PROJECT_MEMORY.md
docs/03_BACKEND_API.md
docs/04_AI_USAGE_LOG.md
PROMPTS.md

Record the actual tests that were implemented and passed.

Do not claim tests passed unless they actually passed.


STOP CONDITION


After completing the tests and cleanup:

1. Run the test suite.
2. Show the complete test result.
3. Show files changed.
4. Do not commit.
5. Do not push.
6. Do not start Sprint 8.

# Sprint 8 - Frontend - Initialization of Frontend and required components

Build "AB Talks", an AI-Powered Adaptive Technical Interview System
Build a fully functional, production-quality, responsive web app on Base44 (React + Tailwind + Vite, Base44 BaaS). This is a fully public app — wire NO auth routes; ignore the boilerplate Login/Register pages. Use only installed packages: React, Tailwind, shadcn/ui (@/components/ui/*), lucide-react, framer-motion, react-router-dom, date-fns, recharts, the pre-initialized base44 client (import { base44 } from '@/api/base44Client'). Do NOT install any new packages.

1. Brand & Design System
A monochrome brand (matching a pure black-on-white "AB Talks" monogram logo) with an electric indigo accent for all AI/interactive highlights.

Logo: use this exact URL as the brand mark via a plain <img> (not the Image component): https://media.base44.com/images/public/user_698786b2c559df9f425137fb/f5edf2971_logo.png. Create src/components/Logo.jsx exporting default Logo({ className }) that renders <img src={LOGO_URL} alt="AB Talks" className={className} draggable={false} />. Use it in nav, footer, and splash.

index.css tokens (exact values)
Add @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap'); as the first line, before @tailwind base;.
In :root, change font tokens to:
--font-heading: 'Sora', ui-sans-serif, system-ui, sans-serif;
--font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
--font-display: 'Sora', ui-sans-serif, system-ui, sans-serif;
Add brand tokens in :root: --brand: 245 80% 61%; and --brand-foreground: 0 0% 100%; (keep :root accent/primary as the default monochrome slate).
Keep .dark as-is. Body uses font-body (already in base layer).
tailwind.config.js
Add to theme.extend.colors:
brand: { DEFAULT: 'hsl(var(--brand))', foreground: 'hsl(var(--brand-foreground))' }
fontFamily already maps heading/body/display to the var tokens — leave as-is.
Design language
Generous whitespace, rounded-2xl/3xl cards, subtle borders (border-neutral-100), soft shadows on hover (hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)]), framer-motion entrance animations (opacity/y, ease [0.22,1,0.36,1]). Headings use font-heading. Buttons: primary = bg-neutral-900 text-white rounded-full hover:bg-neutral-800; outline = border-neutral-200 bg-white. Indigo (text-indigo-500, bg-indigo-50) only for AI accents, progress, and next-steps.
2. Routing (src/App.jsx)
Surgically edit (do NOT rewrite the scaffold — preserve AuthProvider, QueryClientProvider, Router, Toaster, ScrollToTop, AuthenticatedApp). Add imports for Layout (@/components/Layout), Landing, Program, Interview, Candidate (all @/pages/*). Inside AuthenticatedApp's <Routes>, add a layout route wrapping the four pages, keeping the existing catch-all:

<Route element={<Layout />}>
  <Route path="/" element={<Landing />} />
  <Route path="/program" element={<Program />} />
  <Route path="/interview" element={<Interview />} />
  <Route path="/candidate" element={<Candidate />} />
</Route>
<Route path="*" element={<PageNotFound />} />
3. Layout (src/components/Layout.jsx)
Sticky h-16 header (bg-white/80 backdrop-blur-xl, border-b border-neutral-100) with: Logo (left, h-7), centered desktop nav (Home, Program, Interview, Candidates — active = text-neutral-900 with a -bottom-px h-px bg-neutral-900 underline; inactive text-neutral-500 hover:text-neutral-900), and a right-side "Start Interview" button (<Sparkles/> + label, rounded-full bg-neutral-900 text-white, links to /interview). Mobile: hamburger (Menu/X from lucide) toggling a stacked menu. Footer: border-t border-neutral-100 bg-neutral-50, Logo + copyright. Uses <Outlet/> for page content. useLocation() to compute active link.

4. Splash (src/components/Splash.jsx)
Full-screen fixed inset-0 z-[100] bg-white overlay shown only on first visit per browser session (guard with sessionStorage key abt_splash_seen): if seen, render nothing. Otherwise show the Logo centered at w-[min(58vw,360px)] (framer-motion fade/scale-in), plus below it a tiny uppercase tracking-[0.35em] text-neutral-400 label "AI-Powered Technical Interviews" flanked by two h-px w-8 bg-neutral-300 rules. Auto-hide after 2300ms, set the sessionStorage flag, exit with a 0.7s opacity fade. Render <Splash/> at the top of the Landing page.

5. Entity — base44/entities/InterviewSession.jsonc
Create the full schema object:

session_id (string, unique human-readable e.g. ABT-XXXXXX)
candidate_name (string), email (string), role (string), experience (enum: Entry/Junior/Mid/Senior/Lead), focus_area (string)
status (enum: in_progress/completed, default in_progress)
messages (array of { role: "ai"|"candidate", content: string })
question_count (number, default 0)
feedback (object: summary string, strengths/gaps/next_steps arrays of string, overall_score number, recommendation string)
required: ["session_id","candidate_name","email"]
Never declare built-ins (id, created_date, updated_date, created_by_id). No RLS (public app).
6. Curriculum data (src/lib/curriculum.js)
Export default an object: { cohort: "AI Cohort · 31 days · 8 modules", modules: [...8 modules with n/title/days], days: [...31 day objects] }. Use the full 31-day curriculum (Environment & Tooling → Production & Capstone) — each day: { day, title, type, tools[], objectives[] }. Types include SETUP, BUILD, AI_CORE, LEARN, SHIP_IT, OPTIMIZE, CAPSTONE. (This is the source of truth for the Program page and for the AI evaluator's module references.)

7. Landing page (src/pages/Landing.jsx)
Render <Splash/> first.
Hero: subtle grid + radial-indigo-glow background (mask-image radial fade). Cohort badge (Sparkles + curriculum.cohort). H1: "Technical interviews," / gradient-indigo "conducted by AI." Subcopy. Two CTAs: "Start your interview" (→/interview) and "Explore the program" (→/program). Trust row: ✓ Adaptive questions · ✓ Unique session ID · ✓ Structured feedback · ✓ Program-aligned next steps.
Features grid (6 cards, lucide icons: BrainCircuit, MessagesSquare, ClipboardCheck, Route, Gauge, ShieldCheck): Adaptive Questioning, Conversal Interview, Structured Feedback, Program-Aligned, Quantified Score, Consistent & Fair. Each: black h-11 w-11 icon tile, title, body; hover lift.
How it works (bg-neutral-50 section): three numbered steps (Enter details → Interview with AI → Get structured feedback). Plus a black CTA bar "Ready to be interviewed?" → /interview.
All sections max-w-6xl px-5, framer-motion fade-in.
8. Program page (src/pages/Program.jsx)
Header with cohort badge + "The 31-day program" title.
Module selector: 8 buttons (sm:grid-cols-2 lg:grid-cols-4). Active = border-neutral-900 bg-neutral-900 text-white shadow-lg; inactive = white card, hover lift. Each shows 01..08 mono badge, title, "Days X–Y · N days".
Active module detail: card with Module number, title, day range, a "Test this module" button → /interview. Then each day as a sub-card: a "Day N" tile + title + a colored type Badge, a Tools list (chips) and Objectives list (ChevronRight bullets). Type→color map:
SETUP→sky, BUILD→emerald, AI_CORE→indigo, LEARN→amber, SHIP_IT→rose, OPTIMIZE→violet, CAPSTONE→neutral-900/white.
Uses useState(activeModule); detail re-animates on switch.
9. Interview — the core flow
Three focused components under src/components/interview/, orchestrated by src/pages/Interview.jsx.

9a. AI helper (src/lib/interviewAi.js)
export const TOTAL_QUESTIONS = 8;
Build a module summary string from curriculum.modules ("${n}. ${title} (days ${start}-${end})" joined by newlines) — this is fed to the evaluator.
generateSessionId(): ABT- + 6 random chars from "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".
getNextMessage(candidate, messages, questionsAnswered): calls base44.integrations.Core.InvokeLLM with response_json_schema { type:object, properties:{ message:string, is_closing:boolean }, required:[message,is_closing] }. Prompt: you are "AB Talks", an AI technical interviewer for the 31-day AI Engineering program; include candidate profile (name/role/experience/focus_area), the conversation transcript so far (Interviewer:/Candidate: lines), and questionsAnswered of 8. If first message → warmly welcome by name, explain the adaptive ~8-question format, then ask the FIRST technical question. Otherwise → one short acknowledgement of the last answer, then the NEXT adaptive question (adapt difficulty: deeper if strong, simplify/shift if weak; cover a balanced spread across Python, data, embeddings/vector search, LLMs/prompting, RAG, fine-tuning, agents/MCP, evaluation/deployment; ONE question per message). If questionsAnswered >= 8 → no more questions, give a friendly closing thanking them and saying you'll prepare feedback, set is_closing true. Return { message, is_closing }.
evaluateInterview(candidate, messages): calls InvokeLLM with schema { summary:string, strengths:string[], gaps:string[], next_steps:string[], overall_score:number, recommendation:string } (all required). Prompt: you are "AB Talks" evaluating a completed interview; include profile, full transcript, and the module summary above. next_steps MUST each reference a specific module number and/or day range based on the candidate's gaps (e.g. "Revisit Module 3: Embeddings & Vector Search (days 7-10) to strengthen cosine similarity intuition"). overall_score integer 0–100. recommendation ∈ {"Strong Candidate","Conditional — Needs Review","Needs More Preparation"}. Normalize array types defensively; default recommendation "Needs More Preparation".
transcriptText helper formats messages as Interviewer:/Candidate:.
9b. InterviewForm.jsx (src/components/interview/InterviewForm.jsx)
Centered max-w-xl card: "Step 1 of 2 · Candidate details" badge, "Before we begin" title, subcopy. Fields: Full name, Email (type=email), Target role (default "AI Engineer"), Experience level (5 pill buttons Entry/Junior/Mid/Senior/Lead, active = bg-neutral-900 text-white), Focus area (native <select> populated from curriculum.modules as "Module N: Title"). Validate name non-empty + email regex; show "Required"/inline error only after submit attempt. Submit button "Start interview" calls onStart(form).

9c. InterviewChat.jsx (src/components/interview/InterviewChat.jsx)
Props: { candidate, sessionId, sessionIdRecord:{id}, onComplete }. Full-height flex h-[calc(100vh-4rem)] column.

Header row: black Sparkles avatar + "AB Talks Interviewer" + mono sessionId (with Hash icon); right side: "Question {min(qa,8)}/8" + a 112px indigo progress bar (bg-indigo-500, width = qa/8).
On mount (once): call getNextMessage(candidate, [], 0) → append AI message → base44.entities.InterviewSession.update(record.id, { messages }) (catch errors silently; fallback welcome message on throw). Show a typing indicator while loading.
Messages: AI bubbles left (bg-neutral-100, black Sparkles avatar), candidate bubbles right (rounded-br-sm bg-neutral-900 text-white). whitespace-pre-wrap. Each animates in.
Typing indicator: three bouncing dots in a neutral-100 bubble (staggered animationDelay).
Send: textarea (Enter sends, Shift+Enter newline) + send button (Send icon). On send: append candidate answer, increment questionsAnswered, clear input, call runAiTurn(next, nextAnswered) → getNextMessage → append AI message → persist update with { messages, question_count }. If is_closing → call finalize(messages) (no more questions).
finalize: set evaluating, call evaluateInterview → update(record.id, { status:"completed", feedback, question_count }) → onComplete(feedback). Fallback feedback object on error.
When questionsAnswered >= 8: show a small emerald "Minimum questions reached — wrapping up." note. Disable input while loading/evaluating; placeholder "Preparing your feedback…" while evaluating.
9d. FeedbackCard.jsx (src/components/interview/FeedbackCard.jsx)
Modal overlay fixed inset-0 z-50 bg-black/40 backdrop-blur-sm with a centered max-w-2xl rounded-3xl bg-white shadow-2xl card (framer-motion scale-in).

Black header: "Interview complete" badge (Sparkles), "{name}, here's your evaluation" title, mono session id, and a circular SVG score ring (0–100, strokeDasharray of pct/100 * 276.46 on a white-15% track) with the number in the center, plus the recommendation (Star icon). Close X button top-right.
Body (scrollable): Summary section (indigo Sparkles). Two-column: Strengths (emerald CheckCircle2 bullets) and Gaps (rose AlertTriangle bullets). Then an indigo-tinted "Next steps — your program path" box listing numbered next_steps (indigo circular badges).
Footer: "View program" outline button (→/program, Route icon) and "New interview" black button (RotateCcw) — both call onRestart / onClose.
Empty arrays render graceful "Not enough signal…" / "No major gaps detected." placeholders.
9e. Interview.jsx (src/pages/Interview.jsx)
State: stage ("form"|"chat"), candidate, sessionId, recordId, feedback.

start(data): generate session id, set candidate/sessionId, base44.entities.InterviewSession.create({ session_id, candidate_name, email, role, experience, focus_area, status:"in_progress", messages:[], question_count:0 }) → store recordId (proceed in-memory if create fails) → setStage("chat").
complete(fb): setFeedback(fb) (chat stays mounted; card overlays on top).
restart(): clear everything back to form.
Render: form stage → <InterviewForm onStart={start}/>; chat stage → <div className="relative"><InterviewChat .../>{feedback && <FeedbackCard .../>}</div>. Crucial: do NOT remount InterviewChat for feedback — the card overlays the still-mounted chat (remounting would re-fire the welcome effect and create a duplicate session).
10. Candidate page (src/pages/Candidate.jsx)
Header: "Interview sessions" + subcopy about unique session IDs.
On mount: base44.entities.InterviewSession.list("-created_date", 50).
Stat row: Total sessions / Completed / Avg score (of completed).
Loading spinner; empty state (Inbox icon + "Start interview" CTA); else a 2-column layout: left = list of session buttons (mono session id with Hash, name, role · experience, and either a colored score chip — emerald ≥75, amber ≥50, rose <50 — or an amber "In progress" badge); right = sticky detail panel showing the selected session's full feedback (score block, summary, strengths/gaps, next steps) or "Select a session to view its feedback."
Reuse the same score→color logic as FeedbackCard.
11. Build-reliability rules (mandatory)
ESM only — never require()/module.exports. JSX only in .jsx. Hooks at top level only.
cn from @/lib/utils; createPageUrl from @/utils. Import shadcn primitives from their own file (Button from @/components/ui/button, Badge from @/components/ui/badge). Use @/ alias everywhere, never relative src/ paths.
Only import lucide icons that exist; alias any icon colliding with a component name.
Tailwind classes as literal strings (no dynamic bg-${x} — they get purged).
Let errors bubble (no try/catch) except: form validation, and the interview flow's LLM/persistence calls (those catch and fall back gracefully so the interview never dead-ends).
Each page/component its own file, ≤~50 lines where reasonable. Export every page/component as default, named like its file.
12. Done-criteria
Every flow finishes: splash fades → landing renders → program browses all 31 days → interview creates a unique session ID, welcomes the candidate, asks ≥8 adaptive questions, persists the transcript, then pops the structured feedback card (summary/strengths/gaps/program-aligned next steps + score) over the chat → candidate dashboard lists past sessions with feedback. No stubs, no dead-ends.

# Sprints 8.1 - Small changes 

In header the implement the glassmorphism effect and the sction i select it turn into black box.

In program option give option of select whole module day wise (means if i tap module 2 so there will day wise detail be display and just below the day give the button of completion and at side give button of start learning).

Increase the size of Logo.png in header.

Make a flash screen of logo in white color where logo is zoom in then enter to landing page.

# Sprints 8.2 - Header and logo changes 

In flash screen increase the size of  logo.

[curriculum.json] Analyse this and make the content in the module option through of 31 days program content with 8 modules.

# Sprints 8.3 - Changes in Top bar (header)

Make the sidely curve and make it professionnal header and give the space between the from above and side also.

# Sprints 8.4 - Changes in Frontend

FRONTEND DEVELOPMENT LOG
========================

Feature: Home Page / Hero Section

P01 - Homepage Background
Date:
Prompt:
Use the provided image as the homepage background.

P02 - Background Visibility
Date:
Prompt:
Increase background image visibility and reduce excessive opacity.

P03 - Hero Typography
Date:
Prompt:
Change hero text to white for better visibility.

P04 - Hero Spacing
Date:
Prompt:
Increase spacing between Interview/Explore Program CTAs
and the feature section.

P05 - Bottom Gradient
Date:
Prompt:
Reduce the white shade at the bottom of the background.

P06 - Fixed Background
Date:
Prompt:
Keep the background image fixed while scrolling.

P07 - Bottom Gradient Refinement
Date:
Prompt:
Further reduce the white bottom shade while maintaining
a smooth transition.

P08 - Header Layout
Date:
Prompt:
Remove the old white header section because the header
is now inside a box. Keep the background image visible
and maintain justified spacing between the header and
AI Cohort section.

# Sprint 9.1 - Integration 

You are working on the frontend integration of my Hackathon project: "Adaptive Interview Agent".

IMPORTANT:
The backend is ALREADY COMPLETE and FROZEN.
The frontend UI is ALSO ALREADY COMPLETE and should NOT be redesigned or unnecessarily rewritten.

Your task is to INTEGRATE the existing React frontend with the existing Express backend while preserving the current UI/UX.

DO NOT redesign the frontend.
DO NOT rewrite the backend.
DO NOT change the backend API contract unless absolutely required to fix a genuine contract mismatch.
DO NOT introduce authentication.
DO NOT add unnecessary libraries.
DO NOT replace the existing visual design.

==================================================
PROJECT ARCHITECTURE
==================================================

Frontend:
- React
- Vite
- React Router
- Existing polished UI
- Frontend runs on localhost:5173

Backend:
- Node.js
- Express
- Groq SDK / LLM
- Breeth MCP
- Backend runs on localhost:3000
- Backend endpoint:

POST /api/interview

The Vite proxy is already configured:

server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}

Therefore frontend requests should continue using:

fetch('/api/interview', ...)

Do NOT replace this with a hardcoded localhost:3000 URL.

==================================================
AUTHORITATIVE HACKATHON API CONTRACT
==================================================

The technical specification requires exactly one interview endpoint:

POST /api/interview

No authentication is required.

The supplied sessionId maintains interview state.

START REQUEST:

POST /api/interview

{
  "sessionId": "abc-123",
  "candidate": { ...candidate data... }
}

Expected response:

{
  "reply": "Welcome. Let's begin your interview.",
  "done": false
}

SUBSEQUENT TURN:

POST /api/interview

{
  "sessionId": "abc-123",
  "message": "candidate answer"
}

Expected response:

{
  "reply": "next question...",
  "done": false
}

FINAL RESPONSE:

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

The feedback fields are exactly:

summary: string
strengths: string[]
gaps: string[]
next: string[]

The frontend must trust the backend's `done` field to determine completion.

Do NOT determine interview completion purely from frontend question counting.

==================================================
CURRENT FRONTEND API SERVICE
==================================================

There is already:

src/services/api.js

It currently contains:

api.startInterview(sessionId, candidate)

which sends:

POST /api/interview

{
  sessionId,
  candidate
}

and:

api.sendInterviewMessage(sessionId, message)

which sends:

POST /api/interview

{
  sessionId,
  message
}

THIS API SERVICE IS ALREADY CORRECT.

Reuse it.

Do not duplicate fetch() calls throughout React components.

==================================================
CRITICAL CURRENT PROBLEM
==================================================

The current frontend interview page is STILL MOCKED.

File:

src/pages/Interview/InterviewSession.jsx

Currently it:
- imports getSession/updateSession from ../../lib/storage
- contains MOCK_QUESTIONS
- generates questions locally
- uses setTimeout() to simulate AI thinking
- generates fake feedback using generateFeedback()
- updates local mock session storage
- calculates question count from frontend messages

THIS MUST BE REPLACED WITH REAL BACKEND COMMUNICATION.

The existing UI/CSS/layout should remain intact.

Only replace the underlying interview logic.

==================================================
REAL INTERVIEW FLOW
==================================================

The final behavior must be:

Candidate Form
    ↓
Create/generate sessionId
    ↓
Navigate to InterviewSession
    ↓
InterviewSession calls:

api.startInterview(sessionId, candidate)

    ↓
POST /api/interview
    ↓
Backend returns Q1
    ↓
Display backend reply in existing chat UI

Then:

Candidate enters answer
    ↓
api.sendInterviewMessage(sessionId, answer)
    ↓
POST /api/interview
    ↓
Backend returns next question
    ↓
Display next question

Repeat until backend returns:

done: true

Then:

Display evaluation/feedback using:

feedback.summary
feedback.strengths
feedback.gaps
feedback.next

DO NOT generate feedback on the frontend.

DO NOT use generateFeedback().

DO NOT use MOCK_QUESTIONS.

DO NOT use artificial setTimeout() to simulate the backend.

==================================================
Q8 REQUIREMENT
==================================================

This is extremely important.

There are 8 minimum questions.

The correct sequence is:

Q1
↓
Answer 1
↓
Q2
↓
Answer 2
↓
...
↓
Q7
↓
Answer 7
↓
Q8
↓
Answer 8
↓
FINAL EVALUATION

Q8 itself is a real interview question.

The frontend must NOT show feedback immediately when Q8 appears.

The candidate MUST be allowed to answer Q8.

Only after sending the Q8 answer to:

POST /api/interview

and receiving:

{
  "done": true,
  "feedback": {...}
}

should the frontend show the feedback.

The backend is the source of truth.

==================================================
QUESTION PROGRESS
==================================================

Do not calculate question progress using:

Math.floor(messages.length / 2)

Do not infer backend progress from chat message count.

The frontend should maintain a UI progress state based on actual interview turns/backend responses.

At minimum the UI should correctly show:

QUESTION 1/8
QUESTION 2/8
...
QUESTION 8/8

When Q8 is displayed, it must still allow an answer.

After the final answer, show evaluation state.

If the backend already returns progress/currentQuestion/totalQuestions, use those values.

If it does not, maintain only the minimal frontend display state necessary to represent the current question without interfering with backend state.

==================================================
LOADING STATES
==================================================

Use real request states.

After submitting an answer:

Show the existing typing/loading UI, but it must correspond to the actual API request.

Example:

AI is thinking...

Disable:
- input
- submit button

while the request is pending.

After Q8 answer:

Show:

Evaluating your interview...

until the final response containing feedback arrives.

Do not use fake fixed delays.

==================================================
ERROR HANDLING
==================================================

Handle:
- network failure
- HTTP 400
- HTTP 404
- HTTP 500
- malformed response
- completed session
- duplicate submission

Never send duplicate requests if the user clicks submit multiple times.

The submit button must be disabled while a request is in progress.

If an API request fails, preserve the candidate's typed answer when possible and show a useful retry state.

==================================================
CANDIDATE DATA REQUIREMENT
==================================================

This is VERY IMPORTANT.

The current CandidateForm contains frontend fields:

- name
- email
- role
- experience
- focusAreas

Current implementation creates:

createSession(formData)

and stores the frontend form object.

This is NOT sufficient as the final backend candidate payload unless those fields exactly match the backend's candidate schema.

The supplied candidate dataset is:

candidates.json

Its candidate records contain:

member:
  id
  name
  jobRole
  yearsExperience
  education
  status

missions:
  day
  title
  passed
  skipped
  attempts

signals:
  commitDays
  missionsCompleted
  missionsFirstTry

Example candidate structure:

{
  "member": {
    "id": "CAND-001",
    "name": "Sarah Johnson",
    "jobRole": "Senior Data Engineer",
    "yearsExperience": 9,
    "education": "MS Computer Science",
    "status": "COMPLETED"
  },
  "missions": [...],
  "signals": {
    "commitDays": 28,
    "missionsCompleted": 30,
    "missionsFirstTry": 20
  }
}

IMPORTANT:
Do NOT invent candidate fields.
Do NOT fabricate education.
Do NOT fabricate mission history.
Do NOT fabricate signals.
Do NOT send arbitrary UI-only fields to the backend merely because they exist in the form.

The candidate object sent to the backend must conform to the ACTUAL candidate schema expected by the backend and the supplied candidate.json specification.

Before changing the CandidateForm, inspect the backend code and determine exactly which candidate object shape the backend consumes.

The technical specification explicitly states that:

"The candidate object will follow the provided candidate.json schema."

Therefore the backend's expected candidate object and the supplied candidate JSON are authoritative.

==================================================
CANDIDATE FORM / JSON MAPPING
==================================================

The existing UI currently collects:

name
email
target role
experience level
focus areas

We need to distinguish between:

1. UI-only fields
2. Candidate-schema fields
3. Data required by the backend

Do NOT blindly send all formData.

Create a clear mapping layer.

For example, conceptually:

const candidatePayload = {
   // ONLY fields actually required by candidate schema
};

The exact fields must be determined by inspecting:
- backend candidate handling
- supplied candidates.json
- technical-spec.md

If a required candidate-schema field is not currently collected by the form, decide the MINIMAL correct UI change needed to collect it.

Do not silently substitute fake values.

If a field is not required by the actual backend candidate schema, do not send it.

==================================================
EMAIL / FOCUS AREAS / EXPERIENCE
==================================================

The current form collects email, experience level and focusAreas.

These fields must NOT automatically be added to candidatePayload just because the UI collects them.

Determine whether they belong in the backend candidate schema.

If they are not part of the required candidate JSON:
- they may remain frontend metadata if useful for UI
- but they must not pollute the backend candidate object

If a form field maps to an existing candidate field, map it explicitly.

For example:

role → jobRole

experience → yearsExperience

ONLY if that mapping is semantically correct and supported by the backend.

Do not map arbitrary values such as:
"Mid" → 5
unless the application already defines an explicit mapping.

If such a mapping is necessary, implement it transparently and document it.

==================================================
SESSION ID
==================================================

The backend requires the same sessionId throughout the entire interview.

Generate/use exactly ONE sessionId when starting an interview.

Example:

CAND-TEST-008

or the project's existing UUID/session generation mechanism.

Do not generate a new sessionId for every answer.

The same sessionId must be used for:

startInterview(sessionId, candidate)

and every:

sendInterviewMessage(sessionId, message)

==================================================
LOCAL STORAGE
==================================================

The current frontend uses:

src/lib/storage

Do NOT delete it blindly.

Inspect it.

It may still be useful for:
- candidate UI state
- session ID
- navigation
- local UI persistence

But the actual interview state must belong to the backend.

Do NOT allow localStorage/mock storage to become the source of truth for:
- questions
- answers
- adaptive state
- evaluation
- feedback

Backend is the source of truth for those.

==================================================
FEEDBACK PAGE / MODAL
==================================================

The frontend already has:

EvaluationModal
FeedbackPage

Reuse the existing design.

Adapt them to consume the REAL backend feedback:

feedback.summary
feedback.strengths
feedback.gaps
feedback.next

Do NOT display:
- fake score 85
- "Strong Candidate (Mock)"
- "Technical depth is simulated"
- "Needs real backend"

These are mock values and must be removed from the real interview path.

Do not invent a score if the backend does not return one.

The hackathon feedback contract contains only:

summary
strengths
gaps
next

Therefore the frontend must not manufacture a score.

==================================================
IMPORTANT EVALUATION RULE
==================================================

The evaluator must only evaluate what was actually tested.

A curriculum topic that was never asked must NOT automatically become a gap.

Do not implement frontend logic that creates gaps from curriculum coverage.

The backend evaluator is responsible for evaluation.

Frontend only renders:

feedback.gaps

==================================================
CURRICULUM
==================================================

The supplied curriculum has 8 modules:

1. Environment & Tooling
2. Data Foundations
3. Embeddings & Vector Search
4. LLM Core, Prompting & Fine-Tuning
5. Chatbot Application Build
6. Agentic AI & MCP
7. Evaluation, Security & Deployment
8. Production & Capstone

The existing focus-area UI may continue to display these modules.

However, do not assume that selecting a focus area means the candidate demonstrated knowledge of it.

The backend decides which questions are asked and what is evaluated.

==================================================
UI PRESERVATION
==================================================

The current frontend is already visually designed.

Preserve:
- navbar
- typography
- spacing
- cards
- buttons
- chat bubbles
- icons
- responsive behavior
- CSS
- existing routing
- existing page structure

Do NOT replace the UI with a generic chat interface.

Only modify data flow and state management required for backend integration.

==================================================
FILES TO INSPECT
==================================================

Inspect these files before making changes:

Frontend:

src/services/api.js
src/pages/Interview/InterviewSession.jsx
src/pages/FeedbackPage.jsx
src/pages/SetupPage.jsx
src/pages/LandingPage.jsx
src/lib/storage.*
src/components/Interview/*
src/pages/*

Backend:

server.js
routes
controllers
services
session manager
prompt builder
Groq service
Breeth service
candidate data handling
package.json

Data:

candidates.json
curriculum.json

Specification:

technical-spec.md

==================================================
EXPECTED RESULT
==================================================

After your changes, this must work end-to-end:

1. User opens frontend.
2. User fills candidate details.
3. Frontend creates one sessionId.
4. Frontend creates the correctly shaped candidate JSON object.
5. Frontend navigates to interview.
6. InterviewSession calls api.startInterview().
7. Backend returns Q1.
8. Q1 appears in existing chat UI.
9. Candidate submits answer.
10. Frontend calls api.sendInterviewMessage().
11. Backend returns Q2.
12. Continue adaptively.
13. Q8 appears.
14. Candidate can answer Q8.
15. Frontend sends Q8 answer.
16. Backend returns done:true + feedback.
17. Frontend displays "Evaluating..." while request is pending.
18. Feedback UI displays the real:
    - summary
    - strengths
    - gaps
    - next
19. No mock questions remain in the real interview flow.
20. No fake feedback remains.
21. No artificial setTimeout-based AI simulation remains.
22. No frontend logic determines what technical gaps the candidate has.
23. No duplicate requests occur.
24. Backend remains unchanged unless a genuine integration bug is found.

==================================================
VALIDATION
==================================================

After implementation, run:

npm run build

and fix all frontend build/lint/runtime errors.

Then test the complete flow manually:

Start
→ Q1
→ Answer 1
→ Q2
→ Answer 2
→ ...
→ Q7
→ Answer 7
→ Q8
→ Answer 8
→ Evaluating
→ Feedback

Also verify in browser DevTools → Network:

POST /api/interview

First request payload:

{
  sessionId,
  candidate
}

Subsequent request payload:

{
  sessionId,
  message
}

Final response:

{
  done: true,
  feedback: {
    summary,
    strengths,
    gaps,
    next
  }
}

==================================================
VERY IMPORTANT FINAL RULE
==================================================

Do not stop after making the UI appear connected.

The integration is only complete if the actual Groq-powered backend is generating the questions and the actual backend evaluator is generating the final feedback.

The frontend should become a thin presentation/client layer over the existing backend.

Before finishing, provide:
1. Files changed
2. What was changed in each file
3. Final candidate JSON shape being sent
4. Exact API request flow
5. Any assumptions made
6. Any backend issues discovered
7. Build/test result

# Sprint 9.2 - further changes in integration

Update the existing frontend interview page using the two attached reference images. Keep the current project theme, but make the interview interface look like a clean, premium professional technical interview environment — not overly flashy or exaggerated.

Use the SECOND image as the main reference for the Module + Day structure. Show the candidate's current Module, Day and progress, including the existing candidate.json fields such as passed, skipped and attempts. Use the actual candidate.json schema already present in the project; do not invent fields or values.

Fix the current HTTP 404 issue when entering the interview. After the candidate data is collected, navigate to the frontend /interview page and initialize the interview using:

POST /api/interview

{
  "sessionId": "...",
  "candidate": { ...candidate.json }
}

The backend response:

{
  "reply": "...",
  "done": false
}

must appear directly as the AI interviewer's chat message.

Whenever the candidate submits an answer, send:

POST /api/interview

{
  "sessionId": "...",
  "message": "candidate answer"
}

Use the SAME sessionId for the entire interview.

Maintain the complete interview history so all previous questions and answers remain accessible. Add a compact question/history navigation so the candidate can click previous questions and review them.

Improve the chat UI with clear separation between interviewer and candidate messages, a professional answer input area, loading state while the backend is responding, and proper error handling. Keep the design focused and premium without excessive animations, neon effects, or unnecessary UI.

When the backend returns:

{
  "done": true,
  "feedback": {
    "summary": "...",
    "strengths": [],
    "gaps": [],
    "next": []
  }
}

treat the interview as completed. Disable further answers, preserve the complete transcript, and show the feedback report using exactly the returned summary, strengths, gaps and next fields.

Important:
- Do NOT modify the backend.
- Do NOT change the API contract.
- Do NOT hardcode interview questions.
- Do NOT create mock API responses.
- Inspect the existing frontend routing, API service, candidate.json and interview components before making changes.
- Fix the actual cause of the 404.
- Test the complete flow from candidate data → /interview → POST /api/interview → conversation → done:true → feedback.

