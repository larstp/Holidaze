import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../../components/DashboardShell/DashboardShell';
import { useAuth } from '../../context/useAuth';
import VenueSummary from '../../components/VenueSummary/VenueSummary';
import { ApiError } from '../../lib/services/apiClient';
import { getProfileVenues } from '../../lib/services/profileService';
import type { Venue } from '../../types/api';
import styles from './IncomingBookings.module.css';

function IncomingBookings() {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, profile } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [expandedVenueId, setExpandedVenueId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !profile?.venueManager) {
      navigate('/dashboard', { replace: true });
      return;
    }
    if (!accessToken) return;

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
          setExpandedVenueId(loadedVenues[0]?.id ?? null);
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
  }, [accessToken, isAuthenticated, navigate, profile]);

  if (!isAuthenticated || !profile?.venueManager) return null;

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
            const events = (venue.bookings ?? []).map((booking) => ({
              id: booking.id,
              title: `${booking.customer?.name ?? 'Guest'}\n${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`,
              start: booking.dateFrom,
              end: booking.dateTo,
              allDay: true,
            }));

            return (
              <article className={styles.venueCard} key={venue.id}>
                <button
                  className={styles.venueHeader}
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
  }>;
};

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
