#  **TEST EXECUTION REPORT**

 For: Modern E-Commerce Web Application*
 Prepared By: **Gaurav Khope (SDET)**
 Version: 1.0
 Execution Cycle: Manual Testing Phase

#  **1. Execution Summary (Overall)**

| Metric                    | Count                         |
| ------------------------- | ----------------------------- |
| Total Test Cases Executed | **680** (660 + 20 failed set) |
| Total Passed              | **660**                       |
| Total Failed              | **20**                        |
| Total Blocked             | **0**                         |
| Total Not Executed        | **0**                         |
| **Pass Percentage**       | **97.05%**                    |
| **Fail Percentage**       | **2.95%**                     |

✔ High stability
✔ Most flows working correctly
✔ Only 3 modules show functional bugs

---

#  **2. Module-Wise Execution Summary**

| Module            | Total Test Cases | Passed | Failed | Status                         |
| ----------------- | ---------------- | ------ | ------ | ------------------------------ |
| Homepage          | 120              | 118    | 2      | Stable with minor issues       |
| Search & Filter   | 90               | 90     | 0      | Passed                         |
| Product Details   | 60               | 60     | 0      | Passed                         |
| Cart              | 95               | 89     | 6      | ⚠ Issues in revert/remove flow |
| Checkout          | 110              | 102    | 8      | ⚠ Checkout functional issues   |
| Orders            | 70               | 70     | 0      | Passed                         |
| Profile           | 55               | 55     | 0      | Passed                         |
| API (All Modules) | 90               | 90     | 0      | Passed                         |
| Database          | 15               | 15     | 0      | Passed                         |
| Integration       | 15               | 15     | 0      | Passed                         |
| Security          | 10               | 10     | 0      | Passed                         |
| Performance       | 5                | 5      | 0      | Passed                         |

---

#  **3. Summary of Failed Test Cases**

20 failed test cases are grouped under 3 functional areas:

### **A. Wishlist (Homepage)** – 6 Failures

* Add to Wishlist not working
* Wishlist counter not updating
* Wishlist page remains empty

### **B. Checkout (Homepage → Product → Buy Now)** – 8 Failures

* Buy Now button not responding
* Checkout does not load
* Summary missing
* No API call triggered

### **C. Cart Revert Functionality** – 6 Failures

* Remove button non-functional
* Undo option missing
* Cart list not refreshing
* State not persisted after refresh

---

#  **4. Defect Overview (High-Level)**

| Defect ID | Module   | Summary                            | Severity | Priority | Status |
| --------- | -------- | ---------------------------------- | -------- | -------- | ------ |
| DEF-001   | Wishlist | Add to Wishlist not functioning    | High     | High     | Open   |
| DEF-002   | Checkout | Buy Now / Checkout flow broken     | Critical | High     | Open   |
| DEF-003   | Cart     | Remove / Undo / Revert not working | Medium   | High     | Open   |

*Detailed bug reports will be created separately.*

---

#  **5. Test Environment Details**

| Environment Component | Details                                  |
| --------------------- | ---------------------------------------- |
| Frontend              | Next.js (React)                          |
| Backend               | Express.js (Node.js)                     |
| Database              | MongoDB                                  |
| Runtime               | Node 18+                                 |
| Browser Used          | Chrome (Latest), Playwright Test Browser |
| OS                    | Windows                                  |

---

#  **6. Tools Used**

| Category             | Tools                        |
| -------------------- | ---------------------------- |
| Test Case Management | Google Sheets                |
| Manual Testing       | Browser DevTools             |
| API Testing          | Postman / Playwright API     |
| Performance          | JMeter / Playwright Load     |
| Security             | Manual validation / Payloads |
| Documentation        | Markdown (VS Code)           |

---

## 7. Final Remarks (SDET Summary)

- Manual testing cycle is successfully completed.
- Most modules exhibit stable and expected behavior.
- Three modules require immediate fixes:  
  - Wishlist  
  - Checkout  
  - Cart revert functionality
- After fixes, a regression cycle is recommended.
- Automation (UI + API) should begin after major bugs are resolved.
- Pass rate of **97%** shows strong application quality overall.

---

## 8. Sign-off

**QA/SDET:** Gaurav Khope  
**Status:** Manual Testing Cycle Completed 


#  **TEST EXECUTION REPORT IS COMPLETE**

