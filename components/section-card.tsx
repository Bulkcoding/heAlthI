import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  action?: string;
  children: ReactNode;
  id?: string;
};

export function SectionCard({
  title,
  description,
  action,
  children,
  id
}: SectionCardProps) {
  return (
    <section className="section-card" id={id}>
      <div className="section-card__header">
        <div>
          <p className="section-card__title">{title}</p>
          {description ? (
            <p className="section-card__description">{description}</p>
          ) : null}
        </div>
        {action ? <button className="text-button">{action}</button> : null}
      </div>
      {children}
    </section>
  );
}
