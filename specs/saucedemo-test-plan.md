# SauceDemo Comprehensive Test Plan

**Application Under Test:** https://www.saucedemo.com/  
**Application Name:** Swag Labs  
**Test Plan Version:** 1.0  
**Date Created:** 2026-05-18  

---

## Application Overview

SauceDemo (Swag Labs) is a demo e-commerce application for testing purposes. It provides:
- A login page with multiple user types
- A product inventory page with 6 products
- Product detail pages
- A shopping cart
- A multi-step checkout flow (information → overview → confirmation)
- Hamburger menu with navigation, logout, and reset options

### User Accounts

| Username | Password | Behavior |
|---|---|---|
| standard_user | secret_sauce | Normal functioning user |
| locked_out_user | secret_sauce | Login blocked — account locked |
| problem_user | secret_sauce | UI defects on product images and interactions |
| performance_glitch_user | secret_sauce | Artificial delay on login and other operations |
| error_user | secret_sauce | Errors on specific interactions (add-to-cart, checkout) |
| visual_user | secret_sauce | Visual layout defects |

### Products (6 total)

| Product | Price |
|---|---|
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Bolt T-Shirt | $15.99 |
| Sauce Labs Fleece Jacket | $49.99 |
| Sauce Labs Onesie | $7.99 |
| Test.allTheThings() T-Shirt (Red) | $15.99 |

### Pages / URLs

| Page | URL |
|---|---|
| Login | https://www.saucedemo.com/ |
| Inventory | https://www.saucedemo.com/inventory.html |
| Product Detail | https://www.saucedemo.com/inventory-item.html?id={id} |
| Cart | https://www.saucedemo.com/cart.html |
| Checkout Step 1 | https://www.saucedemo.com/checkout-step-one.html |
| Checkout Step 2 | https://www.saucedemo.com/checkout-step-two.html |
| Checkout Complete | https://www.saucedemo.com/checkout-complete.html |

---

## Test Scenarios

---

### SECTION 1: Authentication / Login

---

#### TC-AUTH-001: Successful Login — standard_user

**Title:** Valid credentials login redirects to inventory page

