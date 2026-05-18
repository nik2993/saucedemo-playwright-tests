import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryTotal: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');
    this.paymentInfo = page.locator('[data-test="payment-info-value"]');
    this.shippingInfo = page.locator('[data-test="shipping-info-value"]');
    this.cartItems = page.locator('.cart_item');
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getSubtotal(): Promise<number> {
    const text = (await this.summarySubtotal.textContent()) ?? '';
    return parseFloat(text.replace('Item total: $', ''));
  }

  async getTax(): Promise<number> {
    const text = (await this.summaryTax.textContent()) ?? '';
    return parseFloat(text.replace('Tax: $', ''));
  }

  async getTotal(): Promise<number> {
    const text = (await this.summaryTotal.textContent()) ?? '';
    return parseFloat(text.replace('Total: $', ''));
  }

  async getPaymentInfo(): Promise<string> {
    return (await this.paymentInfo.textContent()) ?? '';
  }

  async getShippingInfo(): Promise<string> {
    return (await this.shippingInfo.textContent()) ?? '';
  }
}
