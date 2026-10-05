import { test, expect } from "@playwright/test";

test("catalogue to confirmation", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "Shop all" })).toBeVisible();

  await page.getByRole("link", { name: /Classic Logo Tee/ }).click();
  await expect(
    page.getByRole("heading", { name: "Classic Logo Tee", level: 1 })
  ).toBeVisible();

  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "Add to cart" }).first().click();

  // Added to cart opens the drawer; go to the full cart page from there.
  // Note: these render as real <a> tags (via a polymorphic Button `render`
  // prop) but Base UI's Button forces an ARIA role of "button" regardless —
  // still fully keyboard-operable, just not matched by getByRole("link").
  await page.getByRole("button", { name: "View cart" }).click();
  await expect(page).toHaveURL("/cart");
  await expect(
    page.getByRole("main").getByText("Classic Logo Tee")
  ).toBeVisible();

  await page
    .getByRole("main")
    .getByRole("button", { name: "Checkout" })
    .click();
  await expect(page).toHaveURL("/checkout");

  await page.getByLabel("Full name").fill("Thandiwe Nkosi");
  await page.getByLabel("Email").fill("thandiwe@example.com");
  await page.getByLabel("Mobile number").fill("0821234567");
  await page.getByLabel("Street address").fill("12 Vrede Street");
  await page.getByLabel("Suburb").fill("Observatory");
  await page.getByLabel("City / town").fill("Cape Town");
  await page.getByLabel("Province").selectOption("Western Cape");
  await page.getByLabel("Postal code").fill("7925");
  await page.getByRole("radio", { name: /Standard delivery/ }).check();
  await page
    .getByText(/I accept the/)
    .locator("input")
    .check();

  await page.getByRole("button", { name: "Continue to review" }).click();
  await expect(page).toHaveURL("/checkout/review");
  await expect(
    page.getByRole("heading", { name: "Review order" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Pay now" }).click();
  await expect(page).toHaveURL(/\/order\/ORD-/, { timeout: 10_000 });
  await expect(
    page.getByRole("heading", { name: "Order confirmed" })
  ).toBeVisible();
  await expect(page.getByText(/Order reference: ORD-/)).toBeVisible();
});
