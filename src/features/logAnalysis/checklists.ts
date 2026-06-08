import type { IssueCategory } from "../../types/logAnalysis";

export const baseChecks = [
  "Confirm whether the issue affects one user, multiple users, or all users.",
  "Identify the first timestamp where the issue appears.",
  "Compare the incident start time against recent deployments or configuration changes.",
  "Collect reproduction steps, affected user/customer details, and expected vs. actual behavior.",
];

export const issueCategoryChecks: Record<IssueCategory, string[]> = {
  timeout: [
    "Check downstream service status and response times.",
    "Review API timeout thresholds, retry behavior, and circuit breaker settings.",
    "Verify network connectivity between the application and dependent services.",
    "Check whether the timeout is isolated to one endpoint or affecting multiple workflows.",
  ],

  auth: [
    "Check whether access tokens, sessions, or credentials are expired or malformed.",
    "Verify user permissions, roles, and authentication provider status.",
    "Confirm whether the issue occurs after login, token refresh, or permission changes.",
    "Review recent changes to SSO, auth middleware, or access control rules.",
  ],

  "server-error": [
    "Review backend stack traces and application exceptions around the first 500 error.",
    "Check recent backend deployments, feature flags, and configuration changes.",
    "Verify whether dependent services, queues, or databases are failing.",
    "Look for recurring exceptions across logs, monitoring dashboards, and alert history.",
  ],

  database: [
    "Check database connection health and recent database-related alerts.",
    "Review slow queries, failed queries, missing records, or data integrity issues.",
    "Verify whether affected records exist and match expected business rules.",
    "Check recent migrations, schema changes, or data imports.",
  ],

  "successful-response-data-issue": [
    "Verify whether successful responses contain the expected data.",
    "Compare the API response body against what the UI displays.",
    "Check frontend state, caching, filtering, and transformation logic.",
    "Confirm whether the issue is a data correctness problem rather than a request failure.",
  ],

  unknown: [
    "Gather more context from the reporter, including screenshots, timestamps, and reproduction steps.",
    "Increase logging or inspect additional related logs if the current data is inconclusive.",
    "Check monitoring dashboards for unusual patterns around the reported time.",
  ],
};
