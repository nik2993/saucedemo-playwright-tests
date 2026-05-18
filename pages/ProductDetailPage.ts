import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.productImage = page.locator('.inventory_details_img');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async goto(id: number) {
    await this.page.goto(`/inventory-item.html?id=${id}`);
  }

  async addToCart() {
    await this.page.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart() {
    await this.page.getByRole('button', { name: 'Remove' }).click();
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }

  async getName(): Promise<string> {
    return (await this.productName.textContent()) ?? '';
  }

  async getPrice(): Promise<number> {
    const text = (await this.productPrice.textContent()) ?? '';
    return parseFloat(text.replace('$', ''));
  }
}
