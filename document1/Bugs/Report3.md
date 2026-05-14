# Bug Report: DEF-003  
**Title:** Remove / Undo / Revert not working in Cart  
**Module:** Cart  
**Reported By:** Gaurav Khope (SDET)  
**Date:** YYYY-MM-DD  

---

## 1. Summary
When user removes an item from the cart, nothing happens.  
Undo button does not appear and removed items reappear after refresh.

---

## 2. Severity & Priority  
- **Severity:** Medium  
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
1. Add any item to cart  
2. Go to Cart page  
3. Click **Remove**  
4. Refresh the page  
5. Check if item is removed  

---

## 5. Expected Result
- Item should be removed  
- Cart count should update  
- Undo/revert option should appear  
- Removed item should not reappear on refresh  

---

## 6. Actual Result
- Remove button is non-functional  
- Cart count unchanged  
- No undo button  
- Item reappears after refresh  

---

## 7. Attachments  
`/screenshots/bugs/cart-remove-not-working.png`

---

## 8. Linked Failed Test Cases
- TC-FAIL-015  
- TC-FAIL-016  
- TC-FAIL-017  
- TC-FAIL-018  
- TC-FAIL-019  
- TC-FAIL-020  

---

## 9. Additional Notes
Possible frontend state management or backend DELETE route issue.
