import { CalendarDays, TrendingUp } from 'lucide-react';
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
    <DashboardShell isLoading={isLoading} loadingLabel="Loading your overview">
      <section aria-labelledby="overview-heading">
        <ProfileHero profile={profile!} headingId="overview-heading" />
        <h2 className={styles.overviewHeading}>Overview</h2>

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
      </section>
    </DashboardShell>
  );
}

export default DashboardOverview;
