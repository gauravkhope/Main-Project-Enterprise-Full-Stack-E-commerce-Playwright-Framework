# Defect Summary Report  
**Project:** Modern E-Commerce Web Application  
**Prepared By:** Gaurav Khope (SDET)  
**Version:** 1.0  
**Date:** YYYY-MM-DD  

---

## 1. Overview  
This document provides a consolidated summary of all reported defects identified during the manual testing phase.  
A total of **3 high-impact defects** were logged across Wishlist, Checkout, and Cart modules.

---

## 2. Defect Summary Table

| Defect ID | Module | Title | Severity | Priority | Status | Linked Test Cases |
|-----------|---------|--------|----------|----------|---------|--------------------|
| **DEF-001** | Wishlist | Add to Wishlist button not working | High | High | Open | TC-FAIL-001, 002, 003, 004, 005, 006 |
| **DEF-002** | Checkout | Checkout / Buy Now does not trigger navigation or load checkout data | Critical | High | Open | TC-FAIL-007, 008, 009, 010, 011, 012, 013, 014 |
| **DEF-003** | Cart | Remove / Undo / Revert not working | Medium | High | Open | TC-FAIL-015, 016, 017, 018, 019, 020 |

---

## 3. Defect Severity Definition

| Severity Level | Description |
|-----------------|--------------|
| **Critical** | Core functionality broken; user unable to continue workflow |
| **High** | Major feature not working; impacts user flow |
| **Medium** | Function works partially or inconsistently |
| **Low** | Cosmetic or minor issues that do not affect functionality |

---

## 4. Defect Priority Definition

| Priority Level | Description |
|-----------------|--------------|
| **High** | Must be resolved immediately; impacts primary user journey |
| **Medium** | Should be resolved soon but not blocking |
| **Low** | Can be fixed in later release; low impact |

---

## 5. Defect Status Meaning

| Status | Meaning |
|-|-|
| **Open** | Developer has not yet started working |
| **In Progress** | Fix is being implemented |
| **Resolved** | Developer has fixed the issue |
| **Re-Test** | QA needs to verify the fix |
| **Closed** | Verified by QA and approved |
| **Deferred** | Will be fixed in a future release |

---

## 6. Summary & Impact Analysis

### ✔ DEF-001: Wishlist Button  
- Impacts user's ability to save products  
- Affects personalization feature  
- Medium business impact  

### ✔ DEF-002: Checkout Failure (**Critical**)  
- Blocks purchase flow  
- Directly affects revenue  
- Must be fixed immediately  
- Highest risk area  

### ✔ DEF-003: Cart Revert Failure  
- Removes user control over cart actions  
- Affects user trust  
- High impact but not blocking checkout  

---

## 7. Recommendations

1. **Fix checkout defect first** (revenue-critical).  
2. Follow with **wishlist fix** (important UX feature).  
3. Lastly address **cart revert issue** (medium severity).  
4. Perform a **full regression cycle** after fixes.  
5. Only then begin **automation setup**.

---

## 8. Sign-Off

**QA/SDET:** Gaurav Khope  
**Status:** Defect Summary Prepared & Reviewed  
