import {
  Car,
  ChevronDown,
  Coffee,
  MapPin,
  PawPrint,
  Star,
  Wifi,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import ImageWithFallback from '../../components/ImageWithFallback/ImageWithFallback';
import PageLoader from '../../components/PageLoader/PageLoader';
import { useAuth } from '../../context/useAuth';
import { useVenue } from '../../hooks/useVenue';
import { getNextDate, getToday } from '../../lib/helpers/dateHelpers';
import { getRandomReviews } from '../../lib/helpers/reviews';
import { ApiError } from '../../lib/services/apiClient';
import { createBooking } from '../../lib/services/bookingService';
import styles from './Venue.module.css';

const amenities = [
  ['wifi', 'Wi-Fi included', Wifi],
  ['parking', 'Free parking', Car],
  ['breakfast', 'Breakfast', Coffee],
  ['pets', 'Pet friendly', PawPrint],
] as const;

function Venue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { venue, isLoading, error, refetch } = useVenue(id);
  const { accessToken, isAuthenticated } = useAuth();
  const mockReviews = useMemo(() => getRandomReviews(3), []);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  if (isLoading) return <PageLoader />;

  if (error || !venue) {
    return (
      <main className={styles.state}>
        <h1>We could not find this stay.</h1>
        <p>The venue may have been removed or is temporarily unavailable.</p>
        <Button variant="secondary" size="small" onClick={refetch}>
          Try again
        </Button>
      </main>
    );
  }

  const location = [venue.location.city, venue.location.country]
    .filter(Boolean)
    .join(', ');
  const hasDateConflict = venue.bookings?.some(
    (booking) => checkIn < booking.dateTo && checkOut > booking.dateFrom
  );

  const clearBookingFeedback = () => {
    setBookingError('');
    setBookingSuccess('');
  };

  const handleBooking = async () => {
    if (!accessToken || !id || !checkIn || !checkOut) return;

    if (checkOut <= checkIn) {
      setBookingError('Check-out must be after check-in.');
      return;
    }

    if (hasDateConflict) {
      setBookingError('Those dates are already booked. Choose another range.');
      return;
    }

    setIsBooking(true);
    clearBookingFeedback();

    try {
      await createBooking(
        { dateFrom: checkIn, dateTo: checkOut, guests, venueId: id },
        accessToken
      );
      setBookingSuccess('Your stay has been reserved.');
    } catch (bookingRequestError) {
      setBookingError(
        bookingRequestError instanceof ApiError
          ? bookingRequestError.message
          : 'We could not complete your booking. Please try again.'
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <button
          className={styles.backLink}
          type="button"
          onClick={() => navigate(-1)}
        >
          &lt; Back
        </button>

        <div className={styles.gallery}>
          <div className={styles.galleryHero}>
            <ImageWithFallback
              className={styles.galleryMainImage}
              src={venue.media[selectedImageIndex]?.url}
              alt={venue.media[selectedImageIndex]?.alt || venue.name}
            />
          </div>
          {venue.media.length > 1 && (
            <div className={styles.galleryThumbs} aria-label="Venue images">
              {venue.media.slice(0, 5).map((media, index) => (
                <button
                  className={`${styles.galleryThumb} ${index === selectedImageIndex ? styles.galleryThumbActive : ''}`}
                  type="button"
                  key={`${media.url}-${index}`}
                  aria-label={`Show venue image ${index + 1}`}
                  aria-pressed={index === selectedImageIndex}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <ImageWithFallback src={media.url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.columns}>
          <div className={styles.mainContent}>
            <div className={styles.category}>Stay</div>
            <div className={styles.headingRow}>
              <h1>{venue.name}</h1>
              <div className={styles.rating}>
                <Star size={17} aria-hidden="true" />
                <strong>{venue.rating.toFixed(1)}</strong>
                <span>({venue._count?.bookings ?? 0} bookings)</span>
              </div>
              <p className={styles.location}>
                <MapPin size={15} aria-hidden="true" />
                {location || 'Location not specified'}
              </p>
            </div>

            <div className={styles.hostProfile}>
              {venue.owner?.avatar?.url ? (
                <img
                  className={styles.hostAvatar}
                  src={venue.owner.avatar.url}
                  alt={venue.owner.avatar.alt || `${venue.owner.name} avatar`}
                />
              ) : (
                <span className={styles.hostAvatar} aria-hidden="true">
                  {venue.owner?.name?.charAt(0) || 'H'}
                </span>
              )}
              <div className={styles.hostInfo}>
                <strong>
                  Hosted by {venue.owner?.name || 'a Holidaze host'}
                </strong>
                <span>Manager · Superhost</span>
              </div>
            </div>

            <p className={styles.description}>{venue.description}</p>

            <section className={styles.offers} aria-labelledby="offers-heading">
              <h2 id="offers-heading">What this place offers</h2>
              <div className={styles.amenities}>
                {amenities.map(([key, label, Icon]) =>
                  venue.meta[key] ? (
                    <span key={key}>
                      <Icon size={15} aria-hidden="true" />
                      {label}
                    </span>
                  ) : null
                )}
              </div>
            </section>

            <section
              className={styles.reviews}
              aria-labelledby="reviews-heading"
            >
              <h2 id="reviews-heading">Reviews</h2>
              <p>
                <Star size={17} aria-hidden="true" />
                <strong>{venue.rating.toFixed(1)}</strong>
                <span>Venue rating</span>
              </p>
              <div className={styles.reviewList}>
                {mockReviews.map((review) => (
                  <article className={styles.review} key={review.id}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewAvatar} aria-hidden="true">
                        {review.author
                          .split(/\s|&/)
                          .filter(Boolean)
                          .map((name) => name[0])
                          .join('')}
                      </span>
                      <div>
                        <strong>{review.author}</strong>
                        <span>{review.subtitle}</span>
                      </div>
                      <span
                        className={styles.reviewStars}
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {'★'.repeat(review.rating)}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className={styles.bookingCard} aria-label="Book this stay">
            <p className={styles.bookingPrice}>
              €{venue.price} <span>/ night</span>
            </p>
            <p className={styles.bookingCapacity}>
              Up to {venue.maxGuests}{' '}
              {venue.maxGuests === 1 ? 'guest' : 'guests'}
            </p>
            <div className={styles.bookingFields}>
              <label>
                Check-in
                <input
                  type="date"
                  min={getToday()}
                  value={checkIn}
                  onChange={(event) => {
                    const nextCheckIn = event.target.value;
                    setCheckIn(nextCheckIn);
                    if (checkOut && checkOut <= nextCheckIn) setCheckOut('');
                    clearBookingFeedback();
                  }}
                />
              </label>
              <label>
                Check-out
                <input
                  type="date"
                  min={checkIn ? getNextDate(checkIn) : getToday()}
                  value={checkOut}
                  onChange={(event) => {
                    setCheckOut(event.target.value);
                    clearBookingFeedback();
                  }}
                />
              </label>
              <label className={styles.guestsField}>
                Guests
                <span className={styles.selectWrapper}>
                  <select
                    value={guests}
                    onChange={(event) => {
                      setGuests(Number(event.target.value));
                      clearBookingFeedback();
                    }}
                  >
                    {Array.from({ length: venue.maxGuests }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1} {index === 0 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden="true" />
                </span>
              </label>
            </div>
            {isAuthenticated ? (
              <Button
                type="button"
                variant="primary"
                disabled={
                  isBooking || !checkIn || !checkOut || checkOut <= checkIn
                }
                onClick={handleBooking}
              >
                {isBooking ? 'Reserving...' : 'Reserve'}
              </Button>
            ) : (
              <Link
                className={styles.loginToBook}
                to="/login"
                state={{ from: `/venues/${id}` }}
              >
                Log in to book
              </Link>
            )}
            {bookingError && (
              <p className={styles.bookingFeedbackError} role="alert">
                {bookingError}
              </p>
            )}
            {bookingSuccess && (
              <p className={styles.bookingFeedbackSuccess} role="status">
                {bookingSuccess}
              </p>
            )}
            <small>You won&apos;t be charged yet.</small>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Venue;
