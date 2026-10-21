# Product Requirements Document: Fruit Shopping Prototype

## 1. App Overview and Purpose

Create a client-side shopping prototype where users can browse a small catalog of fruit, view product details, manage a shopping cart, and simulate placing an order. The prototype should demonstrate the basic flow of an online shopping app; it is not a production e-commerce system.

## 2. Target Audience

Online shoppers interested in browsing and ordering fruit.

## 3. Scope and Constraints

### In scope

- A sample catalog of 10 fruit products.
- Product browsing and product details.
- Adding products to a cart, changing quantities, and removing products.
- A checkout summary and simulated order confirmation.
- A left-side navigation menu linking to the four app pages.
- Basic styling and a layout that adapts to desktop and phone screens.

### Out of scope

- User accounts or authentication.
- Backend services, databases, or server APIs.
- Real payment processing, shipping, or order fulfillment.
- Production-grade visual polish.

## 4. Core Features

- Display the sample fruit catalog with each product's name, price per unit, description, and emoji.
- Let shoppers select a positive whole-number quantity and add a product to the cart.
- Show details for a selected product.
- Let shoppers review cart contents, update quantities, and remove products.
- Show an order summary and total at checkout.
- Simulate processing an order without collecting payment information.

## 5. Pages and Expected Behavior

### Products

- Display all 10 products with their emoji, name, and price per unit.
- Provide a quantity control and an **Add to Cart** action for each product.
- Allow shoppers to select a product to open its ProductDetails page.
- Show clear feedback when a product is added to the cart.

### ProductDetails

- Display the selected product's emoji, name, description, and price per unit.
- Provide a way to return to Products.
- If no product has been selected or the product ID is invalid, show a helpful message and a link to Products.

### ShoppingCart

- Display each cart item's name, quantity, and line total.
- Allow shoppers to update each item's quantity or remove the item.
- Show the cart total.
- Provide ways to continue shopping or proceed to Checkout.
- Show a useful empty-cart message when there are no items.

### Checkout

- Display the products being purchased, their quantities, line totals, and the order total.
- Provide a **Process Order** action when the cart contains items.
- Simulate a successful order locally; do not make a payment or contact a service.
- Show an empty-cart message and a way back to Products if there are no items.

## 6. Navigation

Provide a left-side navigation menu with links to **Products**, **ProductDetails**, **ShoppingCart**, and **Checkout**. Shoppers must also be able to open ProductDetails by selecting a product on Products.

At viewport widths below 600 CSS pixels, collapse the navigation labels to one- or two-letter abbreviations (for example, P, D, C, and O). Keep every link operable and provide accessible names so the abbreviated controls remain understandable to assistive technology.

## 7. Sample Data

Use this sample catalog. Prices are illustrative and in USD.

| Product | Description | Price per unit | Emoji |
|---|---|---:|:---:|
| Apples | Crisp, sweet apples for snacking. | $1.20 each | 🍎 |
| Bananas | Ripe bananas with a naturally sweet flavor. | $0.60 each | 🍌 |
| Oranges | Juicy oranges with a bright citrus taste. | $1.00 each | 🍊 |
| Strawberries | Sweet, fresh strawberries. | $4.50 per pound | 🍓 |
| Grapes | Seedless grapes for snacking or sharing. | $3.25 per pound | 🍇 |
| Watermelon | Refreshing watermelon with a crisp texture. | $0.80 per pound | 🍉 |
| Pineapple | Tropical pineapple with a sweet-tart flavor. | $3.50 each | 🍍 |
| Mangoes | Soft, sweet mangoes. | $1.75 each | 🥭 |
| Pears | Juicy pears with a mild sweetness. | $1.30 each | 🍐 |
| Cherries | Sweet cherries, great for a snack. | $5.00 per pound | 🍒 |

## 8. Use Cases and Acceptance Criteria

1. **Browse and inspect a product:** A shopper sees the product catalog, selects a product, and sees its description, emoji, and price on ProductDetails.
2. **Add items to the cart:** A shopper selects a quantity and adds a product. The cart shows the correct product and quantity. Adding the same product again increases its existing cart quantity.
3. **Update or remove cart items:** A shopper changes an item's quantity or removes it. The displayed line total and cart total update accordingly. A quantity of zero removes the item; invalid or negative quantities are not accepted.
4. **Review checkout:** A shopper proceeds to Checkout and sees the same items, quantities, and total as in the cart.
5. **Simulate an order:** Selecting **Process Order** displays an order confirmation, clears the cart, and does not request payment details.
6. **Navigate between pages:** The navigation menu takes the shopper to each page. Selecting a product opens its details, and the navigation labels collapse to abbreviations below 600 CSS pixels.

## 9. Technical Requirements

- Use HTML, CSS, and JavaScript to build a client-side web app.
- Use vanilla JavaScript; do not add a framework or backend.
- Keep the product catalog in a simple in-app dataset.
- Keep cart state while navigating between pages. Persistence after a browser refresh is not required.
- Use stable product IDs to associate selected products and cart entries with catalog data.
- Format prices consistently in USD and calculate line totals and the order total from product price and quantity. Round displayed monetary amounts to two decimal places.
- Do not require external services or API keys. Use emoji as the product visuals.

## 10. Visual and Responsive Requirements

- Use basic, clean styling that makes product information and actions easy to understand.
- Support desktop and phone-sized screens with a layout that adapts to available width.
- The app does not need fully polished responsive behavior, but content and controls should remain usable on small screens.
- Keep the navigation on the left at wider widths. At widths below 600 CSS pixels, show only the specified abbreviations.
- Use the accompanying text wireframes as low-fidelity layout guidance; exact colors, fonts, and decorative details are left to implementation.

## 11. Prototype Assumptions

- Product prices and descriptions are sample content, not live inventory or pricing.
- **Process Order** simulates success only. On confirmation, the cart is cleared; no real order or payment is created.
- Cart contents only need to remain available while navigating within the open app.
- Product images are represented by emoji and do not require downloaded image assets.
