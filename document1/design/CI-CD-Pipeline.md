# **CI/CD Pipeline Document**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
This document defines the **Continuous Integration (CI)** and **Continuous Delivery (CD)** pipeline strategy for the Modern E-Commerce Web Application.

It ensures:
- Automated builds  
- Automated testing (UI + API)  
- Quality checks before merging  
- Deployment readiness  
- Fast, reliable release cycles  

CI/CD is implemented using **GitHub Actions**.

---

## **1.2 Scope**
This pipeline covers:
- Code checkout  
- Dependency installation  
- Linting  
- Build validation  
- API automation execution  
- UI automation execution  
- Reports generation & artifacts  
- Deployment readiness checks  

This does **not** include production deployment; that can be added later.

---

# **2. CI/CD Architecture Overview**

```

Developer → GitHub Push/PR
↓
GitHub Actions Pipeline Triggers
↓
Install Dependencies
↓
Run Linting & Build (frontend + backend)
↓
Run API Automation Tests
↓
Run UI Automation Tests (Playwright)
↓
Generate Reports
↓
Upload Artifacts
↓
Merge Approval or Release Tag

````

---

# **3. Pipeline Triggers**

The pipeline triggers on:

### **1. Pull Request (PR)**
- Feature → Develop  
- Bugfix → Develop  
- Develop → Main  

### **2. Push Events**
- Changes in backend/api folders  
- Changes in frontend folders  
- Changes in automation folder  

### **3. Manual Trigger**
- Developers or QA can trigger regression on demand.

---

# **4. Pipeline Stages**

---

# **4.1 Stage 1 – Checkout Code**

Uses GitHub checkout action:

```yaml
- name: Checkout
  uses: actions/checkout@v3
````

---

# **4.2 Stage 2 – Setup Node Environment**

```yaml
- name: Setup Node
  uses: actions/setup-node@v3
  with:
    node-version: 18
```

---

# **4.3 Stage 3 – Install Dependencies**

### Install root + frontend + backend + automation deps:

```yaml
- name: Install Dependencies
  run: |
    npm install
    cd frontend && npm install
    cd ../backend && npm install
    cd ../testing/automation/ui && npm install
    cd ../../api && npm install
```

---

# **4.4 Stage 4 – Build Validation**

### Build frontend (Next.js):

```yaml
- name: Build Frontend
  run: |
    cd frontend
    npm run build
```

### Build backend:

```yaml
- name: Build Backend
  run: |
    cd backend
    npm run build
```

---

# **4.5 Stage 5 – API Automation Tests (Jest + SuperTest)**

```yaml
- name: Run API Tests
  run: |
    cd testing/automation/api
    npm test
```

Artifacts stored:

* Jest report
* JSON summary

---

# **4.6 Stage 6 – UI Automation Tests (Playwright)**

### Install Playwright browsers:

```yaml
- name: Install Playwright Browsers
  run: |
    cd testing/automation/ui
    npx playwright install --with-deps
```

### Run tests:

```yaml
- name: Run UI Tests
  run: |
    cd testing/automation/ui
    npx playwright test
```

Artifacts stored:

* HTML Report
* Trace files
* Screenshots
* Videos

---

# **4.7 Stage 7 – Upload Reports**

```yaml
- name: Upload Test Reports
  uses: actions/upload-artifact@v3
  with:
    name: playwright-ui-test-report
    path: testing/automation/ui/playwright-report/
```

```yaml
- name: Upload API Reports
  uses: actions/upload-artifact@v3
  with:
    name: api-test-report
    path: testing/automation/api/reports/
```

---

# **5. Pipeline Workflow (Full YAML)**

```yaml
name: CI Pipeline

on:
  push:
    branches:
      - main
      - develop
  pull_request:

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install Dependencies
        run: |
          npm install
          cd frontend && npm install
          cd ../backend && npm install
          cd ../testing/automation/ui && npm install
          cd ../../api && npm install

      - name: Build Frontend
        run: |
          cd frontend
          npm run build

      - name: Build Backend
        run: |
          cd backend
          npm run build

      - name: Install Playwright Browsers
        run: |
          cd testing/automation/ui
          npx playwright install --with-deps

      - name: Run API Tests
        run: |
          cd testing/automation/api
          npm test

      - name: Run UI Tests
        run: |
          cd testing/automation/ui
          npx playwright test

      - name: Upload UI Test Report
        uses: actions/upload-artifact@v3
        with:
          name: playwright-ui-report
          path: testing/automation/ui/playwright-report/

      - name: Upload API Test Report
        uses: actions/upload-artifact@v3
        with:
          name: api-test-report
          path: testing/automation/api/reports/
```

---

# **6. Reports and Artifacts**

### **UI Automation (Playwright)**

* HTML reporter
* Trace files `.zip`
* Failure screenshots
* Execution videos

### **API Automation (Jest)**

* HTML / JSON report
* Console logs
* Status breakdown

These artifacts help debug failed builds.

---

# **7. Notifications & Alerts**

Future enhancement:

* Slack notifications
* Email alerts
* GitHub comment on PR with report links

---

# **8. Pipeline Frequency**

| Type             | Frequency               |
| ---------------- | ----------------------- |
| Smoke Suite      | Every PR                |
| API Suite        | Every PR & nightly      |
| UI Suite         | Every PR & nightly      |
| Regression Suite | Manual trigger / weekly |

---

# **9. Quality Gates**

A build is **blocked** if:

* Any UI test fails
* Any API test fails
* Linting fails
* Build fails
* TypeScript errors exist

Ensures release quality.

---

# **10. Future Enhancements**

* Parallel UI + API test jobs
* Allure reporting integration
* Dashboard visualization
* Auto-deploy on successful pipeline
* Running tests on cloud browsers (BrowserStack)
* Code coverage integration

---

# **End of CI/CD Pipeline Document**
