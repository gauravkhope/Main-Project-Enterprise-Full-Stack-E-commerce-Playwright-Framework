import { Locator, expect } from '@playwright/test';
import { RetryEngine } from '../resilience/retryEngine';

export class UIActions {

  static async click(element: Locator, name: string) {
    await RetryEngine.retry(async () => {
      await element.waitFor({ state: 'visible' });
      await element.click();
      console.log(`Clicked on ${name}`);
    });
  }

  static async fill(element: Locator, value: string, name: string) {
    await RetryEngine.retry(async () => {
      await element.waitFor({ state: 'visible' });
      await element.fill(value);
      console.log(`Filled ${name} with value: ${value}`);
    });
  }

  static async expectVisible(element: Locator, name: string) {
    await RetryEngine.retry(async () => {
      await expect(element).toBeVisible();
      console.log(`${name} is visible`);
    });
  }
}


// import { Locator, expect } from '@playwright/test';

// export class UIActions {

//   static async click(element: Locator, name: string) {
//     try {
//       await element.waitFor({ state: 'visible' });
//       await element.click();
//       console.log(`Clicked on ${name}`);
//     } catch (error) {
//       console.error(`Failed to click ${name}`);
//       throw error;
//     }
//   }

//   static async fill(element: Locator, value: string, name: string) {
//     try {
//       await element.waitFor({ state: 'visible' });
//       await element.fill(value);
//       console.log(`Filled ${name} with value: ${value}`);
//     } catch (error) {
//       console.error(`Failed to fill ${name}`);
//       throw error;
//     }
//   }

//   static async expectVisible(element: Locator, name: string) {
//     try {
//       await expect(element).toBeVisible();
//       console.log(`${name} is visible`);
//     } catch (error) {
//       console.error(`${name} is NOT visible`);
//       throw error;
//     }
//   }
// }