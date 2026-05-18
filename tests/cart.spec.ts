import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import products from '../data/products.json';

test.describe('Shopping Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ loggedInPage: page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await inventoryPage.goto();
  });

  test('TC-CART-001: cart icon navigates to cart page', async ({ loggedInPage: page }) => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('TC-CART-002: cart displays correct item details', async () => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await inventoryPage.addToCart(backpack.slug);
    await cartPage.goto();
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain(backpack.name);
    const price = await cartPage.getItemPrice(backpack.name);
    expect(price).toBe(backpack.price);
  });

  test('TC-CART-003: cart displays all 6 added items', async () => {
    for (const product of products.products) {
      await inventoryPage.addToCart(product.slug);
    }
    await cartPage.goto();
    await expect(cartPage.cartItems).toHaveCount(6);
    await expect(cartPage.cartBadge).toHaveText('6');
  });

  test('TC-CART-004: removing item from cart decrements badge', async () => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    const bikeLight = products.products.find(p => p.slug === 'sauce-labs-bike-light')!;
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.addToCart(bikeLight.slug);
    await cartPage.goto();
    await cartPage.removeItem(backpack.slug);
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartBadge).toHaveText('1');
    const remainingNames = await cartPage.getItemNames();
    expect(remainingNames).not.toContain(backpack.name);
  });

  test('TC-CART-005: removing last item empties cart and hides badge', async () => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await inventoryPage.addToCart(backpack.slug);
    await cartPage.goto();
    await cartPage.removeItem(backpack.slug);
    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(cartPage.cartBadge).not.toBeVisible();
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('TC-CART-006: continue shopping returns to inventory with cart preserved', async ({ loggedInPage: page }) => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await inventoryPage.addToCart(backpack.slug);
    await cartPage.goto();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(page.locator(`[data-test="remove-${backpack.slug}"]`)).toBeVisible();
  });

  test('TC-CART-007: empty cart page shows no items', async ({ loggedInPage: page }) => {
    await cartPage.goto();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('TC-CART-008: cart state is preserved after changing sort order', async () => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    const bikeLight = products.products.find(p => p.slug === 'sauce-labs-bike-light')!;
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.addToCart(bikeLight.slug);
    await inventoryPage.sortBy('hilo');
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await cartPage.goto();
    await expect(cartPage.cartItems).toHaveCount(2);
  });
});
