# **API Test Cases Document**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
This document contains all **API Functional Test Cases** for the Modern E-Commerce Web Application.  
The goal is to validate:

- API request/response behavior  
- Input validation  
- Authentication & authorization  
- Error handling  
- Business logic validations  
- Response status codes  
- Data integrity  

API tests will be automated using **Jest + SuperTest**.

---

# **2. API Test Case Format**

Each test case includes:

- API-TC-ID  
- Endpoint  
- Test Objective  
- Method  
- Pre-Conditions  
- Test Steps  
- Expected Response  
- Expected Status Code  
- Priority  

---

# **3. Test Cases by Module**

---

# **3.1 Authentication API**

---

## **API-TC-01 – Register User (Positive)**
**Endpoint:** `POST /api/auth/register`  
**Method:** POST  
**Objective:** Validate successful user registration  
**Pre-Conditions:** New user email  
**Steps:**  
1. Send valid name, email, password  
**Expected Response:**  
- User created  
- JSON response with userId  
**Status Code:** 201  
**Priority:** P0  

---

## **API-TC-02 – Register User (Duplicate Email)**
**Endpoint:** `/api/auth/register`  
**Objective:** Validate email uniqueness  
**Steps:**  
1. Register using an already registered email  
**Expected:**  
- Error message: “Email already exists”  
**Status Code:** 400  
**Priority:** P1  

---

## **API-TC-03 – Login User (Positive)**
**Endpoint:** `POST /api/auth/login`  
**Objective:** Validate login process  
**Steps:**  
1. Enter valid credentials  
**Expected:**  
- JWT token returned  
- User profile returned  
**Status Code:** 200  
**Priority:** P0  

---

## **API-TC-04 – Login User (Wrong Password)**
**Objective:** Validate incorrect login handling  
**Expected:**  
- Error message: “Invalid credentials”  
**Status Code:** 401  
**Priority:** P1  

---

## **API-TC-05 – Access Protected Route Without Token**
**Endpoint:** Any `/api/user/*`  
**Objective:** Validate auth middleware  
**Expected:**  
- Unauthorized access error  
**Status Code:** 401  
**Priority:** P0  

---

## **API-TC-06 – Access Admin Route as User**
**Endpoint:** `/api/admin/*`  
**Objective:** Validate role protection  
**Expected:**  
- Forbidden access  
**Status Code:** 403  
**Priority:** P0  

---

# **3.2 Product API**

---

## **API-TC-10 – Get Product List**
**Endpoint:** `GET /api/products`  
**Objective:** Fetch all products  
**Expected:**  
- Array of products  
- Pagination supported  
**Status Code:** 200  
**Priority:** P0  

---

## **API-TC-11 – Search Products**
**Endpoint:** `/api/products?search=`  
**Objective:** Validate search functionality  
**Expected:**  
- Products matching keyword  
**Status Code:** 200  
**Priority:** P0  

---

## **API-TC-12 – Get Product by ID**
**Endpoint:** `GET /api/products/:id`  
**Objective:** Fetch product details  
**Expected:**  
- Product object  
**Status Code:** 200  
**Priority:** P0  

---

## **API-TC-13 – Get Product Not Found**
**Endpoint:** `/api/products/:id`  
**Expected:**  
- Error: “Product not found”  
**Status Code:** 404  
**Priority:** P1  

---

## **API-TC-14 – Admin Add Product**
**Endpoint:** `POST /api/admin/products`  
**Method:** POST  
**Pre-Conditions:** Admin Token  
**Objective:** Validate product creation  
**Expected:**  
- Product created  
**Status Code:** 201  
**Priority:** P0  

---

## **API-TC-15 – Admin Edit Product**
**Endpoint:** `PUT /api/admin/products/:id`  
**Objective:** Validate product update  
**Expected:**  
- Updated product details  
**Status Code:** 200  
**Priority:** P1  

---

## **API-TC-16 – Admin Delete Product**
**Endpoint:** `DELETE /api/admin/products/:id`  
**Objective:** Validate product deletion  
**Expected:**  
- Product removed  
**Status Code:** 200  
**Priority:** P1  

---

# **3.3 Cart API**

---

## **API-TC-20 – Add Product to Cart**
**Endpoint:** `POST /api/cart/add`  
**Method:** POST  
**Pre-Conditions:** Valid token  
**Objective:** Validate cart add logic  
**Expected:**  
- Cart updated  
**Status Code:** 200  
**Priority:** P0  

---

## **API-TC-21 – Update Cart Quantity**
**Endpoint:** `PUT /api/cart/update`  
**Objective:** Validate quantity update  
**Expected:**  
- Updated quantities returned  
**Status Code:** 200  
**Priority:** P0  

---

## **API-TC-22 – Remove Product from Cart**
**Endpoint:** `DELETE /api/cart/remove/:id`  
**Expected:**  
- Item removed  
**Status Code:** 200  
**Priority:** P1  

---

## **API-TC-23 – Cart Persistence**
**Endpoint:** `GET /api/cart`  
**Objective:** Validate cart persistence  
**Expected:**  
- Items remain across sessions  
**Status Code:** 200  
**Priority:** P1  

---

# **3.4 Checkout & Orders API**

---

## **API-TC-30 – Checkout Validation**
**Endpoint:** `POST /api/orders/checkout`  
**Objective:** Validate checkout  
**Expected:**  
- Address validations  
- Cart validation  
**Status Code:** 400 / 200  
**Priority:** P0  

---

## **API-TC-31 – Create Order**
**Endpoint:** `POST /api/orders/create`  
**Objective:** Create order  
**Expected:**  
- Order created  
- Order ID returned  
**Status Code:** 201  
**Priority:** P0  

---

## **API-TC-32 – Reduce Stock After Order**
**Endpoint:** `/api/orders/create`  
**Objective:** Validate stock deduction  
**Expected:**  
- Stock reduced based on quantity  
**Status Code:** 200  
**Priority:** P0  

---

## **API-TC-33 – Invalid Order Request**
**Expected:**  
- Error: “Invalid data”  
**Status Code:** 400  
**Priority:** P2  

---

# **3.5 Order Tracking API**

---

## **API-TC-40 – Fetch User Orders**
**Endpoint:** `GET /api/orders/user`  
**Objective:** Fetch order history  
**Expected:**  
- Array of orders  
**Status Code:** 200  
**Priority:** P1  

---

## **API-TC-41 – Fetch Order Details**
**Endpoint:** `GET /api/orders/:id`  
**Objective:** Fetch order detail  
**Expected:**  
- Order object  
**Status Code:** 200  
**Priority:** P1  

---

## **API-TC-42 – Admin Change Order Status**
**Endpoint:** `PUT /api/admin/orders/:id`  
**Objective:** Check admin update logic  
**Expected:**  
- Status updated  
**Status Code:** 200  
**Priority:** P0  

---

# **4. API Test Coverage Summary**

| Module | Test Cases | Priority Range |
|--------|-------------|----------------|
| Authentication | 6 | P0–P1 |
| Products | 7 | P0–P1 |
| Cart | 4 | P0–P1 |
| Orders | 4 | P0–P1 |
| Order Tracking | 3 | P0–P1 |

Total API Test Cases: **24**

---

# **5. Notes**
- All tests will be automated using Jest + SuperTest.  
- Tokens for user/admin will be generated via fixture utilities.  
- Test DB should be reset before each test run.  
- Ensure proper response schema validation.  

---

# **End of API Test Cases Document**
