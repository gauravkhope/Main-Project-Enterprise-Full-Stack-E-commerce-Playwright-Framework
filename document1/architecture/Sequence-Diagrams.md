# **Sequence Diagrams Document**  
**Project:** Modern E-Commerce Web Application  
**Version:** 1.0  
**Author:** Gaurav Khope  
**Last Updated:** _Current Date_

---

# **1. Introduction**

## **1.1 Purpose**
This document provides **detailed sequence diagrams** for critical user and admin flows of the Modern E-Commerce Web Application.

Sequence diagrams show:
- Order of interactions  
- Communication between UI, API, Database  
- Data flow  
- Expected automation interactions  

These diagrams are essential for:
- UI automation design  
- API automation validation  
- Test planning  
- Understanding business workflows  

---

# **2. Notation Used**

```

UI = Browser/User Interface (Next.js Frontend)
API = Backend Services (Node.js / Express.js)
DB = Database (MongoDB / PostgreSQL)
TEST = Automation Framework (UI/API)

```

---

# **3. Sequence Diagram: User Login Flow**

```

TEST          UI              API                DB
|            |                |                 |
|---Open Login Page---------->|                 |
|            |                |                 |
|---Enter Email/Password----->|                 |
|            |---POST /login------------------->|
|            |                |---Verify User--->|
|            |                |<--User Found-----|
|            |<--JWT Token-----------------------|
|<--Validate Token------------|                 |
|            |                |                 |

```

---

# **4. Sequence Diagram: Product Listing Flow**

```

TEST          UI              API                DB
|            |                |                 |
|---Open Products Page------->|                 |
|            |---GET /products----------------->|
|            |                |---Fetch List---->|
|            |                |<--Products List--|
|            |<--Render UI-----------------------|
|<--Validate product count----|                 |

```

---

# **5. Sequence Diagram: Product Details Flow**

```

TEST          UI              API                DB
|            |                |                 |
|---Click Product Card------->|                 |
|            |---GET /product/:id-------------->|
|            |                |---Fetch Item---->|
|            |                |<--Item Details---|
|            |<--Render Product Detail-----------|
|<--Validate Title/Price------|                 |

```

---

# **6. Sequence Diagram: Add to Cart Flow**

```

TEST          UI              API                DB
|            |                |                 |
|---Click "Add to Cart"------>|                 |
|            |---POST /cart/add--------------->|
|            |                |---Update/Insert->|
|            |                |<--Success--------|
|            |<--Cart Updated--------------------|
|<--Validate Cart Badge-------|                 |

```

---

# **7. Sequence Diagram: Checkout Flow**

```

TEST          UI                   API                   DB
|            |                     |                    |
|---Open Checkout Page-----------> |                    |
|            |---GET /cart-------------------------------->|
|            |                     |---Fetch Items------->|
|            |                     |<--Cart Items---------|
|---Fill Address------------------>|
|            |---POST /order/create---------------------->|
|            |                     |---Validate Cart------>|
|            |                     |---Deduct Stock------->|
|            |                     |---Create Order--------|
|            |                     |<--Order Response------|
|<--Validate Order Success-------- |

```

---

# **8. Sequence Diagram: Order History Flow**

```

TEST          UI              API                DB
|            |                |                 |
|---Click "Order History"---->|                 |
|            |---GET /orders/user------------->|
|            |                |---Fetch Orders-->|
|            |                |<--Order List------|
|            |<--Render History------------------|
|<--Verify Order Count---------|                 |

```

---

# **9. Sequence Diagram: Admin Add Product Flow**

```

TEST            UI                 API                   DB
|              |                   |                    |
|---Login Admin------------------->|                    |
|---Fill Product Form------------->|                    |
|              |---POST /admin/products--------------->|
|              |                   |---Insert Product--->|
|              |                   |<--Success------------|
|              |<--Product Added--------------------------|
|<--Validate product appears------|                    |

```

---

# **10. Sequence Diagram: Admin Edit Product Flow**

```

TEST            UI                 API                   DB
|              |                   |                    |
|---Open Edit Product------------>|                    |
|              |---PUT /admin/products/:id------------>|
|              |                   |---Update DB-------->|
|              |                   |<--Updated------------|
|              |<--Success Response-----------------------|
|<--Validate Product Changes------|                    |

```

---

# **11. Sequence Diagram: Admin Order Management Flow**

```

TEST            UI                 API                   DB
|              |                   |                    |
|---Open Order Panel------------->|                    |
|              |---GET /admin/orders------------------->|
|              |                   |---Fetch Orders------>|
|              |                   |<--Orders List---------|
|---Update Status---------------> |
|              |---PUT /admin/orders/:id--------------->|
|              |                   |---Update Status------>|
|              |                   |<--Success--------------|
|              |<--Updated UI------------------------------|
|<--Validate Status Updated------|                    |

```

---

# **12. Summary of Sequence Coverage**

| Flow | Covered By |
|------|------------|
| Login | UI + API |
| Product List | UI + API |
| Product Details | UI |
| Add to Cart | UI + API |
| Checkout | Full System |
| Order History | UI + API |
| Admin Add Product | API + UI |
| Admin Edit Product | API + UI |
| Admin Order Management | System Test |

This delivers **complete E2E sequence coverage** for SDET-level testing.

---

# **End of Sequence Diagrams Document**
```
