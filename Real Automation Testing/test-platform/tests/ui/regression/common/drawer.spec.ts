import { test, expect } from '../../../../core/fixtures/base.fixture';
import { DrawerAssertions } from '../../../../validation/ui/common/drawerAssertions';
import users from '../../../../data/static/users.json';

test.describe('Drawer Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Drawer hidden by default', async ({ drawer }) => {
    await DrawerAssertions.expectDrawerHidden(drawer);
  });

  test('Drawer opens', async ({ drawerFlow, drawer }) => {
    await drawerFlow.open();
    await DrawerAssertions.expectDrawerVisible(drawer);
  });

  test('Drawer closes', async ({ drawerFlow, drawer }) => {
    await drawerFlow.open();
    await drawerFlow.close();
    await DrawerAssertions.expectDrawerHidden(drawer);
  });

  test('Guest sees login option', async ({ drawerFlow, drawer }) => {
    await drawerFlow.open();
    await DrawerAssertions.expectLoginVisible(drawer);
  });

  test('Navigate to home', async ({ drawerFlow, page }) => {
    await drawerFlow.open();
    await drawerFlow.goToHome();
    await DrawerAssertions.expectNavigation(page, '/');
  });

  test.describe('Authenticated Drawer', () => {

    test.beforeEach(async ({ loginFlow, drawerFlow, page }) => {
      const user = users.validUser;

      await loginFlow.login(user.email, user.password);
      await page.waitForURL('/');
      await drawerFlow.open();
    });

    test('Profile dropdown works', async ({ drawerFlow, drawer }) => {
      await drawerFlow.openProfileMenu();
      await DrawerAssertions.expectOrdersVisible(drawer);

      await drawerFlow.openProfileMenu();
      await DrawerAssertions.expectDrawerHidden(drawer);
    });

    test('Navigate to orders', async ({ drawerFlow, page }) => {
      await drawerFlow.openProfileMenu();
      await drawerFlow.goToOrders();
      await DrawerAssertions.expectNavigation(page, /orders/);
    });

  });

});

