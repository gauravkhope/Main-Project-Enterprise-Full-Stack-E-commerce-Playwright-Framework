# **POM Design Document (Page Object Model Architecture)**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
The purpose of this document is to describe the **Page Object Model (POM) architecture** used in UI test automation for the Modern E-Commerce Web Application.

The POM design provides:

- Clean separation between test scripts and UI locators  
- Highly maintainable and scalable architecture  
- Reusability of actions and UI components  
- Stability through `data-test` based locators  
- Easy onboarding for new QA/SDET members  

---

## **1.2 Scope**
This document covers:

- POM folder structure  
- Page class design  
- Locator strategy  
- Action methods  
- Assertions handling  
- Reusable components  
- Best practices  

This design is used in **Playwright UI Automation**.

---

# **2. POM Folder Structure**

```

testing/
└── automation/
└── ui/
├── pages/
│    ├── login.page.ts
│    ├── register.page.ts
│    ├── product-list.page.ts
│    ├── product-detail.page.ts
│    ├── cart.page.ts
│    ├── checkout.page.ts
│    ├── orders.page.ts
│    └── admin.page.ts
│
├── fixtures/
├── utils/
├── tests/
└── test-data/

```

Each `.page.ts` file maps to a screen in the UI.

---

# **3. POM Design Principles**

### **1. Single Responsibility**
Each page class should represent **one UI screen** only.

### **2. Encapsulation**
- Locators should be private.  
- Expose only actions needed by tests.

### **3. Reusability**
Actions shared across pages should go into:

```

ui/utils/

````

### **4. Stability**
Use **data-test** locators:

```html
<button data-test="login-btn">Login</button>
````

### **5. No Assertions in Page Classes**

Assertions belong in the test files.

POM only handles:

* Locators
* Actions
* Navigation

---

# **4. Page Structure Template**

Each page class follows this structure:

```ts
export class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-btn"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

---

# **5. Page by Page Design**

---

# **5.1 Login Page (login.page.ts)**

### **Locators**

* Email input
* Password input
* Login button
* Error message

### **Actions**

* `goto()`
* `login(email, password)`
* `validateError()` (optional)

---

# **5.2 Register Page (register.page.ts)**

### **Locators**

* Name
* Email
* Password
* Register button

### **Actions**

* `goto()`
* `register(name, email, password)`

---

# **5.3 Product List Page (product-list.page.ts)**

### **Locators**

* Product cards
* Search bar
* Filter dropdowns
* Category list
* Add to cart button (for quick add)

### **Actions**

* `search(keyword)`
* `filterByCategory(category)`
* `filterByPrice(min, max)`
* `openProduct(index)`

---

# **5.4 Product Detail Page (product-detail.page.ts)**

### **Locators**

* Title
* Description
* Price
* Stock
* Add to cart button

### **Actions**

* `addToCart()`
* `getProductTitle()`

---

# **5.5 Cart Page (cart.page.ts)**

### **Locators**

* Item list
* Quantity selector
* Remove item
* Total price

### **Actions**

* `increaseQty(index)`
* `decreaseQty(index)`
* `removeItem(index)`
* `getTotal()`

---

# **5.6 Checkout Page (checkout.page.ts)**

### **Locators**

* Address input fields
* Place order button

### **Actions**

* `fillAddress(data)`
* `placeOrder()`

---

# **5.7 Orders Page (orders.page.ts)**

### **Locators**

* List of orders
* Order detail button

### **Actions**

* `openOrder(index)`

---

# **5.8 Admin Page (admin.page.ts)**

### **Locators**

* Add product
* Edit product
* Delete product
* Order management

### **Actions**

* `createProduct(data)`
* `editProduct(id, data)`
* `deleteProduct(id)`
* `updateOrderStatus(id, status)`

---

# **6. Utility Architecture**

Utilities support the POM and live under:

```
testing/automation/ui/utils/
```

Types of utility files:

### **6.1 wait-utils.ts**

Custom wait methods:

* Wait until element visible
* Wait until request completes

### **6.2 env.ts**

Environment-related utilities:

* baseURL
* credentials

### **6.3 api-helpers.ts**

Useful for hybrid tests:

* Create product by API
* Create order by API

---

# **7. Fixtures**

Fixtures are saved under:

```
testing/automation/ui/fixtures/
```

### Key Fixtures:

* Auth fixture (auto login)
* Base setup fixture (browser/page)
* Reusable state fixture (admin session)

### Example Auth Fixture:

```ts
test.use({
  storageState: 'storage/user.json'
});
```

---

# **8. Best Practices**

### **Locator Best Practices**

* Always use `data-test` selectors
* Avoid CSS/XPath selectors
* Avoid text-based locators

### **POM Best Practices**

* Keep actions small
* Do not add assertions inside POM
* Reuse actions across tests
* Keep page constructor minimal

### **Test Best Practices**

* Use descriptive test names
* Keep test cases atomic
* Avoid coupling tests
* Use fixtures for login
* Always validate navigation

---

# **9. Scalability Plan**

Your POM framework supports:

* Adding new pages easily
* Multiple test suites per feature
* Cross-browser execution
* Parallel testing
* CI/CD integration
* Future AI testing modules

---

# **10. Conclusion**

The POM design provides:

* Clean architecture
* Maintainability
* Stability
* Professional separation of concerns
* Enterprise-level scalability

This POM structure will support long-term SDET workflows and advanced automation strategies.

---

# **End of POM Design Document**