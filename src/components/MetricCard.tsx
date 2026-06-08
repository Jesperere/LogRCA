type MetricCardProps = {
  label: string;
  value: string | number;
  className?: string;
};

export function MetricCard({ label, value, className = "" }: MetricCardProps) {
  return (
    <div className={`metric-card ${className}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
