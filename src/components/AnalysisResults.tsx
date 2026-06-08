import type { AnalysisResult } from "../types/logAnalysis";
import { ResultListCard } from "./ResultListCard";
import { ParsedLogsTable } from "./ParsedLogsTable";

type AnalysisResultsProps = {
  result: AnalysisResult;
};

export function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <section className="results">
      <ResultListCard
        title="Detected Issue Categories"
        items={result.issueCategories}
        emptyMessage="No issue categories detected."
      />

      <ResultListCard
        title="Affected Endpoints"
        items={result.affectedEndpoints}
        emptyMessage="No endpoints detected."
      />

      <ResultListCard
        title="Status Codes"
        items={result.statusCodes}
        emptyMessage="No status codes detected."
      />

      <article className="card">
        <h3>Repeated Messages</h3>

        {result.repeatedMessages.length > 0 ? (
          <ul>
            {result.repeatedMessages.map((item) => (
              <li key={item.message}>
                <strong>{item.count}x</strong> — {item.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No repeated error or warning messages detected.</p>
        )}
      </article>

      <ResultListCard
        title="Recommended Checks"
        items={result.recommendedChecks}
        emptyMessage="No recommended checks generated."
        ordered
      />

      <article className="card wide">
        <h3>Engineering Escalation Note</h3>
        <p>{result.escalationNote}</p>
      </article>

      <ParsedLogsTable parsedLines={result.parsedLines} />
    </section>
  );
}
