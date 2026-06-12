import type { MatchJersey } from "../types";

type JerseyGalleryProps = {
  jerseys: MatchJersey[];
};

export function JerseyGallery({ jerseys }: JerseyGalleryProps) {
  if (jerseys.length === 0) {
    return null;
  }

  return (
    <div className="jersey-gallery" aria-label="本场球衣信息">
      <div className="jersey-gallery__track">
        {jerseys.map((jersey) => (
          <article className="jersey-card" key={jersey.id}>
            <div className="jersey-card__image">
              <img src={jersey.image} alt="" loading="lazy" />
            </div>
            <div className="jersey-card__body">
              <strong>{jersey.team}</strong>
              <span>{jersey.type}</span>
              <small>{jersey.status}{jersey.note ? ` · ${jersey.note}` : ""}</small>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
