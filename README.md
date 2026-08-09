
---
Frontend URL :- https://adaptive-interview-agent.vercel.app/
# `README.md`

And this is the README I'd use for the final repository:

```md
# Adaptive Interview Agent

> An AI-powered adaptive technical interview platform that turns a
> candidate's learning journey into a personalized, multi-turn technical
> interview.

Built for the **ABTalks Vibe Coding Hackathon**.

---

## 🚀 Project Status

**MVP Completed — Deployment & Final Verification**

The core application is fully implemented and tested, including:

- React frontend
- Express backend
- Adaptive multi-turn interview flow
- Groq LLM integration
- Breeth MCP persistent memory
- Candidate and curriculum context
- Structured final evaluation
- Frontend/backend API integration
- Backend orchestration tests
- Real Groq integration testing
- Real Breeth integration testing

---

# 🎯 Problem

Traditional technical interviews often use a fixed set of questions that do
not account for a candidate's actual learning journey, strengths, or
weaknesses.

A candidate may have completed different modules, explored different topics,
or have different levels of understanding across the curriculum.

A static questionnaire cannot adapt effectively to these differences.

---

# 💡 Solution

The **Adaptive Interview Agent** conducts a personalized technical interview
based on the candidate's available profile and learning journey.

Instead of following a completely fixed questionnaire, the agent:

1. Understands the candidate context.
2. Uses the completed curriculum to build interview context.
3. Generates technical questions dynamically.
4. Records candidate responses.
5. Generates adaptive follow-up questions.
6. Maintains conversation and interview state.
7. Evaluates the completed interview.
8. Produces structured and actionable feedback.
9. Persists relevant interview memory through Breeth MCP.

---

# ✨ Key Features

### 🧑‍💻 Personalized Interviews

Interview questions are generated using candidate-specific information and
curriculum context.

### 🔄 Adaptive Follow-ups

The next question can adapt to the candidate's previous answer instead of
simply following a fixed questionnaire.

### 🧠 Persistent Memory

Breeth MCP provides persistent memory for interview-related information.

### 📊 Interview Progress Tracking

The backend tracks:

- Current question
- Total required questions
- Candidate answers
- Conversation history
- Interview status
- Interview progress

### 📝 Structured Final Feedback

After the required interview responses are completed, the system generates:

- Summary
- Strengths
- Gaps
- Next learning steps

### 🔒 Server-Side API Keys

Groq and Breeth credentials are stored in environment variables and are never
exposed to the frontend.

---

# 🏗️ Architecture

```text
                    React Frontend
                         |
                         | HTTPS REST
                         v
                 Express Backend
                         |
                 Interview Controller
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
   Session Manager   Prompt Builder   Data Layer
          |              |
          |              v
          |        Groq LLM Service
          |              |
          |              v
          |          Groq API
          |
          v
      Breeth MCP
    Persistent Memory

The frontend handles user interaction.

The backend is responsible for interview orchestration and session state.

Groq performs language generation and evaluation.

Breeth provides persistent interview memory.

🔄 Interview Flow

Candidate Selected
       |
       v
Start Interview
       |
       v
Generate Initial Question
       |
       v
Candidate Answers
       |
       v
Record Answer + Update Progress
       |
       v
Generate Next Question / Follow-up
       |
       v
Repeat
       |
       v
Required Responses Completed
       |
       v
Generate Final Evaluation
       |
       v
Structured Feedback
       |
       v
Interview Completed

The system records a candidate response before generating the next interview
question.

The final evaluation is generated only after the required interview responses
have been collected.

🧠 How the AI Works

The application separates application logic from LLM reasoning.

Backend

The backend controls:

Sessions
Interview progress
Candidate data
Curriculum data
Prompt construction
Interview completion
API responses
Groq LLM

The LLM handles:

Interview questions
Adaptive follow-ups
Candidate answer evaluation
Final evaluation
Structured feedback generation
Breeth

Breeth handles:

Persistent interview memory
Interview-related memory retrieval
Session-associated long-term context

Neither Groq nor Breeth directly manages application sessions.

📚 Data Sources

The application uses data supplied for the hackathon.

Primary sources include:

candidates.json
curriculum.json

These datasets provide the candidate and curriculum context used by the
interview system.

The system does not invent candidate or curriculum information outside the
provided context.

📝 Final Evaluation

The final evaluation is based on the interview conversation and the candidate
and curriculum context actually provided to the evaluator.

The evaluation is designed to:

Connect candidate answers with the questions that were asked
Identify strengths demonstrated during the interview
Identify gaps supported by the interview
Avoid treating untested curriculum topics as candidate weaknesses
Avoid unsupported or invented weaknesses
Generate recommendations based on identified gaps

The resulting feedback is structured into:

summary
strengths
gaps
next
🛠️ Tech Stack
Frontend
React
Tailwind CSS
Axios
Backend
Node.js
Express
dotenv
AI
Groq
Groq JavaScript SDK
Memory
Breeth MCP
Data
JSON datasets
Deployment
Vercel
Render
📁 Project Structure
adaptive-interview-agent/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── utils/
│   │   ├── data/
│   │   └── tests/
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── assets/
│   │
│   └── package.json
│
├── docs/
│   ├── 01_ARCHITECTURE.md
│   ├── 02_PROJECT_MEMORY.md
│   ├── 03_BACKEND_API.md
│   ├── 04_AI_USAGE_LOG.md
│   └── 05_GIT_WORKFLOW.md
│
├── AI_PROJECT_CONTEXT.md
├── PROMPTS.md
├── technical-spec.md
└── README.md
🔌 API

