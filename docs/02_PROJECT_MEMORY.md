# Project Memory

## Project Status

Sprint 6 – Breeth MCP Integration

Status: ✅ Completed

---

## Completed

- Repository initialized
- Project documentation created
- AI Project Context defined
- Architecture finalized
- Technical specification added
- Curriculum dataset added
- Candidate dataset added
- Backend initialized
- Data Layer completed
- Session Manager implemented
- Prompt Builder implemented
- Groq LLM Service implemented
- Breeth MCP integration implemented
- Real Breeth write/read integration tested

---

## Backend Progress

- [x] Initialize Express
- [x] Configure project
- [x] Candidate Loader
- [x] Curriculum Loader
- [x] Data Cache
- [x] File Reader
- [x] Path Configuration
- [x] Session Manager
- [x] Prompt Builder
- [x] Breeth Service / MCP Adapter
- [x] LLM Service
- [x] Interview Controller
- [x] Feedback Generator

---

## Frontend Progress

- [x] Initialize React
- [x] Landing Page
- [x] Candidate Selector
- [x] Chat Interface
- [x] Feedback Screen
- [ ] API Integration

---

## Breeth MCP Integration

Status: ✅ Completed

- MCP client SDK installed
- Breeth MCP server connected
- BREETH_API_KEY loaded from local environment
- add_episode integration implemented
- search integration implemented
- Deterministic session group IDs implemented
- Synthetic test session used for integration testing
- Real Breeth write tested successfully
- Real Breeth retrieval tested successfully
- Breeth dashboard activity verified
- API key excluded from source control

---

## LLM Integration

Status: ✅ Completed

- Groq SDK installed
- Groq client implemented
- GROQ_API_KEY loaded from local environment
- GROQ_MODEL configured through environment variables
- Initial interview prompt tested
- Interview turn prompt tested
- Final evaluation prompt tested
- Real Groq completion tested successfully

---

## Current API

### POST /api/interview

Status: ✅ Implemented and tested

The endpoint supports:

1. Starting a new interview using `sessionId` and candidate data.
2. Continuing an existing interview using `sessionId` and candidate message.
3. Returning `reply` and `done`.
4. Returning structured feedback when the interview is complete.

The endpoint contract is implemented according to the technical specification and
`docs/03_BACKEND_API.md`.

---

## Infrastructure

- [x] Repository
- [x] Documentation
- [x] Backend initialization
- [x] Data layer
- [x] Prompt builder
- [x] Groq LLM integration
- [x] Breeth MCP integration
- [x] Real integration testing
- [x] Full backend testing
- [x] Interview Controller
- [x] Feedback Generator
- [ ] Frontend
- [ ] Deployment
- [ ] README Finalization
- [ ] PROMPTS.md Finalization

---

## Known Decisions

- React frontend
- Express backend
- REST API
- Breeth MCP for persistent memory
- Groq as the LLM provider
- Groq SDK for backend LLM communication
- Model configured through environment variables
- No authentication
- JSON datasets provided by organizers
- Client-provided `sessionId` is used for interview state
- Deterministic Breeth group IDs based on session ID
- Append-oriented memory strategy for interview state
- API keys stored only in local environment variables
- Incremental Git commits
- AI usage documented throughout development

---

## Current Sprint

---

## Sprint 7.1 – Interview Agent Tuning & Verification

Status: ✅ Completed

### Interview Orchestration Improvements

- Refined interview start and continuation flow
- Ensured candidate responses are recorded before generating the next interview question
- Ensured the final interview response is processed before final evaluation
- Improved interview completion handling
- Improved completed-session protection
- Added validation for invalid requests
- Added unknown-session handling
- Verified structured final feedback generation

### Final Evaluation Improvements

- Tuned the final evaluation prompt to evaluate only the interview conversation, candidate profile, and curriculum context actually provided to the evaluator
- Gaps must be supported by questions that were actually asked
- Curriculum topics that were not tested are not treated as candidate gaps
- Candidate answers are cross-referenced with the corresponding interview questions
- Unsupported or invented weaknesses are discouraged
- Recommendations are based only on identified gaps

### Testing

The interview orchestration test suite was executed using:

node test-interview-orchestration.js

Result:

- 6 tests passed
- 0 tests failed
- Start flow verified
- Continue flow verified
- Completion flow verified
- Completed-session rejection verified
- Invalid-request handling verified
- Unknown-session handling verified

### Breeth Verification

Breeth MCP integration was tested using the project's real integration path.

The Breeth dashboard currently shows:

- 23 writes
- 1 retrieval
- 0 intents
- 0 knots

Multiple tests were performed during development. The dashboard count is recorded exactly as observed rather than assuming every test resulted in a retrieval.

### Current Backend Status

The backend MVP orchestration layer is functionally verified.

The remaining major development phase is frontend implementation and integration.

---

## Next Sprint

Sprint 8 – TBD

### Objectives

- Stabilize interview flow
- Improve session persistence
- Add frontend integration
- Prepare deployment and monitoring

---

## Sprint 7 Architecture

```text
POST /api/interview
        |
        v
Interview Controller
        |
        +------------------+
        |                  |
        v                  v
Session Manager       Candidate/Curriculum
        |
        v
Breeth Memory
        |
        v
Prompt Builder
        |
        v
Groq LLM Service
        |
        v
Interview Response
        |
        +----> Session Update
        |
        +----> Breeth Memory