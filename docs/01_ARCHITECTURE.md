# Architecture

## Overview

The AI Interview Agent is a full-stack web application that conducts adaptive technical interviews using an LLM and persistent memory.

The frontend is responsible only for user interaction.

The backend orchestrates the interview flow.

The LLM performs reasoning and evaluation.

Breeth stores and retrieves interview memory.

---

# High-Level Architecture

```text
+-----------------------+
| React Frontend        |
|-----------------------|
| Candidate Selection   |
| Chat Interface        |
| Interview Screen      |
| Feedback Screen       |
+-----------+-----------+
            |
            | HTTP
            v
+-----------------------+
| Express Backend       |
|-----------------------|
| Routes                |
| Controllers           |
| Services              |
| Session Manager       |
| Prompt Builder        |
+-----+-----------+-----+
      |           |
      |           |
      v           v
+-----------+  +----------------+
| Breeth    |  | Claude/Gemini  |
| Memory    |  | LLM            |
+-----------+  +----------------+
```

---

# Component Responsibilities

## React

Responsible for

- Candidate Selection
- Displaying Questions
- Accepting Answers
- Rendering Feedback
- Calling Backend APIs

React never generates interview logic.

---

## Express Backend

Responsible for

- Request Validation
- Session Management
- Interview Orchestration
- Prompt Construction
- Calling Breeth
- Calling LLM
- Returning Responses

The backend is the brain of the application.

---

## Breeth

Responsible for

- Persisting interview memory
- Retrieving relevant memories
- Long-term context

Breeth never decides interview flow.

---

## LLM

Responsible for

- Interview Questions
- Follow-up Questions
- Answer Evaluation
- Final Feedback

The LLM never manages sessions.

---

# Backend Request Flow

Candidate submits answer

↓

Backend validates request

↓

Retrieve session

↓

Retrieve relevant memory from Breeth

↓

Build prompt

↓

Send prompt to LLM

↓

Receive response

↓

Update session

↓

Store important memory

↓

Return response

---

# Session Lifecycle

Interview starts

↓

Create sessionId

↓

Store candidate

↓

Track conversation history

↓

Track current question

↓

Track interview progress

↓

Interview ends

↓

Generate feedback

↓

Destroy session

---

# Folder Structure

backend/

src/

controllers/

routes/

services/

middleware/

config/

utils/

data/

tests/

frontend/

src/

components/

pages/

hooks/

services/

context/

assets/

---

# External Services

Claude / Gemini

Purpose

Reasoning

Breeth

Purpose

Memory

---

# Engineering Principles

- Modular Design
- Separation of Concerns
- One Responsibility per Service
- Async/Await
- Environment Variables
- Incremental Development
- Feature-Based Commits

---

# Deployment

Frontend

Vercel

Backend

Render

Communication

HTTPS REST API