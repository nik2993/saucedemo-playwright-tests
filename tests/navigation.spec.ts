import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import products from '../data/products.json';

test.describe('Navigation and Header', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ loggedInPage: page }) => {
    inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
  });

  test('TC-NAV-001: hamburger All Items link navigates to inventory', async ({ loggedInPage: page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await inventoryPage.openMenu();
    await inventoryPage.allItemsLink.click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.productItems).toHaveCount(6);
  });

  test('TC-NAV-002: hamburger About link navigates to Sauce Labs website', async ({ loggedInPage: page }) => {
    await inventoryPage.openMenu();
    await Promise.all([
      page.waitForURL(/saucelabs\.com/),
      inventoryPage.aboutLink.click(),
    ]);
    expect(page.url()).toContain('saucelabs.com');
  });

  test('TC-NAV-003: Reset App State clears cart and resets buttons', async ({ loggedInPage: page }) => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    const bikeLight = products.products.find(p => p.slug === 'sauce-labs-bike-light')!;
    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.addToCart(bikeLight.slug);
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.resetAppState();
    await inventoryPage.closeMenu();
    await inventoryPage.goto(); // navigate to force button DOM to reflect cleared cart
    await expect(inventoryPage.cartBadge).not.toBeVisible();
    await expect(page.locator(`[data-test="add-to-cart-${backpack.slug}"]`)).toBeVisible();
    await expect(page.locator(`[data-test="add-to-cart-${bikeLight.slug}"]`)).toBeVisible();
  });

  test('TC-NAV-004: Swag Labs logo does not crash the application', async ({ loggedInPage: page }) => {
    await page.locator('.app_logo').click();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('TC-NAV-005: footer social media links have correct URLs', async ({ loggedInPage: page }) => {
    const twitterLink = page.locator('[data-test="social-twitter"]');
    const facebookLink = page.locator('[data-test="social-facebook"]');
    const linkedInLink = page.locator('[data-test="social-linkedin"]');
    await expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/saucelabs');
    await expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/saucelabs');
    await expect(linkedInLink).toHaveAttribute('href', 'https://www.linkedin.com/company/sauce-labs/');
  });
});
