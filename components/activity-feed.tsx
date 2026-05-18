type Activity = {
  name: string;
  action: string;
  time: string;
};

type ActivityFeedProps = {
  items: Activity[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="activity-feed">
      {items.map((item) => (
        <article key={`${item.name}-${item.time}`} className="activity-feed__item">
          <div className="activity-feed__avatar">{item.name.slice(0, 1)}</div>
          <div>
            <p className="activity-feed__name">{item.name}</p>
            <p className="activity-feed__action">{item.action}</p>
          </div>
          <span className="activity-feed__time">{item.time}</span>
        </article>
      ))}
    </div>
  );
}
