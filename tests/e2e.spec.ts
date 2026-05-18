import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import users from '../data/users.json';
import products from '../data/products.json';
import checkoutData from '../data/checkout.json';

test.describe('End-to-End Happy Paths', () => {
  async function loginAsStandardUser(page: any) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.valid.standard.username, users.valid.standard.password);
    await page.waitForURL('**/inventory.html');
  }

  test('TC-E2E-001: single item full purchase flow from login to confirmation', async ({ page }) => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    const customer = checkoutData.valid[1];

    await loginAsStandardUser(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const stepOne = new CheckoutStepOnePage(page);
    const stepTwo = new CheckoutStepTwoPage(page);
    const completePage = new CheckoutCompletePage(page);

    await inventoryPage.addToCart(backpack.slug);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await cartPage.goto();
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain(backpack.name);

    await cartPage.checkout();
    await stepOne.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await stepOne.continue();

    const subtotal = await stepTwo.getSubtotal();
    expect(subtotal).toBe(backpack.price);
    const tax = await stepTwo.getTax();
    const total = await stepTwo.getTotal();
    expect(total).toBeCloseTo(subtotal + tax, 2);

    await stepTwo.finish();
    await expect(completePage.completeHeader).toHaveText('Thank you for your order!');
    await expect(completePage.cartBadge).not.toBeVisible();

    await completePage.backHome();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('TC-E2E-002: multiple items purchase with correct total calculation', async ({ page }) => {
    const bikeLight = products.products.find(p => p.slug === 'sauce-labs-bike-light')!;
    const boltTShirt = products.products.find(p => p.slug === 'sauce-labs-bolt-t-shirt')!;
    const onesie = products.products.find(p => p.slug === 'sauce-labs-onesie')!;
    const customer = checkoutData.valid[2];

    await loginAsStandardUser(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const stepOne = new CheckoutStepOnePage(page);
    const stepTwo = new CheckoutStepTwoPage(page);
    const completePage = new CheckoutCompletePage(page);

    await inventoryPage.addToCart(bikeLight.slug);
    await inventoryPage.addToCart(boltTShirt.slug);
    await inventoryPage.addToCart(onesie.slug);
    await expect(inventoryPage.cartBadge).toHaveText('3');

    await cartPage.goto();
    await expect(cartPage.cartItems).toHaveCount(3);

    await cartPage.checkout();
    await stepOne.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await stepOne.continue();

    const expectedSubtotal = bikeLight.price + boltTShirt.price + onesie.price;
    const subtotal = await stepTwo.getSubtotal();
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);

    await stepTwo.finish();
    await expect(completePage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC-E2E-003: add item from product detail page then complete checkout', async ({ page }) => {
    const fleeceJacket = products.products.find(p => p.slug === 'sauce-labs-fleece-jacket')!;
    const customer = checkoutData.valid[0];

    await loginAsStandardUser(page);
    const inventoryPage = new InventoryPage(page);
    const detailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);
    const stepOne = new CheckoutStepOnePage(page);
    const stepTwo = new CheckoutStepTwoPage(page);
    const completePage = new CheckoutCompletePage(page);

    await inventoryPage.goto();
    await inventoryPage.clickProductByName(fleeceJacket.name);
    await expect(detailPage.productName).toHaveText(fleeceJacket.name);
    await expect(detailPage.productPrice).toHaveText(`$${fleeceJacket.price}`);

    await detailPage.addToCart();
    await expect(detailPage.cartBadge).toHaveText('1');

    await detailPage.backToProducts();
    await expect(page).toHaveURL(/inventory\.html/);

    await cartPage.goto();
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain(fleeceJacket.name);

    await cartPage.checkout();
    await stepOne.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await stepOne.continue();

    const subtotal = await stepTwo.getSubtotal();
    expect(subtotal).toBe(fleeceJacket.price);

    await stepTwo.finish();
    await expect(completePage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC-E2E-004: sort products then purchase verifies sort does not affect cart', async ({ page }) => {
    const fleeceJacket = products.products.find(p => p.slug === 'sauce-labs-fleece-jacket')!;
    const onesie = products.products.find(p => p.slug === 'sauce-labs-onesie')!;
    const customer = checkoutData.valid[0];

    await loginAsStandardUser(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const stepOne = new CheckoutStepOnePage(page);
    const stepTwo = new CheckoutStepTwoPage(page);
    const completePage = new CheckoutCompletePage(page);

    await inventoryPage.sortBy('hilo');
    await inventoryPage.addToCart(fleeceJacket.slug);

    await inventoryPage.sortBy('lohi');
    await inventoryPage.addToCart(onesie.slug);

    await expect(inventoryPage.cartBadge).toHaveText('2');

    await cartPage.goto();
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain(fleeceJacket.name);
    expect(itemNames).toContain(onesie.name);

    await cartPage.checkout();
    await stepOne.fillForm(customer.firstName, customer.lastName, customer.zipCode);
    await stepOne.continue();

    const expectedSubtotal = fleeceJacket.price + onesie.price;
    const subtotal = await stepTwo.getSubtotal();
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);

    await stepTwo.finish();
    await expect(completePage.completeHeader).toHaveText('Thank you for your order!');
  });
});
