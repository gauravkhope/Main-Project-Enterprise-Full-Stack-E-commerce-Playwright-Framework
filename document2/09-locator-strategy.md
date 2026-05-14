# AI-Commerce Locator Strategy
Version: 1.0  
Owner: Test Engineering Team  
Project: AI-Commerce Enterprise Platform  

---

# 1. Purpose

This document defines the standardized locator selection and UI interaction policy for the AI-Commerce automation framework.

Objective:

- Prevent flaky tests
- Improve maintainability
- Reduce brittle selectors
- Enable UI redesign tolerance
- Enforce clean separation of concerns

---

# 2. Locator Philosophy

Locators must be:

- Stable
- Semantic
- Predictable
- Intent-based
- Resistant to UI cosmetic changes

Locators must NOT depend on:

- Dynamic IDs
- DOM hierarchy depth
- CSS styling classes
- Positional indexing

---

# 3. Locator Priority Order

Automation must follow this priority hierarchy:

1️⃣ data-testid (preferred)  
2️⃣ ARIA roles  
3️⃣ Accessible name  
4️⃣ Stable semantic attribute  
5️⃣ Controlled CSS selector  
6️⃣ XPath (last resort, highly discouraged)

---

# 4. data-testid Policy

Frontend must expose stable attributes:

Example:
data-testid="login-button"

Benefits:
- Independent of CSS changes
- Independent of UI layout refactor
- Clear automation intent

This is the preferred strategy.

---

# 5. ARIA & Accessibility Strategy

When possible:

Use role-based selection:

Example:
getByRole('button', { name: 'Login' })

Advantages:
- Aligns with accessibility best practices
- Improves semantic reliability
- Encourages accessible design

---

# 6. Strict Prohibitions

Never use:

- nth-child selectors
- Absolute XPath
- Random CSS class chains
- Text-based selectors for dynamic content
- Index-based array selection (e.g., [0], [1])

Example of forbidden selector:
div > div:nth-child(3) > button

---

# 7. Page Ownership Rule

Only page objects may define locators.

Tests must never:

- Define locators
- Use page.locator directly
- Use raw Playwright selectors

Correct flow:

Test → Flow → Domain → Page → Locator

---

# 8. Component Model Strategy

Reusable UI blocks (e.g., navbar, product card) must be:

Encapsulated in ui/components/

Each component manages its own internal locators.

Prevents duplication across pages.

---

# 9. Dynamic Element Handling

Dynamic elements must use:

- Explicit wait for visibility
- Network stabilization strategy
- Event-driven readiness

Never use fixed sleep delays.

---

# 10. Wait Stabilization Rules

Allowed:

- waitForSelector (visible/attached)
- expect(locator).toBeVisible()
- network idle state (if justified)

Not Allowed:

- setTimeout-based waits
- Blind page.waitForTimeout()

---

# 11. Locator Naming Convention

Locators inside page files must:

- Be private
- Be descriptive
- Follow camelCase naming

Example:

private readonly loginButton;
private readonly emailInput;

---

# 12. Handling Dynamic IDs

If application generates dynamic IDs:

- Request frontend to add data-testid
- Use stable attribute wrapper
- Use semantic parent-child selection

Never rely on auto-generated ID values.

---

# 13. Self-Healing Consideration

If self-healing engine is enabled:

- Healing must log fallback behavior
- Healing must not hide real defects
- Healing must not auto-correct incorrect UI state

Self-healing is controlled, not automatic magic.

---

# 14. Flaky Prevention Rules

| Problem | Solution |
|----------|----------|
| Slow load | Explicit visibility wait |
| Animation delay | Wait for stable state |
| Dynamic rendering | Poll for presence |
| Shadow DOM | Explicit locator handling |

---

# 15. Review Policy

Any new locator must:

- Follow priority hierarchy
- Avoid brittle strategy
- Pass peer review
- Align with UI team collaboration

---

# 16. Long-Term Stability Goal

Locator strategy is designed to:

- Survive UI redesign
- Support theming changes
- Handle layout refactor
- Maintain low flake rate (< 2%)

---

End of Document.
