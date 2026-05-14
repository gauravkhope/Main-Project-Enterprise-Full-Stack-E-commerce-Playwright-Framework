# Bug Report: DEF-002  
**Title:** Checkout / Buy Now does not redirect or load checkout information  
**Module:** Checkout  
**Reported By:** Gaurav Khope (SDET)  
**Date:** YYYY-MM-DD  

---

## 1. Summary
The **Buy Now** button on homepage and product card is not functional.  
Checkout does not open, summary does not load, and API call is not triggered.

---

## 2. Severity & Priority  
- **Severity:** Critical  
- **Priority:** High  

---

## 3. Environment
- Platform: Web  
- Browser: Chrome (Latest)  
- Frontend: Next.js  
- Backend: Node.js + Express  
- DB: MongoDB  

---

## 4. Steps to Reproduce
1. Open Homepage  
2. Select any product  
3. Click **Buy Now** button  
4. Observe UI  
5. Check Network tab  

---

## 5. Expected Result
- User should be redirected to checkout page  
- Product summary should load  
- API call `/checkout` should fire  
- User can proceed to payment  

---

## 6. Actual Result
- No redirect occurs  
- Checkout does not load  
- Product summary missing  
- No API call sent  
- Button is unresponsive  

---

## 7. Attachments  
(Place screenshots or logs)  
`/screenshots/bugs/checkout-not-working.png`

---

## 8. Linked Failed Test Cases
- TC-FAIL-007  
- TC-FAIL-008  
- TC-FAIL-009  
- TC-FAIL-010  
- TC-FAIL-011  
- TC-FAIL-012  
- TC-FAIL-013  
- TC-FAIL-014  

---

## 9. Additional Notes
Critical path failure — checkout is a revenue-generating feature; must be fixed immediately.
