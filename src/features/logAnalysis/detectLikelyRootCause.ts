import type { ParsedLogLine } from "../../types/logAnalysis";

export function detectLikelyRootCause(lines: ParsedLogLine[]): string {
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
