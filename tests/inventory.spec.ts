import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import products from '../data/products.json';

test.describe('Product Inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ loggedInPage: page }) => {
    inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
  });

  test('TC-INV-001: inventory displays all 6 products with required elements', async ({ loggedInPage: page }) => {
    await expect(inventoryPage.productItems).toHaveCount(6);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    for (const product of products.products) {
      const card = inventoryPage.productItems.filter({ hasText: product.name });
      await expect(card.locator('.inventory_item_name')).toBeVisible();
      await expect(card.locator('.inventory_item_price')).toHaveText(`$${product.price}`);
    }
  });

  test('TC-INV-002: default sort is Name A to Z', async () => {
    const names = await inventoryPage.getProductNamesList();
    expect(names).toEqual(products.sorting.az);
  });

  test('TC-INV-003: sort by Name Z to A reverses order', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNamesList();
    expect(names).toEqual(products.sorting.za);
  });

  test('TC-INV-004: sort by Price low to high orders ascending', async () => {
    await inventoryPage.sortBy('lohi');
    const names = await inventoryPage.getProductNamesList();
    expect(names).toEqual(products.sorting.lohi);
  });

  test('TC-INV-005: sort by Price high to low orders descending', async () => {
    await inventoryPage.sortBy('hilo');
    const names = await inventoryPage.getProductNamesList();
    expect(names).toEqual(products.sorting.hilo);
  });

  test('TC-INV-006: adding single product updates cart badge to 1', async () => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await inventoryPage.addToCart(backpack.slug);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.page.locator(`[data-test="remove-${backpack.slug}"]`)).toBeVisible();
  });

  test('TC-INV-007: adding all 6 products increments badge to 6', async () => {
    for (let i = 0; i < products.products.length; i++) {
      await inventoryPage.addToCart(products.products[i].slug);
      await expect(inventoryPage.cartBadge).toHaveText(String(i + 1));
    }
  });

  test('TC-INV-008: removing product from inventory decrements badge', async () => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await inventoryPage.addToCart(backpack.slug);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.removeFromCart(backpack.slug);
    await expect(inventoryPage.cartBadge).not.toBeVisible();
    await expect(inventoryPage.page.locator(`[data-test="add-to-cart-${backpack.slug}"]`)).toBeVisible();
  });
});
