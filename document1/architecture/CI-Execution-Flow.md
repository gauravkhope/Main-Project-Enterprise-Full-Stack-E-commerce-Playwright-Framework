# **CI Execution Flow Document**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
This document describes the **complete Continuous Integration (CI) execution flow** for the Modern E-Commerce Web Application.

It explains:
- How CI triggers  
- What steps CI executes  
- How UI/API tests run inside CI  
- How reports are generated & stored  
- How quality gates determine PR approval  

The CI engine used is **GitHub Actions**.

---

## **1.2 Scope**
This document covers:
- PR builds  
- Push builds  
- Regression builds  
- Automated test execution  
- Artifact uploads  
- Execution sequence and logic  

It does **not** include CD (deployment) steps.

---

# **2. High-Level CI Execution Flow**

```

Developer Push/PR
│
▼
GitHub Actions CI Trigger
│
▼
Setup Environment
│
▼
Install Dependencies
│
▼
Build Frontend + Backend
│
▼
Run API Tests
│
▼
Run UI Tests
│
▼
Generate Reports
│
▼
Upload Artifacts
│
▼
Quality Gate Check
│
▼
Approve / Block PR

```

---

# **3. CI Trigger Types**

---

## **3.1 Pull Request (PR) Trigger**
Runs on:
- `feature → develop`
- `develop → main`
- `bugfix → develop`

**Purpose:**  
Prevent bad code from being merged.

---

## **3.2 Push Trigger**
Runs on:
- main  
- develop  

**Purpose:**  
Validate changes before they affect others.

---

## **3.3 Manual Trigger**
Used for:
- Full regression  
- Overnight builds  
- Manual SDET runs  

---

# **4. CI Execution Pipeline Stages**

Below is the detailed flow for each stage.

---

# **4.1 Stage 1 – Checkout Code**

```

* name: Checkout code
  uses: actions/checkout@v3

```

Downloads the repository into the CI runner.

---

# **4.2 Stage 2 – Setup Node Environment**

```

* name: Setup Node
  uses: actions/setup-node@v3
  with:
  node-version: 18

```

Ensures consistent environment across all developers and CI.

---

# **4.3 Stage 3 – Install Dependencies**

Installs dependencies for:
- frontend  
- backend  
- ui automation  
- api automation  

```

* name: Install Dependencies
  run: |
  npm install
  cd frontend && npm install
  cd ../backend && npm install
  cd ../testing/automation/ui && npm install
  cd ../../api && npm install

```

---

# **4.4 Stage 4 – Build the Application**

Frontend Build:
```

cd frontend
npm run build

```

Backend Build:
```

cd backend
npm run build

```

Purpose:
- Validate that code compiles  
- Detect TypeScript errors early  

---

# **4.5 Stage 5 – API Automation Tests**

### Executes Jest + SuperTest suite:

```

cd testing/automation/api
npm test

```

Validates:
- Auth  
- Product APIs  
- Cart APIs  
- Order APIs  
- Admin APIs  

If API fails → PR blocked.

---

# **4.6 Stage 6 – UI Automation Tests (Playwright)**

### Install browsers:

```

cd testing/automation/ui
npx playwright install --with-deps

```

### Execute tests:

```

npx playwright test

```

Outputs:
- HTML Reports  
- Screenshots  
- Trace files  
- Videos  

If any P0/P1 UI test fails → PR blocked.

---

# **4.7 Stage 7 – Report Generation & Storage**

UI Report Upload:
```

actions/upload-artifact@v3

```

API Report Upload:
```

actions/upload-artifact@v3

```

Artifacts include:
- UI HTML report  
- API HTML report  
- Traces (zip files)  
- Screenshots  
- Jest logs  

---

# **4.8 Stage 8 – Quality Gate Validation**

CI checks:

| Gate | Condition |
|------|-----------|
| Build Status | Must pass |
| API Tests | All must pass |
| UI Tests | All must pass |
| Lint / TypeScript | Must pass |
| Security Scan (optional) | Must pass |

If any gate fails:
**PR gets blocked automatically.**

---

# **4.9 Stage 9 – PR Status & Merge Decision**

- If pipeline is GREEN → merge allowed  
- If RED → merge blocked until fixed  

---

# **5. CI Execution Diagram**

```

┌───────────────────────┐
│      Developer PR      │
└────────────┬───────────┘
▼
┌───────────────────────┐
│   GitHub Actions CI   │
└────────────┬───────────┘
▼
┌───────────────────────┐
│ Install + Build Apps  │
└────────────┬───────────┘
▼
┌───────────────────────┐
│     API Test Suite    │
└────────────┬───────────┘
▼
┌───────────────────────┐
│     UI Test Suite     │
└────────────┬───────────┘
▼
┌───────────────────────┐
│ Generate + Upload Logs│
└────────────┬───────────┘
▼
┌───────────────────────┐
│     Quality Gates     │
└────────────┬───────────┘
▼
┌───────────────────────┐
│     PR Merge Status    │
└────────────────────────┘

```

---

# **6. CI Environment Details**

### Runner:  
- `ubuntu-latest`

### Node version:  
- 18.x

### Browsers:  
- Chromium  
- Firefox  
- WebKit  

### Reporting:  
- Playwright HTML  
- Jest HTML  
- JSON summaries  
- Trace & screenshot files  

---

# **7. CI Optimization Techniques**

- Test caching for node modules  
- Parallel API/UI execution  
- Matrix builds for multiple browsers  
- Fail-fast strategy for critical failures  
- Selective test execution based on file changes  

---

# **8. CI Failure Handling**

If pipeline fails:
- Developer reviews logs  
- SDET reviews failing test case  
- Fix pushed → CI re-runs automatically  

---

# **9. Future Enhancements**

- Release pipeline integration  
- Slack/Email notifications  
- Add Allure reporting  
- Add test analytics dashboard  
- Add parallel browser grid  

---

# **End of CI Execution Flow Document**
