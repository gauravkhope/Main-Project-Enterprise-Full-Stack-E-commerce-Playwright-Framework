# **Test Data Strategy Document**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
The **Test Data Strategy** defines how test data will be created, stored, managed, and refreshed for both **UI** and **API** automation in the Modern E-Commerce Web Application.

A well-designed data strategy ensures:
- Stability of automation tests  
- Repeatable and predictable test results  
- No dependency on production data  
- Full isolation of test environments  
- Easy debugging and maintenance  

---

## **1.2 Scope**
This strategy covers:
- UI Test data  
- API Test data  
- Data creation methods  
- Static vs Dynamic test data  
- Pre-seeded data  
- Data cleanup & reset rules  
- Data versioning

It applies to:
- Dev environment  
- Staging environment  
- Local testing  

---

# **2. Test Data Types**

Test data is classified as:

### **1. Static Test Data**
Stored permanently in `.json` files, includes:
- Predefined users  
- Sample products  
- Categories  
- Address formats  
- Error messages  

Used for:
- UI tests  
- API functional tests  

### **2. Dynamic Test Data**
Generated during runtime:
- Random email for registration  
- Unique order IDs  
- Random category names  
- Temporary admin-created products  

Used for:
- Regression tests  
- Negative scenarios  
- Load variations  

### **3. Hybrid Test Data**
Combination of static + dynamic:
- Static base product, dynamic stock  
- Static user account, dynamic cart items  

---

# **3. Test Data Storage Structure**

Stored under:

```

testing/automation/ui/test-data/
testing/automation/api/data/

````

### **UI Data Folder (`ui/test-data/`)**
Contains:
- `users.json`
- `products.json`
- `checkout.json`
- `addresses.json`
- `filters.json`

### **API Data Folder (`api/data/`)**
Contains:
- API payloads  
- Mock request bodies  
- Negative test payloads  
- Admin/user sample objects  

---

# **4. Static Data Format Examples**

### **users.json**
```json
{
  "validUser": {
    "email": "user@test.com",
    "password": "Password123"
  },
  "adminUser": {
    "email": "admin@test.com",
    "password": "AdminPass123"
  }
}
````

---

### **products.json**

```json
{
  "sampleProduct": {
    "title": "Test Product",
    "price": 999,
    "stock": 10,
    "description": "Automation test product"
  }
}
```

---

### **checkout.json**

```json
{
  "validAddress": {
    "name": "Akshay Singh",
    "phone": "9686646662",
    "line1": "Test Street",
    "pincode": "400001"
  }
}
```

---

# **5. Data Creation Strategy**

---

## **5.1 For UI Tests**

* Use **static test users** for login
* Use **dynamic products** for Add-to-Cart tests
* Reuse **pre-seeded product IDs** when possible
* Use **helper functions** to create products via API before UI flows

### Example:

```ts
const productId = await apiHelper.createProduct();
```

---

## **5.2 For API Tests**

* API tests should create and tear down their own data
* Use **dynamic payloads** for registration tests
* Maintain clean state for each test suite
* Use hooks (`beforeAll`, `afterAll`) to setup test data

---

# **6. Test Data Reset Rules**

To prevent pollution of environments:

### **Local**

* Reset manually or recreate DB
* Use seed script

### **Dev**

* Reset daily (automation recommended)
* Create a **separate DB** for test automation

### **Staging**

* Reset weekly
* No destructive tests allowed without approval

---

# **7. Test Data Generation Utilities**

Utilities stored inside:

```
testing/automation/api/utils/
```

### **Examples include:**

* Random email generator
* Random number/string generator
* Create product utility
* Create order utility
* Admin login utility

### Example Utility

```js
export function generateEmail() {
  return `user_${Date.now()}@test.com`;
}
```

---

# **8. Test Data for Key Modules**

---

## **8.1 Authentication**

* Static admin user
* Static default user
* Dynamic email for registration tests

---

## **8.2 Product Catalog**

* Pre-seeded product list
* Dynamic products for negative tests
* Static categories for filter testing

---

## **8.3 Cart**

* Products created via API
* Different price/stock combinations

---

## **8.4 Checkout**

* Static valid address
* Missing fields for validation tests

---

## **8.5 Orders**

* API-based order creation before UI tests
* Different order states for admin tests (pending, shipped, delivered)

---

## **8.6 Admin**

* Static admin login details
* Dynamic products for CRUD testing

---

# **9. Best Practices**

### ✔ Always use stable static users

### ✔ Use dynamic emails for signup

### ✔ Keep static data small & readable

### ✔ Do not hardcode IDs inside tests

### ✔ Use API utilities to generate data

### ✔ Never modify production data

### ✔ Avoid sharing dynamic data between tests

### ✔ Ensure each test cleans up after itself

---

# **10. Future Enhancements**

* Implement test data server (microservice)
* Use seed scripts triggered from CI
* Build snapshot/restore functionality
* AI-based dynamic data generation
* Database virtualization for isolated testing

---

# **11. Conclusion**

This Test Data Strategy ensures:

* Consistent environment
* Predictable test results
* Efficient test automation
* Stable UI and API testing
* Long-term maintainability

Following this strategy guarantees professional and scalable testing infrastructure.

---

# **End of Test Data Strategy Document**

