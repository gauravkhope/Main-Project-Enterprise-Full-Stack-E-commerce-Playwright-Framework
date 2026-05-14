import { getOrderByStatusAndSave, getOrderById } from '../../../helpers/orders.helper';
import { OrderCancelPage } from '../../pages/orders/orderCancel.page';

export class OrderCancelFlow {
  constructor(private orderCancelPage: OrderCancelPage) {}

  async openProcessingOrderAndSave() {
    const result = await getOrderByStatusAndSave(
      this.orderCancelPage.page,
      'Processing'
    );

    await this.orderCancelPage.openOrderDetails(result.order);

    return result.orderId;
  }
  async openCancelledOrderAndSave() {
    const result = await getOrderByStatusAndSave(
      this.orderCancelPage.page,
      'Cancelled'
    );

    await this.orderCancelPage.openOrderDetails(result.order);

    return result.orderId;
  }

  async openOrderById(orderId: string) {
    const order = getOrderById(
      this.orderCancelPage.page,
      orderId
    );

    await this.orderCancelPage.openOrderDetails(order);
  }

  async cancelOrder() {
    await this.orderCancelPage.cancelOrder();
  }
}