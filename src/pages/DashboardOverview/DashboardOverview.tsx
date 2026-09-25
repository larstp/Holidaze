import { CalendarDays, TrendingUp } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { useEffect, useMemo, useState } from 'react';
import BookingCard from '../../components/BookingCard/BookingCard';
import DashboardShell from '../../components/DashboardShell/DashboardShell';
import ProfileHero from '../../components/ProfileHero/ProfileHero';
import StatCard from '../../components/StatCard/StatCard';
import { useAuth } from '../../context/useAuth';
import { ApiError } from '../../lib/services/apiClient';
import { getProfileBookings } from '../../lib/services/profileService';
import type { Booking } from '../../types/api';
import styles from './DashboardOverview.module.css';

function getBookingEndDate(dateValue: string): Date {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ? new Date(`${dateValue}T23:59:59`)
    : new Date(dateValue);
}

const isUpcoming = (booking: Booking) =>
  new Date(booking.dateFrom).getTime() > Date.now() &&
  getBookingEndDate(booking.dateTo).getTime() >= Date.now();

const isOngoing = (booking: Booking) =>
  new Date(booking.dateFrom).getTime() <= Date.now() &&
  getBookingEndDate(booking.dateTo).getTime() >= Date.now();

function DashboardOverview() {
  const { accessToken, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile || !accessToken) return;

    let isCurrentRequest = true;
    getProfileBookings(profile.name, '?_venue=true', accessToken)
      .then((response) => {
        if (isCurrentRequest) setBookings(response?.data ?? []);
      })
      .catch((requestError: unknown) => {
        if (isCurrentRequest) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : 'We could not load your overview.'
          );
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [accessToken, profile]);

  const ongoingBookings = useMemo(() => bookings.filter(isOngoing), [bookings]);
  const upcomingBookings = useMemo(
    () => bookings.filter(isUpcoming),
    [bookings]
  );
  const tripCalendarBookings = useMemo(
    () => [...ongoingBookings, ...upcomingBookings],
    [ongoingBookings, upcomingBookings]
  );
  const totalSpent = bookings.reduce((total, booking) => {
    if (!booking.venue) return total;
    const nights = Math.max(
      1,
      Math.round(
        (new Date(booking.dateTo).getTime() -
          new Date(booking.dateFrom).getTime()) /
          86400000
      )
    );
    return total + booking.venue.price * nights;
  }, 0);

  return (
    <DashboardShell
      isLoading={isLoading}
      loadingLabel="Loading your overview"
      overviewHero={<ProfileHero profile={profile!} />}
    >
      <section aria-labelledby="overview-heading">
        <h2 className={styles.overviewHeading} id="overview-heading">
          Overview
        </h2>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.stats}>
          <StatCard
            icon={CalendarDays}
            value={bookings.length}
            label="Booked trips"
          />
          <StatCard
            icon={TrendingUp}
            value={`€${totalSpent.toLocaleString('en-GB')}`}
            label="Total spent"
          />
        </div>

        <section className={styles.section} aria-labelledby="current-heading">
          <h2 className={styles.sectionHeading} id="current-heading">
            Your trips
          </h2>
          <div className={styles.bookingList}>
            {ongoingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                variant="bookedVenue"
                booking={booking}
                status="Ongoing"
              />
            ))}
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                variant="bookedVenue"
                booking={booking}
                status="Upcoming"
              />
            ))}
            {!error && bookings.length === 0 && (
              <p className={styles.muted}>No upcoming trips yet.</p>
            )}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="calendar-heading">
          <h2 className={styles.sectionHeading} id="calendar-heading">
            Trip calendars
          </h2>
          {tripCalendarBookings.length > 0 ? (
            <div className={styles.calendarGrid}>
              {tripCalendarBookings.map((booking) => (
                <TripCalendar key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <p className={styles.muted}>Your booked dates will appear here.</p>
          )}
        </section>
      </section>
    </DashboardShell>
  );
}

function TripCalendar({ booking }: { booking: Booking }) {
  const toCalendarDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  const checkIn = toCalendarDate(booking.dateFrom);
  const checkOut = toCalendarDate(booking.dateTo);
  const bookedDates: Date[] = [];
  const currentDate = new Date(checkIn);
  const lastBookedDate = new Date(checkOut);
  lastBookedDate.setDate(lastBookedDate.getDate() - 1);

  while (currentDate <= lastBookedDate) {
    bookedDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <article className={styles.calendarCard}>
      <h3>{booking.venue?.name ?? 'Booked stay'}</h3>
      <DayPicker
        className={styles.calendar}
        defaultMonth={checkIn}
        modifiers={{ booked: bookedDates, checkIn, checkOut }}
        modifiersClassNames={{
          booked: styles.bookedDay,
          checkIn: styles.checkInDay,
          checkOut: styles.checkOutDay,
        }}
        weekStartsOn={1}
        showOutsideDays
        fixedWeeks
        formatters={{
          formatWeekdayName: (date) =>
            date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
        }}
      />
      <p className={styles.calendarDates}>
        {booking.dateFrom.slice(0, 10)} to {booking.dateTo.slice(0, 10)}
      </p>
    </article>
  );
}

export default DashboardOverview;
