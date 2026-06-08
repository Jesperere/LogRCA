import type { ParsedLogLine, LogLevel } from "../../types/logAnalysis";

export function parseLogLine(line: string, index: number): ParsedLogLine {
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
