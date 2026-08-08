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
- [ ] Feedback Generator

---

## Frontend Progress

- [ ] Initialize React
- [ ] Landing Page
- [ ] Candidate Selector
- [ ] Chat Interface
- [ ] Feedback Screen
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
- [ ] Interview Controller
- [ ] Feedback Generator
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

Sprint 7 – Interview Orchestration

Status: ✅ Completed

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