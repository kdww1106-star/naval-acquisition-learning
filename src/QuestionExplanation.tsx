import { ExternalLink } from "lucide-react";
import { sources, type Question } from "./data";

export default function QuestionExplanation({
  question: q,
  selected,
}: {
  question: Question;
  selected: number;
}) {
  const source = sources[q.sourceId];
  const chosen = q.optionExplanations?.find(
    (entry) => entry.option === q.options[selected],
  );
  const comparisonSource =
    selected !== q.answerIndex && chosen?.sourceId
      ? sources[chosen.sourceId as keyof typeof sources]
      : undefined;
  return (
    <div className="question-explanation">
      <div className="explanation-body">
        <h3>해설</h3>
        {q.explanation
          .split(/\n+/)
          .filter(Boolean)
          .map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        {selected !== q.answerIndex && chosen && (
          <div className="choice-comparison">
            <h4>선택한 보기와의 차이</h4>
            <p>
              <strong>{chosen.option}</strong>: {chosen.explanation}
            </p>
          </div>
        )}
        {q.actionSteps && (
          <div className="work-steps">
            <h4>업무 처리 순서</h4>
            <ol>
              {q.actionSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
      <div className="explanation-source">
        <h3>출처</h3>
        {q.citation && (
          <p className="citation">
            <strong>적용 근거</strong> {q.citation}
          </p>
        )}
        <a
          className="source-link"
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {source.publisher} · {source.title} <ExternalLink size={14} />
          <span className="sr-only">(새 창)</span>
        </a>
        <p className="source-date">
          {"version" in source
            ? source.version
            : source.date
              ? `자료 게시 ${source.date}`
              : "게시일 미표기"}
          {" · "}근거 확인 {q.evidenceCheckedAt}
        </p>
        {comparisonSource && (
          <p className="comparison-source">
            <strong>선택한 용어의 근거</strong>{" "}
            <a
              href={comparisonSource.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {chosen?.citation} <ExternalLink size={14} />
              <span className="sr-only">(새 창)</span>
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
