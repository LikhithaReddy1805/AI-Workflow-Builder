"use client";

import { useState } from "react";

const steps = [
  {
    id: 1,
    name: "Analyze Customer",
    type: "LLM Call",
  },
  {
    id: 2,
    name: "Get External Data",
    type: "HTTP Request",
  },
  {
    id: 3,
    name: "Check Urgency",
    type: "Conditional Branch",
  },
  {
    id: 4,
    name: "Manager Approval",
    type: "Approval Gate",
  },
  {
    id: 5,
    name: "Save Result",
    type: "Database Write",
  },
];

const BACKEND_URL =
  "https://ai-workflow-builder-hqfj.onrender.com";

export default function Home() {
  const [status, setStatus] = useState("ready");
  const [message, setMessage] = useState(
    "Ready to run the workflow."
  );

  async function runWorkflow() {
    setStatus("running");
    setMessage("Executing workflow...");

    try {
      const response = await fetch(
        `${BACKEND_URL}/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Workflow failed."
        );
      }

      if (data.status === "paused") {
        setStatus("paused");
        setMessage(
          "Workflow paused. Manager approval is required."
        );
      } else {
        setStatus("completed");
        setMessage(
          "Workflow completed successfully."
        );
      }
    } catch (error) {
      console.error(error);
      setStatus("failed");
      setMessage(
        error.message ||
          "Could not connect to backend."
      );
    }
  }

  async function approveWorkflow() {
    setStatus("approving");
    setMessage("Processing approval...");

    try {
      const response = await fetch(
        `${BACKEND_URL}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: "owner",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Approval failed."
        );
      }

      if (data.status === "completed") {
        setStatus("completed");
        setMessage(
          "Workflow completed successfully."
        );
      }
    } catch (error) {
      console.error(error);

      setStatus("failed");
      setMessage(
        error.message || "Approval failed."
      );
    }
  }

  function getStepStatus(index) {
    if (status === "ready") {
      return "pending";
    }

    if (status === "running") {
      if (index < 3) return "completed";
      if (index === 3) return "running";
      return "pending";
    }

    if (status === "paused") {
      if (index < 3) return "completed";
      if (index === 3) return "paused";
      return "pending";
    }

    if (
      status === "approving" ||
      status === "completed"
    ) {
      return "completed";
    }

    return "failed";
  }

  function getStatusLabel(stepStatus) {
    if (stepStatus === "completed") {
      return "✓ Completed";
    }

    if (stepStatus === "paused") {
      return "⏸ Awaiting Approval";
    }

    if (stepStatus === "running") {
      return "Running...";
    }

    if (stepStatus === "failed") {
      return "✕ Failed";
    }

    return "Pending";
  }

  function getStatusStyle(stepStatus) {
    if (stepStatus === "completed") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (stepStatus === "paused") {
      return {
        background: "#ffedd5",
        color: "#9a3412",
      };
    }

    if (stepStatus === "running") {
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (stepStatus === "failed") {
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }

    return {
      background: "#f1f5f9",
      color: "#475569",
    };
  }

  const isBusy =
    status === "running" ||
    status === "approving";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "50px 20px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background:
              "linear-gradient(135deg, #1e293b, #334155)",
            padding: "35px 40px",
            borderRadius: "16px 16px 0 0",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#cbd5e1",
              marginBottom: "10px",
            }}
          >
            AI Automation Platform
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            AI Workflow Builder
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: "17px",
              color: "#e2e8f0",
            }}
          >
            Customer Analysis Workflow
          </p>
        </div>

        {/* CONTENT */}

        <div
          style={{
            background: "#ffffff",
            padding: "35px 40px",
            borderRadius: "0 0 16px 16px",
            boxShadow:
              "0 10px 30px rgba(15, 23, 42, 0.08)",
          }}
        >
          {/* ORGANIZATION */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              padding: "20px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              marginBottom: "25px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#64748b",
                  textTransform: "uppercase",
                  marginBottom: "5px",
                }}
              >
                Organization
              </div>

              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Organization A
              </div>

              <div
                style={{
                  marginTop: "6px",
                  fontSize: "14px",
                  color: "#475569",
                }}
              >
                Monthly quota:{" "}
                <strong>0 / 100</strong>
              </div>
            </div>

            <button
              onClick={runWorkflow}
              disabled={isBusy}
              style={{
                background: isBusy
                  ? "#94a3b8"
                  : "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "9px",
                padding: "14px 24px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: isBusy
                  ? "not-allowed"
                  : "pointer",
                boxShadow:
                  "0 4px 10px rgba(37, 99, 235, 0.2)",
              }}
            >
              {isBusy
                ? "Running..."
                : "▶ Run Workflow"}
            </button>
          </div>

          {/* STATUS */}

          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "32px",
              background:
                status === "paused"
                  ? "#fff7ed"
                  : status === "completed"
                  ? "#f0fdf4"
                  : status === "failed"
                  ? "#fef2f2"
                  : "#f8fafc",
              border:
                status === "paused"
                  ? "1px solid #fdba74"
                  : status === "completed"
                  ? "1px solid #86efac"
                  : status === "failed"
                  ? "1px solid #fca5a5"
                  : "1px solid #cbd5e1",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Current Status
            </div>

            <div
              style={{
                marginTop: "5px",
                fontSize: "22px",
                fontWeight: "700",
                color:
                  status === "paused"
                    ? "#c2410c"
                    : status === "completed"
                    ? "#15803d"
                    : status === "failed"
                    ? "#b91c1c"
                    : "#0f172a",
              }}
            >
              {status === "ready" && "READY"}
              {status === "running" && "RUNNING"}
              {status === "paused" &&
                "AWAITING APPROVAL"}
              {status === "approving" &&
                "APPROVING"}
              {status === "completed" &&
                "COMPLETED"}
              {status === "failed" && "FAILED"}
            </div>

            <div
              style={{
                marginTop: "7px",
                fontSize: "15px",
                color: "#475569",
              }}
            >
              {message}
            </div>
          </div>

          {/* STEPS */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                color: "#0f172a",
              }}
            >
              Workflow Steps
            </h2>

            <p
              style={{
                marginTop: "6px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Sequential execution of the customer
              analysis workflow
            </p>
          </div>

          {steps.map((step, index) => {
            const stepStatus =
              getStepStatus(index);

            const badgeStyle =
              getStatusStyle(stepStatus);

            return (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  padding: "20px",
                  marginBottom: "12px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow:
                    stepStatus === "paused"
                      ? "0 0 0 2px #fed7aa"
                      : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      background:
                        stepStatus === "completed"
                          ? "#dcfce7"
                          : stepStatus === "paused"
                          ? "#ffedd5"
                          : "#e2e8f0",
                      color:
                        stepStatus === "completed"
                          ? "#166534"
                          : stepStatus === "paused"
                          ? "#9a3412"
                          : "#475569",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                    }}
                  >
                    {stepStatus === "completed"
                      ? "✓"
                      : step.id}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "17px",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      {step.name}
                    </div>

                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      {step.type}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    ...badgeStyle,
                    padding: "8px 13px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "700",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getStatusLabel(stepStatus)}
                </div>
              </div>
            );
          })}

          {/* APPROVAL */}

          {status === "paused" && (
            <div
              style={{
                marginTop: "22px",
                padding: "22px",
                background: "#fff7ed",
                border: "1px solid #fdba74",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: "700",
                  color: "#9a3412",
                }}
              >
                Manager Approval Required
              </div>

              <p
                style={{
                  margin: "7px 0 15px",
                  fontSize: "14px",
                  color: "#7c2d12",
                }}
              >
                The workflow detected an urgent
                customer issue and is waiting for
                an authorized approver.
              </p>

              <button
                onClick={approveWorkflow}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#16a34a",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                ✓ Approve & Continue
              </button>
            </div>
          )}

          {/* COMPLETED */}

          {status === "completed" && (
            <div
              style={{
                marginTop: "22px",
                padding: "18px",
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: "10px",
                textAlign: "center",
                color: "#166534",
                fontSize: "16px",
                fontWeight: "700",
              }}
            >
              ✓ All workflow steps completed
              successfully
            </div>
          )}
        </div>
      </div>
    </main>
  );
}