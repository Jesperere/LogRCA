type ResultListCardProps = {
  title: string;
  items: string[];
  emptyMessage: string;
  ordered?: boolean;
};

export function ResultListCard({
  title,
  items,
  emptyMessage,
  ordered = false,
}: ResultListCardProps) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <article className="card">
      <h3>{title}</h3>

      {items.length > 0 ? (
        <ListTag>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      ) : (
        <p>{emptyMessage}</p>
      )}
    </article>
  );
}
