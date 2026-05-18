import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async removeItem(slug: string) {
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrice(name: string): Promise<number> {
    const item = this.cartItems.filter({ hasText: name });
    const priceText = await item.locator('.inventory_item_price').textContent();
    return parseFloat((priceText ?? '').replace('$', ''));
  }
}
