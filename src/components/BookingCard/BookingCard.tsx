import { ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../ImageWithFallback/ImageWithFallback';
import VenueSummary from '../VenueSummary/VenueSummary';
import type { Booking, Venue } from '../../types/api';
import styles from './BookingCard.module.css';

type BookingCardVariant = 'bookedVenue' | 'rentedVenue';

type BookingCardProps =
  | {
      variant: 'bookedVenue';
      booking: Booking;
      status: 'Upcoming' | 'Completed';
    }
  | {
      variant: 'rentedVenue';
      venue: Venue;
      onEdit?: (venue: Venue) => void;
      onDelete?: (venue: Venue) => void;
    };

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date(value))
    .replaceAll('/', '-');

function BookingCard(props: BookingCardProps) {
  if (props.variant === 'rentedVenue') {
    return (
      <article className={`${styles.card} ${styles.rentedCard}`}>
        <VenueSummary venue={props.venue} />
        <div className={styles.actions}>
          <button type="button" onClick={() => props.onEdit?.(props.venue)}>
            <Pencil aria-hidden="true" /> Edit
          </button>
          <button
            className={styles.deleteButton}
            type="button"
            aria-label={`Delete ${props.venue.name}`}
            onClick={() => props.onDelete?.(props.venue)}
          >
            <Trash2 aria-hidden="true" />
          </button>
        </div>
      </article>
    );
  }

  const venue = props.booking.venue;
  const nights = venue
    ? Math.max(
        1,
        Math.round(
          (new Date(props.booking.dateTo).getTime() -
            new Date(props.booking.dateFrom).getTime()) /
            86400000
        )
      ) /* This is where i needed most help */
    : 1;
  const total = venue ? venue.price * nights : 0;

  return (
    <Link
      className={styles.card}
      to={venue ? `/venues/${venue.id}` : '/search'}
    >
      <ImageWithFallback
        src={venue?.media[0]?.url}
        alt={venue?.media[0]?.alt || venue?.name || 'Booked stay'}
        loading="lazy"
      />
      <div className={styles.info}>
        <strong>{venue?.name || 'Booked stay'}</strong>
        <span>
          {[venue?.location.city, venue?.location.country]
            .filter(Boolean)
            .join(', ') || 'Location unavailable'}
        </span>
        <small>
          {formatDate(props.booking.dateFrom)} →{' '}
          {formatDate(props.booking.dateTo)} · {props.booking.guests}{' '}
          {props.booking.guests === 1 ? 'guest' : 'guests'} ·{' '}
          <b>€{total} total</b>
        </small>
      </div>
      <span
        className={`${styles.status} ${props.status === 'Completed' ? styles.completed : ''}`}
      >
        {props.status}
      </span>
      <ArrowRight className={styles.arrow} aria-hidden="true" />
    </Link>
  );
}

export type { BookingCardVariant };
export default BookingCard;
