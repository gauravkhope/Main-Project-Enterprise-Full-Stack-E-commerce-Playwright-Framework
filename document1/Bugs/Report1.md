# Bug Report: DEF-001  
**Title:** Add to Wishlist button not working on Homepage  
**Module:** Wishlist  
**Reported By:** Gaurav Khope (SDET)  
**Date:** YYYY-MM-DD  

---

## 1. Summary
When clicking the **Add to Wishlist** button on the homepage, nothing happens.  
Product is not added, counter does not update, and no API call is triggered.

---

## 2. Severity & Priority  
- **Severity:** High  
- **Priority:** High  

---

## 3. Environment
- Platform: Web  
- Browser: Chrome (Latest)  
- Frontend: Next.js  
- Backend: Node.js + Express  
- DB: MongoDB  
- Build: Dev Environment  

---

## 4. Steps to Reproduce
1. Go to Homepage  
2. Select any product  
3. Click the **Add to Wishlist** button  
4. Navigate to Wishlist page  

---

## 5. Expected Result
- Product should be added to wishlist  
- Wishlist count should increase  
- Wishlist page should show selected product  
- API call should be triggered  

---

## 6. Actual Result
- Nothing happens  
- No data added  
- Counter unchanged  
- Wishlist page is empty  
- No API call triggered (checked in DevTools → Network tab)

---

## 7. Attachments  
(Place screenshots here)  
`/screenshots/bugs/wishlist-not-working.png`

---

## 8. Linked Failed Test Cases
- TC-FAIL-001  
- TC-FAIL-002  
- TC-FAIL-003  
- TC-FAIL-004  
- TC-FAIL-005  
- TC-FAIL-006  

---

## 9. Additional Notes
Likely a missing click handler or backend route not connected.
