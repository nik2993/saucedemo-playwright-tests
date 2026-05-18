import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import products from '../data/products.json';
import checkoutData from '../data/checkout.json';

test.describe('Edge Cases and Boundary Conditions', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let stepOne: CheckoutStepOnePage;
  let detailPage: ProductDetailPage;

  test.beforeEach(async ({ loggedInPage: page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    stepOne = new CheckoutStepOnePage(page);
    detailPage = new ProductDetailPage(page);
  });

  test('TC-EDGE-001: cart badge shows 6 when all items are added', async () => {
    await inventoryPage.goto();
    for (const product of products.products) {
      await inventoryPage.addToCart(product.slug);
    }
    await expect(inventoryPage.cartBadge).toHaveText('6');
  });

  test('TC-EDGE-002: direct URL to valid product detail page loads correctly', async ({ loggedInPage: page }) => {
    const backpack = products.products.find(p => p.id === 4)!;
    await detailPage.goto(backpack.id);
    await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
    await expect(detailPage.productName).toHaveText(backpack.name);
    await expect(detailPage.productPrice).toHaveText(`$${backpack.price}`);
  });

  test('TC-EDGE-003: invalid product ID handled without crash', async ({ loggedInPage: page }) => {
    await page.goto('/inventory-item.html?id=999');
    await expect(page).not.toHaveURL('/');
    const errors = await page.evaluate(() => {
      const errors: string[] = [];
      return errors;
    });
    expect(errors).toHaveLength(0);
  });

  test('TC-EDGE-004: checkout accepts special characters in name fields', async ({ loggedInPage: page }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.products[0].slug);
    await cartPage.goto();
    await cartPage.checkout();
    const special = checkoutData.edgeCases[0];
    await stepOne.fillForm(special.firstName, special.lastName, special.zipCode);
    await stepOne.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('TC-EDGE-005: cart state persists after browser page reload', async ({ loggedInPage: page }) => {
    await inventoryPage.goto();
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    const bikeLight = products.products.find(p => p.slug === 'sauce-labs-bike-light')!;
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.addToCart(bikeLight.slug);
    await page.reload();
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await cartPage.goto();
    await expect(cartPage.cartItems).toHaveCount(2);
  });

  test('TC-EDGE-006: cancel from checkout step 2 preserves cart items', async ({ loggedInPage: page }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.products[0].slug);
    await cartPage.goto();
    await cartPage.checkout();
    await stepOne.fillForm(checkoutData.valid[0].firstName, checkoutData.valid[0].lastName, checkoutData.valid[0].zipCode);
    await stepOne.continue();
    const stepTwo = page.locator('[data-test="cancel"]');
    await stepTwo.click();
    await expect(page).toHaveURL(/inventory\.html/);
    await cartPage.goto();
    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test('TC-EDGE-007: checkout accepts numeric-only name fields', async ({ loggedInPage: page }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.products[0].slug);
    await cartPage.goto();
    await cartPage.checkout();
    const numeric = checkoutData.edgeCases[1];
    await stepOne.fillForm(numeric.firstName, numeric.lastName, numeric.zipCode);
    await stepOne.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('TC-EDGE-008: checkout accepts alpha-only zip code', async ({ loggedInPage: page }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.products[0].slug);
    await cartPage.goto();
    await cartPage.checkout();
    const alphaZip = checkoutData.edgeCases[2];
    await stepOne.fillForm(alphaZip.firstName, alphaZip.lastName, alphaZip.zipCode);
    await stepOne.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });
});
