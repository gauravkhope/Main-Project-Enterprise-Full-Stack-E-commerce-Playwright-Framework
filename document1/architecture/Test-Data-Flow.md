# **Test Data Flow Document**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
This document explains the **complete Test Data Flow** used in UI and API automation for the Modern E-Commerce Web Application.

It outlines:
- How test data is created  
- How static & dynamic data is used  
- How data flows across UI, API & DB  
- Cleanup & refresh strategies  
- Interaction with CI/CD pipelines  

This ensures predictable, repeatable, and stable test results.

---

## **1.2 Scope**
Test data flow covers:
- UI automation  
- API automation  
- Test data utilities  
- Environment data  
- Pre-seeded data  
- Dynamic runtime data  
- Data lifecycle management  

---

# **2. High-Level Test Data Flow Diagram**

```

```
          ┌────────────────────────────┐
          │       Test Engineer        │
          └──────────────┬─────────────┘
                         ▼
            ┌───────────────────────────┐
            │   Test Case Execution     │
            │   UI + API Automation     │
            └──────────────┬────────────┘
                         ▼
      ┌─────────────────────────────────────┐
      │           Test Data Layer           │
      │ Static + Dynamic + Utilities        │
      └────────────────────┬────────────────┘
                           │
        ┌──────────────────┼───────────────────┐
        ▼                  ▼                   ▼
```

┌────────────────┐  ┌─────────────────────┐  ┌────────────────────┐
│Static Test Data│  │ Dynamic Test Data   │  │ API Data Generators│
│ (JSON Files)   │  │ (Runtime Generated) │  │ (Utility Functions)│
└────────────────┘  └──────────┬──────────┘  └──────────────┬────┘
│                            │
▼                            ▼
┌────────────────────┐      ┌─────────────────────┐
│Backend Services    │      │   Database Layer    │
│(Express.js APIs)   │      │ MongoDB/Postgres DB │
└──────────┬─────────┘      └────────────┬────────┘
▼                              ▼
┌─────────────────────┐       ┌─────────────────────┐
│ Frontend (UI)       │       │ Reporting & Logs    │
│  Next.js React UI   │       │ (Trace, HTML, JSON) │
└─────────────────────┘       └─────────────────────┘

```

---

# **3. Types of Test Data**

---

## **3.1 Static Test Data (Predefined JSON)**
Stored inside:

```

testing/automation/ui/test-data/
testing/automation/api/data/

```

Includes:
- Users  
- Admin accounts  
- Product samples  
- Checkout address templates  
- Filters  
- Error messages  

Static data is used for:
- Login flows  
- Checkout defaults  
- Repeatable testing  
- Validation scenarios  

---

## **3.2 Dynamic Test Data (Runtime Generated)**

Created during test execution using utilities:

Examples:
- Random email for user registration  
- Unique product names  
- Unique order IDs  
- Temporary carts  
- Random stock & variants  

Dynamic data is used for:
- Negative tests  
- Boundary tests  
- Regression scenarios  
- One-time flows  

---

## **3.3 Hybrid Data (Static + Dynamic Combination)**

Example:
- Static user → dynamic orders  
- Static product → dynamic stock updates  
- Static checkout address → dynamic phone  

---

# **4. Detailed Test Data Flow**

---

# **4.1 UI Automation Data Flow (Playwright)**

```

POM Test → Loads Test Data → UI Actions → Backend API → DB → UI Response

```

### Detailed Steps:
1. Test loads static test data from JSON  
2. POM actions interact with UI  
3. UI sends AJAX/REST request to backend  
4. Backend validates data  
5. DB stores/retrieves information  
6. UI reflects final result  
7. Playwright captures logs/screenshots/trace  

---

# **4.2 API Automation Data Flow (Jest + SuperTest)**

```

Test Suite → Load Static Payload → Apply Dynamic Fields → API Call → Backend → DB

```

### Steps:
1. Test loads static payload  
2. Dynamic generator adds fields (email, SKU, etc.)  
3. API request sent using SuperTest  
4. Backend processes the request  
5. DB stores or updates data  
6. Response returned → validated by Jest  

---

# **4.3 Combined UI + API Data Flow**

```

API Generates Data → UI Uses That Data → UI Validates → Backend Confirms → DB Stores

```

Example:
- API creates a product  
- UI automation uses created product ID  
- UI flow adds that product to cart  
- Checkout completes using API-generated data  

This creates **super-stable** E2E flows.

---

# **5. Test Data Lifecycle**

---

## **5.1 Creation**
Data is created by:
- JSON files  
- Utility functions  
- API calls  
- DB seeds  

---

## **5.2 Usage**
Used by:
- Playwright UI tests  
- Jest API tests  
- Regression flows  
- Smoke cases  

---

## **5.3 Cleanup**
Strategies include:
- API-based cleanup  
- DB reset for local  
- Daily cleanup in dev environment  

---

## **5.4 Refresh**
- Daily refresh for dev  
- Weekly refresh for staging  
- Reset triggers in CI  

---

# **6. Test Data Storage Structure**

```

testing/
└── automation/
├── ui/
│    └── test-data/
│          users.json
│          products.json
│          addresses.json
│          filters.json
│
└── api/
└── data/
sample-payloads.json
invalid-payloads.json
negative-tests.json

```

---

# **7. Test Data Utilities**

Stored inside:

```

testing/automation/api/utils/
testing/automation/ui/utils/

```

### Utilities include:
- Random email generator  
- Random string/number generator  
- Product creation utility  
- Order creation utility  
- Token generator  
- Environment utility  

---

# **8. Test Data Rules**

### ✔ Use static users for login  
### ✔ Use dynamic emails for signup  
### ✔ Never hardcode IDs in tests  
### ✔ Use pre-seeded admin data  
### ✔ API should generate required product/order before UI tests  
### ✔ Avoid reusing dynamic data across test cases  
### ✔ Ensure cleanup after destructive tests  

---

# **9. Test Data Flow in CI Pipeline**

```

CI Trigger
│
▼
Load Test Data (Static JSON)
│
▼
Generate Dynamic Data Utilities
│
▼
Run API Tests → Update DB
│
▼
Run UI Tests → Consume DB/API Data
│
▼
Generate Reports → Artifacts Saved

```

CI ensures:
- Clean environment  
- Fresh data per pipeline  
- No test collisions  
- Predictable outcomes  

---

# **10. Future Enhancements**

- Test Data Microservice  
- Snapshot/Restore DB states  
- Environment virtualization  
- AI-generated smart test data  
- Test data monitoring dashboard  

---

# **End of Test Data Flow Document**
