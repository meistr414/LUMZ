import { test, expect } from "@playwright/test";

/**
 * Drives the same catalogue -> confirmation flow as
 * catalogue-to-confirmation.spec.ts, but using only keyboard activation
 * (focus + Enter/Space) rather than .click(), to verify a keyboard-only
 * user can complete checkout per SPEC.md's Phase 6 acceptance criterion.
 */
test("keyboard-only checkout", async ({ page }) => {
  await page.goto("/products");

  const productLink = page.getByRole("link", { name: /Classic Logo Tee/ });
  await productLink.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Classic Logo Tee", level: 1 })
  ).toBeVisible();

  const sizeButton = page.getByRole("button", { name: "M", exact: true });
  await sizeButton.focus();
  await page.keyboard.press("Enter");
  await expect(sizeButton).toHaveAttribute("aria-pressed", "true");

  const addToCart = page.getByRole("button", { name: "Add to cart" }).first();
  await addToCart.focus();
  await page.keyboard.press("Enter");

  const viewCart = page.getByRole("button", { name: "View cart" });
  await viewCart.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/cart");

  const cartCheckout = page
    .getByRole("main")
    .getByRole("button", { name: "Checkout" });
  await cartCheckout.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/checkout");

  await page.getByLabel("Full name").focus();
  await page.keyboard.type("Thandiwe Nkosi");
  await page.getByLabel("Email").focus();
  await page.keyboard.type("thandiwe@example.com");
  await page.getByLabel("Mobile number").focus();
  await page.keyboard.type("0821234567");
  await page.getByLabel("Street address").focus();
  await page.keyboard.type("12 Vrede Street");
  await page.getByLabel("Suburb").focus();
  await page.keyboard.type("Observatory");
  await page.getByLabel("City / town").focus();
  await page.keyboard.type("Cape Town");
  await page.getByLabel("Province").selectOption("Western Cape");
  await page.getByLabel("Postal code").focus();
  await page.keyboard.type("7925");

  const standardDelivery = page.getByRole("radio", {
    name: /Standard delivery/,
  });
  await standardDelivery.focus();
  await page.keyboard.press(" ");
  await expect(standardDelivery).toBeChecked();

  const acceptTerms = page.getByText(/I accept the/).locator("input");
  await acceptTerms.focus();
  await page.keyboard.press(" ");
  await expect(acceptTerms).toBeChecked();

  const continueButton = page.getByRole("button", {
    name: "Continue to review",
  });
  await continueButton.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/checkout/review");

  const payButton = page.getByRole("button", { name: "Pay now" });
  await payButton.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/order\/ORD-/, { timeout: 10_000 });
  await expect(
    page.getByRole("heading", { name: "Order confirmed" })
  ).toBeVisible();
});