**Starting State:** Browser is on the login page (https://www.saucedemo.com/), not authenticated.

**Steps:**
1. Open https://www.saucedemo.com/
2. Verify the login form is visible with Username field, Password field, and Login button
3. Enter `standard_user` in the Username field
4. Enter `secret_sauce` in the Password field
5. Click the Login button

**Expected Outcome:**
- Browser redirects to https://www.saucedemo.com/inventory.html
- Page title shows "Swag Labs"
- Header displays "Products"
- 6 product cards are displayed
- The shopping cart icon is visible in the header with no badge (empty cart)

**Success Criteria:** URL is `/inventory.html`, 6 products are listed, no error messages displayed.  
**Failure Criteria:** Error message appears, URL remains at login page, or product listing is not rendered.

---

#### TC-AUTH-002: Login with Locked Out User

**Title:** Locked out user is blocked from logging in

**Starting State:** Browser is on the login page, not authenticated.

**Steps:**
1. Open https://www.saucedemo.com/
2. Enter `locked_out_user` in the Username field
3. Enter `secret_sauce` in the Password field
4. Click the Login button

**Expected Outcome:**
- URL remains at https://www.saucedemo.com/
- Error message is displayed: "Epic sadface: Sorry, this user has been locked out."
- Username and Password fields have a red error icon
- Error message has an "X" close button

**Success Criteria:** Error message matches expected text exactly, URL has not changed.  
**Failure Criteria:** User is logged in, or a different error message is shown.

---

#### TC-AUTH-003: Login with Empty Username and Password

**Title:** Login attempt with empty credentials shows username required error

**Starting State:** Browser is on the login page, not authenticated.

**Steps:**
1. Open https://www.saucedemo.com/
2. Leave both Username and Password fields empty
3. Click the Login button

**Expected Outcome:**
- URL remains at https://www.saucedemo.com/
- Error message is displayed: "Epic sadface: Username is required"
- Both input fields display error styling

**Success Criteria:** Correct error message appears.  
**Failure Criteria:** Login proceeds or different error message is shown.

---

#### TC-AUTH-004: Login with Username but No Password

**Title:** Login attempt with only username shows password required error

**Starting State:** Browser is on the login page, not authenticated.

**Steps:**
1. Open https://www.saucedemo.com/
2. Enter `standard_user` in the Username field
3. Leave Password field empty
4. Click the Login button

**Expected Outcome:**
- URL remains at https://www.saucedemo.com/
- Error message is displayed: "Epic sadface: Password is required"

**Success Criteria:** Error message matches expected text.  
**Failure Criteria:** Login proceeds or different error message is shown.

---

#### TC-AUTH-005: Login with Invalid Credentials

**Title:** Invalid username/password combination shows mismatch error

**Starting State:** Browser is on the login page, not authenticated.

**Steps:**
1. Open https://www.saucedemo.com/
2. Enter `invalid_user` in the Username field
3. Enter `wrong_password` in the Password field
4. Click the Login button

**Expected Outcome:**
- URL remains at https://www.saucedemo.com/
- Error message is displayed: "Epic sadface: Username and password do not match any user in this service"

**Success Criteria:** Correct error message appears.  
**Failure Criteria:** Login proceeds or different error message is shown.

---

#### TC-AUTH-006: Dismiss Login Error Message

**Title:** Clicking the error close button dismisses the error

**Starting State:** Browser is on the login page with an error message visible (after a failed login attempt).

**Steps:**
1. Perform any failed login to generate an error message
2. Click the "X" (close) button on the error message

**Expected Outcome:**
- Error message is removed from the page
- Input fields return to their normal (non-error) styling

**Success Criteria:** Error message is no longer visible.  
**Failure Criteria:** Error message remains after clicking X.

---

#### TC-AUTH-007: Login with performance_glitch_user

**Title:** Performance glitch user logs in successfully but with a delay

**Starting State:** Browser is on the login page, not authenticated.

**Steps:**
1. Open https://www.saucedemo.com/
2. Enter `performance_glitch_user` in the Username field
3. Enter `secret_sauce` in the Password field
4. Click the Login button
5. Wait for page to load (may take several seconds)

**Expected Outcome:**
- Login eventually succeeds and redirects to `/inventory.html`
- Login takes noticeably longer than standard_user (typically 3–5+ seconds)

**Success Criteria:** Inventory page loads eventually.  
**Failure Criteria:** Login never completes, times out, or shows an error.

---

#### TC-AUTH-008: Login with problem_user

**Title:** Problem user can log in but product images are broken

**Starting State:** Browser is on the login page, not authenticated.

**Steps:**
1. Open https://www.saucedemo.com/
2. Enter `problem_user` in the Username field
3. Enter `secret_sauce` in the Password field
4. Click the Login button
5. Observe the inventory page

**Expected Outcome:**
- Login succeeds and redirects to `/inventory.html`
- Product images are all the same wrong image (all show Sauce Labs Backpack image regardless of product)

**Success Criteria:** Login succeeds; defective product images are observed.  
**Failure Criteria:** Login fails or images appear correct.

---

#### TC-AUTH-009: Access Protected Page Without Authentication

**Title:** Unauthenticated access to inventory page redirects to login with error

**Starting State:** Browser has no active session (logged out or fresh start).

**Steps:**
1. Directly navigate to https://www.saucedemo.com/inventory.html
2. Observe the page behavior

**Expected Outcome:**
- Browser is redirected to https://www.saucedemo.com/
- An error message is displayed: "Epic sadface: You can only access '/inventory.html' when you are logged in."

**Success Criteria:** Redirect occurs and the correct error message is shown.  
**Failure Criteria:** Inventory page is accessible without login.

---

#### TC-AUTH-010: Access Cart Without Authentication

**Title:** Unauthenticated access to cart page redirects to login with error

**Starting State:** Browser has no active session.

**Steps:**
1. Directly navigate to https://www.saucedemo.com/cart.html

**Expected Outcome:**
- Browser redirects to https://www.saucedemo.com/
- Error message states the user must be logged in to access `/cart.html`

**Success Criteria:** Redirect and correct error message.  
**Failure Criteria:** Cart page is accessible.

---

#### TC-AUTH-011: Access Checkout Without Authentication

**Title:** Unauthenticated access to checkout pages redirects to login

**Starting State:** Browser has no active session.

**Steps:**
1. Directly navigate to https://www.saucedemo.com/checkout-step-one.html

**Expected Outcome:**
- Browser redirects to https://www.saucedemo.com/
- Appropriate login-required error is displayed

**Success Criteria:** Redirect occurs with error message.  
**Failure Criteria:** Checkout page is accessible without login.

---

### SECTION 2: Logout

---

#### TC-LOGOUT-001: Successful Logout

**Title:** Logout via hamburger menu clears session and returns to login

**Starting State:** User is logged in as standard_user and on the inventory page.

**Steps:**
1. Click the hamburger menu (three-line icon) in the top-left
2. Wait for the side menu to slide open
3. Verify menu items are visible: "All Items", "About", "Logout", "Reset App State"
4. Click the "Logout" link

**Expected Outcome:**
- Browser redirects to https://www.saucedemo.com/
- The login form is displayed (Username, Password, Login button)
- No cart items are retained in the session

**Success Criteria:** URL is at login page, login form is visible.  
**Failure Criteria:** Redirect does not occur, or session persists.

---

#### TC-LOGOUT-002: Post-Logout Protected Page Access

**Title:** After logout, previously accessible pages require re-authentication

**Starting State:** User has just logged out and is on the login page.

**Steps:**
1. After logging out, attempt to navigate to https://www.saucedemo.com/inventory.html
2. Observe page behavior

**Expected Outcome:**
- Browser redirects back to login page
- Error message is displayed indicating login is required

**Success Criteria:** Redirect and error message are shown.  
**Failure Criteria:** Inventory page is accessible after logout.

---

#### TC-LOGOUT-003: Hamburger Menu Close Button

**Title:** Clicking Close Menu button closes the hamburger menu

**Starting State:** User is logged in, hamburger menu is open.

**Steps:**
1. Open the hamburger menu by clicking the menu icon
2. Click the "Close Menu" (X) button in the menu

**Expected Outcome:**
- The side navigation panel slides closed
- The inventory page is fully interactive again

**Success Criteria:** Menu panel closes.  
**Failure Criteria:** Menu remains open.

---

### SECTION 3: Product Inventory

---

#### TC-INV-001: Inventory Page Displays All 6 Products

**Title:** All 6 products are displayed with name, description, price, and Add to Cart button

**Starting State:** User is logged in as standard_user and on the inventory page.

**Steps:**
1. Navigate to https://www.saucedemo.com/inventory.html
2. Count the product cards displayed
3. For each product card, verify the following elements are present:
   - Product image (clickable)
   - Product name (clickable link)
   - Product description text
   - Product price (formatted as $X.XX)
   - "Add to cart" button

**Expected Outcome:**
- 6 product cards are displayed
- All elements are present and visible for each card
- Products shown: Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99), Sauce Labs Bolt T-Shirt ($15.99), Sauce Labs Fleece Jacket ($49.99), Sauce Labs Onesie ($7.99), Test.allTheThings() T-Shirt (Red) ($15.99)

**Success Criteria:** Exactly 6 products with all required elements.  
**Failure Criteria:** Fewer/more than 6 products, or any product missing required elements.

---

#### TC-INV-002: Sort Products by Name (A to Z) — Default

**Title:** Default product sorting is Name A to Z

**Starting State:** User is logged in as standard_user, on the inventory page.

**Steps:**
1. Navigate to the inventory page
2. Observe the sort dropdown default value
3. Verify the order of products displayed

**Expected Outcome:**
- Sort dropdown shows "Name (A to Z)" as the selected option
- Products appear in alphabetical order:
  1. Sauce Labs Backpack
  2. Sauce Labs Bike Light
  3. Sauce Labs Bolt T-Shirt
  4. Sauce Labs Fleece Jacket
  5. Sauce Labs Onesie
  6. Test.allTheThings() T-Shirt (Red)

**Success Criteria:** Default sort is A-Z and product order is correct.  
**Failure Criteria:** Different default or incorrect ordering.

---

#### TC-INV-003: Sort Products by Name (Z to A)

**Title:** Selecting Z to A sort reverses alphabetical product order

**Starting State:** User is logged in, on the inventory page.

**Steps:**
1. Click the sort dropdown
2. Select "Name (Z to A)"
3. Observe the product order

**Expected Outcome:**
- Products appear in reverse alphabetical order:
  1. Test.allTheThings() T-Shirt (Red)
  2. Sauce Labs Onesie
  3. Sauce Labs Fleece Jacket
  4. Sauce Labs Bolt T-Shirt
  5. Sauce Labs Bike Light
  6. Sauce Labs Backpack

