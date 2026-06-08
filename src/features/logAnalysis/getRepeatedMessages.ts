import type { ParsedLogLine, RepeatedMessage } from "../../types/logAnalysis";
import { simplifyMessage } from "./simplifyMessage";

export function getRepeatedMessages(lines: ParsedLogLine[]): RepeatedMessage[] {
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
