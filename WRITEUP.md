\# AI Workflow Builder — Design Write-up



\## Schema and Workflow Reasoning



The workflow is modeled as a sequence of execution steps where each step represents a distinct operation in the customer-analysis process. The demonstrated workflow contains an LLM-style analysis step, an external HTTP request, a conditional branch, an approval gate, and a final save-result operation.



The workflow execution is represented by a run state. When the conditional step determines that the customer issue is urgent, execution does not continue directly to the final operation. Instead, the current run state is retained with a `paused` status. This makes the approval gate an explicit execution state rather than simply a UI interaction.



The backend also keeps the workflow identifier and trigger type with the paused execution state. This allows the approval operation to resume the correct workflow execution.



\## Permission Layers



The assignment describes two distinct permission layers.



The first layer is organization and role scoping. Users should only be able to access workflows belonging to organizations in which they are members. Within an organization, owners have full control, editors can create and trigger workflows, and viewers are read-only.



The second layer is step-level authorization. Certain operations require additional restrictions beyond ordinary workflow access. In particular, approval of an approval-gate step must verify the approver's role at execution time.



The current implementation demonstrates the second layer in the approval handler. The `/approve` endpoint checks the supplied role and only accepts `owner` or `editor`. A viewer receives a `403` response and cannot approve the paused workflow.



The production version would enforce the first layer through Hasura row-level permissions scoped through `org\_members`, while retaining the approval check inside the execution handler because approval is a mid-execution decision.



\## Approval-Gate Pause and Resume



The approval gate is implemented as a state transition.



During workflow execution, the conditional step checks the analysis output for an urgent issue. If the result is urgent, the backend stores the current workflow information in `currentRun` and returns:



`status: "paused"`



The frontend detects this state and displays the approval interface.



An authorized approver then sends an `/approve` request containing their role. The backend verifies that the role is `owner` or `editor`. Once approved, the saved workflow state is used to perform the final save-result operation, after which the paused state is cleared and the workflow returns:



`status: "completed"`



This demonstrates the essential pause → approval → resume → completion lifecycle.



\## External Calls and Failure Handling



The workflow performs an external HTTP request to JSONPlaceholder during execution. The backend checks the HTTP response and raises an error when the request fails. Errors are returned with a failed workflow status.



The current LLM implementation is intentionally stubbed with an artificial delay, as disclosed in the README, so that the approval-gate scenario can be demonstrated consistently without requiring a paid LLM API.



\## Current Scope



The deployed implementation demonstrates the core workflow execution, conditional branching, approval-gate pause/resume behavior, webhook endpoint, role check in the approval handler, and live frontend/backend deployment.



A complete production implementation would additionally connect the workflow to Nhost/PostgreSQL/Hasura with organization-scoped permissions, GraphQL subscriptions, persistent workflow and step-run records, quota enforcement, scheduled and database-event triggers, retry handling, and a production LLM API.

