# 📄 **SRS – Software Requirements Specification**

**Project:** Modern E-Commerce Web Application
**Version:** 1.0
**Author:** Gaurav Khope
**Document Type:** Requirements Specification
**Last Updated:** *Current Date*

---

# **1. Introduction**

## **1.1 Purpose**

The purpose of this SRS is to define the complete set of **software requirements** for the **Modern E-Commerce Web Application**.
It serves as a reference for:

* Developers
* Testers / SDET Team
* Architects
* Product Owners
* Stakeholders

This document establishes the **functional and non-functional requirements** needed to design, develop, and test the system.

---

## **1.2 Scope**

The Modern E-Commerce Web Application allows users to:

* Browse products
* Search and filter
* Add to cart
* Checkout
* Place orders
* Track order history
* Manage user account

Admins can:

* Manage products
* Manage users
* Manage orders
* Update inventory

The system includes:

* Frontend (Next.js)
* Backend API (Express.js)
* Authentication (JWT)
* Database (MongoDB/PostgreSQL)

AI features may be added **in future versions**.

---

## **1.3 Definitions, Acronyms**

| Term  | Meaning                                   |
| ----- | ----------------------------------------- |
| SRS   | Software Requirements Specification       |
| UI    | User Interface                            |
| API   | Application Programming Interface         |
| JWT   | JSON Web Token                            |
| CRUD  | Create, Read, Update, Delete              |
| Admin | Authorized user with elevated permissions |
| User  | Registered customer                       |

---

## **1.4 References**

* Business requirements (internal notes)
* Similar e-commerce platforms
* JWT authentication guidelines
* REST API principles
* Next.js official documentation

---

# **2. Overall Description**

## **2.1 Product Perspective**

This system is a **standalone full-stack web application** consisting of:

* A Next.js frontend for users & admins
* An Express.js backend providing REST APIs
* A central database storing all persistent data

High-level architecture:

```
Frontend (Next.js) → REST API (Express.js) → Database (MongoDB/PostgreSQL)
```

---

## **2.2 Product Functions**

### **User Functions**

* Sign up / Login
* View product catalog
* Filter, search products
* View product details
* Add to cart
* Update cart
* Checkout
* Place order
* View order history
* Update profile

### **Admin Functions**

* Add product
* Edit product
* Delete product
* View all orders
* Update order status
* Manage inventory
* Manage user roles

---

## **2.3 User Classes**

| User Type       | Description                                |
| --------------- | ------------------------------------------ |
| Guest           | Unregistered user browsing products        |
| Registered User | Can buy products, manage cart, checkout    |
| Admin           | Can manage all app data, inventory, orders |

---

## **2.4 Operating Environment**

* **Frontend:** Next.js (React 18+), Node 18+
* **Backend:** Express.js, Node.js 18+
* **Database:** MongoDB / PostgreSQL
* **Browsers:** Chrome, Firefox, Edge, Safari
* **Hosting:** Vercel / Render / AWS (future choice)

---

## **2.5 Design and Implementation Constraints**

* JWT for authentication
* REST API architecture
* Role-based access control
* Database schema consistency
* Modern browser compatibility
* Secure password hashing (bcrypt)

---

## **2.6 User Documentation**

Will include:

* README.md
* API documentation
* Testing documentation
* Developer setup guide

---

# **3. System Features (Functional Requirements)**

Below are grouped functional requirements.
These will later be expanded into an **FRS**.

---

## **3.1 User Registration & Login**

### **Description**

Users must be able to create an account and securely login.

### **Functional Requirements**

* FR-1: User shall register using name, email, and password
* FR-2: System shall validate unique email
* FR-3: Users shall login with email + password
* FR-4: System shall generate JWT token
* FR-5: Admin role must be identifiable

---

## **3.2 Product Catalog**

### **Description**

Users can view products with search and filters.

### **Functional Requirements**

* FR-10: System shall display product list
* FR-11: System shall support search by keyword
* FR-12: System shall support filter by category/price
* FR-13: System shall show product detail page

---

## **3.3 Cart Management**

### **Description**

Users can add, update, and remove cart items.

### **Functional Requirements**

* FR-20: Add product to cart
* FR-21: Update product quantity
* FR-22: Remove item from cart
* FR-23: Persist cart data

---

## **3.4 Checkout & Order Placement**

### **Description**

Users place an order after providing details.

### **Functional Requirements**

* FR-30: System shall validate cart
* FR-31: System shall calculate total price
* FR-32: System shall create order record
* FR-33: System shall reduce product stock

---

## **3.5 Order Tracking**

### **Functional Requirements**

* FR-40: Users can view their order history
* FR-41: User can open order detail
* FR-42: Admin can change order status

---

## **3.6 Admin Product Management**

* FR-50: Admin can add product
* FR-51: Admin can edit product
* FR-52: Admin can delete product
* FR-53: Admin can update stock and pricing

---

# **4. Non-Functional Requirements**

## **4.1 Performance Requirements**

* System should respond to product listing in < 1 sec
* API calls should respond in < 300ms under normal load
* Checkout process should complete in < 3 sec

---

## **4.2 Security Requirements**

* Password hashing using bcrypt
* JWT-based authentication
* Role-based authorization
* Protection against:

  * SQL/NoSQL injection
  * XSS
  * CSRF
  * Brute-force attacks

---

## **4.3 Reliability**

* System must handle unexpected failures gracefully
* All critical operations must have error handling

---

## **4.4 Usability**

* UI must be simple, intuitive, mobile responsive
* Navigation should support search, filters, breadcrumbs

---

## **4.5 Scalability**

* Product catalog scalable to 10,000+ items
* System designed for future microservices
* Future AI integration possible

---

# **5. System Architecture Overview**

```
Users
│
▼
Frontend (Next.js)
│
▼
Backend API (Express.js)
│
▼
Database (MongoDB / PostgreSQL)
```

---

# **6. Assumptions and Dependencies**

* Users have stable internet
* Email uniqueness is enforced
* Admin role is manually assigned
* External payment gateway may be added later
* AI features may be added in future

---

# **7. Future Enhancements**

* AI-based recommendations
* AI chatbot for customer support
* Payment gateway integration
* Real-time order updates via WebSockets
* Admin analytics dashboard

---

# 🎉 ** SRS is Completed.**