The application exposes the required interview endpoint:

POST /api/interview

The endpoint supports:

Starting a new interview
Continuing an existing interview
Returning the next interviewer response
Returning interview completion state
Returning structured final feedback

The complete request and response contract is documented in:

docs/03_BACKEND_API.md
⚙️ Local Development
Prerequisites

Make sure the following are installed:

Node.js
npm
Git

You also need valid credentials for:

Groq
Breeth
1. Clone the Repository
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
2. Install Backend Dependencies
cd backend
npm install

Create a .env file inside the backend directory.

Example:

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_groq_model
BREETH_API_KEY=your_breeth_api_key

Never commit the .env file.

3. Start the Backend

Use the development script configured in backend/package.json.

For example:

npm run dev
4. Install Frontend Dependencies

Open another terminal:

cd frontend
npm install
5. Start the Frontend

Use the development script configured in frontend/package.json.

For example:

npm run dev
🔐 Environment Variables

The backend requires provider credentials to be supplied through environment
variables.

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_groq_model
BREETH_API_KEY=your_breeth_api_key
Security Rules
Never hardcode API keys.
Never commit .env.
Never expose provider API keys to the frontend.
Never include secrets in Git commits.
Never print API keys in logs.
🧪 Testing

The project includes backend testing for the interview orchestration layer.

The orchestration test verifies:

Interview start flow
Interview continuation
Interview completion
Final evaluation
Completed-session protection
Invalid request handling
Unknown-session handling

Latest recorded orchestration result:

6 tests passed
0 tests failed

Real integration testing was also performed for:

Groq
Breeth MCP

Testing documentation and AI-assisted development records are maintained in
the project documentation.

🧠 Breeth Integration

Breeth MCP is used as the persistent interview-memory layer.

The implementation includes:

MCP client integration
Memory writes
Memory retrieval
Deterministic session group IDs
Environment-based API credentials
Real integration testing

The active interview state remains controlled by the backend Session Manager.

Breeth does not determine interview flow or generate questions.

🤖 AI-Assisted Development

AI tools were used throughout development as development assistance.

AI usage was documented in:

docs/04_AI_USAGE_LOG.md
PROMPTS.md

The repository maintains a record of AI-assisted development rather than
treating AI-generated output as automatically accepted code.

All generated implementation was reviewed, tested, and integrated into the
project incrementally.

📖 Documentation

Additional project documentation:

Document	Purpose
AI_PROJECT_CONTEXT.md	Project rules, architecture principles, and development context
docs/01_ARCHITECTURE.md	System architecture and component responsibilities
docs/02_PROJECT_MEMORY.md	Project progress and implementation status
docs/03_BACKEND_API.md	Backend API contract
docs/04_AI_USAGE_LOG.md	AI-assisted development record
docs/05_GIT_WORKFLOW.md	Git development workflow
PROMPTS.md	Prompts used during AI-assisted development
technical-spec.md	Hackathon technical specification
🚀 Deployment

The planned production architecture is:

             Vercel
        React Frontend
               |
               | HTTPS
               v
             Render
        Express Backend
          /          \
         /            \
        v              v
    Groq API       Breeth MCP
Frontend

Deploy the React frontend to:

Vercel
Backend

Deploy the Express backend to:

Render
Production Configuration

Configure the required environment variables on the backend hosting platform.

The frontend must communicate with the deployed backend API rather than a
localhost URL.

🔒 Security

The application follows these security principles:

Environment-based secret management
No hardcoded API keys
No provider credentials exposed to the frontend
Request validation
Session validation
Completed-session protection
Error handling without exposing provider secrets
🏆 Hackathon Requirements

The implementation includes the core requirements of the Adaptive Interview
Agent:

 Conversational technical interview
 Minimum 8-question interview flow
 Multi-turn interaction
 Adaptive follow-up questions
 Candidate-specific context
 Candidate response tracking
 Structured final feedback
 Required HTTP API
 Persistent memory through Breeth MCP
 Frontend interface
 Backend orchestration
 AI usage documentation
👥 Team

ABTalks Vibe Coding Hackathon Team

The project was developed collaboratively across:

Backend
Frontend
DevOps / Documentation / Testing
📌 Current Status

The core MVP is complete.

Backend                  ✅
Frontend                 ✅
Interview Orchestration  ✅
Groq Integration         ✅
Breeth Integration       ✅
Final Evaluation         ✅
Testing                  ✅
Documentation            ✅
Deployment               🚧
Final E2E Verification   🚧

The next step is production deployment followed by a complete end-to-end
verification of the deployed application.


---

## One more review point before we move on

There is **one stale document you should not forget**:

### `AI_PROJECT_CONTEXT.md`

It still says:

```text
LLM
Claude or Gemini

and its tech-stack section still lists Claude/Gemini.

So your final documentation cleanup should be:

02_PROJECT_MEMORY.md      ✅ DONE
01_ARCHITECTURE.md        🔄 Replace with above
README.md                 🔄 Replace with above
AI_PROJECT_CONTEXT.md     ⚠️ Change Claude/Gemini → Groq
03_BACKEND_API.md         ✅ Leave if contract matches implementation
04_AI_USAGE_LOG.md        ✅ DONE
PROMPTS.md                ✅ DONE
technical-spec.md         ✅ DON'T TOUCH