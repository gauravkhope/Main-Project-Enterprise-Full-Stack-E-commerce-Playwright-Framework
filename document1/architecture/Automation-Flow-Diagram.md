# **Automation Flow Diagram Document**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
This document illustrates the **complete automation flow** of the Modern E-Commerce Web Application, covering:

- UI Automation (Playwright)  
- API Automation (Jest + SuperTest)  
- Test Data flow  
- Execution flow  
- Reporting flow  
- CI/CD integration  

This provides a **visual and structural understanding** of how the automation framework works end-to-end.

---

# **2. High-Level Automation Flow**

```

```
            ┌────────────────────────┐
            │     Test Engineer      │
            └──────────────┬─────────┘
                           │Trigger (Local / CI)
                           ▼
            ┌────────────────────────┐
            │   Test Runner Layer    │
            │Playwright / Jest Runner│
            └──────────────┬─────────┘
                           │
                           ▼
      ┌────────────────────────────────────────────┐
      │          Automation Suites (UI + API)       │
      └────────────────┬────────────────────────────┘
                       │
    ┌──────────────────┼────────────────────┐
    ▼                  ▼                    ▼
```

┌───────────────┐ ┌────────────────┐ ┌─────────────────────┐
│ UI Automation  │ │ API Automation │ │ Test Data Manager   │
│  (Playwright)  │ │ (Jest+SuperTest)│ │ (Static + Dynamic) │
└───────┬────────┘ └───────┬────────┘ └────────┬───────────┘
│                  │                    │
▼                  ▼                    ▼
┌───────────────┐  ┌───────────────────┐  ┌─────────────────────┐
│ Frontend (UI)  │  │ Backend Services  │  │   Database Layer    │
│    Next.js     │  │   Express.js API  │  │ MongoDB/Postgres DB │
└───────────────┘  └───────────────────┘  └─────────────────────┘
│                  │                    │
└──────────┬──────┴──────────┬──────────┘
▼                 ▼
┌──────────────────────────────────────────┐
│                 Reporting                │
│ HTML Reports, Videos, Screenshots, Logs │
└───────────────────┬──────────────────────┘
▼
┌────────────────────────────────────┐
│                CI/CD                │
│        GitHub Actions Pipeline      │
└────────────────────────────────────┘

```

---

# **3. UI Automation Flow (Playwright)**

```

Test Engineer/TRIGGER
│
▼
Playwright Test Runner
│
▼
Load Fixtures → Setup Browser Context
│
▼
Execute Tests (POM Actions)
│
▼
Interact with Frontend (Next.js)
│
▼
Frontend Calls API → Backend Processes Request
│
▼
Database Returns Data → Backend → UI Response
│
▼
Playwright Captures:

* Screenshots
* Videos
* Trace Logs
  │
  ▼
  Generate HTML Report

```

---

# **4. API Automation Flow (Jest + SuperTest)**

```

Trigger API Test Run
│
▼
Jest Test Runner
│
▼
SuperTest Makes API Calls
│
▼
API (Express.js) Validates & Processes
│
▼
Database (MongoDB/Postgres) Query Execution
│
▼
API Sends JSON Response
│
▼
Jest Validates:

* Status Codes
* Schema
* Business Logic
  │
  ▼
  Generate Jest HTML / JSON Reports

```

---

# **5. Combined UI + API + Data Flow**

```

UI Test              API Test               Test Data Layer
│                     │                       │
▼                     ▼                       ▼
Trigger                Trigger                 Load Static Data
│                     │                       │
├───────────────┬─────┴───────────────┬──────┤
▼               ▼                      ▼      ▼
UI Action   API Direct Call      Dynamic Data Generation
│               │                      │
▼               ▼                      ▼
Frontend       Backend API           On-demand Data
│               │                      │
▼               ▼                      ▼
Backend → DB → Response    DB Query     Final Validation
│               │                      │
▼               ▼                      ▼
Playwright     SuperTest             Test Runner Merge
│               │                      │
▼               ▼                      ▼
Screenshots/Video/Trace   API Logs    Unified Reports

```

---

# **6. Test Execution Flow (End-to-End)**

```

Trigger Tests (Local / CI)
│
▼
Run UI Tests → Run API Tests (parallel)
│                │
▼                ▼
Generate Reports (HTML/UI/API)
│                │
└──────┬────────┘
▼
Collect & Upload Artifacts
│
▼
Publish to CI Dashboard
│
▼
Test Engineer Review
│
▼
Approve / Fix / Retest

```

---

# **7. CI/CD Automation Flow**

```

Push or PR →
│
▼
GitHub Actions Trigger
│
▼
Install Dependencies
│
▼
Build Frontend & Backend
│
▼
Run API Tests
│
▼
Run UI Playwright Tests
│
▼
Upload Reports
│
▼
PR Status Check
│
▼
Merge Approval (if green)

```

---

# **8. Automation Components Interaction**

| Component | Interacts With | Purpose |
|-----------|----------------|---------|
| Playwright | UI + Backend | UI workflow validation |
| Jest+SuperTest | Backend + DB | API functional validation |
| Test Data Layer | UI + API | Provides static & dynamic data |
| Reporting Layer | Playwright + Jest | Provides artifacts & analysis |
| CI/CD Pipeline | Entire automation suite | Executes, validates, publishes |

---

# **9. Key Advantages of This Architecture**

- Modular and scalable  
- Supports parallel execution  
- Clear separation between UI & API tests  
- Zero reuse of UI selectors across tests (POM enforced)  
- Easy integration with CI/CD  
- Reusable test data layer  
- Clean, visual reporting  

---

# **10. Future Enhancements**

- Add Allure reporting  
- Integrate AI-based flake detection  
- Add browser grid execution  
- Add microservice-level monitoring  
- Introduce real-time test dashboards  

---

# **End of Automation Flow Diagram Document**
```