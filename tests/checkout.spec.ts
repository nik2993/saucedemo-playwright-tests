import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import products from '../data/products.json';
import checkoutData from '../data/checkout.json';

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let stepOne: CheckoutStepOnePage;
  let stepTwo: CheckoutStepTwoPage;
  let completePage: CheckoutCompletePage;

  test.beforeEach(async ({ loggedInPage: page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    stepOne = new CheckoutStepOnePage(page);
    stepTwo = new CheckoutStepTwoPage(page);
    completePage = new CheckoutCompletePage(page);
  });

  async function addBackpackAndGoToCheckout(page: any) {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await inventoryPage.goto();
    await inventoryPage.addToCart(backpack.slug);
    await cartPage.goto();
    await cartPage.checkout();
  }

  test('TC-CHK-001: valid checkout step 1 proceeds to overview', async ({ loggedInPage: page }) => {
    await addBackpackAndGoToCheckout(page);
    const customer = checkoutData.valid[0];
    await stepOne.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await stepOne.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
  });

  test('TC-CHK-002: empty form shows first name required error', async ({ loggedInPage: page }) => {
    await addBackpackAndGoToCheckout(page);
    const invalid = checkoutData.invalid[0];
    await stepOne.fillForm(invalid.firstName, invalid.lastName, invalid.zipCode);
    await stepOne.continue();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(stepOne.errorMessage).toContainText(invalid.errorMessage);
  });

  test('TC-CHK-003: missing last name shows last name required error', async ({ loggedInPage: page }) => {
    await addBackpackAndGoToCheckout(page);
    const invalid = checkoutData.invalid[1];
    await stepOne.fillForm(invalid.firstName, invalid.lastName, invalid.zipCode);
    await stepOne.continue();
    await expect(stepOne.errorMessage).toContainText(invalid.errorMessage);
  });

  test('TC-CHK-004: missing zip code shows postal code required error', async ({ loggedInPage: page }) => {
    await addBackpackAndGoToCheckout(page);
    const invalid = checkoutData.invalid[2];
    await stepOne.fillForm(invalid.firstName, invalid.lastName, invalid.zipCode);
    await stepOne.continue();
    await expect(stepOne.errorMessage).toContainText(invalid.errorMessage);
  });

  test('TC-CHK-005: cancel on step 1 returns to cart', async ({ loggedInPage: page }) => {
    await addBackpackAndGoToCheckout(page);
    await stepOne.cancel();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('TC-CHK-006: checkout overview shows correct summary for backpack', async ({ loggedInPage: page }) => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await inventoryPage.goto();
    await inventoryPage.addToCart(backpack.slug);
    await cartPage.goto();
    await cartPage.checkout();
    const customer = checkoutData.valid[0];
    await stepOne.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await stepOne.continue();
    const subtotal = await stepTwo.getSubtotal();
    expect(subtotal).toBe(backpack.price);
    expect(await stepTwo.getPaymentInfo()).toBe(checkoutData.payment);
    expect(await stepTwo.getShippingInfo()).toBe(checkoutData.shipping);
  });

  test('TC-CHK-007: tax is calculated at ~8% of item total', async ({ loggedInPage: page }) => {
    await addBackpackAndGoToCheckout(page);
    const customer = checkoutData.valid[0];
    await stepOne.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await stepOne.continue();
    const subtotal = await stepTwo.getSubtotal();
    const tax = await stepTwo.getTax();
    const total = await stepTwo.getTotal();
    expect(tax).toBeCloseTo(subtotal * products.taxRate, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('TC-CHK-008: multi-item checkout shows correct totals', async ({ loggedInPage: page }) => {
    await inventoryPage.goto();
    for (const product of products.products) {
      await inventoryPage.addToCart(product.slug);
    }
    await cartPage.goto();
    await cartPage.checkout();
    const customer = checkoutData.valid[0];
    await stepOne.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await stepOne.continue();
    const subtotal = await stepTwo.getSubtotal();
    const total = await stepTwo.getTotal();
    expect(subtotal).toBeCloseTo(products.totalAllItems, 2);
    expect(total).toBeCloseTo(subtotal + await stepTwo.getTax(), 2);
  });

  test('TC-CHK-009: cancel on step 2 returns to inventory', async ({ loggedInPage: page }) => {
    await addBackpackAndGoToCheckout(page);
    const customer = checkoutData.valid[0];
    await stepOne.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await stepOne.continue();
    await stepTwo.cancel();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-CHK-010: finish order shows confirmation page with empty cart', async ({ loggedInPage: page }) => {
    await addBackpackAndGoToCheckout(page);
    const customer = checkoutData.valid[0];
    await stepOne.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await stepOne.continue();
    await stepTwo.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(completePage.completeHeader).toHaveText('Thank you for your order!');
    await expect(completePage.completeText).toContainText('Your order has been dispatched');
    await expect(completePage.ponyImage).toBeVisible();
    await expect(completePage.backHomeButton).toBeVisible();
    await expect(completePage.cartBadge).not.toBeVisible();
  });

  test('TC-CHK-011: back home after order confirmation returns to inventory', async ({ loggedInPage: page }) => {
    await addBackpackAndGoToCheckout(page);
    const customer = checkoutData.valid[0];
    await stepOne.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await stepOne.continue();
    await stepTwo.finish();
    await completePage.backHome();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('TC-CHK-012: checkout with empty cart proceeds to step 1', async ({ loggedInPage: page }) => {
    await cartPage.goto();
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
