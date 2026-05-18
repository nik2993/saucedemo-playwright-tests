import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import users from '../data/users.json';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC-AUTH-001: standard_user login redirects to inventory', async ({ page }) => {
    await loginPage.login(users.valid.standard.username, users.valid.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('TC-AUTH-002: locked_out_user shows locked error', async ({ page }) => {
    await loginPage.login(users.invalid.locked_out.username, users.invalid.locked_out.password);
    await expect(page).toHaveURL('/');
    await expect(loginPage.errorMessage).toContainText(users.invalid.locked_out.errorMessage);
  });

  test('TC-AUTH-003: empty credentials shows username required error', async () => {
    await loginPage.login(users.invalid.empty_both.username, users.invalid.empty_both.password);
    await expect(loginPage.errorMessage).toContainText(users.invalid.empty_both.errorMessage);
  });

  test('TC-AUTH-004: username only shows password required error', async () => {
    await loginPage.login(users.invalid.empty_password.username, users.invalid.empty_password.password);
    await expect(loginPage.errorMessage).toContainText(users.invalid.empty_password.errorMessage);
  });

  test('TC-AUTH-005: invalid credentials shows mismatch error', async () => {
    await loginPage.login(users.invalid.wrong_credentials.username, users.invalid.wrong_credentials.password);
    await expect(loginPage.errorMessage).toContainText(users.invalid.wrong_credentials.errorMessage);
  });

  test('TC-AUTH-006: dismiss error button removes error message', async () => {
    await loginPage.login(users.invalid.empty_both.username, users.invalid.empty_both.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await loginPage.dismissError();
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

  test('TC-AUTH-007: performance_glitch_user eventually logs in', async ({ page }) => {
    test.setTimeout(30000);
    await loginPage.login(users.valid.performance_glitch.username, users.valid.performance_glitch.password);
    await expect(page).toHaveURL(/inventory\.html/, { timeout: 20000 });
  });

  test('TC-AUTH-008: problem_user logs in and reaches inventory', async ({ page }) => {
    await loginPage.login(users.valid.problem.username, users.valid.problem.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('TC-AUTH-009: unauthenticated access to inventory redirects with error', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-test="error"]')).toContainText("You can only access '/inventory.html' when you are logged in.");
  });

  test('TC-AUTH-010: unauthenticated access to cart redirects with error', async ({ page }) => {
    await page.goto('/cart.html');
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-test="error"]')).toContainText("You can only access '/cart.html' when you are logged in.");
  });

  test('TC-AUTH-011: unauthenticated access to checkout redirects to login', async ({ page }) => {
    await page.goto('/checkout-step-one.html');
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });
});
