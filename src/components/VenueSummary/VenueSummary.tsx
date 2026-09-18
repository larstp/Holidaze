import { Link } from 'react-router-dom';
import ImageWithFallback from '../ImageWithFallback/ImageWithFallback';
import type { Venue } from '../../types/api';
import styles from './VenueSummary.module.css';

type VenueSummaryProps = {
  venue: Venue;
  linkToVenue?: boolean;
};

function VenueSummary({ venue, linkToVenue = true }: VenueSummaryProps) {
  const location = [venue.location.city, venue.location.country]
    .filter(Boolean)
    .join(', ');

  const content = (
    <>
      <ImageWithFallback
        className={styles.image}
        src={venue.media[0]?.url}
        alt={venue.media[0]?.alt || venue.name}
        loading="lazy"
      />
      <span className={styles.info}>
        <strong>{venue.name}</strong>
        <small>{location || 'Location unavailable'}</small>
        <small>
          ★ {venue.rating.toFixed(1)} · {venue._count?.bookings ?? 0} bookings ·
          €{venue.price}/night
        </small>
      </span>
    </>
  );

  if (!linkToVenue) return <span className={styles.summary}>{content}</span>;

  return (
    <Link className={styles.summary} to={`/venues/${venue.id}`}>
      {content}
    </Link>
  );
}

export default VenueSummary;
