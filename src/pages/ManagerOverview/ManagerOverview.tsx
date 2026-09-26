import { CalendarDays, Store, TrendingUp, Users } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { useEffect, useMemo, useState } from 'react';
import BookingCard from '../../components/BookingCard/BookingCard';
import DashboardShell from '../../components/DashboardShell/DashboardShell';
import ProfileHero from '../../components/ProfileHero/ProfileHero';
import StatCard from '../../components/StatCard/StatCard';
import { useAuth } from '../../context/useAuth';
import { ApiError } from '../../lib/services/apiClient';
import {
  getProfileBookings,
  getProfileVenues,
} from '../../lib/services/profileService';
import type { Booking, Venue } from '../../types/api';
import styles from './ManagerOverview.module.css';

const isUpcoming = (booking: Booking) => {
  const endDate = /^\d{4}-\d{2}-\d{2}$/.test(booking.dateTo)
    ? new Date(`${booking.dateTo}T23:59:59`)
    : new Date(booking.dateTo);
  return (
    new Date(booking.dateFrom).getTime() > Date.now() &&
    endDate.getTime() >= Date.now()
  );
};

const isOngoing = (booking: Booking) => {
  const endDate = /^\d{4}-\d{2}-\d{2}$/.test(booking.dateTo)
    ? new Date(`${booking.dateTo}T23:59:59`)
    : new Date(booking.dateTo);
  return (
    new Date(booking.dateFrom).getTime() <= Date.now() &&
    endDate.getTime() >= Date.now()
  );
};

const bookingTotal = (booking: Booking) => {
  if (!booking.venue) return 0;
  const nights = Math.max(
    1,
    Math.round(
      (new Date(booking.dateTo).getTime() -
        new Date(booking.dateFrom).getTime()) /
        86400000
    )
  );
  return booking.venue.price * nights;
};

function ManagerOverview() {
  const { accessToken, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken || !profile) return;

    let isCurrentRequest = true;
    Promise.all([
      getProfileBookings(profile.name, '?_venue=true', accessToken),
      getProfileVenues(
        profile.name,
        '?_bookings=true&_customer=true',
        accessToken
      ),
    ])
      .then(([bookingResponse, venueResponse]) => {
        if (!isCurrentRequest) return;
        setBookings(bookingResponse?.data ?? []);
        setVenues(venueResponse?.data ?? []);
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

  const upcomingTrips = useMemo(() => bookings.filter(isUpcoming), [bookings]);
  const ongoingTrips = useMemo(() => bookings.filter(isOngoing), [bookings]);
  const totalSpent = bookings.reduce(
    (total, booking) => total + bookingTotal(booking),
    0
  );
  const confirmedBookings = venues.reduce(
    (total, venue) => total + (venue.bookings?.length ?? 0),
    0
  );
  const totalEarned = venues.reduce(
    (total, venue) =>
      total +
      (venue.bookings ?? []).reduce(
        (venueTotal, booking) =>
          venueTotal + bookingTotal({ ...booking, venue }),
        0
      ),
    0
  );

  return (
    <DashboardShell
      isLoading={isLoading}
      loadingLabel="Loading your overview"
      overviewHero={<ProfileHero profile={profile!} />}
    >
      <section aria-labelledby="overview-heading">
        <h1 className={styles.heading} id="overview-heading">
          Overview
        </h1>
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
          <StatCard
            icon={Store}
            value={venues.length}
            label="Registered venues"
          />
          <StatCard
            icon={Users}
            value={confirmedBookings}
            label="Confirmed bookings"
          />
          <StatCard
            icon={TrendingUp}
            value={`€${totalEarned.toLocaleString('en-GB')}`}
            label="Total earned"
          />
        </div>

        {ongoingTrips.length > 0 && (
          <section className={styles.section} aria-labelledby="ongoing-heading">
            <h2 id="ongoing-heading">Ongoing trips</h2>
            <div className={styles.bookingList}>
              {ongoingTrips.map((booking) => (
                <BookingCard
                  key={booking.id}
                  variant="bookedVenue"
                  booking={booking}
                  status="Ongoing"
                />
              ))}
            </div>
          </section>
        )}

        <section className={styles.section} aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading">Upcoming trips</h2>
          <div className={styles.bookingList}>
            {upcomingTrips.length > 0 ? (
              upcomingTrips.map((booking) => (
                <BookingCard
                  key={booking.id}
                  variant="bookedVenue"
                  booking={booking}
                  status="Upcoming"
                />
              ))
            ) : (
              <p className={styles.muted}>No upcoming trips.</p>
            )}
          </div>
        </section>

        <section
          className={styles.section}
          aria-labelledby="availability-heading"
        >
          <h2 id="availability-heading">Availability calendars</h2>
          <div className={styles.calendarGrid}>
            {venues.map((venue) => (
              <VenueCalendar key={venue.id} venue={venue} />
            ))}
          </div>
        </section>
      </section>
    </DashboardShell>
  );
}

function VenueCalendar({ venue }: { venue: Venue }) {
  const bookings = venue.bookings ?? [];
  const upcomingBookings = bookings.filter(isUpcoming);
  const pastBookings = bookings.filter((booking) => !isUpcoming(booking));
  const toCalendarDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  const checkInDates = upcomingBookings.map((booking) =>
    toCalendarDate(booking.dateFrom)
  );
  const checkOutDates = upcomingBookings.map((booking) =>
    toCalendarDate(booking.dateTo)
  );
  const bookedDates = upcomingBookings.flatMap((booking) => {
    const dates: Date[] = [];
    const currentDate = toCalendarDate(booking.dateFrom);
    const endDate = toCalendarDate(booking.dateTo);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  });
  const pastBookedDates = pastBookings.flatMap((booking) => {
    const dates: Date[] = [];
    const currentDate = toCalendarDate(booking.dateFrom);
    const endDate = toCalendarDate(booking.dateTo);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  });

  if (bookings.length === 0) {
    return (
      <article className={styles.calendarCard}>
        <h3>{venue.name}</h3>
        <p className={styles.calendarEmpty}>No bookings for this venue yet.</p>
      </article>
    );
  }

  return (
    <article className={styles.calendarCard}>
      <h3>{venue.name}</h3>
      <DayPicker
        className={styles.calendar}
        mode="multiple"
        defaultMonth={bookings[0] ? new Date(bookings[0].dateFrom) : new Date()}
        modifiers={{
          booked: bookedDates,
          pastBooked: pastBookedDates,
          checkIn: checkInDates,
          checkOut: checkOutDates,
        }}
        modifiersClassNames={{
          booked: styles.bookedDay,
          pastBooked: styles.pastBookedDay,
          checkIn: styles.checkInDay,
          checkOut: styles.checkOutDay,
        }}
        weekStartsOn={1}
        showOutsideDays
        fixedWeeks
        hideNavigation={false}
        formatters={{
          formatWeekdayName: (date) =>
            date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
        }}
      />
      <div className={styles.legend} aria-label="Calendar legend">
        <span>
          <i className={styles.bookedSwatch} /> Booked
        </span>
        <span>
          <i className={styles.pastBookedSwatch} /> Past booking
        </span>
        <span>
          <i className={styles.checkInSwatch} /> Check-in
        </span>
        <span>
          <i className={styles.checkOutSwatch} /> Check-out
        </span>
      </div>
    </article>
  );
}

export default ManagerOverview;
