# Project Memory

## Project Status

Adaptive Interview Agent

Status: ✅ MVP Completed

The backend, interview orchestration, LLM integration, Breeth MCP integration,
frontend, structured feedback flow, testing, and project documentation have
been implemented and verified.

The project is now moving to deployment and final end-to-end verification.

---

## Project Overview

The Adaptive Interview Agent is a full-stack AI-powered technical interview
system built for the ABTalks Vibe Coding Hackathon.

The system conducts personalized, multi-turn technical interviews based on:

- Candidate profile
- Candidate learning journey
- Completed curriculum
- Previous interview responses
- Interview session state

The agent dynamically generates interview questions and follow-ups, maintains
conversation context, and produces structured final feedback.

---

## Hackathon Requirements

The implementation satisfies the core requirements:

- [x] Conversational technical interview
- [x] Minimum 8-question interview flow
- [x] Multi-turn interaction
- [x] Adaptive/follow-up questions
- [x] Candidate response context maintained throughout the interview
- [x] Structured final feedback
- [x] Required HTTP endpoint implemented
- [x] Candidate-specific interview context
- [x] Persistent memory integration through Breeth MCP

The interview flow is designed so that candidate responses are recorded before
the next interview question is generated.

The final evaluation is generated only after the required interview responses
have been collected.

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
- [x] Interview Orchestration
- [x] Input validation
- [x] Completed-session protection
- [x] Unknown-session handling
- [x] Structured final evaluation
- [x] Backend test coverage for orchestration

---

## Frontend Progress

- [x] React application initialized
- [x] Landing Page
- [x] Candidate Selector
- [x] Interview Session Page
- [x] Chat Interface
- [x] Candidate response input
- [x] Interview progress display
- [x] Feedback Screen
- [x] API Integration
- [x] Completed interview state
- [x] In-progress interview state

---

## LLM Integration

Status: ✅ Completed

- Groq SDK installed
- Groq client implemented
- GROQ_API_KEY loaded from environment
- GROQ_MODEL configured through environment variables
- Initial interview prompt implemented
- Interview turn prompt implemented
- Final evaluation prompt implemented
- Real Groq completion tested successfully
- LLM response parsing implemented
- Final evaluation JSON validation implemented

### LLM Responsibilities

The LLM is responsible for:

- Generating interview questions
- Generating adaptive follow-up questions
- Responding to candidate answers
- Evaluating the completed interview
- Generating structured final feedback

The LLM does not manage session state directly.

---

## Breeth MCP Integration

Status: ✅ Completed

- MCP client SDK installed
- Breeth MCP server connected
- BREETH_API_KEY loaded from local environment
- add_episode integration implemented
- search integration implemented
- Deterministic session group IDs implemented
- Synthetic integration test session used
- Real Breeth write tested successfully
- Real Breeth retrieval tested successfully
- Breeth dashboard activity verified
- API key excluded from source control

### Breeth Usage

Breeth is used as the persistent interview-memory layer.

The backend maintains the authoritative active interview state through the
Session Manager and persists interview-related memory through Breeth.

Breeth failures are handled without unnecessarily terminating the interview
flow.

Breeth dashboard activity was verified during real integration testing.

The observed dashboard metrics are documented based on actual testing and are
not treated as a measure of production traffic.

---

## Interview Orchestration

Status: ✅ Completed

The interview controller coordinates:

1. Candidate/session validation
2. Candidate resolution
3. Session creation
4. Curriculum loading
5. Prompt construction
6. Groq generation
7. Candidate response recording
8. Interview progress tracking
9. Follow-up question generation
10. Completion detection
11. Final evaluation
12. Structured feedback storage
13. Breeth persistence

---

## Interview Flow

```text
Candidate selected
        |
        v
Start interview
        |
        v
Generate Question 1
        |
        v
Candidate Answer
        |
        v
Record answer + update progress
        |
        v
Generate next question / follow-up
        |
        v
Repeat
        |
        v
Required interview responses completed
        |
        v
Generate final evaluation
        |
        v
Structured feedback
        |
        v
Interview completed