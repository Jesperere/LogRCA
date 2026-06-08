export type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG" | "UNKNOWN";

export type ParsedLogLine = {
  id: number;
  raw: string;
  timestamp?: string;
  level: LogLevel;
  endpoint?: string;
  statusCode?: string;
  message: string;
};

export type RepeatedMessage = {
  message: string;
  count: number;
};

export type AnalysisResult = {
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

export type IncidentSeverity = "Low" | "Medium" | "High";
