# Folder Structure Of Real Automation Testing

```text
test-platform/
├── config/
│   ├── env/
│   │   ├── dev.env
│   │   ├── qa.env
│   │   ├── staging.env
│   │   └── prod.env
│   │
│   ├── playwright.config.ts
│   ├── playwright.api.config.ts
│   └── global.d.ts
│
├── core/
│   ├── auth/
│   │   ├── auth.setup.ts
│   │   ├── authStorage.ts
│   │   ├── loginHelper.ts
│   │   ├── globalTeardown.ts
│   │   └── storage/
│   │       └── checkout-auth.json
│   │
│   ├── fixtures/
│   │   ├── base.fixture.ts
│   │   ├── auth.fixture.ts
│   │   └── api.fixture.ts
│   │
│   ├── hooks/
│   │   └── testHooks.ts
│   │
│   ├── wrappers/
│   │   └── uiActions.ts
│   │
│   ├── resilience/
│   │   └── retryEngine.ts
│   │
│   └── utils/
│       ├── env.ts
│       ├── logger.ts
│       ├── token-manager.ts
│       └── time.util.ts
│
├── api/
│   ├── client/
│   │   ├── base-client.ts
│   │   ├── auth-client.ts
│   │   └── request-manager.ts
│   │
│   ├── endpoints/
│   │   ├── auth.endpoints.ts
│   │   └── user.endpoints.ts
│   │
│   ├── services/
│   │   ├── auth/
│   │   │   └── auth.service.ts
│   │   │
│   │   └── users/
│   │       └── user.service.ts
│   │
│   ├── schemas/
│   │   ├── auth/
│   │   │   └── login.schema.ts
│   │   │
│   │   └── users/
│   │       └── user.schema.ts
│   │
│   ├── validators/
│   │   ├── schema-validator.ts
│   │   └── business/
│   │       ├── auth.validator.ts
│   │       └── user.validator.ts
│   │
│   ├── middleware/
│   ├── payloads/
│   ├── contracts/
│   └── types/
│
├── ui/
│   ├── pages/
│   │   ├── auth/
│   │   │   └── login.page.ts
│   │   │
│   │   ├── home/
│   │   │   └── home.page.ts
│   │   │
│   │   ├── products/
│   │   │   ├── products.page.ts
│   │   │   ├── category.page.ts
│   │   │   ├── filters.page.ts
│   │   │   ├── filtersCombo.page.ts
│   │   │   ├── wishlist.page.ts
│   │   │   └── trending.page.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── cart.page.ts
│   │   │   └── cartPage.page.ts
│   │   │
│   │   ├── checkout/
│   │   │   ├── checkout.page.ts
│   │   │   └── completeFlow.page.ts
│   │   │
│   │   └── orders/
│   │       ├── orders.page.ts
│   │       ├── orderCancel.page.ts
│   │       ├── orderConfirmation.page.ts
│   │       └── orderReturnReplace.page.ts
│   │
│   ├── components/
│   │   ├── navbar.component.ts
│   │   ├── drawer.component.ts
│   │   ├── search.component.ts
│   │   ├── trending.component.ts
│   │   ├── pagination.component.ts
│   │   └── category-section.component.ts
│   │
│   ├── flows/
│   │   ├── auth/
│   │   │   └── login.flow.ts
│   │   │
│   │   ├── home/
│   │   │   └── home.flow.ts
│   │   │
│   │   ├── products/
│   │   │   ├── products.flow.ts
│   │   │   ├── filters.flow.ts
│   │   │   ├── filtersCombo.flow.ts
│   │   │   ├── wishlist.flow.ts
│   │   │   └── trending.flow.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── cart.flow.ts
│   │   │   └── cartPage.flow.ts
│   │   │
│   │   ├── checkout/
│   │   │   ├── checkout.flow.ts
│   │   │   └── completeFlow.flow.ts
│   │   │
│   │   └── orders/
│   │       ├── orders.flow.ts
│   │       ├── orderCancel.flow.ts
│   │       ├── orderConfirmation.flow.ts
│   │       └── orderReturnReplace.flow.ts
│   │
│   └── locators/
│       ├── auth/
│       ├── products/
│       ├── orders/
│       └── common/
│
├── validation/
│   ├── ui/
│   │   ├── auth/
│   │   │   └── loginAssertions.ts
│   │   │
│   │   ├── home/
│   │   │   └── homeAssertions.ts
│   │   │
│   │   ├── products/
│   │   │   ├── productsAssertions.ts
│   │   │   ├── filters.assertions.ts
│   │   │   ├── filtersCombo.assertions.ts
│   │   │   ├── categoryAssertions.ts
│   │   │   ├── wishlist.assertions.ts
│   │   │   └── trendingAssertions.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── cartAssertion.ts
│   │   │   └── cartPageAssertion.ts
│   │   │
│   │   ├── checkout/
│   │   │   ├── checkout.assert.ts
│   │   │   └── completeFlow.assert.ts
│   │   │
│   │   └── orders/
│   │       ├── orders.assert.ts
│   │       ├── orderCancel.assert.ts
│   │       ├── orderConfirmation.assert.ts
│   │       └── orderReturnReplace.assert.ts
│   │
│   └── api/
│       ├── auth/
│       └── users/
│
├── data/
│   ├── static/
│   │   └── users.json
│   │
│   ├── brands/
│   │   ├── fixedBrands.ts
│   │   └── randomBrands.ts
│   │
│   ├── price/
│   │   └── priceData.ts
│   │
│   ├── factories/
│   │   └── userFactory.ts
│   │
│   └── builders/
│       └── auth/
│           └── login.builder.ts
│
├── helpers/
│   └── orders.helper.ts
│
├── tests/
│   ├── ui/
│   │   ├── smoke/
│   │   │   ├── login.spec.ts
│   │   │   ├── home.spec.ts
│   │   │   └── navbar.spec.ts
│   │   │
│   │   ├── regression/
│   │   │   ├── products/
│   │   │   │   ├── products.spec.ts
│   │   │   │   ├── category.spec.ts
│   │   │   │   ├── filters.spec.ts
│   │   │   │   ├── filtersCombo.spec.ts
│   │   │   │   ├── search.spec.ts
│   │   │   │   ├── trending.spec.ts
│   │   │   │   ├── wishlist.spec.ts
│   │   │   │   └── pagination.spec.ts
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── cart.spec.ts
│   │   │   │   └── cartPage.spec.ts
│   │   │   │
│   │   │   ├── checkout/
│   │   │   │   ├── checkout.spec.ts
│   │   │   │   └── checkout2.spec.ts
│   │   │   │
│   │   │   └── orders/
│   │   │       ├── orders.spec.ts
│   │   │       ├── orderCancel.spec.ts
│   │   │       ├── orderConfirmation.spec.ts
│   │   │       └── orderReturnReplace.spec.ts
│   │   │
│   │   ├── e2e/
│   │   │   └── completeFlow.spec.ts
│   │   │
│   │   └── stress/
│   │       └── filters.stress.spec.ts
│   │
│   └── api/
│       ├── smoke/
│       │   └── auth/
│       │       └── login.spec.ts
│       │
│       └── regression/
│           └── users/
│               └── profile.spec.ts
│
├── reports/
│   ├── screenshots/
│   ├── videos/
│   ├── traces/
│   ├── logs/
│   └── html/
│
├── docs/
│   ├── framework-architecture.md
│   ├── onboarding.md
│   ├── testing-guidelines.md
│   └── naming-conventions.md
│
├── scripts/
│   ├── clean.ts
│   ├── report.ts
│   └── seed.ts
│
├── package.json
├── tsconfig.json
├── .env
├── .gitignore
└── README.md
```

This version is the clean target layout for the current `test-platform` work, with the old `e2e/`, `shared/`, and `validation/assertions/` groupings collapsed into the new `tests/`, `helpers/`, `data/builders/`, and `validation/ui/` arrangement.