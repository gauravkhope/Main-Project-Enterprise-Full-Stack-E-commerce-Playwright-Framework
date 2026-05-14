# **Automation Architecture Document**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
This document describes the **end-to-end automation architecture** for the Modern E-Commerce Web Application.  
It outlines how UI and API test automation frameworks are designed, implemented, and structured using:

- Playwright (UI)  
- Jest + SuperTest (API)  
- Page Object Model (POM)  
- Fixtures and utilities  
- CI/CD integration  

This document ensures scalability, maintainability, and enterprise-level structure for long-term growth.

---

## **1.2 Automation Goals**
- Fully separate UI & API automation.  
- Stable, reusable, readable, and maintainable tests.  
- Reduce flakiness using professional patterns.  
- Provide clean CI/CD integration for continuous execution.  
- Support parallel testing and modular scaling.

---

# **2. High-Level Automation Architecture**

```

```
                      ┌────────────────────────────┐
                      │        Automation           │
                      │         Framework           │
                      └────────────────────────────┘
                                   │
                                   ▼
         ┌───────────────UI Automation──────────────┐
         │                 (Playwright)              │
         │   - POM Architecture                      │
         │   - Fixtures (Auth, Products)             │
         │   - Utils (waits, env, helpers)           │
         │   - Tests (functional + e2e)              │
         └───────────────────────────────────────────┘
                                   │
                                   ▼
       ┌──────────────API Automation (Jest + SuperTest)──────────────┐
       │   - Test suites                                              │
       │   - Helper utilities                                         │
       │   - Token & session handlers                                 │
       │   - Contract/response validation                             │
       └──────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                     ┌───────────────────────────┐
                     │          Reports           │
                     │  HTML, JSON, traces, logs  │
                     └───────────────────────────┘
                                   │
                                   ▼
                     ┌───────────────────────────┐
                     │           CI/CD            │
                     │ GitHub Actions integration │
                     └───────────────────────────┘
```

```

---

# **3. Folder Structure**

The automation folder lives under:testing/automation/


## **3.1 UI Automation Structure (Playwright)**

```

testing/
└── automation/
└── ui/
├── tests/             # All UI test scripts
├── pages/             # Page Object Model classes
├── fixtures/          # Auth fixtures, global setup
├── utils/             # Helper modules
├── test-data/         # JSON files for static data
└── playwright.config.ts

```

---

## **3.2 API Automation Structure (Jest + SuperTest)**

```

testing/
└── automation/
└── api/
├── tests/             # API test suites
├── data/              # Payloads and JSON data
├── utils/             # Helper functions (tokens, requests)
└── jest.config.js

```

---

# **4. UI Automation Design (Playwright)**

## **4.1 Framework Components**

### **1. Playwright Test Runner**
- Supports parallel execution  
- Auto-waits  
- Screenshot, video, trace capturing  

### **2. Page Object Model (POM)**
Each page contains:
- URL  
- Locators  
- Page actions  
- Assertions (optional)  

### **3. Fixtures**
- Authentication fixture  
- Reusable test setup  
- State management  
- API pre-test utilities  

### **4. Utilities**
- Custom waiters  
- Environment reader  
- Logger  
- API helpers (optional inside UI tests)  

---

## **4.2 POM Architecture Sample**

```

pages/
├── login.page.ts
├── product.page.ts
├── cart.page.ts
├── checkout.page.ts
├── profile.page.ts
└── admin.page.ts

````

### **Each page file contains:**
- Locators using `data-test` attributes  
- Functions representing user actions  
- Helper methods for repeated tasks  

---

## **4.3 Example POM Structure**

```ts
class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator('[data-test="email"]');
    this.password = page.locator('[data-test="password"]');
    this.loginBtn = page.locator('[data-test="login-btn"]');
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginBtn.click();
  }
}
````

---

## **4.4 Test Example**

```ts
test('User Login Flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('/login');
  await loginPage.login("test@test.com", "password123");
  await expect(page).toHaveURL("/products");
});
```

---

# **5. API Automation Design (Jest + SuperTest)**

## **5.1 Components**

### **1. Jest Test Runner**

* Snapshot testing
* Parallel test execution
* Mock capabilities

### **2. SuperTest**

* Makes HTTP requests to Express API
* Validates status codes & payloads

### **3. Utils**

* Token generator
* Admin/user login utilities
* Request wrapper
* Environment handler

---

## **5.2 API Utils Sample**

```js
export async function getUserToken() {
  const res = await request(app).post('/api/auth/login').send({
    email: "user@test.com",
    password: "password123"
  });

  return res.body.token;
}
```

---

# **6. Reporting Architecture**

## **6.1 UI Reports**

* Playwright HTML report
* Screenshots
* Videos
* Trace files

## **6.2 API Reports**

* Jest HTML output
* JSON summary
* Console logs

---

# **7. CI/CD Integration**

## **7.1 GitHub Actions Pipeline**

Pipeline stages:

1. Install dependencies
2. Build backend & frontend (if required)
3. Run API tests
4. Run UI tests
5. Upload reports
6. Notification / dashboard

---

## **7.2 Parallel Execution**

* UI tests run in multiple browsers
* API tests run concurrently
* Matrix builds supported

---

# **8. Quality & Stability Measures**

* Use `data-test` locators for stability
* Avoid brittle CSS/XPath selectors
* Use retries only when required
* Use fresh browser context for each test
* Keep test cases independent

---

# **9. Scalability Design**

* Easy to add new pages in POM
* Easy to add new API endpoints
* Reusable utilities reduce duplication
* Supports multi-environment testing
* Ready for microservices expansion

---

# **10. Future Enhancements**

* Integrate Allure reporting
* Add contract testing layer (Swagger/OpenAPI)
* Implement performance tests
* Run tests on cloud browsers (BrowserStack, LambdaTest)
* Add AI-based auto-locator generation

---

# **End of Automation Architecture Document**