\# AI Workflow Builder



A full-stack workflow execution demo for chaining customer-analysis steps with an approval gate.



\## Live Application



https://ai-workflow-builder-eight-psi.vercel.app/



\## GitHub



https://github.com/LikhithaReddy1805/AI-Workflow-Builder



\## Architecture



\- Frontend: Next.js / React

\- Backend: Node.js / Express

\- Workflow execution: Express API

\- External HTTP step: JSONPlaceholder

\- Frontend deployment: Vercel

\- Backend deployment: Render



\## Workflow



The demonstrated Customer Analysis Workflow contains:



1\. Analyze Customer — LLM-style analysis step

2\. Get External Data — HTTP request

3\. Check Urgency — conditional branch

4\. Manager Approval — approval gate

5\. Save Result — database-write simulation



The workflow pauses when an urgent customer issue is detected. The approval handler accepts owner/editor roles and rejects viewer approval. After approval, execution continues to the final save-result step.



\## Local Setup



\### Backend



```bash

cd backend

npm install

npm start


Backend runs at:

http://localhost:4000

### Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:3000

## API Endpoints

### Health Check

GET /health

### Run Workflow

POST /run

Starts the customer-analysis workflow manually.

### Webhook

POST /webhook

Example payload:

{
  "customer": "Test Customer",
  "issue": "Urgent support request"
}

### Approve Workflow

POST /approve

Example:

{
  "role": "owner"
}

The approval handler accepts owner and editor roles and rejects viewer approval.

## LLM Note

The current implementation uses a deterministic stubbed LLM-style response with an artificial delay instead of a paid external LLM API.

The stub intentionally produces an urgent customer-analysis result so the approval-gate scenario can be demonstrated consistently.

## Approval Flow

When the conditional branch detects an urgent issue, the backend stores the current workflow state and returns a paused status.

The frontend displays the approval interface.

An approval request is then sent to the backend with the approver role. The handler checks the role before allowing the workflow to continue.

After successful approval, the final save-result step executes and the workflow returns completed.

## Deployment

The frontend is deployed on Vercel:

https://ai-workflow-builder-eight-psi.vercel.app/

The backend is deployed on Render:

https://ai-workflow-builder-hqfj.onrender.com/

The deployed frontend communicates with the deployed backend rather than localhost.

## Known Scope / Limitations

This repository focuses on demonstrating the core workflow execution, conditional branching, approval-gate pause/resume behavior, webhook endpoint, and live deployment.

The current demo does not claim a complete production implementation of every Hasura/Nhost requirement from the assignment, including full multi-organization Hasura permission configuration, live GraphQL subscriptions, scheduled/database-event triggers, production LLM integration, and a complete visual workflow builder.

These areas would be the next steps for a production-ready implementation.
