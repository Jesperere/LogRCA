import type { AnalysisResult } from "../types/logAnalysis";
import { getSeverityClass } from "./GetSeverityClass";
import { MetricCard } from "./MetricCard";

type IncidentOverviewProps = {
  result: AnalysisResult;
};

export function IncidentOverview({ result }: IncidentOverviewProps) {
  return (
    <div className="panel">
      <h2>Incident Overview</h2>

      <div className="metric-grid">
        <MetricCard label="Total Lines" value={result.totalLines} />
        <MetricCard label="Errors" value={result.errorCount} />
        <MetricCard label="Warnings" value={result.warningCount} />
        <MetricCard
          label="Severity"
          value={result.severity}
          className={getSeverityClass(result.severity)}
        />
      </div>

      <div className="card">
        <h3>Summary</h3>
        <p>{result.summary}</p>
      </div>

      <div className="card">
        <h3>Likely Root Cause</h3>
        <p>{result.likelyRootCause}</p>
      </div>
    </div>
  );
}
