import { expect, type Page } from "@playwright/test";
export async function confirmAndContinue(page: Page) {
  await page.getByRole("button", { name: "정답 확인", exact: true }).click();
  await expect(page.locator(".answer-feedback")).toBeVisible();
  await page
    .getByRole("button", { name: /^(다음 문제|학습 결과 보기)$/ })
    .click();
}
