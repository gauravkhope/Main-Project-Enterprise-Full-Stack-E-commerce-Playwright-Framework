# AI-Commerce Exception Handling + Retry & Flaky Test Strategy
Version: 1.0  
Owner: Test Engineering Team  
Project: AI-Commerce Enterprise Platform  

---

# 1. Purpose

This document defines:

- Exception classification
- Error propagation model
- Retry strategy rules
- Flaky test detection
- Flaky governance protocol

Objective:

- Maintain execution stability
- Prevent false positives
- Avoid masking real defects
- Enforce disciplined retry usage

---

# 2. Exception Classification

Automation errors are categorized into:

---

## 2.1 UI Exceptions

- Element not visible
- Element detached
- Timeout waiting for selector
- Navigation failure
- Unexpected UI state

---

## 2.2 API Exceptions

- HTTP 4xx / 5xx
- Timeout
- Invalid response schema
- Contract mismatch

---

## 2.3 DB Exceptions

- Connection timeout
- Query execution failure
- Data mismatch

---

## 2.4 Infrastructure Exceptions

- Browser crash
- CI node instability
- Network disruption
- Docker container failure

---

# 3. Error Handling Philosophy

Fail Fast for:

- Assertion failures
- Business logic mismatch
- Contract validation errors
- Security violations

Controlled Retry for:

- Transient network issues
- Known environment instability
- Temporary UI rendering delay

Never retry logic failures.

---

# 4. Error Propagation Model

Error Flow:

UI/API/DB  
↓  
Domain  
↓  
Flow  
↓  
Test  
↓  
Reporter  

Core engine standardizes error formatting.

Each error must include:

- Test name
- Environment
- Execution step
- Stack trace
- Screenshot (if UI)
- Network trace (if API)

---

# 5. Retry Strategy

Retries are allowed only for transient failures.

---

## 5.1 Test-Level Retry

Configured in Playwright config.

Policy:

Local: 0 retries  
CI: 1–2 retries maximum  

Retries must be logged clearly.

---

## 5.2 Step-Level Retry

Allowed only for idempotent operations:

- Safe click
- Safe wait
- Navigation readiness check

Not allowed for:

- Payment submission
- Order placement
- State-changing operations

---

# 6. Retry Governance Rules

- Maximum retry limit defined
- Retry must not hide persistent bug
- Retry attempts logged in report
- Retry statistics monitored

Retries are mitigation, not a solution.

---

# 7. Flaky Test Definition

A test is considered flaky if:

- Fails intermittently
- Passes on retry
- Fails only in CI
- Fails without code change

---

# 8. Flaky Detection Workflow

If test fails:

1. Check reproducibility locally
2. Identify failure type
3. Classify as:
   - Locator issue
   - Timing issue
   - Data issue
   - Environment issue
4. Fix root cause
5. Remove retry dependency

---

# 9. Flaky Governance Policy

Flaky lifecycle:

First occurrence → Investigation  
Second occurrence → Flag unstable  
Third occurrence → Temporary quarantine  

Quarantine location:

ui/tests/quarantine/

Must include:

- Jira reference
- Root cause note
- Remediation plan

---

# 10. Anti-Flakiness Engineering Rules

- No hard waits
- No index-based locators
- No shared mutable test data
- No dependent test chaining
- No hidden retry masking logic
- No silent exception swallowing

---

# 11. Logging & Observability

Each failure must capture:

- Screenshot
- Trace file
- Console logs
- Network logs
- Retry count

Observability layer records execution events.

---

# 12. Stability Metrics

Framework stability targets:

Smoke stability > 99%  
Flaky rate < 2%  
Retry dependency < 5%  
Mean time to fix flaky test < 24h  

---

# 13. Continuous Improvement

Flaky rate reviewed:

- Weekly
- After major feature release
- After environment change
- After scaling update

---

# 14. Architectural Discipline

Retries are never used to:

- Force green pipeline
- Hide race conditions
- Ignore UI instability

Framework must expose real defects clearly.

---

End of Document.
