import { test, expect } from "@playwright/test";
import { createSession } from "../../src/domain";

test("Pages 해군 신규 문항의 정오답·두 문단 해설·공식 원문과 새로고침", async ({
  page,
}) => {
  const session = createSession("destroyer", 1, ["q-rok-ddg-main-force"]);
  await page.addInitScript((s) => {
    if (!sessionStorage.getItem("hamjeong.session.v2"))
      sessionStorage.setItem("hamjeong.session.v2", JSON.stringify(s));
  }, session);
  await page.goto("./#/quiz");
  await expect(
    page.getByText(session.items[0].prompt, { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("radio")
    .nth((session.items[0].answerIndex + 1) % 4)
    .check();
  await page.getByRole("button", { name: "정답 확인", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "오답입니다.", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".explanation-body > p")).toHaveCount(2);
  await expect(page.locator(".citation")).toContainText("구축함 임무 소개");
  await expect(page.locator(".source-link")).toHaveAttribute(
    "href",
    "https://www.navy.mil.kr/mbshome/mbs/navy/subview.do?id=navy_060501010000",
  );
  await expect(page.locator(".source-date")).toContainText("2026-11-03");
  page.on("dialog", (dialog) => dialog.accept());
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "오답입니다.", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "학습 결과 보기", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/result$/);
});
