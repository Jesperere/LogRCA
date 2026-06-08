export function simplifyMessage(raw: string): string {
  return raw
    .replace(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/g, "")
    .replace(/\buser_id=\d+\b/g, "user_id=*")
    .replace(/\bcustomer_id=\d+\b/g, "customer_id=*")
    .replace(/\border_id=\d+\b/g, "order_id=*")
    .replace(/\s+/g, " ")
    .trim();
}
