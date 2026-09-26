import {
  Car,
  ChevronLeft,
  ChevronDown,
  Coffee,
  MapPin,
  PawPrint,
  Pencil,
  Star,
  Wifi,
  CalendarDays,
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import buttonStyles from '../../components/Button/Button.module.css';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import ImageWithFallback from '../../components/ImageWithFallback/ImageWithFallback';
import PageLoader from '../../components/PageLoader/PageLoader';
import { VenueNotFoundPage } from '../../components/PageStates/PageStates';
import ProfileAvatar from '../../components/ProfileAvatar/ProfileAvatar';
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
  const { accessToken, isAuthenticated, profile } = useAuth();
  const mockReviews = useMemo(() => getRandomReviews(3), []);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isBookingConfirmationOpen, setIsBookingConfirmationOpen] =
    useState(false);

  if (isLoading) return <PageLoader />;

  if (error || !venue) {
    return <VenueNotFoundPage onRetry={refetch} />;
  }

  const location = [venue.location.city, venue.location.country]
    .filter(Boolean)
    .join(', ');
  const hasDateConflict = venue.bookings?.some(
    (booking) => checkIn < booking.dateTo && checkOut > booking.dateFrom
  );
  const bookingNights =
    checkIn && checkOut && checkOut > checkIn
      ? Math.round(
          (new Date(`${checkOut}T00:00:00`).getTime() -
            new Date(`${checkIn}T00:00:00`).getTime()) /
            86400000
        )
      : 0;
  const bookingSubtotal = venue.price * bookingNights;
  const bookingTotal = bookingSubtotal * guests;
  const isOwnVenue = Boolean(
    isAuthenticated &&
    profile?.venueManager &&
    profile.name === venue.owner?.name
  );
  const toCalendarDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  const toInputDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const bookedDates = (venue.bookings ?? []).flatMap((booking) => {
    const dates: Date[] = [];
    const currentDate = toCalendarDate(booking.dateFrom);
    const endDate = toCalendarDate(booking.dateTo);
    endDate.setDate(endDate.getDate() - 1);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  });
  const checkInDate = checkIn ? toCalendarDate(checkIn) : undefined;
  const checkOutDate = checkOut ? toCalendarDate(checkOut) : undefined;
  const selectedRangeDates: Date[] = [];

  if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
    const currentDate = new Date(checkInDate);
    currentDate.setDate(currentDate.getDate() + 1);

    while (currentDate < checkOutDate) {
      selectedRangeDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;
    const selectedDate = toInputDate(date);

    if (!checkIn || checkOut || selectedDate <= checkIn) {
      setCheckIn(selectedDate);
      setCheckOut('');
    } else {
      setCheckOut(selectedDate);
    }
    clearBookingFeedback();
  };

  const clearBookingFeedback = () => {
    setBookingError('');
    setBookingSuccess('');
  };

  const requestBooking = () => {
    if (!accessToken || !id || !checkIn || !checkOut) return;

    if (checkOut <= checkIn) {
      setBookingError('Check-out must be after check-in.');
      return;
    }

    if (hasDateConflict) {
      setBookingError('Those dates are already booked. Choose another range.');
      return;
    }

    setBookingError('');
    setIsBookingConfirmationOpen(true);
  };

  const handleBooking = async () => {
    if (!accessToken || !id || !checkIn || !checkOut) return;

    setIsBooking(true);
    clearBookingFeedback();
    setIsBookingConfirmationOpen(false);

    try {
      await createBooking(
        { dateFrom: checkIn, dateTo: checkOut, guests, venueId: id },
        accessToken
      );
      setBookingSuccess('Your stay has been reserved.');
    } catch (bookingRequestError) {
      const apiMessage =
        bookingRequestError instanceof ApiError
          ? bookingRequestError.message
          : '';
      const isConflict = /booked|overlap|available|conflict/i.test(apiMessage);

      if (isConflict) {
        refetch();
      }

      setBookingError(
        isConflict
          ? 'Your selected dates overlap an existing booking. Please choose another date range.'
          : apiMessage ||
              'We could not complete your booking. Please try again.'
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
          <ChevronLeft aria-hidden="true" /> Back
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
              <ProfileAvatar
                className={styles.hostAvatar}
                profile={
                  venue.owner ?? {
                    name: 'Holidaze host',
                    email: '',
                  }
                }
              />
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

          {isOwnVenue ? (
            <aside
              className={styles.bookingCard}
              aria-label="Manage this venue"
            >
              <p className={styles.managerCardTitle}>This is your venue</p>
              <p className={styles.managerCardMessage}>
                Manage your listing or review its upcoming bookings.
              </p>
              <div className={styles.managerActions}>
                <Button
                  type="button"
                  size="small"
                  icon={<Pencil aria-hidden="true" />}
                  onClick={() => navigate(`/venues/${venue.id}/edit`)}
                >
                  Edit venue
                </Button>
                <Button
                  type="button"
                  size="small"
                  variant="secondary"
                  icon={<CalendarDays aria-hidden="true" />}
                  onClick={() =>
                    navigate(`/dashboard/manager/bookings?venue=${venue.id}`)
                  }
                >
                  Booking calendar
                </Button>
              </div>
            </aside>
          ) : (
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
              </div>
              <Button
                type="button"
                variant="primary"
                size="small"
                className={styles.availabilityButton}
                onClick={() => setIsAvailabilityOpen((isOpen) => !isOpen)}
                aria-expanded={isAvailabilityOpen}
                aria-controls="venue-availability-calendar"
              >
                {isAvailabilityOpen ? 'Hide availability' : 'View availability'}
              </Button>
              {isAvailabilityOpen && (
                <div
                  className={styles.availabilityCalendar}
                  id="venue-availability-calendar"
                >
                  <DayPicker
                    className={styles.calendar}
                    mode="single"
                    selected={
                      checkOut
                        ? toCalendarDate(checkOut)
                        : checkIn
                          ? toCalendarDate(checkIn)
                          : undefined
                    }
                    onSelect={handleCalendarSelect}
                    disabled={[
                      { before: toCalendarDate(getToday()) },
                      ...bookedDates,
                    ]}
                    modifiers={{
                      booked: bookedDates,
                      checkIn: checkInDate ?? [],
                      selectedRange: selectedRangeDates,
                      checkOut: checkOutDate ?? [],
                    }}
                    modifiersClassNames={{
                      booked: styles.bookedDay,
                      checkIn: styles.checkInDay,
                      selectedRange: styles.selectedRangeDay,
                      checkOut: styles.checkOutDay,
                    }}
                    fixedWeeks
                    formatters={{
                      formatWeekdayName: (date) =>
                        date
                          .toLocaleDateString('en-US', { weekday: 'short' })
                          .slice(0, 2),
                    }}
                  />
                  <div className={styles.calendarLegend}>
                    <span>
                      <i /> Booked dates are unavailable
                    </span>
                  </div>
                </div>
              )}
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
              {bookingNights > 0 && (
                <div className={styles.bookingSummary} aria-live="polite">
                  <div>
                    <span>
                      {bookingNights} x{' '}
                      {bookingNights === 1 ? 'night' : 'nights'}
                    </span>
                    <span>€{bookingSubtotal}</span>
                  </div>
                  <div>
                    <span>
                      {guests} x {guests === 1 ? 'person' : 'people'}
                    </span>
                    <span>€{bookingTotal}</span>
                  </div>
                  <div className={styles.bookingTotal}>
                    <strong>Total</strong>
                    <strong>€{bookingTotal}</strong>
                  </div>
                </div>
              )}
              {isAuthenticated ? (
                <Button
                  type="button"
                  variant="primary"
                  size="small"
                  disabled={
                    isBooking || !checkIn || !checkOut || checkOut <= checkIn
                  }
                  onClick={requestBooking}
                >
                  {isBooking ? 'Reserving...' : 'Reserve'}
                </Button>
              ) : (
                <Link
                  className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.small} ${styles.loginToBook}`}
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
          )}
        </div>
        <ConfirmDialog
          open={isBookingConfirmationOpen}
          title="Are you sure?"
          confirmLabel="Confirm booking"
          cancelVariant="danger"
          confirmVariant="primary"
          onCancel={() => setIsBookingConfirmationOpen(false)}
          onConfirm={handleBooking}
        >
          <div className={styles.bookingConfirmationSummary}>
            <strong>{venue.name}</strong>
            <span>
              {checkIn} to {checkOut}
            </span>
            <span>
              {bookingNights} {bookingNights === 1 ? 'night' : 'nights'} ·{' '}
              {guests} {guests === 1 ? 'guest' : 'guests'}
            </span>
            <strong>Total: €{bookingTotal}</strong>
          </div>
        </ConfirmDialog>
      </div>
    </main>
  );
}

export default Venue;