**Success Criteria:** Product order matches Z-A alphabetical sequence.  
**Failure Criteria:** Order is unchanged or incorrect.

---

#### TC-INV-004: Sort Products by Price (Low to High)

**Title:** Price (low to high) sort orders products from cheapest to most expensive

**Starting State:** User is logged in, on the inventory page.

**Steps:**
1. Click the sort dropdown
2. Select "Price (low to high)"
3. Observe product order

**Expected Outcome:**
- Products sorted by ascending price:
  1. Sauce Labs Onesie ($7.99)
  2. Sauce Labs Bike Light ($9.99)
  3. Sauce Labs Bolt T-Shirt ($15.99)
  4. Test.allTheThings() T-Shirt (Red) ($15.99)
  5. Sauce Labs Backpack ($29.99)
  6. Sauce Labs Fleece Jacket ($49.99)

**Success Criteria:** Products in ascending price order.  
**Failure Criteria:** Prices are not ascending or order is unchanged.

---

#### TC-INV-005: Sort Products by Price (High to Low)

**Title:** Price (high to low) sort orders products from most expensive to cheapest

**Starting State:** User is logged in, on the inventory page.

**Steps:**
1. Click the sort dropdown
2. Select "Price (high to low)"
3. Observe product order

**Expected Outcome:**
- Products sorted by descending price:
  1. Sauce Labs Fleece Jacket ($49.99)
  2. Sauce Labs Backpack ($29.99)
  3. Sauce Labs Bolt T-Shirt ($15.99)
  4. Test.allTheThings() T-Shirt (Red) ($15.99)
  5. Sauce Labs Bike Light ($9.99)
  6. Sauce Labs Onesie ($7.99)

**Success Criteria:** Products in descending price order.  
**Failure Criteria:** Prices are not descending or order is unchanged.

---

#### TC-INV-006: Add Single Product to Cart from Inventory

**Title:** Clicking Add to Cart adds item to cart and updates badge

**Starting State:** User is logged in as standard_user, cart is empty (badge not visible).

**Steps:**
1. On the inventory page, click "Add to cart" for "Sauce Labs Backpack"
2. Observe the cart badge in the header
3. Observe the button that was clicked

**Expected Outcome:**
- Cart badge appears in the header with the value "1"
- The "Add to cart" button changes to "Remove"
- No page navigation occurs

**Success Criteria:** Cart badge shows "1", button text changed to "Remove".  
**Failure Criteria:** Badge does not appear or button text does not change.

---

#### TC-INV-007: Add Multiple Products to Cart from Inventory

**Title:** Adding multiple products increments cart badge correctly

**Starting State:** User is logged in as standard_user, cart is empty.

**Steps:**
1. Click "Add to cart" for Sauce Labs Backpack
2. Click "Add to cart" for Sauce Labs Bike Light
3. Click "Add to cart" for Sauce Labs Bolt T-Shirt
4. Verify cart badge after each addition
5. Continue adding remaining 3 products
6. Verify final cart badge

**Expected Outcome:**
- Cart badge increments by 1 with each addition: 1, 2, 3, 4, 5, 6
- All 6 "Add to cart" buttons change to "Remove"
- Final badge shows "6"

**Success Criteria:** Badge accurately reflects number of items added.  
**Failure Criteria:** Badge shows wrong count or does not update.

---

#### TC-INV-008: Remove Product from Inventory (via Remove Button)

**Title:** Clicking Remove from inventory page removes item and decrements badge

**Starting State:** User is logged in, one or more items are in the cart.

**Steps:**
1. Add Sauce Labs Backpack to cart (badge shows "1")
2. Click the "Remove" button for Sauce Labs Backpack
3. Observe cart badge and button state

**Expected Outcome:**
- Cart badge disappears (or decrements if other items in cart)
- Button reverts to "Add to cart"
- No page navigation occurs

**Success Criteria:** Badge decremented, button text reverted.  
**Failure Criteria:** Item remains in cart or badge shows wrong count.

---

### SECTION 4: Product Detail Page

---

#### TC-DETAIL-001: Navigate to Product Detail via Product Name Link

**Title:** Clicking a product name navigates to the correct product detail page

**Starting State:** User is logged in, on the inventory page.

**Steps:**
1. Click the "Sauce Labs Backpack" product name link
2. Observe the URL and page content

**Expected Outcome:**
- URL changes to https://www.saucedemo.com/inventory-item.html?id=4
- Product detail page shows:
  - Product image
  - Product name: "Sauce Labs Backpack"
  - Product description text
  - Price: "$29.99"
  - "Add to cart" button
  - "Back to products" button/link

**Success Criteria:** Correct product information is displayed on detail page.  
**Failure Criteria:** Wrong product shown, elements missing, or navigation fails.

---

#### TC-DETAIL-002: Navigate to Product Detail via Product Image

**Title:** Clicking a product image navigates to product detail page

**Starting State:** User is logged in, on the inventory page.

**Steps:**
1. Click the product image for "Sauce Labs Bike Light"
2. Observe the URL and page content

**Expected Outcome:**
- URL changes to the product's inventory-item page
- Correct product details are shown (Sauce Labs Bike Light, $9.99)

**Success Criteria:** Product detail page displays the correct product.  
**Failure Criteria:** Navigation does not occur or wrong product shown.

---

#### TC-DETAIL-003: Add to Cart from Product Detail Page

**Title:** Adding product to cart from detail page updates cart badge

**Starting State:** User is logged in, on the product detail page for any product, cart is empty.

**Steps:**
1. Navigate to a product detail page (e.g., Sauce Labs Backpack)
2. Click the "Add to cart" button
3. Observe the cart badge and button state

**Expected Outcome:**
- Cart badge appears with value "1"
- "Add to cart" button changes to "Remove"

**Success Criteria:** Badge shows "1", button text changed.  
**Failure Criteria:** Badge does not update or button text unchanged.

---

#### TC-DETAIL-004: Remove from Cart on Product Detail Page

**Title:** Removing product from detail page decrements cart badge

**Starting State:** User is logged in, product detail page is showing a product that is already in the cart (Remove button visible).

**Steps:**
1. Navigate to a product detail page where item is in cart
2. Click the "Remove" button
3. Observe the cart badge and button state

**Expected Outcome:**
- Cart badge decrements (or disappears if last item)
- Button reverts to "Add to cart"

**Success Criteria:** Badge and button updated correctly.  
**Failure Criteria:** Item still in cart or badge wrong.

---

#### TC-DETAIL-005: Back to Products Navigation

