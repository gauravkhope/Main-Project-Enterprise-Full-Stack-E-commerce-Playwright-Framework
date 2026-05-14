import { expect, type Page, type Locator } from '@playwright/test';

export class OrderReturnReplaceAssertions {

  // ============================================================
  // COMMON
  // ============================================================
  static async expectDelivered(page: Page) {
    await expect(
      page.getByTestId('order-status')
    ).toContainText(/delivered/i);
  }

  static async expectPaid(page: Page) {
    await expect(
      page.getByTestId('payment-status')
    ).toHaveText(/paid/i);
  }

  static async expectRefunded(page: Page) {
    await expect(
      page.getByTestId('payment-status')
    ).toHaveText(/refunded/i);
  }

  static async expectActualDate(locator: Locator) {
    await expect(locator).toBeVisible();

    await expect(locator)
      .not.toContainText('Expected');
  }

  static async expectExpectedDate(locator: Locator) {
    await expect(locator).toBeVisible();

    await expect(locator)
      .toContainText('Expected');
  }

  // ============================================================
  // RETURN REQUESTED
  // ============================================================
  static async expectReturnRequested(page: Page) {

    await expect(
      page.getByTestId('order-status')
    ).toContainText(/return requested/i);

    const returnIcon =
      page.getByTestId('tracking-icon-return-requested');

    const returnText =
      page.getByTestId('tracking-text-return-requested');

    const pickedText =
      page.getByTestId('tracking-text-order-picked');

    const pickedIcon =
      page.getByTestId('tracking-icon-order-picked');

    await expect(returnText)
      .toHaveText('Return Requested');

    await expect(pickedText)
      .toHaveText('Order Picked');

    await expect(returnIcon)
      .toHaveClass(/bg-orange-400/);

    await expect(
      returnIcon.locator('svg')
    ).toBeVisible();

    await expect(
      pickedIcon.locator('svg')
    ).toHaveCount(0);

    await expect(pickedIcon)
      .toContainText(/[0-9]/);

    await expect(pickedText)
      .toHaveClass(/orange-400/);

    await this.expectActualDate(
      page.getByTestId(
        'tracking-date-actual-return-requested'
      )
    );

    await this.expectExpectedDate(
      page.getByTestId(
        'tracking-date-expected-order-picked'
      )
    );
  }

  // ============================================================
  // RETURN COMPLETED
  // ============================================================
  static async expectOrderReturned(page: Page) {

    const pickedIcon =
      page.getByTestId('tracking-icon-order-picked');

    const pickedText =
      page.getByTestId('tracking-text-order-picked');

    await expect(
      page.getByTestId('order-status')
    ).toContainText(/order returned/i);

    await expect(
      pickedIcon.locator('svg')
    ).toBeVisible();

    await expect(pickedIcon)
      .toHaveClass(/bg-orange-600/);

    await expect(
      pickedIcon.locator('svg')
    ).toHaveClass(/circle-check/);

    await expect(pickedText)
      .toHaveClass(/orange-800/);

    await this.expectActualDate(
      page.getByTestId(
        'tracking-date-actual-order-picked'
      )
    );
  }

  // ============================================================
  // RETURN CANCELLED
  // ============================================================
  static async expectReturnCancelled(page: Page) {

    await this.expectDelivered(page);

    await expect(
      page.getByRole('button', {
        name: /order return/i
      })
    ).toBeVisible();

    await expect(
      page.getByTestId(
        'tracking-text-return-requested'
      )
    ).not.toBeVisible();

    await expect(
      page.getByTestId(
        'tracking-text-order-picked'
      )
    ).not.toBeVisible();
  }

  static async expectReturnButtonHidden(page: Page) {
    await expect(
      page.getByRole('button', {
        name: /order return/i
      })
    ).toHaveCount(0);
  }

  // ============================================================
  // REPLACE REQUESTED
  // ============================================================
  static async expectReplaceRequested(page: Page) {

    await expect(
      page.getByTestId('order-status')
    ).toContainText(/replacement requested/i);

    const replaceText =
      page.getByTestId(
        'tracking-text-replacement-requested'
      );

    const replaceIcon =
      page.getByTestId(
        'tracking-icon-replacement-requested'
      );

    const replacedText =
      page.getByTestId(
        'tracking-text-order-replaced'
      );

    const replacedIcon =
      page.getByTestId(
        'tracking-icon-order-replaced'
      );

    await expect(replaceText)
      .toHaveText('Replacement Requested');

    await expect(replacedText)
      .toHaveText('Order Replaced');

    await expect(replaceIcon)
      .toHaveClass(
        /bg-gradient-to-r from-green-400 to-green-500/
      );

    await expect(
      replaceIcon.locator('svg')
    ).toBeVisible();

    await expect(
      replacedIcon.locator('svg')
    ).toHaveCount(0);

    await expect(replacedIcon)
      .toContainText(/[0-9]/);

    await expect(replacedText)
      .toHaveClass(/gray-400/);

    await this.expectActualDate(
      page.getByTestId(
        'tracking-date-actual-replacement-requested'
      )
    );

    await this.expectExpectedDate(
      page.getByTestId(
        'tracking-date-expected-order-replaced'
      )
    );
  }

  // ============================================================
  // REPLACE COMPLETED
  // ============================================================
  static async expectOrderReplaced(page: Page) {

    const icon =
      page.getByTestId(
        'tracking-icon-order-replaced'
      );

    const text =
      page.getByTestId(
        'tracking-text-order-replaced'
      );

    await expect(
      page.getByTestId('order-status')
    ).toContainText(/order replaced/i);

    await expect(
      icon.locator('svg')
    ).toBeVisible();

    await expect(icon)
      .toHaveClass(
        /bg-gradient-to-r from-green-400 to-green-500/
      );

    await expect(
      icon.locator('svg')
    ).toHaveClass(/circle-check/);

    await expect(text)
      .toHaveClass(/gray-800/);

    await this.expectActualDate(
      page.getByTestId(
        'tracking-date-actual-order-replaced'
      )
    );
  }

  // ============================================================
  // REPLACE CANCELLED
  // ============================================================
  static async expectReplaceCancelled(page: Page) {

    await this.expectDelivered(page);

    await expect(
      page.getByRole('button', {
        name: /order replace/i
      })
    ).toBeVisible();

    await expect(
      page.getByTestId(
        'tracking-text-replacement-requested'
      )
    ).not.toBeVisible();

    await expect(
      page.getByTestId(
        'tracking-step-order-replaced'
      )
    ).not.toBeVisible();
  }

  static async expectReplaceButtonHidden(page: Page) {
    await expect(
      page.getByRole('button', {
        name: /order replace/i
      })
    ).toHaveCount(0);
  }

  // ============================================================
  // VALIDATION TOAST
  // ============================================================
  static async expectValidationToast(page: Page) {

    const toast =
      page.getByRole('status').filter({
        hasText:
          'Please enter a valid reason (minimum 5 characters)'
      });

    await expect(toast).toBeVisible();
  }
}