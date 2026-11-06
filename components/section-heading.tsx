import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  id: string;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  action,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div className="section-heading-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
        <p className="section-description">{description}</p>
      </div>
      {action ? <div className="section-heading-action">{action}</div> : null}
    </div>
  );
}