**Title:** Clicking Back to Products returns to inventory without losing cart state

**Starting State:** User is logged in, on a product detail page, has items in cart.

**Steps:**
1. Navigate to a product detail page
2. Add the product to cart if not already added
3. Note the cart badge count
4. Click the "Back to products" button (with back arrow)
5. Observe URL, page content, and cart badge

**Expected Outcome:**
- URL changes back to https://www.saucedemo.com/inventory.html
- Cart badge still shows the same count as before
- Products page is displayed
- Previously added items still show "Remove" button

**Success Criteria:** Cart state preserved on navigation back.  
**Failure Criteria:** Cart is cleared or badge changes unexpectedly.

---

#### TC-DETAIL-006: Cart Badge Persists Across Product Detail Pages

**Title:** Cart count badge persists when navigating between product detail pages

**Starting State:** User is logged in, has 2 items in cart.

**Steps:**
1. Add Sauce Labs Backpack and Sauce Labs Bike Light to cart (badge shows "2")
2. Click on Sauce Labs Bolt T-Shirt to open its detail page
3. Observe the cart badge

**Expected Outcome:**
- Cart badge on the Sauce Labs Bolt T-Shirt detail page shows "2"
- Previously added items are still in cart

**Success Criteria:** Cart badge persists across page navigations.  
**Failure Criteria:** Badge resets or shows wrong count.

---

### SECTION 5: Shopping Cart

---

#### TC-CART-001: Navigate to Cart via Cart Icon

**Title:** Clicking the cart icon navigates to the cart page

**Starting State:** User is logged in, has at least one item in cart.

**Steps:**
1. Click the shopping cart icon in the header
2. Observe the URL and page content

**Expected Outcome:**
- URL changes to https://www.saucedemo.com/cart.html
- Page shows "Your Cart" heading
- Added item(s) are listed with QTY, name, description, price, and Remove button
- "Continue Shopping" and "Checkout" buttons are visible

**Success Criteria:** Cart page loads with correct items.  
**Failure Criteria:** Cart does not load or wrong items shown.

---

#### TC-CART-002: Cart Shows Correct Item Details

**Title:** Cart displays correct quantity, name, description, and price for each item

**Starting State:** User is logged in, has Sauce Labs Backpack in cart.

**Steps:**
1. Navigate to the cart page
2. Verify item details for Sauce Labs Backpack

**Expected Outcome:**
- QTY: 1
- Item name: "Sauce Labs Backpack"
- Description: full description text
- Price: $29.99
- Remove button is visible and clickable

**Success Criteria:** All item details match expected values.  
**Failure Criteria:** Any field shows incorrect data.

---

#### TC-CART-003: Cart with Multiple Items

**Title:** Cart correctly displays all added items when multiple products are added

**Starting State:** User is logged in, all 6 products have been added to cart.

**Steps:**
1. Add all 6 products to cart from the inventory page
2. Navigate to the cart page
3. Count the items listed
4. Verify cart badge shows "6"

**Expected Outcome:**
- 6 items are listed in the cart
- Cart badge shows "6"
- Each item has its own name, description, price ($7.99–$49.99), and Remove button

**Success Criteria:** 6 items listed, badge shows 6.  
**Failure Criteria:** Fewer items listed or badge shows wrong number.

---

#### TC-CART-004: Remove Item from Cart Page

**Title:** Removing an item from the cart page updates the cart correctly

**Starting State:** User is logged in, cart has multiple items (e.g., 2 items).

**Steps:**
1. Navigate to the cart page with 2 items
2. Click the "Remove" button for the first item (e.g., Sauce Labs Backpack)
3. Observe the cart contents and badge

**Expected Outcome:**
- Sauce Labs Backpack is no longer listed
- Cart badge decrements to "1"
- Remaining item(s) are still listed correctly

**Success Criteria:** Item removed, badge updated, remaining items intact.  
**Failure Criteria:** Item not removed, or other items affected.

---

#### TC-CART-005: Remove All Items from Cart

**Title:** Removing all items from the cart results in an empty cart

**Starting State:** User is logged in, cart has 1 item.

**Steps:**
1. Navigate to the cart page with 1 item
2. Click the "Remove" button for that item
3. Observe cart contents and badge

**Expected Outcome:**
- Cart is empty (no items listed)
- Cart badge disappears from the header
- "Continue Shopping" and "Checkout" buttons remain visible

**Success Criteria:** Cart is empty, badge removed.  
**Failure Criteria:** Badge remains or items still listed.

---

#### TC-CART-006: Continue Shopping from Cart Returns to Inventory

**Title:** Clicking Continue Shopping returns to inventory with cart state preserved

**Starting State:** User is logged in, on the cart page with items in cart.

**Steps:**
1. Navigate to the cart page
2. Click the "Continue Shopping" button (with back arrow)
3. Observe the URL, page, and cart badge

**Expected Outcome:**
- URL changes to https://www.saucedemo.com/inventory.html
- Cart badge still shows the same count
- Previously added items still show "Remove" button on inventory

**Success Criteria:** Inventory page loads, cart state preserved.  
**Failure Criteria:** Cart is cleared or wrong page is shown.

---

#### TC-CART-007: Navigate to Empty Cart

**Title:** Navigating to cart with no items shows empty cart

**Starting State:** User is logged in, no items in cart.

**Steps:**
1. Verify cart badge is not visible (no items added)
2. Click the cart icon in the header
3. Observe the cart page

**Expected Outcome:**
- URL is https://www.saucedemo.com/cart.html
- "Your Cart" heading is visible
- No items are listed in the cart
- "Continue Shopping" and "Checkout" buttons are present

**Success Criteria:** Empty cart page loads with no items.  
**Failure Criteria:** Items appear in empty cart or page fails to load.

---

#### TC-CART-008: Cart State Persists After Sorting Products

**Title:** Cart items are not affected by changing the sort order on inventory

**Starting State:** User is logged in, has 2 items in cart.

**Steps:**
1. Add Sauce Labs Backpack and Sauce Labs Bike Light to cart (badge shows "2")
2. Change sort order to "Price (high to low)"
3. Observe the cart badge
4. Navigate to the cart page

**Expected Outcome:**
- Cart badge remains "2" after sorting
- Cart page still shows both items correctly

**Success Criteria:** Sort does not affect cart contents.  
**Failure Criteria:** Cart is cleared or badge changes after sort.

---

### SECTION 6: Checkout

---

#### TC-CHK-001: Checkout Step 1 — Valid Form Submission

