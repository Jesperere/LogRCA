import { useMemo, useState } from "react";
import "./App.css";

type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG" | "UNKNOWN";

type ParsedLogLine = {
  id: number;
  raw: string;
  timestamp?: string;
  level: LogLevel;
  endpoint?: string;
  statusCode?: string;
  message: string;
};

type RepeatedMessage = {
  message: string;
  count: number;
};

type AnalysisResult = {
  totalLines: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  debugCount: number;
  affectedEndpoints: string[];
  statusCodes: string[];
  repeatedMessages: RepeatedMessage[];
  severity: "Low" | "Medium" | "High";
  summary: string;
  likelyRootCause: string;
  recommendedChecks: string[];
  escalationNote: string;
  parsedLines: ParsedLogLine[];
};

const sampleLogs = `2026-06-04 14:03:12 ERROR /api/payments 500 timeout payment-provider
2026-06-04 14:03:15 ERROR /api/payments 500 timeout payment-provider
2026-06-04 14:04:01 WARN /api/payments retry failed customer_id=4821
2026-06-04 14:05:22 INFO /api/orders 200 success
2026-06-04 14:06:11 ERROR /api/payments 500 timeout payment-provider
2026-06-04 14:07:45 WARN /api/auth 401 token expired user_id=912`;

function parseLogLine(line: string, index: number): ParsedLogLine {
  const timestampMatch = line.match(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/);
  const levelMatch = line.match(/\b(ERROR|WARN|INFO|DEBUG)\b/);
  const endpointMatch = line.match(/\/[a-zA-Z0-9/_-]+/);
  const statusCodeMatch = line.match(/\b[1-5][0-9]{2}\b/);

  const level = (levelMatch?.[1] as LogLevel | undefined) ?? "UNKNOWN";

  return {
    id: index,
    raw: line,
    timestamp: timestampMatch?.[0],
    level,
    endpoint: endpointMatch?.[0],
    statusCode: statusCodeMatch?.[0],
    message: line,
  };
}

function simplifyMessage(raw: string): string {
  return raw
    .replace(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/g, "")
    .replace(/\buser_id=\d+\b/g, "user_id=*")
    .replace(/\bcustomer_id=\d+\b/g, "customer_id=*")
    .replace(/\border_id=\d+\b/g, "order_id=*")
    .replace(/\s+/g, " ")
    .trim();
}

