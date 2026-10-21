export function PageHeading({ title, description, eyebrow = 'Il tuo spazio' }: { title: string; description: string; eyebrow?: string }) {
  return <header className="page-heading">
    <p className="eyebrow">{eyebrow}</p>
    <h1 tabIndex={-1}>{title}</h1>
    <p>{description}</p>
  </header>;
}