**Title:** Completing checkout step 1 with valid information proceeds to overview

**Starting State:** User is logged in, has at least 1 item in cart, is on checkout-step-one.html.

**Steps:**
1. Navigate to the cart and click "Checkout"
2. Verify URL is https://www.saucedemo.com/checkout-step-one.html
3. Verify "Checkout: Your Information" heading is shown
4. Verify 3 fields: First Name, Last Name, Zip/Postal Code
5. Fill "First Name" with "John"
6. Fill "Last Name" with "Doe"
7. Fill "Zip/Postal Code" with "12345"
8. Click the "Continue" button

**Expected Outcome:**
- URL changes to https://www.saucedemo.com/checkout-step-two.html
- "Checkout: Overview" heading is displayed

**Success Criteria:** Navigation to step 2 occurs.  
**Failure Criteria:** Error is shown or URL does not change.

---

#### TC-CHK-002: Checkout Step 1 — Empty First Name Validation

**Title:** Submitting checkout step 1 with empty First Name shows required error

**Starting State:** User is logged in, has item in cart, is on checkout-step-one.html.

**Steps:**
1. Leave all fields empty
2. Click "Continue"
3. Observe validation feedback

**Expected Outcome:**
- URL remains at checkout-step-one.html
- Error message displayed: "Error: First Name is required"
- Input fields display error icons/styling

**Success Criteria:** Correct validation error shown.  
**Failure Criteria:** Checkout proceeds or wrong error shown.

---

#### TC-CHK-003: Checkout Step 1 — Empty Last Name Validation

**Title:** Submitting checkout with first name but no last name shows last name required error

**Starting State:** User is logged in, has item in cart, is on checkout-step-one.html.

**Steps:**
1. Fill "First Name" with "John"
2. Leave "Last Name" empty
3. Leave "Zip/Postal Code" empty
4. Click "Continue"

**Expected Outcome:**
- Error message displayed: "Error: Last Name is required"

**Success Criteria:** Correct error message shown.  
**Failure Criteria:** Checkout proceeds or wrong error shown.

---

#### TC-CHK-004: Checkout Step 1 — Empty Zip Code Validation

**Title:** Submitting checkout with first and last name but no zip code shows zip required error

**Starting State:** User is logged in, has item in cart, is on checkout-step-one.html.

**Steps:**
1. Fill "First Name" with "John"
2. Fill "Last Name" with "Doe"
3. Leave "Zip/Postal Code" empty
4. Click "Continue"

**Expected Outcome:**
- Error message displayed: "Error: Postal Code is required"

**Success Criteria:** Correct error message shown.  
**Failure Criteria:** Checkout proceeds or wrong error shown.

---

#### TC-CHK-005: Checkout Step 1 — Cancel Returns to Cart

**Title:** Clicking Cancel on checkout step 1 returns to the cart page

**Starting State:** User is logged in, on checkout-step-one.html.

**Steps:**
1. Navigate to checkout step 1
2. Click the "Cancel" button (with back arrow)
3. Observe the URL

**Expected Outcome:**
- URL changes back to https://www.saucedemo.com/cart.html
- Cart items are still present

**Success Criteria:** Returns to cart with items intact.  
**Failure Criteria:** Different page shown or cart is cleared.

---

#### TC-CHK-006: Checkout Step 2 — Overview Displays Correct Summary

**Title:** Checkout overview shows correct item summary, payment, shipping, and totals

**Starting State:** User is logged in, has Sauce Labs Backpack ($29.99) in cart, completed step 1.

**Steps:**
1. Complete checkout step 1 with valid data
2. On the checkout overview page, verify the following:
   - Item(s) listed with QTY, name, and price
   - Payment Information section
   - Shipping Information section
   - Price Total section with item total, tax, and grand total

**Expected Outcome:**
- Items shown: Sauce Labs Backpack, QTY 1, $29.99
- Payment Information: "SauceCard #31337"
- Shipping Information: "Free Pony Express Delivery!"
- Item total: $29.99
- Tax: $2.40
- Total: $32.39
- "Cancel" and "Finish" buttons visible

**Success Criteria:** All summary details match expected values.  
**Failure Criteria:** Any value is incorrect or missing.

---

#### TC-CHK-007: Checkout Step 2 — Tax Calculation

**Title:** Tax is calculated at 8% of item total

**Starting State:** User is logged in, has items in cart, on checkout-step-two.html.

**Steps:**
1. Add Sauce Labs Backpack ($29.99) to cart
2. Complete step 1 and reach step 2
3. Verify: Item total $29.99, Tax $2.40, Total $32.39

**Expected Outcome:**
- Tax ≈ 8% of item total
- Grand total = item total + tax

**Success Criteria:** Math is correct (29.99 × 0.08 ≈ 2.40, total = 32.39).  
**Failure Criteria:** Totals do not add up.

---

#### TC-CHK-008: Checkout Step 2 — Multi-Item Total Calculation

**Title:** Checkout overview calculates correct total for multiple items

**Starting State:** User is logged in, has all 6 items in cart, on checkout-step-two.html.

**Steps:**
1. Add all 6 products to cart
2. Complete step 1 with valid data
3. Observe the price total section on step 2
4. Verify: Item total = $7.99 + $9.99 + $15.99 + $15.99 + $29.99 + $49.99 = $129.94
5. Verify tax ≈ 8% of $129.94 = $10.39
6. Verify grand total = $140.33

**Expected Outcome:**
- Item total: $129.94
- Tax: $10.39
- Grand total: $140.33

**Success Criteria:** Totals are mathematically correct.  
**Failure Criteria:** Any total is incorrect.

---

#### TC-CHK-009: Checkout Step 2 — Cancel Returns to Inventory

**Title:** Clicking Cancel on checkout overview returns to inventory page

**Starting State:** User is logged in, on checkout-step-two.html.

**Steps:**
1. Reach checkout step 2 (overview)
2. Click the "Cancel" button

**Expected Outcome:**
- URL changes to https://www.saucedemo.com/inventory.html

**Success Criteria:** Returns to inventory page.  
**Failure Criteria:** Different page shown.

---

#### TC-CHK-010: Complete Order — Checkout Confirmation

**Title:** Clicking Finish completes the order and shows confirmation

**Starting State:** User is logged in, on checkout-step-two.html (overview) with item(s) in cart.

**Steps:**
1. Reach checkout step 2 with items
2. Click the "Finish" button
3. Observe the page

