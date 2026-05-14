import { test as base } from '@playwright/test';
import { LoginPage } from '../../ui/pages/auth/login.page';
import { LoginFlow } from '../../ui/flows/auth/login.flow';
import { HomePage } from '../../ui/pages/home/home.page';
import { HomeFlow } from '../../ui/flows/home/home.flow';
import { NavbarComponent } from '../../ui/components/navbar.component';
import { NavbarFlow } from '../../ui/flows/components/navbar.flow';
import { SearchComponent } from '../../ui/components/search.component';
import { SearchFlow } from '../../ui/flows/components/search.flow';
import { DrawerComponent } from '../../ui/components/drawer.component';
import { DrawerFlow } from '../../ui/flows/components/drawer.flow';
import { TrendingComponent } from '../../ui/components/trending.component';
import { TrendingFlow } from '../../ui/flows/products/trending.flow';
import { ProductsPage } from '../../ui/pages/products/products.page';
import { ProductsFlow } from '../../ui/flows/products/products.flow';
import { CategoryPage } from '../../ui/pages/products/category.page';
import { CategoryFlow } from '../../ui/flows/components/category.flow';
import { FiltersPage } from '../../ui/pages/products/filters.page';
import { FiltersFlow } from '../../ui/flows/products/filters.flow';
import { CheckoutPage } from '../../ui/pages/checkout/checkout.page';
import { CheckoutFlow } from '../../ui/flows/checkouts/checkout.flow';
import { OrderPage } from '../../ui/pages/orders/orderConfirmation.page';
import { OrderFlow } from '../../ui/flows/orders/orderConfirmation.flow';
import { OrdersPage } from '../../ui/pages/orders/orders.page';
import { OrdersFlow } from '../../ui/flows/orders/orders.flow';
import { OrderCancelPage }from '../../ui/pages/orders/orderCancel.page';
import { OrderCancelFlow }from '../../ui/flows/orders/orderCancel.flow';
import { OrderReturnReplacePage }from '../../ui/pages/orders/orderReturnReplace.page';
import { OrderReturnReplaceFlow }from '../../ui/flows/orders/orderReturnReplace.flow';
import { CompleteFlowPage }from '../../ui/pages/checkout/completeFlow.page';
import { CompleteFlow }from '../../ui/flows/checkouts/completeFlow.flow';


// Hooks intentionally not registered here to avoid Playwright loading-time errors.

type TestFixtures = {
  loginPage: LoginPage;
  loginFlow: LoginFlow;
  homePage: HomePage;
  homeFlow: HomeFlow;
  navbar: NavbarComponent;
  search: SearchComponent;
  searchFlow: SearchFlow;
  navbarFlow: NavbarFlow;
  drawer: DrawerComponent;
  drawerFlow: DrawerFlow;
  trending: TrendingComponent;
trendingFlow: TrendingFlow;
productsPage: ProductsPage;
productsFlow: ProductsFlow;
categoryPage: CategoryPage;
  categoryFlow: CategoryFlow;
    filtersPage: FiltersPage;
  filtersFlow: FiltersFlow;
  checkoutPage: CheckoutPage;
  checkoutFlow: CheckoutFlow;
    orderPage: OrderPage;
  orderFlow: OrderFlow;
  ordersPage: OrdersPage;
  ordersFlow: OrdersFlow;
  orderCancelPage: OrderCancelPage;
  orderCancelFlow: OrderCancelFlow;
  orderReturnReplacePage: OrderReturnReplacePage;
  orderReturnReplaceFlow: OrderReturnReplaceFlow;
    completeFlowPage: CompleteFlowPage;
  completeFlow: CompleteFlow;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  loginFlow: async ({ loginPage }, use) => {
    const loginFlow = new LoginFlow(loginPage);
    await use(loginFlow);
  },
  homePage: async ({ page }, use) => {
  await use(new HomePage(page));
},

homeFlow: async ({ homePage }, use) => {
  await use(new HomeFlow(homePage));
},
navbar: async ({ page }, use) => {
  await use(new NavbarComponent(page));
},

navbarFlow: async ({ navbar }, use) => {
  await use(new NavbarFlow(navbar));
},
search: async ({ page }, use) => {
  await use(new SearchComponent(page));
},

searchFlow: async ({ search }, use) => {
  await use(new SearchFlow(search));
},
drawer: async ({ page }, use) => {
  await use(new DrawerComponent(page));
},

drawerFlow: async ({ drawer }, use) => {
  await use(new DrawerFlow(drawer));
},
trending: async ({ page }, use) => {
  await use(new TrendingComponent(page));
},

trendingFlow: async ({ trending }, use) => {
  await use(new TrendingFlow(trending));
},
productsPage: async ({ page }, use) => {
  await use(new ProductsPage(page));
},

productsFlow: async ({ productsPage }, use) => {
  await use(new ProductsFlow(productsPage));
},
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },

  categoryFlow: async ({ page, categoryPage }, use) => {
    await use(new CategoryFlow(page, categoryPage));
  },
    filtersPage: async ({ page }, use) => {
    const filtersPage = new FiltersPage(page);
    await use(filtersPage);
  },

  filtersFlow: async ({ filtersPage }, use) => {
    const filtersFlow = new FiltersFlow(filtersPage);
    await use(filtersFlow);
  },
   // 🔹 Page fixture (default Playwright page)
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // 🔹 Flow fixture
  checkoutFlow: async ({ checkoutPage }, use) => {
    await use(new CheckoutFlow(checkoutPage));
  },
  orderPage: async ({ page }, use) => {
  await use(new OrderPage(page));
},

orderFlow: async ({ orderPage }, use) => {
  await use(new OrderFlow(orderPage));
},
ordersPage: async ({ page }, use) => {
  await use(new OrdersPage(page));
},

ordersFlow: async ({ ordersPage }, use) => {
  await use(new OrdersFlow(ordersPage));
},

 orderCancelPage: async ({ page }, use) => {
   const orderCancelPage =new OrderCancelPage(page);
    await use(orderCancelPage);
  },
   orderCancelFlow: async ({ orderCancelPage },use) => {
     const orderCancelFlow = new OrderCancelFlow(orderCancelPage);
       await use(orderCancelFlow);
  },
    orderReturnReplacePage: async ({ page },use ) => {
     const orderReturnReplacePage = new OrderReturnReplacePage(page);
       await use(orderReturnReplacePage);
  },
    orderReturnReplaceFlow: async ({ orderReturnReplacePage },use) => {
      const orderReturnReplaceFlow = new OrderReturnReplaceFlow(orderReturnReplacePage);
         await use(orderReturnReplaceFlow);
  },

    completeFlowPage: async ( { page }, use ) => {
       const completeFlowPage = new CompleteFlowPage(page);
          await use( completeFlowPage );
    },

    completeFlow: async ({ completeFlowPage }, use ) => {
        const completeFlow = new CompleteFlow( completeFlowPage );
          await use( completeFlow );
    },

});

export { expect } from '@playwright/test';

