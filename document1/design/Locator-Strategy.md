# **Locator Strategy Document**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
This document defines the **locator strategy** for the UI automation framework (Playwright) used in the Modern E-Commerce Web Application.

The goal is to ensure:

- Stable selectors  
- Long-term maintainability  
- Avoid flakiness  
- Improve automation speed  
- Standardization across all SDETs  

This document is the **master guideline** for selecting DOM elements in POM and UI test scripts.

---

## **1.2 Scope**
This strategy applies to:

- Playwright tests  
- Page Object Model (POM)  
- Data-test attributes  
- UI testing guidelines  
- Admin & User portals  

It does **not** cover API locators or database identifiers.

---

# **2. Locator Priority Rule**

Use the following order of priority when selecting locators:

### **Priority 1 → `data-test` attributes (Preferred BEST)**
### **Priority 2 → ARIA roles + name**
### **Priority 3 → CSS selectors (stable only)**
### **Priority 4 → Text-based selectors (avoid if possible)**
### **Priority 5 → XPath (NEVER use in this project)**

---

# **3. Recommended Locator Type: `data-test`**

The project must use `data-test` attributes for all important UI elements.

### **Why?**
- Not affected by CSS or layout changes  
- Not visible to users  
- Ideal for automation  
- Reduces flakiness  
- Standard in enterprise automation  

### **Example:**

```html
<input data-test="email" />
<button data-test="login-btn">Login</button>
````

### Playwright usage:

```ts
page.locator('[data-test="login-btn"]');
```

---

# **4. Locator Standards**

## **4.1 General Rules**

* Every interactable element **must** have a `data-test` ID
* All `data-test` values must be lowercase, hyphen-separated
* Avoid dynamic selectors
* Avoid auto-generated selectors

### **Correct Example**

```
data-test="add-to-cart-btn"
```

### **Incorrect Examples**

```
data-test="AddToCart"    ❌
data-id="[random-id]"    ❌
button:nth-child(3)      ❌
```

---

# **5. Naming Conventions**

All names must follow:

```
feature-element-type
```

### **Examples**

| Feature  | Element       | Example                 |
| -------- | ------------- | ----------------------- |
| login    | button        | `login-btn`             |
| product  | card          | `product-card`          |
| cart     | remove button | `cart-remove-btn`       |
| checkout | submit        | `checkout-submit-btn`   |
| admin    | add product   | `admin-add-product-btn` |

---

# **6. Locator Design per Module**

---

# **6.1 Authentication Locators**

### **Examples**

```html
<input data-test="email" />
<input data-test="password" />
<button data-test="login-btn"></button>
<button data-test="register-btn"></button>
```

---

# **6.2 Product Catalog Locators**

```html
<div data-test="product-card"></div>
<input data-test="search-bar" />
<select data-test="filter-category" />
<select data-test="filter-price" />
<button data-test="product-details-btn" />
```

---

# **6.3 Product Detail Page Locators**

```html
<h1 data-test="product-title"></h1>
<p data-test="product-description"></p>
<span data-test="product-price"></span>
<button data-test="add-to-cart-btn"></button>
```

---

# **6.4 Cart Page Locators**

```html
<div data-test="cart-item"></div>
<button data-test="cart-increase-btn"></button>
<button data-test="cart-decrease-btn"></button>
<button data-test="cart-remove-btn"></button>
<span data-test="cart-total"></span>
```

---

# **6.5 Checkout Page Locators**

```html
<input data-test="address-name" />
<input data-test="address-phone" />
<input data-test="address-line1" />
<button data-test="checkout-submit-btn" />
```

---

# **6.6 Orders Page Locators**

```html
<div data-test="order-card"></div>
<button data-test="order-details-btn"></button>
```

---

# **6.7 Admin Page Locators**

```html
<button data-test="admin-add-product-btn"></button>
<button data-test="admin-edit-product-btn"></button>
<button data-test="admin-delete-product-btn"></button>
<select data-test="admin-order-status"></select>
```

---

# **7. Locator Best Practices**

### ✔ **Use data-test attributes for all important elements**

### ✔ Keep names simple and consistent

### ✔ Prefer explicit locators, not generic ones

### ✔ Avoid child index selectors

### ✔ Use unique IDs wherever possible

### ✔ Always update POM when UI updates

### ✔ Use `getByRole()` only when meaningful (e.g., buttons, links)

### ✔ Never use XPath

---

# **8. Examples of Ideal Locators in Playwright**

### **1. Using data-test**

```ts
page.locator('[data-test="login-btn"]');
```

### **2. Using ARIA role**

```ts
page.getByRole('button', { name: 'Login' });
```

### **3. Using stable CSS (last option)**

```ts
page.locator('.product-card .price');
```

---

# **9. Anti-Patterns (DO NOT USE)**

### ❌ Dynamic CSS

```
button:nth-child(4)
```

### ❌ Auto-generated class names

```
._abc12345
```

### ❌ Text-based locators (only use during emergencies)

```
page.getByText('Buy Now')
```

### ❌ XPath

```
/html/body/div[1]/button
```

---

# **10. Locator Maintenance Strategy**

* Every new UI element must have a `data-test` attribute
* POM classes are the **only** place where locators should exist
* UI changes → update POM only → tests remain unchanged
* Weekly UI review to remove unused locators
* Consistent naming across User & Admin panels

---

# **11. Conclusion**

This Locator Strategy ensures:

* Stable automation over time
* Minimum test flakiness
* High maintainability
* Professional enterprise structure
* Reliable Playwright-based testing

Following this strategy will keep UI automation **clean, scalable, and future-proof**.

---

# **End of Locator Strategy Document**