function getRepeatedMessages(lines: ParsedLogLine[]): RepeatedMessage[] {
  const counts = new Map<string, number>();

  for (const line of lines) {
    if (line.level === "ERROR" || line.level === "WARN") {
      const simplified = simplifyMessage(line.raw);
      counts.set(simplified, (counts.get(simplified) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([message, count]) => ({ message, count }))
    .filter((item) => item.count > 1)
    .sort((a, b) => b.count - a.count);
}

function determineSeverity(
  errorCount: number,
  warningCount: number,
  repeatedMessages: RepeatedMessage[],
): AnalysisResult["severity"] {
  if (errorCount >= 3 || repeatedMessages.some((item) => item.count >= 3)) {
    return "High";
  }

  if (errorCount >= 1 || warningCount >= 3) {
    return "Medium";
  }

  return "Low";
}

function detectLikelyRootCause(lines: ParsedLogLine[]): string {
  const combinedLogs = lines.map((line) => line.raw.toLowerCase()).join(" ");

  if (combinedLogs.includes("timeout")) {
    return "Timeouts were detected. This may indicate a slow or unavailable downstream service, network issue, overloaded dependency, or retry logic problem.";
  }

  if (combinedLogs.includes("401") || combinedLogs.includes("unauthorized")) {
    return "Authentication or authorization failures were detected. This may indicate expired tokens, invalid credentials, permission issues, or session handling problems.";
  }

  if (combinedLogs.includes("500")) {
    return "Server-side errors were detected. This may indicate application exceptions, failed dependencies, recent deployment issues, or unhandled edge cases.";
  }

  if (combinedLogs.includes("database") || combinedLogs.includes("sql")) {
    return "Database-related terms were detected. This may indicate query failures, connection issues, missing records, or data integrity problems.";
  }

  return "No clear root cause pattern was detected from the current logs. More context, reproduction steps, recent deployment history, and monitoring data may be required.";
}

function analyzeLogs(logText: string): AnalysisResult {
  const parsedLines = logText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseLogLine);

  const errorCount = parsedLines.filter(
    (line) => line.level === "ERROR",
  ).length;
  const warningCount = parsedLines.filter(
    (line) => line.level === "WARN",
  ).length;
  const infoCount = parsedLines.filter((line) => line.level === "INFO").length;
  const debugCount = parsedLines.filter(
    (line) => line.level === "DEBUG",
  ).length;

  const affectedEndpoints = Array.from(
    new Set(
      parsedLines
        .map((line) => line.endpoint)
        .filter((endpoint): endpoint is string => Boolean(endpoint)),
    ),
  );

  const statusCodes = Array.from(
    new Set(
      parsedLines
        .map((line) => line.statusCode)
        .filter((code): code is string => Boolean(code)),
    ),
  );

  const repeatedMessages = getRepeatedMessages(parsedLines);
  const severity = determineSeverity(
    errorCount,
    warningCount,
    repeatedMessages,
  );
  const primaryEndpoint = affectedEndpoints[0] ?? "an unknown endpoint";
  const firstError = parsedLines.find((line) => line.level === "ERROR");

  const summary =
    errorCount > 0
      ? `${errorCount} error(s), ${warningCount} warning(s), and ${infoCount} info log(s) were detected. The main affected area appears to be ${primaryEndpoint}.`
      : `${warningCount} warning(s) and ${infoCount} info log(s) were detected. No ERROR-level logs were found.`;

  const likelyRootCause = detectLikelyRootCause(parsedLines);

  const recommendedChecks = [
    "Confirm whether the issue affects one user, multiple users, or all users.",
    "Identify the first timestamp where the issue appears and compare it against recent deployments or configuration changes.",
    "Check downstream service status, API response times, and network connectivity.",
    "Use browser dev tools, Postman, or API logs to reproduce the failing request.",
    "Review related application logs, database records, monitoring dashboards, and alert history.",
    "Document reproduction steps and expected vs. actual behavior before escalating.",
  ];

  const escalationNote =
    errorCount > 0
      ? `Detected ${errorCount} ERROR log(s), primarily around ${primaryEndpoint}. First error: "${firstError?.raw}". Status codes detected: ${
          statusCodes.length > 0 ? statusCodes.join(", ") : "none"
        }. Please investigate recent deployments, downstream dependencies, request/response behavior, and related monitoring data.`
      : `No ERROR-level logs detected. ${warningCount} warning(s) found. Recommend monitoring affected workflows and collecting additional logs if users continue reporting issues.`;

  return {
    totalLines: parsedLines.length,
    errorCount,
    warningCount,
    infoCount,
    debugCount,
    affectedEndpoints,
    statusCodes,
    repeatedMessages,
    severity,
    summary,
    likelyRootCause,
    recommendedChecks,
    escalationNote,
    parsedLines,
  };
}

function getSeverityClass(severity: AnalysisResult["severity"]) {
  if (severity === "High") return "severity-high";
  if (severity === "Medium") return "severity-medium";
  return "severity-low";
}

export default function App() {
  const [logText, setLogText] = useState(sampleLogs);

  const result = useMemo(() => {
    if (!logText.trim()) return null;
    return analyzeLogs(logText);
  }, [logText]);

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Support Engineering Portfolio Project</p>
        <h1>Log Analyzer + RCA Generator</h1>
        <p>
          Paste application logs to detect error patterns, affected endpoints,
          repeated failures, and generate a first-draft root cause analysis for
          escalation or incident review.
        </p>
      </section>

      <section className="workspace">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Application Logs</h2>
              <p>Paste logs from an application, API, or support incident.</p>
            </div>

            <button type="button" onClick={() => setLogText(sampleLogs)}>
              Load Sample
            </button>
          </div>

          <textarea
            value={logText}
            onChange={(event) => setLogText(event.target.value)}
            rows={14}
            placeholder="Paste logs here..."
          />
        </div>

        {result && (
          <div className="panel">
            <h2>Incident Overview</h2>

            <div className="metric-grid">
              <div className="metric-card">
                <span>Total Lines</span>
                <strong>{result.totalLines}</strong>
              </div>
              <div className="metric-card">
                <span>Errors</span>
                <strong>{result.errorCount}</strong>
              </div>
              <div className="metric-card">
                <span>Warnings</span>
                <strong>{result.warningCount}</strong>
              </div>
              <div
                className={`metric-card ${getSeverityClass(result.severity)}`}
              >
                <span>Severity</span>
                <strong>{result.severity}</strong>
              </div>
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
        )}
      </section>

      {result && (
        <section className="results">
          <article className="card">
            <h3>Affected Endpoints</h3>
            {result.affectedEndpoints.length > 0 ? (
              <ul>
                {result.affectedEndpoints.map((endpoint) => (
                  <li key={endpoint}>{endpoint}</li>
                ))}
              </ul>
            ) : (
              <p>No endpoints detected.</p>
            )}
          </article>

          <article className="card">
            <h3>Status Codes</h3>
            {result.statusCodes.length > 0 ? (
              <ul>
                {result.statusCodes.map((code) => (
                  <li key={code}>{code}</li>
                ))}
              </ul>
            ) : (
              <p>No status codes detected.</p>
            )}
          </article>

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

          <article className="card">
            <h3>Recommended Checks</h3>
            <ol>
              {result.recommendedChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ol>
          </article>

          <article className="card wide">
            <h3>Engineering Escalation Note</h3>
            <p>{result.escalationNote}</p>
          </article>

          <article className="card wide">
            <h3>Parsed Log Lines</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Timestamp</th>
                    <th>Endpoint</th>
                    <th>Status</th>
                    <th>Raw Log</th>
                  </tr>
                </thead>
                <tbody>
                  {result.parsedLines.map((line) => (
                    <tr key={line.id}>
                      <td>
                        <span
                          className={`level level-${line.level.toLowerCase()}`}
                        >
                          {line.level}
                        </span>
                      </td>
                      <td>{line.timestamp ?? "—"}</td>
                      <td>{line.endpoint ?? "—"}</td>
                      <td>{line.statusCode ?? "—"}</td>
                      <td>{line.raw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}
