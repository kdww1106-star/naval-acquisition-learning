import { describe, expect, it } from "vitest";
import { pool, questions, shipUnits, sources } from "../src/data";
import { rokNavyQuestions, rokNavySources } from "../src/rok-navy-content";
import { createSession, validateSession } from "../src/domain";

describe("대한민국 해군 자료 보강과 미국 관련 문항 제외", () => {
  it("문항과 공개 출처에서 미국 함정·미 해군·AUKUS 사례를 제외한다", () => {
    const forbidden = /미\s*해군|미국|\bUSS\b|Gerald R\. Ford|AUKUS|SSBN|SSGN/i;
    expect(JSON.stringify(questions)).not.toMatch(forbidden);
    for (const source of Object.values(sources)) {
      expect(new URL(source.url).hostname).not.toMatch(/(^|\.)navy\.mil$/);
      expect(`${source.publisher} ${source.title}`).not.toMatch(forbidden);
    }
    expect(
      questions.find((q) => q.id === "q-destroyer-ddg-role"),
    ).toBeUndefined();
    expect(
      questions.find((q) => q.id === "q-support-rescue-support-vertrep"),
    ).toBeUndefined();
    expect(
      questions.find((q) => q.id === "q-submarine-sub-nuclear-meaning"),
    ).toBeUndefined();
  });

  it("6개 함종에 해군 공식자료 기반 72문항과 원문·항목 근거를 제공한다", () => {
    expect(rokNavyQuestions).toHaveLength(72);
    for (const unit of shipUnits) {
      const added = pool(unit.id).filter((q) => q.id.startsWith("q-rok-"));
      expect(added).toHaveLength(12);
      for (const q of added) {
        expect(new URL(sources[q.sourceId].url).hostname).toBe(
          "www.navy.mil.kr",
        );
        expect(q.citation).toBeTruthy();
        expect(q.explanation.split(/\n\n/)).toHaveLength(2);
        expect(new Set(q.options).size).toBe(4);
        expect(q.evidenceCheckedAt).toBe("2026-11-03");
        expect(q.reviewedBy).toBeUndefined();
      }
    }
    expect(Object.keys(rokNavySources)).toHaveLength(7);
    expect(Object.values(rokNavySources).every((s) => s.date === null)).toBe(
      true,
    );
  });

  it("같은 학습목표의 기존·신규 문항은 회차 안에서 겹치지 않는다", () => {
    for (const unit of shipUnits) {
      expect(
        new Set(pool(unit.id).map((q) => q.concept)).size,
      ).toBeGreaterThanOrEqual(20);
      const session = createSession(unit.id, 20);
      expect(new Set(session.items.map((q) => q.concept)).size).toBe(20);
    }
    expect(
      questions.find((q) => q.id === "q-rok-ffg3-radar-list")?.concept,
    ).toBe(questions.find((q) => q.id === "q-frigate-ffg-mfr")?.concept);
    expect(questions.find((q) => q.id === "q-rok-mdv-label")?.concept).toBe(
      questions.find((q) => q.id === "q-rok-mhc-mdv")?.concept,
    );
  });

  it("판단형 질문은 최적 대안을 묻고 단일 사실형 질문은 기준 자료를 명시한다", () => {
    const calculations = new Set(
      ["01", "04", "12", "14"].map((n) => `q-business-contract-${n}`),
    );
    for (const q of questions.filter(
      (q) => q.id.startsWith("q-business-") && !calculations.has(q.id),
    )) {
      expect(q.prompt).toMatch(/가장/);
    }
    for (const q of rokNavyQuestions) {
      expect(q.prompt).toMatch(/가장|해군|소개|항목|공개자료/);
    }
  });

  it("제외된 문항을 담은 진행 세션을 다시 출제하지 않는다", () => {
    const session = createSession("destroyer", 5);
    session.items[0] = { ...session.items[0], id: "q-destroyer-ddg-role" };
    expect(validateSession(session)).toBeNull();
  });
});
