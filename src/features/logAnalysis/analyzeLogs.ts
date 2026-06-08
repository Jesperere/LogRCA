import type { AnalysisResult } from "../../types/logAnalysis";
import { detectIssueCategories } from "./detectIssueCategories";
import { detectLikelyRootCause } from "./detectLikelyRootCause";
import { determineSeverity } from "./determineSeverity";
import { generateRecommendedChecks } from "./generateRecommendedChecks";
import { getRepeatedMessages } from "./getRepeatedMessages";
import { parseLogLine } from "./parseLogLine";

export function analyzeLogs(logText: string): AnalysisResult {
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
  const issueCategories = detectIssueCategories(parsedLines);
  const recommendedChecks = generateRecommendedChecks(issueCategories);

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
    issueCategories,
  };
}