**Expected Outcome:**
- URL changes to https://www.saucedemo.com/checkout-complete.html
- "Checkout: Complete!" heading is shown
- "Thank you for your order!" heading is displayed
- Confirmation text: "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
- Pony Express image is displayed
- "Back Home" button is visible
- Cart badge is no longer visible (cart is empty)

**Success Criteria:** Confirmation page shown with all elements, cart cleared.  
**Failure Criteria:** Confirmation not shown or cart not cleared.

---

#### TC-CHK-011: Back Home after Checkout

**Title:** Clicking Back Home after order confirmation returns to inventory

**Starting State:** User is logged in, on checkout-complete.html after completing an order.

**Steps:**
1. Complete a successful checkout
2. Click the "Back Home" button

**Expected Outcome:**
- URL changes to https://www.saucedemo.com/inventory.html
- Inventory page displays all 6 products
- Cart badge is not visible (cart is empty)

**Success Criteria:** Inventory loads with empty cart.  
**Failure Criteria:** Wrong page or cart still shows items.

---

#### TC-CHK-012: Checkout Without Items in Cart

**Title:** Attempting to checkout with empty cart

**Starting State:** User is logged in, cart is empty.

**Steps:**
1. Navigate directly to https://www.saucedemo.com/cart.html with empty cart
2. Click the "Checkout" button
3. Observe behavior

**Expected Outcome:**
- Checkout step 1 page loads (URL: checkout-step-one.html)
- Note: SauceDemo currently allows proceeding to checkout with an empty cart — this is a known behavior to document

**Success Criteria:** Document actual behavior — whether the app allows or prevents empty cart checkout.  
**Failure Criteria:** Application crashes or shows unhandled error.

---

### SECTION 7: Navigation and Header

---

#### TC-NAV-001: Hamburger Menu — All Items Link

**Title:** All Items menu link navigates to inventory

**Starting State:** User is logged in, on any page (e.g., cart).

**Steps:**
1. Open the hamburger menu
2. Click "All Items"

**Expected Outcome:**
- URL changes to https://www.saucedemo.com/inventory.html
- All 6 products are displayed

**Success Criteria:** Inventory page loads.  
**Failure Criteria:** Wrong page or navigation fails.

---

#### TC-NAV-002: Hamburger Menu — About Link

**Title:** About menu link navigates to Sauce Labs website

**Starting State:** User is logged in, on the inventory page.

**Steps:**
1. Open the hamburger menu
2. Click "About"

**Expected Outcome:**
- Browser navigates to https://saucelabs.com/

**Success Criteria:** Sauce Labs homepage loads.  
**Failure Criteria:** Wrong URL or navigation fails.

---

#### TC-NAV-003: Hamburger Menu — Reset App State

**Title:** Reset App State clears cart and resets product button states

**Starting State:** User is logged in, has multiple items in cart, product "Add to cart" buttons show as "Remove".

**Steps:**
1. Add at least 2 products to cart
2. Verify cart badge shows the count
3. Open the hamburger menu
4. Click "Reset App State"
5. Close the menu
6. Observe cart badge and product button states

**Expected Outcome:**
- Cart badge disappears (cart is cleared)
- All "Remove" buttons on inventory revert to "Add to cart"
- The page does not reload/navigate

**Success Criteria:** Cart cleared and buttons reset without page reload.  
**Failure Criteria:** Cart persists or buttons not reset.

---

#### TC-NAV-004: Swag Labs Logo / Title in Header

**Title:** Clicking Swag Labs title in header stays on current page or navigates to inventory

**Starting State:** User is logged in.

**Steps:**
1. On any page, click the "Swag Labs" title/logo in the header

**Expected Outcome:**
- Behavior varies by implementation — document whether it stays on the page or navigates to inventory

**Success Criteria:** Application does not error.  
**Failure Criteria:** Application crashes or shows an error.

---

#### TC-NAV-005: Footer Social Media Links

**Title:** Footer social media links are present and point to correct URLs

**Starting State:** User is logged in, on any app page.

**Steps:**
1. Scroll to the footer of any page
2. Verify Twitter, Facebook, and LinkedIn links are present
3. Verify the href values

**Expected Outcome:**
- Twitter link: https://twitter.com/saucelabs
- Facebook link: https://www.facebook.com/saucelabs
- LinkedIn link: https://www.linkedin.com/company/sauce-labs/

**Success Criteria:** All 3 links present with correct URLs.  
**Failure Criteria:** Links missing or URLs incorrect.

---

### SECTION 8: User Type Behavior Differences

---

#### TC-USER-001: problem_user — Broken Product Images

**Title:** problem_user sees incorrect/broken product images on inventory

**Starting State:** Browser on login page.

**Steps:**
1. Login as `problem_user` with password `secret_sauce`
2. Navigate to inventory page
3. Observe all product images

**Expected Outcome:**
- Login succeeds
- All product images show the same image (Sauce Labs Backpack image shown for all products) — images are incorrect

**Success Criteria:** Defect is observable (all images are the same).  
**Failure Criteria:** Images appear correctly (would indicate defect was fixed).

---

#### TC-USER-002: problem_user — Add to Cart Issues

**Title:** problem_user may experience broken add-to-cart behavior

**Starting State:** Logged in as problem_user.

**Steps:**
1. Click "Add to cart" for various products
2. Observe which products can be added and which cannot

**Expected Outcome:**
- Some products may not add correctly to cart or may add wrong products
- Cart badge may not update correctly for all products

**Success Criteria:** Defects are documented and observed.  
**Failure Criteria:** All products add correctly (no defects).

---

#### TC-USER-003: performance_glitch_user — Login Delay

**Title:** performance_glitch_user experiences a significant delay on login

**Starting State:** Browser on login page.

**Steps:**
1. Record the start time
2. Enter `performance_glitch_user` credentials
3. Click Login
4. Record the time when inventory page loads

**Expected Outcome:**
- Login takes noticeably longer than standard_user (typically 3–5+ seconds)
- Login eventually succeeds

**Success Criteria:** Measurable delay is observed (> 2 seconds longer than standard_user).  
**Failure Criteria:** Login is as fast as standard_user.

---

#### TC-USER-004: performance_glitch_user — Page Interactions

**Title:** performance_glitch_user may experience delays on page interactions

**Starting State:** Logged in as performance_glitch_user.

**Steps:**
1. Attempt to add items to cart
2. Attempt to sort products
3. Navigate to cart and checkout
4. Measure response times for interactions

**Expected Outcome:**
- Interactions may be slower than standard_user
- All features still function correctly, just with delays

