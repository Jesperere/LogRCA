import type { IncidentSeverity } from "../types/logAnalysis";

export function getSeverityClass(severity: IncidentSeverity) {
  if (severity === "High") return "severity-high";
  if (severity === "Medium") return "severity-medium";
  return "severity-low";
}
