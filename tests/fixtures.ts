import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import users from '../data/users.json';

type MyFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<MyFixtures>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.valid.standard.username, users.valid.standard.password);
    await page.waitForURL('**/inventory.html');
    await use(page);
  },
});


