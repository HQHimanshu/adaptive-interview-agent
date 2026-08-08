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