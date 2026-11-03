import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const unit of ["destroyer", "common-terms"]) {
  test(`${unit}: 문항별 정오답·해설·출처, 답안 고정과 새로고침 복원`, async ({
    page,
  }) => {
    await page.goto(`/setup/${unit}`);
    await page.getByRole("button", { name: "학습 시작하기" }).click();
    await expect(
      page.getByRole("button", { name: "정답 확인", exact: true }),
    ).toBeDisabled();
    await expect(page.locator(".answer-feedback")).toHaveCount(0);
    const index = await page.evaluate(
      () =>
        JSON.parse(sessionStorage.getItem("hamjeong.session.v2")!).items[0]
          .answerIndex,
    );
    await page
      .getByRole("radio")
      .nth((index + 1) % 4)
      .check();
    await expect(page.locator(".answer-feedback")).toHaveCount(0);
    await page.getByRole("button", { name: "정답 확인", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "오답입니다.", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "해설", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "출처", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("radio").first()).toBeDisabled();
    await expect(page.locator(".answer-correct")).toHaveCount(1);
    await expect(page.locator(".answer-incorrect")).toHaveCount(1);
    await expect(page.locator(".source-link")).toHaveAttribute(
      "href",
      /^https:\/\//,
    );
    if (unit === "common-terms")
      await expect(page.locator(".choice-comparison")).toBeVisible();
    expect(
      await page
        .locator(".explanation-body")
        .evaluate(
          (el) =>
            !!(
              el.compareDocumentPosition(
                el.parentElement!.querySelector(".explanation-source")!,
              ) & Node.DOCUMENT_POSITION_FOLLOWING
            ),
        ),
    ).toBe(true);
    const stored = await page.evaluate(() =>
      sessionStorage.getItem("hamjeong.session.v2"),
    );
    page.on("dialog", (dialog) => dialog.accept());
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "오답입니다.", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => sessionStorage.getItem("hamjeong.session.v2")),
    ).toBe(stored);
    await page.locator("#answer-feedback-title").focus();
    await page.keyboard.press(String(index + 1));
    expect(
      await page.evaluate(() => sessionStorage.getItem("hamjeong.session.v2")),
    ).toBe(stored);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "다음 문제", exact: true }).click();
    await expect(page.locator(".answer-feedback")).toHaveCount(0);
    const correct = await page.evaluate(
      () =>
        JSON.parse(sessionStorage.getItem("hamjeong.session.v2")!).items[1]
          .answerIndex,
    );
    await page.getByRole("radio").nth(correct).check();
    await page.getByRole("button", { name: "정답 확인", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "정답입니다.", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".answer-incorrect")).toHaveCount(0);
    expect(
      await page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("hamjeong.history.v1") || "[]")
            .length,
      ),
    ).toBe(0);
  });
}
