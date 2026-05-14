# **UI Test Cases Document**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
This document contains all **UI Functional Test Cases** for the Modern E-Commerce Web Application.  
These test cases validate the application’s **front-end behavior**, **user interface elements**, **user flows**, and **visual correctness**.

These will also act as the base for creating automated UI tests using **Playwright** (POM structure).

---

# **2. UI Test Case Format**

Each test case includes:

- Test Case ID  
- Module  
- Title  
- Pre-Conditions  
- Test Steps  
- Expected Result  
- Priority  

---

# **3. UI Test Cases**

---

# **3.1 Authentication Module**

---

## **TC-UI-01 – User Registration**
**Module:** Authentication  
**Pre-Conditions:** User not registered  
**Steps:**  
1. Navigate to Signup page  
2. Enter valid name, email, and password  
3. Submit form  
**Expected Result:**  
- User account is created  
- Redirect to login page  
**Priority:** P0  

---

## **TC-UI-02 – User Login**
**Module:** Authentication  
**Pre-Conditions:** User is registered  
**Steps:**  
1. Open Login page  
2. Enter email/password  
3. Click Login  
**Expected Result:**  
- Login successful  
- User navigates to home page  
**Priority:** P0  

---

## **TC-UI-03 – Invalid Login Error**
**Module:** Authentication  
**Steps:**  
1. Enter wrong credentials  
2. Submit form  
**Expected Result:**  
- Error message displayed: “Invalid credentials”  
**Priority:** P1  

---

# **3.2 Product Catalog Module**

---

## **TC-UI-10 – View Product Listing**
**Module:** Product Catalog  
**Steps:**  
1. Login as user  
2. Open Product listing page  
**Expected Result:**  
- Products are displayed with image, name, price  
**Priority:** P0  

---

## **TC-UI-11 – Search Products**
**Steps:**  
1. Enter text in search bar  
2. Press Enter  
**Expected Result:**  
- Only matching products appear  
**Priority:** P0  

---

## **TC-UI-12 – Filter by Category**
**Steps:**  
1. Click Category filter  
2. Select category  
**Expected Result:**  
- Products in selected category appear  
**Priority:** P1  

---

## **TC-UI-13 – Filter by Price Range**
**Steps:**  
1. Apply price filter  
**Expected Result:**  
- Products within range shown  
**Priority:** P1  

---

## **TC-UI-14 – View Product Details**
**Steps:**  
1. Click product card  
**Expected Result:**  
- Product detail page opens  
- Shows title, image, description, stock  
**Priority:** P0  

---

# **3.3 Cart Module**

---

## **TC-UI-20 – Add Product to Cart**
**Module:** Cart  
**Steps:**  
1. Open product detail page  
2. Click "Add to Cart"  
**Expected Result:**  
- Cart count increases  
- Item added to cart  
**Priority:** P0  

---

## **TC-UI-21 – Increase Cart Quantity**
**Steps:**  
1. Go to Cart page  
2. Increase quantity  
**Expected Result:**  
- Total updated correctly  
**Priority:** P0  

---

## **TC-UI-22 – Decrease Cart Quantity**
**Steps:**  
1. Decrease item quantity  
**Expected Result:**  
- Total updated  
- If qty = 0 → remove item  
**Priority:** P1  

---

## **TC-UI-23 – Remove Item from Cart**
**Steps:**  
1. Click delete icon on an item  
**Expected Result:**  
- Item removed  
**Priority:** P1  

---

## **TC-UI-24 – Cart Persistence**
**Steps:**  
1. Refresh page  
**Expected Result:**  
- Cart items remain intact  
**Priority:** P0  

---

# **3.4 Checkout Module**

---

## **TC-UI-30 – Checkout Page Loads**
**Pre-Conditions:** Cart not empty  
**Steps:**  
1. Navigate to checkout page  
**Expected Result:**  
- Checkout form visible  
**Priority:** P0  

---

## **TC-UI-31 – Successful Checkout**
**Steps:**  
1. Fill address  
2. Click “Place Order”  
**Expected Result:**  
- Order created  
- Confirmation message shown  
**Priority:** P0  

---

## **TC-UI-32 – Checkout Validation Errors**
**Steps:**  
1. Submit checkout form empty  
**Expected Result:**  
- Validation errors displayed  
**Priority:** P1  

---

# **3.5 Order Module**

---

## **TC-UI-40 – View Order History**
**Steps:**  
1. Open Profile  
2. Click “Order History”  
**Expected Result:**  
- List of previous orders displayed  
**Priority:** P1  

---

## **TC-UI-41 – View Order Details**
**Steps:**  
1. Click an order from history  
**Expected Result:**  
- Order details shown (items, qty, amounts)  
**Priority:** P1  

---

# **3.6 Admin Module**

---

## **TC-UI-50 – Admin Login**
**Steps:**  
1. Enter admin credentials  
**Expected Result:**  
- Admin dashboard appears  
**Priority:** P0  

---

## **TC-UI-51 – Admin Add Product**
**Steps:**  
1. Navigate to product management  
2. Click “Add Product”  
3. Enter details  
4. Save  
**Expected Result:**  
- Product appears in list  
**Priority:** P0  

---

## **TC-UI-52 – Admin Edit Product**
**Steps:**  
1. Select product  
2. Modify fields  
3. Save  
**Expected Result:**  
- Product updated  
**Priority:** P1  

---

## **TC-UI-53 – Admin Delete Product**
**Steps:**  
1. Click delete icon  
2. Confirm delete  
**Expected Result:**  
- Product removed  
**Priority:** P1  

---

## **TC-UI-54 – Admin Order Management**
**Steps:**  
1. Open Orders page  
2. Select order  
3. Change status  
**Expected Result:**  
- Status updated successfully  
**Priority:** P0  

---

# **4. UI Test Coverage Summary**

| Module | Number of Test Cases | Priority |
|--------|------------------------|----------|
| Authentication | 3 | P0–P1 |
| Product Catalog | 5 | P0–P1 |
| Cart | 5 | P0–P1 |
| Checkout | 3 | P0–P1 |
| Orders | 2 | P1 |
| Admin | 5 | P0–P1 |

Total UI Test Cases: **23**

---

# **5. Notes**
- All TC-UI tests will be automated using Playwright.  
- Test data for admin/user flows should be prepared before execution.  
- All tests must use stable `data-test` selectors.  

---

# **End of UI Test Cases Document**
