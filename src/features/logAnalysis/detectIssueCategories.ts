import type { IssueCategory, ParsedLogLine } from "../../types/logAnalysis";

export function detectIssueCategories(
  parsedLines: ParsedLogLine[],
): IssueCategory[] {
  const combinedLogs = parsedLines
    .map((line) => line.raw.toLowerCase())
    .join(" ");

  const statusCodes = parsedLines
    .map((line) => line.statusCode)
    .filter(Boolean);

  const categories = new Set<IssueCategory>();

  if (combinedLogs.includes("timeout")) {
    categories.add("timeout");
  }

  if (
    combinedLogs.includes("401") ||
    combinedLogs.includes("403") ||
    combinedLogs.includes("unauthorized") ||
    combinedLogs.includes("forbidden") ||
    combinedLogs.includes("token")
  ) {
    categories.add("auth");
  }

  if (
    statusCodes.some((code) => code?.startsWith("5")) ||
    combinedLogs.includes("exception") ||
    combinedLogs.includes("server error")
  ) {
    categories.add("server-error");
  }

  if (
    combinedLogs.includes("database") ||
    combinedLogs.includes("sql") ||
    combinedLogs.includes("query") ||
    combinedLogs.includes("connection failed")
  ) {
    categories.add("database");
  }

  const hasOnlySuccessfulStatusCodes =
    statusCodes.length > 0 &&
    statusCodes.every((code) => code?.startsWith("2"));

  const hasWarningsOrUnknowns = parsedLines.some(
    (line) => line.level === "WARN" || line.level === "UNKNOWN",
  );

  if (hasOnlySuccessfulStatusCodes && hasWarningsOrUnknowns) {
    categories.add("successful-response-data-issue");
  }

  if (categories.size === 0) {
    categories.add("unknown");
  }

  return Array.from(categories);
}
