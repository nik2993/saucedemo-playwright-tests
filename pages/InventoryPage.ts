import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(value);
  }

  async addToCart(slug: string) {
    await this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  async removeFromCart(slug: string) {
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async getProductNamesList(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getProductPricesList(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  async getProductCount(): Promise<number> {
    return this.productItems.count();
  }

  async clickProductByName(name: string) {
    await this.productNames.filter({ hasText: name }).click();
  }

  async clickProductImage(index: number) {
    await this.page.locator('.inventory_item_img').nth(index).click();
  }
}
