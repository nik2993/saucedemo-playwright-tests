import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly closeMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetLink = page.locator('[data-test="reset-sidebar-link"]');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
  }

  async openMenu() {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async closeMenu() {
    await this.closeMenuButton.click();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.openMenu();
    await this.resetLink.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      return parseInt((await this.cartBadge.textContent()) ?? '0');
    }
    return 0;
  }
}
