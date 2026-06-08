import type { RepeatedMessage, AnalysisResult } from "../../types/logAnalysis";

export function determineSeverity(
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
