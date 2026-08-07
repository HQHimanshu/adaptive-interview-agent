# AI Interview Agent

## Project Overview

This project is being built for the ABTalks Vibe Coding Hackathon.

The objective is to build an AI Interview Agent that conducts adaptive technical interviews using the supplied curriculum and candidate data.

The interview must be conversational, remember context across multiple turns, adapt to the candidate's background, and produce structured feedback after completion.

The project must satisfy the official technical specification provided by the organizers.

The project must NOT invent additional APIs or requirements outside the provided documentation.

---

# Team

Three developers are working simultaneously.

## Backend Engineer

Responsibilities

- Express backend
- Session management
- Interview flow
- Prompt builder
- LLM integration
- Breeth integration
- API implementation

---

## Frontend Engineer

Responsibilities

- React
- Tailwind
- Candidate selector
- Chat interface
- Interview UI
- Feedback screen
- API integration

The frontend never contains interview logic.

---

## DevOps Engineer

Responsibilities

Deployment

README

Testing

AI Usage Log

Git Workflow

Environment Variables

CI

Documentation

---

# Tech Stack

Frontend

React

Tailwind

Axios

Backend

Node.js

Express

dotenv

UUID

LLM

Claude or Gemini

Memory

Breeth MCP

Deployment

Vercel

Render

---

# Project Goal

The application interviews a candidate based on

- previous learning
- completed curriculum
- skipped modules
- strengths
- weaknesses

The interview is adaptive.

The AI asks follow-up questions based on previous answers.

At the end the application returns

summary

strengths

gaps

next learning steps

---

# Data Sources

The organizers provide

curriculum.json

candidate.json

technical specification

Breeth Memory

These are the source of truth.

Never invent fields not present inside these files.

---

# Backend Responsibilities

The backend orchestrates the interview.

It

receives requests

maintains sessions

retrieves memory

builds prompts

calls the LLM

stores memory

returns responses

The backend never renders UI.

---

# Frontend Responsibilities

The frontend

starts interviews

shows questions

collects answers

renders feedback

calls backend APIs

The frontend never generates interview questions.

---

# LLM Responsibilities

The LLM

asks interview questions

asks follow-up questions

evaluates answers

creates feedback

The LLM does not manage sessions.

---

# Breeth Responsibilities

Breeth stores interview memory.

Breeth retrieves interview memory.

Breeth does not decide interview flow.

Breeth does not generate questions.

---

# Engineering Principles

Production quality.

Simple architecture.

Modular code.

Reusable services.

Consistent naming.

No duplicated logic.

Incremental development.

Meaningful commits.

AI-assisted development must be documented.

---

# Hackathon Rules

The repository history must naturally represent project development.

The AI Usage Log must accurately reflect development.

Never generate the whole project in one response.

Implement one feature at a time.

Every completed feature should correspond to one Git commit.

---

# Code Quality

Use async/await.

Handle errors.

Validate inputs.

Use environment variables.

Never hardcode API keys.

Write maintainable code.

---

# Communication Rules

Every implementation should explain

what

why

files changed

how to test

possible edge cases

git commit message

AI log entry

before moving to the next feature.