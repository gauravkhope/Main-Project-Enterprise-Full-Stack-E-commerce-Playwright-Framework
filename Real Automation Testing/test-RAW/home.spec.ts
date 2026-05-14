import { test, expect, Locator } from "@playwright/test";

test.describe("Homepage - Hero Carousel Suite", () => {
  let carousel: Locator;
  let image: Locator;
  let heading: Locator;
  let dots: Locator;

  // 🔹 Global Setup
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    carousel = page.locator("#hero-carousel");
    image = carousel.locator("img:visible").first();
    heading = carousel.locator("h2:visible").first();
    dots = page.getByTestId("hero-carousel-dots").locator("button");
  });

  // =====================================
  // 🟢 BASIC VISIBILITY TESTS
  // =====================================

  test.describe("Visibility", () => {
    test("Carousel is visible", async () => {
      await expect(carousel).toBeVisible();
    });

    test("Initial slide content is visible", async () => {
      await expect(image).toBeVisible();
      await expect(heading).toBeVisible();
    });
  });

  // =====================================
  // 🔵 AUTO ROTATION TESTS
  // =====================================

  test.describe("Auto Rotation", () => {
    test("Slide changes automatically", async () => {
      const firstAlt = await image.getAttribute("alt");

      await expect(image).not.toHaveAttribute("alt", firstAlt!, {
        timeout: 8000,
      });
    });
  });

  // =====================================
  // 🟣 DOT INDICATOR TESTS
  // =====================================

  test.describe("Dot Indicators", () => {
    test("Total slides count is 5", async () => {
      await expect(dots).toHaveCount(5);
    });

    test("Clicking dot changes slide", async () => {
      const firstAlt = await image.getAttribute("alt");

      await dots.nth(1).click();

      await expect(image).not.toHaveAttribute("alt", firstAlt!, {
        timeout: 6000,
      });
    });

    test("Only one dot is active", async ({ page }) => {
      const activeDot = page.locator(
        '[data-testid="hero-carousel-dots"] button.bg-blue-500',
      );

      await expect(activeDot).toHaveCount(1);
    });
  });
});
