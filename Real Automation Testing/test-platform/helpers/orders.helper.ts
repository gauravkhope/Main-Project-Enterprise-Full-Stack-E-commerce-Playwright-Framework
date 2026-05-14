import type { Page } from '@playwright/test';

export async function getOrderByStatusAndSave(page: Page, status: string) {
  const orders = page.locator('[data-testid^="order-card-"]');

  const total = await orders.count();

  console.log('Total Orders:', total);

  const order = orders
    .filter({
      has: page.getByTestId('order-status').filter({ hasText: status })
    })
    .first();

  const orderIdText = await order.getByTestId('order-id').textContent();

  if (!orderIdText) throw new Error('Order ID not found');

  const orderId = orderIdText.replace('Order #', '').trim();

  console.log('Selected Order ID:', orderId);

  return {
    order,
    orderId,
    total
  };
}

export function getOrderById(page: Page, orderId: string) {
  return page.locator(`[data-testid="order-card-${orderId}"]`);
}