**Success Criteria:** Features work, delays are measurable.  
**Failure Criteria:** Features are broken (not just slow).

---

#### TC-USER-005: error_user — Add to Cart Errors

**Title:** error_user encounters errors when adding certain items to cart

**Starting State:** Logged in as error_user.

**Steps:**
1. Attempt to add each product to cart one at a time
2. Observe which succeed and which fail

**Expected Outcome:**
- Some products fail to add to cart
- Error messages or unexpected behavior may appear

**Success Criteria:** Errors are observed for at least some products.  
**Failure Criteria:** All products add successfully.

---

#### TC-USER-006: visual_user — Layout Defects

**Title:** visual_user sees visual layout defects on various pages

**Starting State:** Logged in as visual_user.

**Steps:**
1. Login as visual_user
2. Navigate through inventory, product detail, cart, and checkout pages
3. Observe for visual anomalies: misaligned elements, wrong colors, incorrect fonts, missing elements

**Expected Outcome:**
- Visual defects are visible on one or more pages (e.g., incorrect button placement, wrong product images, layout misalignments)

**Success Criteria:** Visual defects are observable.  
**Failure Criteria:** No visual defects (would indicate defects were fixed).

---

### SECTION 9: Edge Cases and Boundary Conditions

---

#### TC-EDGE-001: Cart Badge Maximum — All 6 Items

**Title:** Cart badge correctly shows maximum of 6 when all items are added

**Starting State:** User is logged in, cart is empty.

**Steps:**
1. Add all 6 products to cart
2. Verify cart badge shows "6"

**Expected Outcome:**
- Badge displays "6"

**Success Criteria:** Badge shows "6".  
**Failure Criteria:** Badge shows wrong number or overflows.

---

#### TC-EDGE-002: Direct URL Navigation to Product Detail

**Title:** Direct URL access to a valid product detail page works correctly

**Starting State:** User is logged in.

**Steps:**
1. Navigate directly to https://www.saucedemo.com/inventory-item.html?id=4
2. Observe page content

**Expected Outcome:**
- Product detail page for Sauce Labs Backpack (id=4) is displayed correctly
- All product elements are visible

**Success Criteria:** Correct product page loads.  
**Failure Criteria:** Error page or wrong product shown.

---

#### TC-EDGE-003: Direct URL Navigation to Invalid Product ID

**Title:** Navigating to an invalid product ID shows appropriate behavior

**Starting State:** User is logged in.

**Steps:**
1. Navigate directly to https://www.saucedemo.com/inventory-item.html?id=999
2. Observe the page

**Expected Outcome:**
- Application handles the invalid ID gracefully (e.g., shows empty page, error message, or redirects)
- No JavaScript errors crash the page

**Success Criteria:** Application handles edge case without crash.  
**Failure Criteria:** Unhandled JavaScript error or white screen of death.

---

#### TC-EDGE-004: Checkout with Special Characters in Name Fields

**Title:** Checkout step 1 handles special characters in name fields

**Starting State:** User is logged in, has item in cart, on checkout-step-one.html.

**Steps:**
1. Fill First Name with "José"
2. Fill Last Name with "O'Brien-Smith"
3. Fill Zip Code with "12345"
4. Click Continue

**Expected Outcome:**
- Checkout proceeds to step 2 without error
- Special characters are preserved

**Success Criteria:** Checkout proceeds normally.  
**Failure Criteria:** Validation error or incorrect data shown.

---

#### TC-EDGE-005: Cart State Preserved Across Browser Refresh

**Title:** Cart items persist after browser refresh

**Starting State:** User is logged in, has items in cart.

**Steps:**
1. Add 2 items to cart (badge shows "2")
2. Refresh the browser (F5 or Ctrl+R)
3. Observe the cart badge and navigate to cart

**Expected Outcome:**
- Cart badge still shows "2" after refresh
- Both items are still in the cart

**Success Criteria:** Cart state persists through refresh.  
**Failure Criteria:** Cart is cleared by refresh.

---

#### TC-EDGE-006: Checkout Cancel on Step 2 Does Not Clear Cart

**Title:** Cancelling from checkout step 2 preserves cart items

**Starting State:** User is logged in, has item in cart, is on checkout-step-two.html.

**Steps:**
1. Add items to cart and proceed to checkout step 2
2. Click "Cancel" on step 2
3. Navigate to the cart page
4. Verify cart items

**Expected Outcome:**
- Items are still in the cart after cancelling from step 2
- Cart count badge still shows the correct count

**Success Criteria:** Cart preserved after cancel from step 2.  
**Failure Criteria:** Cart is cleared after cancel.

---

#### TC-EDGE-007: Checkout Form with Numeric-Only Name

**Title:** Checkout step 1 allows or rejects numeric-only first name

**Starting State:** User is logged in, has item in cart, on checkout-step-one.html.

**Steps:**
1. Fill First Name with "12345"
2. Fill Last Name with "67890"
3. Fill Zip Code with "99999"
4. Click Continue

**Expected Outcome:**
- Document whether the application accepts or rejects numeric-only names
- If accepted, checkout proceeds to step 2

**Success Criteria:** Application behavior is documented (accept or reject).  
**Failure Criteria:** Application crashes or shows unhandled error.

---

#### TC-EDGE-008: Zip Code with Letters

**Title:** Checkout step 1 handles non-numeric zip code input

**Starting State:** User is logged in, has item in cart, on checkout-step-one.html.

**Steps:**
1. Fill First Name with "John"
2. Fill Last Name with "Doe"
3. Fill Zip/Postal Code with "ABCDE"
4. Click Continue

**Expected Outcome:**
- Document whether alphabetic zip codes are accepted or rejected
- If rejected, appropriate validation message appears

**Success Criteria:** Consistent behavior documented.  
**Failure Criteria:** Application crashes or shows unhandled error.

---

### SECTION 10: End-to-End Happy Path Scenarios

---

#### TC-E2E-001: Full Happy Path — Single Item Purchase

**Title:** Complete purchase flow from login to order confirmation with one item

**Starting State:** Browser is on the login page, not authenticated.

**Steps:**
1. Navigate to https://www.saucedemo.com/
2. Enter username: `standard_user`, password: `secret_sauce`
3. Click Login
4. Verify inventory page loads with 6 products
5. Click "Add to cart" for "Sauce Labs Backpack"
6. Verify cart badge shows "1"
7. Click the cart icon
8. Verify cart shows Sauce Labs Backpack
9. Click "Checkout"
10. Fill: First Name = "Jane", Last Name = "Smith", Zip = "90210"
11. Click "Continue"
12. Verify overview shows: Sauce Labs Backpack, $29.99, Tax $2.40, Total $32.39
13. Click "Finish"
14. Verify "Thank you for your order!" confirmation
15. Click "Back Home"
16. Verify inventory page is shown with empty cart

