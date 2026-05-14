# **E2E Flow Document (End-to-End Scenarios)**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
This document defines all **End-to-End (E2E) business flows** for the Modern E-Commerce Web Application.  
Each flow represents a **real-world customer or admin journey**, covering multiple modules such as:

- Authentication  
- Product listing  
- Cart  
- Checkout  
- Orders  
- Admin management  

These flows will be automated using **Playwright** for UI and validated through **API test suites** where applicable.

---

## **1.2 Objectives**
- Validate the most important business workflows.  
- Ensure correct integration between UI, backend API, and database.  
- Provide coverage for customer-facing and admin-facing journeys.  
- Support smoke, sanity, and regression test cycles.

---

# **2. E2E Flow Structure**
Each flow describes:

- Flow ID  
- Flow Title  
- Pre-Conditions  
- Steps  
- Expected Outcome  

---

# **3. End-to-End User Flows**

---

## **3.1 E2E-USER-01 – User Registration Flow**

### **Pre-Conditions**
- User is not registered.
- User has a valid email.

### **Steps**
1. Navigate to Signup page.  
2. Enter valid name, email, and password.  
3. Submit the registration form.  
4. System creates a new user.  

### **Expected Outcome**
- User account created successfully.  
- User is redirected to login page.  

---

## **3.2 E2E-USER-02 – User Login Flow**

### **Pre-Conditions**
- User is registered.

### **Steps**
1. Open Login page.  
2. Enter registered email and password.  
3. Click Login.  
4. System returns JWT token and user profile.

### **Expected Outcome**
- Login successful.  
- User redirected to Home/Product page.  

---

## **3.3 E2E-USER-03 – Browse Product Catalog**

### **Pre-Conditions**
- Products exist in database.

### **Steps**
1. User logs in.  
2. Navigate to Product Listing page.  
3. Scroll through products.  

### **Expected Outcome**
- Products are displayed with accurate information.  

---

## **3.4 E2E-USER-04 – Search and Filter Products**

### **Pre-Conditions**
- Products with categories exist.

### **Steps**
1. Open Product Listing page.  
2. Enter search keyword.  
3. Apply category filter.  
4. Apply price range filter.  

### **Expected Outcome**
- Only matching products are shown.  

---

## **3.5 E2E-USER-05 – View Product Details**

### **Steps**
1. From product list, click on a product.  
2. Navigate to Product Detail page.

### **Expected Outcome**
- Product information is displayed correctly.  

---

## **3.6 E2E-USER-06 – Add Product to Cart**

### **Steps**
1. On Product Detail page, click “Add to Cart”.  
2. Cart count updates.  
3. Open cart.

### **Expected Outcome**
- Product successfully added to cart.

---

## **3.7 E2E-USER-07 – Update Cart Quantity**

### **Steps**
1. Open Cart page.  
2. Increase product quantity.  
3. Review updated total.  

### **Expected Outcome**
- Cart total recalculates correctly.

---

## **3.8 E2E-USER-08 – Remove Item from Cart**

### **Steps**
1. Open Cart page.  
2. Remove one item.  

### **Expected Outcome**
- Item removed successfully.

---

## **3.9 E2E-USER-09 – Checkout Flow**

### **Pre-Conditions**
- User logged in.
- Cart contains items.

### **Steps**
1. Navigate to checkout page.  
2. Enter address details.  
3. Confirm checkout.  

### **Expected Outcome**
- Order is created.  
- User sees order confirmation.

---

## **3.10 E2E-USER-10 – View Order History**

### **Steps**
1. Navigate to user profile.  
2. Go to Order History.  
3. Open an order.

### **Expected Outcome**
- Order history and details are displayed.

---

---

# **4. End-to-End Admin Flows**

---

## **4.1 E2E-ADMIN-01 – Admin Login**

### **Pre-Conditions**
- Admin account exists.

### **Steps**
1. Navigate to login page.  
2. Enter admin credentials.  

### **Expected Outcome**
- Admin dashboard opens.

---

## **4.2 E2E-ADMIN-02 – Add a New Product**

### **Steps**
1. Login as Admin.  
2. Navigate to Product Management.  
3. Click "Add Product".  
4. Enter product details.  
5. Save.

### **Expected Outcome**
- New product is added and visible in catalog.

---

## **4.3 E2E-ADMIN-03 – Edit an Existing Product**

### **Steps**
1. Login as Admin.  
2. Navigate to Product List.  
3. Select a product.  
4. Change details.  
5. Save.

### **Expected Outcome**
- Product information updated.

---

## **4.4 E2E-ADMIN-04 – Delete a Product**

### **Steps**
1. Login as Admin.  
2. Select a product.  
3. Delete it.  

### **Expected Outcome**
- Product removed from catalog.

---

## **4.5 E2E-ADMIN-05 – View and Manage Orders**

### **Steps**
1. Login as Admin.  
2. Open Orders page.  
3. Select an order.  
4. Update status (Pending → Shipped → Delivered).  

### **Expected Outcome**
- Order status updated correctly.

---

# **5. Cross-Module Flows**

---

## **5.1 Add to Cart → Checkout → Order Placement**

### **Steps**
1. Search for product.  
2. Add to cart.  
3. Review cart.  
4. Checkout.  
5. Create order.  
6. View order confirmation.  

### **Expected Outcome**
- Full shopping flow works without errors.

---

## **5.2 Admin Adds Product → User Purchases That Product**

### **Steps**
1. Admin adds product.  
2. User logs in.  
3. User views new product.  
4. User orders it.  

### **Expected Outcome**
- End-to-end product lifecycle works.

---

# **6. Flow Priority Matrix**

| Flow ID | Flow Name | Priority |
|----------|-----------|-----------|
| E2E-USER-06 | Add to Cart | P0 |
| E2E-USER-09 | Checkout | P0 |
| E2E-USER-10 | View Order History | P1 |
| E2E-ADMIN-02 | Add Product | P1 |
| E2E-ADMIN-05 | Manage Orders | P0 |

---

# **7. Notes**
- All E2E flows will be automated in Playwright.  
- Each flow will have at least one equivalent API validation.  
- Once flows are stable, regression pack will be generated.  

---

# **End of E2E Flow Document**
