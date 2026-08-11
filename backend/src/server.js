const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 4000;

const WORKFLOW_ID = "5a369ada-ba0c-4e90-989c-b138d9e02cd4";

let currentRun = null;

// --------------------------------------------------
// HOME
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "AI Workflow Builder backend is running"
  });
});

// --------------------------------------------------
// HEALTH
// --------------------------------------------------

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// --------------------------------------------------
// RUN WORKFLOW MANUALLY
// --------------------------------------------------

app.post("/run", async (req, res) => {
  console.log("\n==============================");
  console.log("MANUAL WORKFLOW STARTED");
  console.log("==============================");

  try {
    // STEP 1 — LLM
    console.log("Step 1: LLM call");

    await new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });

    const llmOutput =
      "The customer has reported an urgent issue.";

    console.log("LLM output:", llmOutput);

    // STEP 2 — HTTP
    console.log("Step 2: HTTP request");

    const httpResponse = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );

    if (!httpResponse.ok) {
      throw new Error("HTTP request failed");
    }

    const httpOutput = await httpResponse.json();

    console.log("HTTP output:", httpOutput);

    // STEP 3 — CONDITIONAL
    console.log("Step 3: Conditional branch");

    const isUrgent = llmOutput
      .toLowerCase()
      .includes("urgent");

    console.log("Urgent:", isUrgent);

    // STEP 4 — APPROVAL
    if (isUrgent) {
      console.log("Step 4: Approval gate");
      console.log("WORKFLOW PAUSED");

      currentRun = {
        workflow_id: WORKFLOW_ID,
        status: "paused",
        trigger_type: "manual",
        llmOutput,
        httpOutput,
        isUrgent
      };

      return res.json({
        workflow_id: WORKFLOW_ID,
        status: "paused",
        message: "Workflow paused — approval required."
      });
    }

    return res.json({
      workflow_id: WORKFLOW_ID,
      status: "completed"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "failed",
      error: error.message
    });
  }
});

// --------------------------------------------------
// WEBHOOK TRIGGER
// --------------------------------------------------

app.post("/webhook", async (req, res) => {
  console.log("\n==============================");
  console.log("WEBHOOK RECEIVED");
  console.log("==============================");

  console.log("Payload:", req.body);

  try {
    // STEP 1 — LLM
    console.log("Step 1: LLM call");

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const llmOutput =
      "The customer has reported an urgent issue.";

    // STEP 2 — HTTP
    console.log("Step 2: HTTP request");

    const httpResponse = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );

    if (!httpResponse.ok) {
      throw new Error("HTTP request failed");
    }

    const httpOutput = await httpResponse.json();

    // STEP 3 — CONDITIONAL
    console.log("Step 3: Conditional branch");

    const isUrgent = llmOutput
      .toLowerCase()
      .includes("urgent");

    if (isUrgent) {
      console.log("Step 4: Approval gate");
      console.log("WEBHOOK WORKFLOW PAUSED");

      currentRun = {
        workflow_id: WORKFLOW_ID,
        status: "paused",
        trigger_type: "webhook",
        payload: req.body,
        llmOutput,
        httpOutput,
        isUrgent
      };

      return res.json({
        success: true,
        workflow_id: WORKFLOW_ID,
        trigger_type: "webhook",
        status: "paused",
        message:
          "Webhook triggered workflow. Approval required."
      });
    }

    return res.json({
      success: true,
      workflow_id: WORKFLOW_ID,
      trigger_type: "webhook",
      status: "completed"
    });

  } catch (error) {
    console.error("Webhook error:", error);

    return res.status(500).json({
      success: false,
      status: "failed",
      error: error.message
    });
  }
});

// --------------------------------------------------
// APPROVAL
// --------------------------------------------------

app.post("/approve", async (req, res) => {
  console.log("\n==============================");
  console.log("APPROVAL REQUEST");
  console.log("==============================");

  try {
    const { role } = req.body;

    // Make sure something is paused
    if (!currentRun) {
      return res.status(400).json({
        success: false,
        error: "No workflow is waiting for approval."
      });
    }

    // Security check
    if (role !== "owner" && role !== "editor") {
      console.log("Approval denied:", role);

      return res.status(403).json({
        success: false,
        error:
          "Only owner or editor can approve this step."
      });
    }

    console.log("Approval granted:", role);

    // STEP 5 — DB WRITE
    console.log("Step 5: DB write");

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    const result = {
      saved: true,
      customer_analysis: currentRun.llmOutput,
      urgent: currentRun.isUrgent,
      trigger_type: currentRun.trigger_type
    };

    const workflowId = currentRun.workflow_id;

    currentRun = null;

    console.log("WORKFLOW COMPLETED");

    return res.json({
      success: true,
      workflow_id: workflowId,
      status: "completed",
      approved_by_role: role,
      db_write: result
    });

  } catch (error) {
    console.error("Approval error:", error);

    return res.status(500).json({
      success: false,
      status: "failed",
      error: error.message
    });
  }
});

// --------------------------------------------------
// SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `Backend running at http://localhost:${PORT}`
  );
});