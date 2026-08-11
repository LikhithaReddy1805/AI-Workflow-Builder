# AI Workflow Builder

## Overview

AI Workflow Builder is a prototype workflow orchestration system that demonstrates
sequential workflow execution, conditional branching, human approval, and workflow
run tracking.

## Workflow

The demo workflow is:

1. Analyze Customer — LLM call
2. Get External Data — HTTP request
3. Check Urgency — Conditional branch
4. Manager Approval — Approval gate
5. Save Result — Database write

## Technology Stack

### Frontend
- Next.js
- React
- JavaScript

### Backend
- Node.js
- Express

### Database
- PostgreSQL
- Nhost
- GraphQL

## Features

- Organization-based workflow structure
- Workflow and workflow-step data model
- GraphQL relationships
- Sequential workflow execution
- LLM step prototype
- External HTTP request
- Conditional branching
- Human approval gate
- Owner/editor approval
- Viewer approval restriction
- Workflow run and step-run tracking
- Web-based workflow dashboard

## Demo Flow

```text
Run Workflow
     ↓
Analyze Customer
     ↓
Get External Data
     ↓
Check Urgency
     ↓
Manager Approval
     ↓
Approve
     ↓
Save Result
     ↓
Completed