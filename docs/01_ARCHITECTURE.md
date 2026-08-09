# Architecture

## Overview

The Adaptive Interview Agent is a full-stack web application that conducts
personalized, adaptive technical interviews using an LLM and persistent memory.

The frontend is responsible only for user interaction.

The backend orchestrates the complete interview flow and maintains the
authoritative active interview state.

The LLM is responsible for interview question generation, adaptive
follow-ups, answer evaluation, and final feedback.

Breeth provides persistent memory for interview-related information.

---

# High-Level Architecture

```text
+-----------------------------+
|       React Frontend        |
|-----------------------------|
| Landing Page                |
| Candidate Selection         |
| Interview Interface         |
| Interview Progress          |
| Feedback Screen             |
+-------------+---------------+
              |
              | HTTP REST
              v
+-----------------------------+
|      Express Backend        |
|-----------------------------|
| Routes                      |
| Interview Controller        |
| Session Manager             |
| Candidate Loader            |
| Curriculum Loader           |
| Prompt Builder              |
| Groq LLM Service            |
| Breeth Service              |
+-------------+---------------+
              |
       +------+------+
       |             |
       v             v
+-------------+  +-------------+
|  Groq API   |  | Breeth MCP  |
|    LLM      |  | Persistent  |
|             |  |   Memory    |
+-------------+  +-------------+

Component Responsibilities
React Frontend

The React frontend is responsible for user interaction.

Responsibilities:

Candidate selection
Starting an interview
Displaying interview questions
Accepting candidate answers
Displaying interview progress
Rendering the completed interview feedback
Calling the backend API
Managing frontend interview UI state

React never generates interview questions or determines interview logic.

Express Backend

The Express backend is the central orchestration layer of the application.

Responsibilities:

Request validation
Candidate resolution
Session management
Interview orchestration
Interview progress tracking
Prompt construction
Calling the Groq LLM service
Persisting interview memory through Breeth
Final evaluation
Returning API responses

The backend is the brain of the application.

Session Manager

The Session Manager maintains the authoritative active interview state.

Responsibilities:

Create interview sessions
Store candidate information
Track conversation history
Track asked questions
Track candidate answers
Track interview progress
Track session status
Prevent invalid continuation of completed sessions

The client-provided sessionId is used as the primary interview-session
identifier.

The Session Manager is independent of both the LLM and Breeth.

Candidate and Curriculum Data

The application uses the datasets supplied by the organizers.

Primary data sources:

candidates.json
curriculum.json

Candidate information and curriculum information are loaded by the backend
and supplied to the prompt-building layer as required.

The application does not invent candidate or curriculum information that is
not available in the supplied data.

Prompt Builder

The Prompt Builder converts candidate information, curriculum context,
conversation history, and interview state into structured prompts for the LLM.

It provides prompts for:

Initial interview generation
Interview continuation
Adaptive follow-up questions
Final interview evaluation

The Prompt Builder does not call the LLM directly.

Groq LLM Service

The Groq LLM Service provides the interface between the backend and the Groq
API.

The model is configured through environment variables.

The LLM is responsible for:

Generating technical interview questions
Generating adaptive follow-up questions
Responding to candidate answers
Evaluating the completed interview
Generating structured final feedback

The LLM does not manage sessions or directly control application state.

Breeth MCP

Breeth provides the persistent memory layer for the application.

Responsibilities:

Persisting interview-related memory
Retrieving interview-related memory when required
Associating memory with deterministic interview-session group IDs

Breeth does not:

Decide interview flow
Generate interview questions
Manage active application sessions
Replace the Session Manager

The Session Manager remains the authoritative source of active interview state.

Breeth failures are handled without unnecessarily terminating the interview
flow.

Backend Request Flow
Starting an Interview
Client
  |
  | POST /api/interview
  | sessionId + candidate data
  v
Express Backend
  |
  v
Validate Request
  |
  v
Resolve Candidate
  |
  v
Create Session
  |
  v
Load Curriculum Context
  |
  v
Build Initial Prompt
  |
  v
Groq LLM Service
  |
  v
Generate First Interview Question
  |
  v
Update Session
  |
  v
Persist Relevant Memory
  |
  v
Return Response
Continuing an Interview
Candidate submits answer
          |
          v
    Express Backend
          |
          v
    Validate Request
          |
          v
    Retrieve Session
          |
          v
 Record Candidate Answer
          |
          v
   Update Progress
          |
          v
    Build Turn Prompt
          |
          v
    Groq LLM Service
          |
          v
Generate Next Question /
Adaptive Follow-up
          |
          v
    Update Session
          |
          v
 Persist Relevant Memory
          |
          v
    Return Response
Completing an Interview
Candidate submits final required answer
                 |
                 v
        Record Candidate Answer
                 |
                 v
          Update Progress
                 |
                 v
       Build Final Evaluation Prompt
                 |
                 v
          Groq LLM Service
                 |
                 v
        Structured Evaluation
                 |
                 v
        Validate Final Feedback
                 |
                 v
       Persist Interview Memory
                 |
                 v
        Return Final Feedback
                 |
                 v
        Interview Completed
Interview Lifecycle
Client provides sessionId
          |
          v
Candidate selected
          |
          v
Interview session created
          |
          v
Initial question generated
          |
          v
Candidate answers
          |
          v
Answer recorded
          |
          v
Progress updated
          |
          v
Next question / follow-up generated
          |
          v
Repeat
          |
          v
Required candidate responses completed
          |
          v
Final evaluation generated
          |
          v
Structured feedback returned
          |
          v
Interview marked completed

The interview progresses based on candidate responses that are actually
submitted.

The final evaluation is generated only after the required interview responses
have been collected.

Adaptive Interview Logic

The interview is not implemented as a static list of predetermined questions.

The LLM receives relevant candidate, curriculum, and conversation context and
generates the next interview response dynamically.

The system can therefore:

Ask questions related to the candidate's learning journey
Ask follow-up questions based on previous answers
Explore areas demonstrated by the candidate
Evaluate answers against the questions that were actually asked
Generate recommendations based on identified gaps

The final evaluator is instructed not to treat curriculum topics as candidate
gaps when those topics were never tested during the interview.

Final Feedback Flow

The final evaluation uses the actual interview conversation, candidate profile,
and curriculum context available to the evaluator.

The evaluation produces structured feedback containing:

Summary
Strengths
Gaps
Next learning steps

The evaluator is instructed to:

Cross-reference candidate answers with the corresponding interview
questions
Support identified gaps with evidence from questions actually asked
Avoid inventing unsupported weaknesses
Avoid treating untested curriculum topics as candidate gaps
Base recommendations on identified gaps
API Architecture

The backend exposes the required interview endpoint:

POST /api/interview

The endpoint supports:

Starting an interview
Continuing an existing interview
Returning the next interviewer response
Returning completion state
Returning structured final feedback

The complete request and response contract is documented in:

docs/03_BACKEND_API.md
Folder Structure
backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── data/
│   └── tests/
│
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── hooks/
    ├── services/
    ├── context/
    └── assets/

The exact implementation may contain additional supporting files and
configuration files.

External Services
Groq

Purpose:

Technical interview question generation
Adaptive follow-up generation
Candidate answer evaluation
Final interview evaluation

The Groq model is configured through environment variables.

Breeth MCP

Purpose:

Persistent interview memory
Interview-session memory retrieval
Long-term interview context

Breeth is accessed through the MCP integration implemented by the backend.

Engineering Principles

The project follows the following principles:

Modular design
Separation of concerns
Single responsibility per service
Reusable services
Async/await
Environment-based configuration
Input validation
Error handling
No hardcoded secrets
Incremental development
Feature-based Git commits
AI-assisted development with documented AI usage
Security and Configuration

API credentials are never hardcoded into source code.

The application uses environment variables for provider credentials.

Required provider credentials remain server-side and are never exposed to the
frontend.

Examples include:

GROQ_API_KEY
GROQ_MODEL
BREETH_API_KEY

Actual secret values must never be committed to the repository.

Deployment

The planned deployment architecture is:

React Frontend
      |
      | HTTPS REST API
      v
Express Backend
      |
      +------------+
      |            |
      v            v
   Groq API    Breeth MCP

Planned hosting:

Frontend → Vercel
Backend  → Render

Production environment variables must be configured on the respective hosting
platforms.

Final System Status

The MVP architecture is complete.

Completed components include:

React frontend
Express backend
Candidate and curriculum data layer
Session Manager
Prompt Builder
Groq LLM Service
Breeth MCP integration
Interview Controller
Interview orchestration
Structured final evaluation
Frontend API integration
Backend testing
Real Groq integration testing
Real Breeth integration testing

The remaining project phase is deployment and final end-to-end verification.