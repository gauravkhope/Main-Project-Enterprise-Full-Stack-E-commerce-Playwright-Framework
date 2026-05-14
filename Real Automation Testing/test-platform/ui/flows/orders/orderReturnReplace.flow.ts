import { getOrderByStatusAndSave, getOrderById } from '../../../helpers/orders.helper';

import { OrderReturnReplacePage }
  from '../../pages/orders/orderReturnReplace.page';

export class OrderReturnReplaceFlow {

  constructor(
    private orderPage: OrderReturnReplacePage
  ) {}

  async openCompletedOrderAndSave() {

    const result =
      await getOrderByStatusAndSave(
        this.orderPage.page,
        'Completed'
      );

    await this.orderPage.openOrder(result.order);

    return result.orderId;
  }

  async openOrderById(orderId: string) {

    const order =
      getOrderById(
        this.orderPage.page,
        orderId
      );

    await this.orderPage.openOrder(order);
  }

  async clearReturnIfExists() {

    const btn =
      this.orderPage.returnCancelButton();

    if (await btn.isVisible()) {
      await btn.click();
    }
  }

  async clearReplaceIfExists() {

    const btn =
      this.orderPage.replaceCancelButton();

    if (await btn.isVisible()) {
      await btn.click();
    }
  }
}