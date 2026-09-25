import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardShell from '../../components/DashboardShell/DashboardShell';
import ProfileAvatar from '../../components/ProfileAvatar/ProfileAvatar';
import { useAuth } from '../../context/useAuth';
import VenueSummary from '../../components/VenueSummary/VenueSummary';
import { ApiError } from '../../lib/services/apiClient';
import { getProfileVenues } from '../../lib/services/profileService';
import type { Venue } from '../../types/api';
import styles from './IncomingBookings.module.css';

function IncomingBookings() {
  const [searchParams] = useSearchParams();
  const { accessToken, profile } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [expandedVenueId, setExpandedVenueId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken || !profile) return;

    let isCurrentRequest = true;
    getProfileVenues(
      profile.name,
      '?_bookings=true&_customer=true',
      accessToken
    )
      .then((response) => {
        if (isCurrentRequest) {
          const loadedVenues = response?.data ?? [];
          setVenues(loadedVenues);
          setExpandedVenueId(searchParams.get('venue'));
        }
      })
      .catch((requestError: unknown) => {
        if (isCurrentRequest) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : 'We could not load incoming bookings.'
          );
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [accessToken, profile, searchParams]);

  return (
    <DashboardShell
      isLoading={isLoading}
      loadingLabel="Loading incoming bookings"
    >
      <section
        className={styles.pageSection}
        aria-labelledby="incoming-heading"
      >
        <h1 id="incoming-heading">Incoming Bookings</h1>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {!error && venues.length === 0 && !isLoading && (
          <p className={styles.empty}>You do not have any venues yet.</p>
        )}
        <div className={styles.venueList}>
          {venues.map((venue) => {
            const isExpanded = venue.id === expandedVenueId;
            const upcomingBookings = (venue.bookings ?? []).filter(
              isUpcomingBooking
            );
            const events = (venue.bookings ?? []).map((booking) => ({
              id: booking.id,
              title: `${booking.customer?.name ?? 'Guest'}\n${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`,
              start: booking.dateFrom,
              end: booking.dateTo,
              allDay: true,
              classNames: isUpcomingBooking(booking) ? [] : ['pastBooking'],
            }));

            return (
              <article className={styles.venueCard} key={venue.id}>
                <button
                  className={`${styles.venueHeader} ${styles.calendarToggle}`}
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() =>
                    setExpandedVenueId(isExpanded ? null : venue.id)
                  }
                >
                  <VenueSummary venue={venue} linkToVenue={false} />
                  <span>{isExpanded ? 'Hide calendar' : 'Show calendar'}</span>
                </button>
                {isExpanded && (
                  <div className={styles.calendar}>
                    {upcomingBookings.length > 0 && (
                      <div
                        className={styles.upcomingBookings}
                        aria-label="Upcoming bookings"
                      >
                        {upcomingBookings.map((booking) => (
                          <div
                            className={styles.upcomingBooking}
                            key={booking.id}
                          >
                            <ProfileAvatar
                              className={styles.customerAvatar}
                              profile={
                                booking.customer ?? {
                                  name: 'Guest',
                                  email: '',
                                }
                              }
                            />
                            <div className={styles.bookingCustomer}>
                              <strong>
                                {booking.customer?.name ?? 'Guest'}
                              </strong>
                              <span>
                                {booking.guests}{' '}
                                {booking.guests === 1 ? 'guest' : 'guests'}
                              </span>
                            </div>
                            <span className={styles.bookingDates}>
                              {formatBookingDate(booking.dateFrom)} →{' '}
                              {formatBookingDate(booking.dateTo)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {events.length > 0 ? (
                      <VenueCalendar events={events} />
                    ) : (
                      <p className={styles.calendarEmpty}>
                        No bookings for this venue yet.
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </DashboardShell>
  );
}

type VenueCalendarProps = {
  events: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    classNames: string[];
  }>;
};

function isUpcomingBooking(booking: NonNullable<Venue['bookings']>[number]) {
  const dateValue = booking.dateTo;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ? new Date(`${dateValue}T23:59:59`)
    : new Date(dateValue);
  return date.getTime() >= Date.now();
}

function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value));
}

function VenueCalendar({ events }: VenueCalendarProps) {
  const calendarElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarElement.current) return;

    const calendar = new Calendar(calendarElement.current, {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      height: 'auto',
      events,
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'today',
      },
      buttonText: {
        today: 'Today',
      },
      eventColor: 'var(--dark-green)',
      dayMaxEvents: true,
    });

    calendar.render();
    return () => calendar.destroy();
  }, [events]);

  return <div ref={calendarElement} />;
}

export default IncomingBookings;
