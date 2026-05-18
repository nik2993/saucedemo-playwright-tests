import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Logout', () => {
  test('TC-LOGOUT-001: logout via hamburger menu returns to login page', async ({ loggedInPage: page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('TC-LOGOUT-002: after logout, protected pages require re-authentication', async ({ loggedInPage: page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.logout();
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-LOGOUT-003: hamburger menu close button closes the menu', async ({ loggedInPage: page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.openMenu();
    await expect(inventoryPage.logoutLink).toBeVisible();
    await inventoryPage.closeMenu();
    await expect(inventoryPage.logoutLink).not.toBeVisible();
  });
});
