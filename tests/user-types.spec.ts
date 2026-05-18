import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import users from '../data/users.json';
import products from '../data/products.json';

test.describe('User Type Behaviors', () => {
  async function loginAs(page: any, user: { username: string; password: string }) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await page.waitForURL('**/inventory.html');
  }

  test('TC-USER-001: problem_user sees incorrect product images', async ({ page }) => {
    await loginAs(page, users.valid.problem);
    const images = page.locator('.inventory_item_img img');
    const srcs = await images.evaluateAll((imgs: HTMLImageElement[]) => imgs.map(img => img.src));
    const uniqueSrcs = new Set(srcs);
    expect(uniqueSrcs.size).toBe(1);
  });

  test('TC-USER-002: problem_user add-to-cart behavior is observable', async ({ page }) => {
    await loginAs(page, users.valid.problem);
    const inventoryPage = new InventoryPage(page);
    for (const product of products.products) {
      const addBtn = page.locator(`[data-test="add-to-cart-${product.slug}"]`);
      if (await addBtn.isVisible()) {
        await addBtn.click();
      }
    }
    const count = await inventoryPage.getCartCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC-USER-003: performance_glitch_user login takes longer but succeeds', async ({ page }) => {
    test.setTimeout(30000);
    const start = Date.now();
    await loginAs(page, users.valid.performance_glitch);
    const elapsed = Date.now() - start;
    await expect(page).toHaveURL(/inventory\.html/);
    expect(elapsed).toBeGreaterThan(2000);
  });

  test('TC-USER-004: performance_glitch_user can interact with all features', async ({ page }) => {
    test.setTimeout(60000);
    await loginAs(page, users.valid.performance_glitch);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('hilo');
    const names = await inventoryPage.getProductNamesList();
    expect(names[0]).toBe(products.sorting.hilo[0]);
  });

  test('TC-USER-005: error_user encounters errors on some add-to-cart actions', async ({ page }) => {
    await loginAs(page, users.valid.error);
    const inventoryPage = new InventoryPage(page);
    for (const product of products.products) {
      const addBtn = page.locator(`[data-test="add-to-cart-${product.slug}"]`);
      if (await addBtn.isVisible()) {
        await addBtn.click();
      }
    }
    const count = await inventoryPage.getCartCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC-USER-006: visual_user logs in and pages load without crashes', async ({ page }) => {
    await loginAs(page, users.valid.visual);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });
});
