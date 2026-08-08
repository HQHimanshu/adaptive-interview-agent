# Backend API

## Overview

The AI Interview Agent exposes a single HTTP endpoint.

```http
POST /api/interview
```

No authentication is required.

The endpoint maintains interview state using the `sessionId` supplied by the client.

---

# Endpoint

## POST /api/interview

Starts a new interview or continues an existing interview session.

### Request Headers

```http
Content-Type: application/json
```

---

# 1. Start Interview

The first request initializes a new interview session.

### Request

```json
{
  "sessionId": "abc-123",
  "candidate": {
    "...": "candidate.json schema"
  }
}
```

### Required Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | Yes | Identifier supplied by the client and used to maintain interview state |
| `candidate` | object | Yes | Candidate object following the provided `candidate.json` schema |

### Expected Response

```json
{
  "reply": "Welcome. Let's begin your interview.",
  "done": false
}
```

---

# 2. Conversation Turn

Every subsequent request continues the existing interview session.

### Request

```json
{
  "sessionId": "abc-123",
  "message": "..."
}
```

### Required Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | Yes | Identifier of the existing interview session |
| `message` | string | Yes | Candidate's latest response |

### Expected Response

```json
{
  "reply": "...",
  "done": false
}
```

The conversation continues across multiple requests until the interview is complete.

---

# 3. End Interview

When the interview is complete, the endpoint returns:

```json
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
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `reply` | string | Final response from the interview agent |
| `done` | boolean | Indicates whether the interview is complete |
| `feedback` | object | Final interview feedback |
| `feedback.summary` | string | Overall interview summary |
| `feedback.strengths` | string[] | Candidate strengths |
| `feedback.gaps` | string[] | Identified gaps |
| `feedback.next` | string[] | Recommended next steps |

Each feedback array should contain concise, actionable points.

---

# Session Lifecycle

```text
Client
  |
  | POST /api/interview
  | sessionId + candidate
  v
Backend
  |
  | Create session state
  v
Interview Session
  |
  | sessionId + conversation state
  |
  | POST /api/interview
  | sessionId + message
  v
Backend
  |
  | Retrieve existing session
  | Continue interview
  |
  v
Interview Session
  |
  | Repeat conversation turns
  |
  v
Interview Complete
  |
  | done: true
  | feedback
  v
Client
```

The same `sessionId` must be used throughout the interview.

---

# State Management

The backend must maintain interview state using the supplied `sessionId`.

The session may contain internal information such as:

- Candidate information
- Conversation history
- Questions already asked
- Candidate responses
- Interview progress
- Current interview state
- Other internal metadata required by the implementation

The exact internal session representation is an implementation detail and is not exposed directly by the API.

---

# HTTP Response Contract

### Active Interview

```json
{
  "reply": "...",
  "done": false
}
```

### Completed Interview

```json
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
```

---

# Error Handling

The technical specification does not define a complete error-response schema.

The implementation should therefore keep error handling consistent with the backend architecture without inventing additional API behavior that conflicts with the specification.

Potential validation conditions include:

- Missing `sessionId`
- Invalid request structure
- Missing candidate on the initial request
- Missing message on a conversation turn
- Session not found when attempting to continue an existing interview

The exact HTTP status codes and error response structure should be finalized during backend implementation.

---

# API Constraints

The implementation must follow these constraints:

- Only one HTTP endpoint is required: `POST /api/interview`.
- No authentication is required.
- The client supplies the `sessionId`.
- The backend maintains state using the supplied `sessionId`.
- The candidate object follows the provided `candidate.json` schema.
- Subsequent requests contain the latest candidate message.
- The interview remains conversational across multiple requests.
- A completed interview returns `done: true` and the required feedback structure.