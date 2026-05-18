import { test, expect } from './fixtures';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import products from '../data/products.json';

test.describe('Product Detail Page', () => {
  let inventoryPage: InventoryPage;
  let detailPage: ProductDetailPage;

  test.beforeEach(async ({ loggedInPage: page }) => {
    inventoryPage = new InventoryPage(page);
    detailPage = new ProductDetailPage(page);
    await inventoryPage.goto();
  });

  test('TC-DETAIL-001: clicking product name navigates to correct detail page', async ({ loggedInPage: page }) => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await inventoryPage.clickProductByName(backpack.name);
    await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
    await expect(detailPage.productName).toHaveText(backpack.name);
    await expect(detailPage.productPrice).toHaveText(`$${backpack.price}`);
    await expect(detailPage.backToProductsButton).toBeVisible();
  });

  test('TC-DETAIL-002: clicking product image navigates to product detail', async ({ loggedInPage: page }) => {
    const bikeLight = products.products.find(p => p.slug === 'sauce-labs-bike-light')!;
    await inventoryPage.clickProductByName(bikeLight.name);
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(detailPage.productName).toHaveText(bikeLight.name);
  });

  test('TC-DETAIL-003: add to cart from detail page updates badge to 1', async () => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await detailPage.goto(backpack.id);
    await detailPage.addToCart();
    await expect(detailPage.cartBadge).toHaveText('1');
    await expect(detailPage.page.getByRole('button', { name: 'Remove' })).toBeVisible();
  });

  test('TC-DETAIL-004: remove from cart on detail page decrements badge', async () => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await detailPage.goto(backpack.id);
    await detailPage.addToCart();
    await expect(detailPage.cartBadge).toHaveText('1');
    await detailPage.removeFromCart();
    await expect(detailPage.cartBadge).not.toBeVisible();
    await expect(detailPage.page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });

  test('TC-DETAIL-005: back to products preserves cart state', async ({ loggedInPage: page }) => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    await detailPage.goto(backpack.id);
    await detailPage.addToCart();
    await expect(detailPage.cartBadge).toHaveText('1');
    await detailPage.backToProducts();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(page.locator(`[data-test="remove-${backpack.slug}"]`)).toBeVisible();
  });

  test('TC-DETAIL-006: cart badge persists when navigating between detail pages', async () => {
    const backpack = products.products.find(p => p.slug === 'sauce-labs-backpack')!;
    const bikeLight = products.products.find(p => p.slug === 'sauce-labs-bike-light')!;
    const boltTShirt = products.products.find(p => p.slug === 'sauce-labs-bolt-t-shirt')!;

    await inventoryPage.addToCart(backpack.slug);
    await inventoryPage.addToCart(bikeLight.slug);
    await detailPage.goto(boltTShirt.id);
    await expect(detailPage.cartBadge).toHaveText('2');
  });
});
