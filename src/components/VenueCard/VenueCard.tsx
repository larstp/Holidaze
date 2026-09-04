import { Heart, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Venue } from '@/types/api';
import ImageWithFallback from '../ImageWithFallback/ImageWithFallback';
import styles from './VenueCard.module.css';

type VenueCardProps = {
  venue: Venue;
};

function VenueCard({ venue }: VenueCardProps) {
  const image = venue.media[0];
  const location = [venue.location.city, venue.location.country]
    .filter(Boolean)
    .join(', ');

  return (
    <article className={styles.card}>
      <Link className={styles.imageLink} to={`/venues/${venue.id}`}>
        <ImageWithFallback
          className={styles.image}
          src={image?.url}
          alt={image?.alt || venue.name}
        />
        <span className={styles.imageBadge}>
          <Star size={12} aria-hidden="true" />
          {venue.rating.toFixed(1)}
        </span>
      </Link>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <div>
            <p className={styles.category}>Stay</p>
            <h3>
              <Link to={`/venues/${venue.id}`}>{venue.name}</Link>
            </h3>
          </div>
          <button
            className={styles.saveButton}
            type="button"
            aria-label={`Save ${venue.name}`}
          >
            <Heart aria-hidden="true" />
          </button>
        </div>
        <p className={styles.location}>
          <MapPin size={14} aria-hidden="true" />
          {location || 'Location not specified'}
        </p>
        <p className={styles.price}>
          €{venue.price} <span>/ night</span>
        </p>
      </div>
    </article>
  );
}

export default VenueCard;