**Expected Outcome:**
- All steps complete successfully
- Order confirmation is displayed
- Cart is cleared after order

**Success Criteria:** Full flow completes end-to-end without errors.  
**Failure Criteria:** Any step fails or shows unexpected behavior.

---

#### TC-E2E-002: Full Happy Path — Multiple Items Purchase

**Title:** Complete purchase of multiple items from inventory to confirmation

**Starting State:** Browser on login page.

**Steps:**
1. Login as standard_user
2. Add Sauce Labs Bike Light ($9.99), Sauce Labs Bolt T-Shirt ($15.99), and Sauce Labs Onesie ($7.99) to cart
3. Verify badge shows "3"
4. Navigate to cart — verify 3 items, correct prices
5. Click Checkout
6. Fill checkout info (First: "Test", Last: "User", Zip: "10001")
7. Click Continue
8. Verify item total = $33.97, tax = $2.72, total = $36.69
9. Click Finish
10. Verify confirmation page

**Expected Outcome:**
- Totals are correct: $9.99 + $15.99 + $7.99 = $33.97, tax ≈ $2.72, total ≈ $36.69
- Confirmation is shown

**Success Criteria:** Multi-item flow completes with correct totals.  
**Failure Criteria:** Totals wrong or checkout fails.

---

#### TC-E2E-003: Add Item via Detail Page Then Checkout

**Title:** Adding item from product detail page and completing checkout

**Starting State:** Browser on login page.

**Steps:**
1. Login as standard_user
2. On inventory, click on "Sauce Labs Fleece Jacket" product name
3. Verify product detail page shows correct info ($49.99)
4. Click "Add to cart" — verify badge shows "1"
5. Click "Back to products"
6. Click cart icon
7. Verify Sauce Labs Fleece Jacket is in cart
8. Click Checkout
9. Fill checkout info
10. Click Continue
11. Verify total = $49.99 + tax
12. Click Finish
13. Verify confirmation

**Expected Outcome:**
- Product added from detail page carries through entire checkout successfully

**Success Criteria:** End-to-end flow works starting from detail page add-to-cart.  
**Failure Criteria:** Any step fails.

---

#### TC-E2E-004: Sort Then Purchase

**Title:** Sorting products then purchasing verifies sort does not affect functionality

**Starting State:** Browser on login page.

**Steps:**
1. Login as standard_user
2. Sort products by "Price (high to low)"
3. Add the first product shown (Sauce Labs Fleece Jacket, $49.99) to cart
4. Sort by "Price (low to high)"
5. Add the first product shown (Sauce Labs Onesie, $7.99) to cart
6. Verify badge shows "2"
7. Navigate to cart — verify both items are present
8. Complete checkout with valid info
9. Verify correct totals and confirmation

**Expected Outcome:**
- Sorting does not interfere with cart or checkout
- Correct items and prices throughout

**Success Criteria:** End-to-end flow with sorting works correctly.  
**Failure Criteria:** Wrong items in cart or sort interferes with purchase.

---

## Test Data Summary

### Valid Credentials
| Username | Password |
|---|---|
| standard_user | secret_sauce |
| problem_user | secret_sauce |
| performance_glitch_user | secret_sauce |
| error_user | secret_sauce |
| visual_user | secret_sauce |

### Invalid/Blocked Credentials
| Username | Password | Expected Error |
|---|---|---|
| locked_out_user | secret_sauce | User locked out message |
| (empty) | (empty) | Username is required |
| standard_user | (empty) | Password is required |
| invalid_user | wrong_password | Username/password do not match |

### Checkout Test Data
| Field | Valid Example | Notes |
|---|---|---|
| First Name | John | Any non-empty string |
| Last Name | Doe | Any non-empty string |
| Zip/Postal Code | 12345 | Any non-empty string |

### Product Price Reference
| Product | Price | ID |
|---|---|---|
| Sauce Labs Onesie | $7.99 | 2 |
| Sauce Labs Bike Light | $9.99 | 0 |
| Sauce Labs Bolt T-Shirt | $15.99 | 6 |
| Test.allTheThings() T-Shirt (Red) | $15.99 | 7 |
| Sauce Labs Backpack | $29.99 | 4 |
| Sauce Labs Fleece Jacket | $49.99 | 5 |
| **Total (all items)** | **$129.94** | |

---

## Key Selectors Reference

| Element | Selector |
|---|---|
| Username field | `[data-test="username"]` |
| Password field | `[data-test="password"]` |
| Login button | `[data-test="login-button"]` |
| Error message container | `[data-test="error"]` |
| Sort dropdown | `[data-test="product-sort-container"]` |
| Add to cart (Backpack) | `[data-test="add-to-cart-sauce-labs-backpack"]` |
| Remove (Backpack) | `[data-test="remove-sauce-labs-backpack"]` |
| Cart icon | `[data-test="shopping-cart-link"]` |
| Cart badge | `[data-test="shopping-cart-badge"]` |
| Continue Shopping | `[data-test="continue-shopping"]` |
| Checkout button | `[data-test="checkout"]` |
| First Name field | `[data-test="firstName"]` |
| Last Name field | `[data-test="lastName"]` |
| Zip/Postal Code field | `[data-test="postalCode"]` |
| Continue button | `[data-test="continue"]` |
| Cancel button | `[data-test="cancel"]` |
| Finish button | `[data-test="finish"]` |
| Back Home button | `[data-test="back-to-products"]` |
| Open Menu button | `getByRole('button', { name: 'Open Menu' })` |
| Logout link | `[data-test="logout-sidebar-link"]` |
| Reset App State | `[data-test="reset-sidebar-link"]` |
| Back to products | `[data-test="back-to-products"]` |

---

## Test Coverage Summary

| Area | Test Count |
|---|---|
| Authentication / Login | 11 |
| Logout | 3 |
| Product Inventory | 8 |
| Product Detail Page | 6 |
| Shopping Cart | 8 |
| Checkout | 12 |
| Navigation and Header | 5 |
| User Type Behaviors | 6 |
| Edge Cases / Boundary | 8 |
| End-to-End Happy Paths | 4 |
| **Total** | **71** |
