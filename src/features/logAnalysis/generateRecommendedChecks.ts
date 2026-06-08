import type { IssueCategory } from "../../types/logAnalysis";
import { baseChecks, issueCategoryChecks } from "./checklists";

export function generateRecommendedChecks(
  issueCategories: IssueCategory[],
): string[] {
  const checks = [...baseChecks];

  for (const category of issueCategories) {
    checks.push(...issueCategoryChecks[category]);
  }

  return Array.from(new Set(checks));
}
