type StatCardProps = {
  label: string;
  value: string;
  meta: string;
  accent: "blue" | "green" | "gold" | "red";
};

export function StatCard({ label, value, meta, accent }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${accent}`}>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__meta">{meta}</p>
    </article>
  );
}
