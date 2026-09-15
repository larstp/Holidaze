import { CalendarDays, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import BookingCard from '../../components/BookingCard/BookingCard';
import DashboardShell from '../../components/DashboardShell/DashboardShell';
import PageLoader from '../../components/PageLoader/PageLoader';
import StatCard from '../../components/StatCard/StatCard';
import { useAuth } from '../../context/useAuth';
import { ApiError } from '../../lib/services/apiClient';
import { getProfileBookings } from '../../lib/services/profileService';
import type { Booking } from '../../types/api';
import styles from './Dashboard.module.css';

const isUpcoming = (booking: Booking) =>
  new Date(`${booking.dateTo}T23:59:59`) >= new Date();

function Dashboard() {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

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
              : 'We could not load your trips.'
          );
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [accessToken, isAuthenticated, navigate, profile]);

  const upcomingBookings = useMemo(
    () => bookings.filter(isUpcoming),
    [bookings]
  );
  const pastBookings = useMemo(
    () => bookings.filter((booking) => !isUpcoming(booking)),
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

  if (!isAuthenticated || !profile || isLoading) {
    return <PageLoader label="Loading your trips" />;
  }

  return (
    <DashboardShell>
      <section aria-labelledby="trips-heading">
        <h1 className={styles.pageHeading} id="trips-heading">
          My Trips
        </h1>
        <div className={styles.stats}>
          <StatCard
            icon={CalendarDays}
            value={upcomingBookings.length}
            label="Upcoming trips"
          />
          <StatCard
            icon={TrendingUp}
            value={`€${totalSpent.toLocaleString('en-GB')}`}
            label="Total spent"
          />
        </div>

        {error && (
          <p className={styles.feedbackError} role="alert">
            {error}
          </p>
        )}
        {!error && bookings.length === 0 && (
          <div className={styles.emptyState}>
            <h2>No trips yet</h2>
            <p>Find a stay and start planning your next adventure.</p>
            <Button onClick={() => navigate('/search')} size="small">
              Explore stays
            </Button>
          </div>
        )}
        {upcomingBookings.length > 0 && (
          <BookingSection title="Upcoming" bookings={upcomingBookings} />
        )}
        {pastBookings.length > 0 && (
          <BookingSection title="Past trips" bookings={pastBookings} />
        )}
      </section>
    </DashboardShell>
  );
}

function BookingSection({
  title,
  bookings,
}: {
  title: string;
  bookings: Booking[];
}) {
  return (
    <section
      className={styles.bookingSection}
      aria-labelledby={`${title}-heading`}
    >
      <h2 id={`${title}-heading`}>{title}</h2>
      <div className={styles.bookingList}>
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            variant="bookedVenue"
            booking={booking}
            status={title === 'Past trips' ? 'Completed' : 'Upcoming'}
          />
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
