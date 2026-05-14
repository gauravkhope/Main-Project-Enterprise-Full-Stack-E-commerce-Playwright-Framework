import type { OrdersPage } from '../../pages/orders/orders.page';

export class OrdersFlow {
  constructor(private ordersPage: OrdersPage) {}

  async navigateToOrders() {
    await this.ordersPage.gotoHome();
    await this.ordersPage.openOrders();
  }

  async getLastOrderData(count: number) {
    const order = this.ordersPage.page.getByTestId(`order-card-${count - 1}`);

    return {
      id: await order.getByTestId("order-id").textContent(),
      date: await order.getByTestId("order-date").textContent(),
      price: await order.getByTestId("order-price").textContent(),
      address: await order.getByTestId("order-address").textContent(),
      status: await order.getByTestId("order-status").textContent(),
      total: await order.getByTestId("order-price").textContent(),
    };
  }
}