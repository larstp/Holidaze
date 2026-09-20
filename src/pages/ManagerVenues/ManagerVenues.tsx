import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import BookingCard from '../../components/BookingCard/BookingCard';
import DashboardShell from '../../components/DashboardShell/DashboardShell';
import { useAuth } from '../../context/useAuth';
import { ApiError } from '../../lib/services/apiClient';
import { getProfileVenues } from '../../lib/services/profileService';
import { deleteVenue } from '../../lib/services/venueService';
import type { Venue } from '../../types/api';
import styles from './ManagerVenues.module.css';

function ManagerVenues() {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, profile } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !profile?.venueManager) {
      navigate('/dashboard', { replace: true });
      return;
    }

    if (!accessToken) return;

    let isCurrentRequest = true;
    getProfileVenues(profile.name, '', accessToken)
      .then((response) => {
        if (isCurrentRequest) setVenues(response?.data ?? []);
      })
      .catch((requestError: unknown) => {
        if (isCurrentRequest) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : 'We could not load your venues.'
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

  if (!isAuthenticated || !profile?.venueManager) {
    return null;
  }

  const handleDelete = async (venue: Venue) => {
    if (!accessToken || !window.confirm(`Delete ${venue.name}?`)) return;

    setError('');
    try {
      await deleteVenue(venue.id, accessToken);
      setVenues((currentVenues) =>
        currentVenues.filter((currentVenue) => currentVenue.id !== venue.id)
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'We could not delete this venue.'
      );
    }
  };

  return (
    <DashboardShell isLoading={isLoading} loadingLabel="Loading your venues">
      <section aria-labelledby="venues-heading">
        <div className={styles.headingRow}>
          <h1 id="venues-heading">My Venues</h1>
          <Button
            type="button"
            size="small"
            icon={<Plus aria-hidden="true" />}
            onClick={() => navigate('/venues/create')}
          >
            Add venue
          </Button>
        </div>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {venues.length === 0 && !error ? (
          <div className={styles.emptyState}>
            <h2>No venues yet</h2>
            <p>Create your first venue and start welcoming guests.</p>
            <Button size="small" onClick={() => navigate('/venues/create')}>
              Add venue
            </Button>
          </div>
        ) : (
          <div className={styles.venueList}>
            {venues.map((venue) => (
              <BookingCard
                key={venue.id}
                variant="rentedVenue"
                venue={venue}
                onBookings={() =>
                  navigate(`/dashboard/manager/bookings?venue=${venue.id}`)
                }
                onEdit={() => navigate(`/venues/${venue.id}/edit`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

export default ManagerVenues;
