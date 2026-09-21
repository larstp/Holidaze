import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import BookingCard from '../../components/BookingCard/BookingCard';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import DashboardShell from '../../components/DashboardShell/DashboardShell';
import { useAuth } from '../../context/useAuth';
import { ApiError } from '../../lib/services/apiClient';
import { getProfileVenues } from '../../lib/services/profileService';
import { deleteVenue } from '../../lib/services/venueService';
import type { Venue } from '../../types/api';
import styles from './ManagerVenues.module.css';

function ManagerVenues() {
  const navigate = useNavigate();
  const { accessToken, profile } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);
  const [isDeleteComplete, setIsDeleteComplete] = useState(false);

  useEffect(() => {
    if (!accessToken || !profile) return;

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
  }, [accessToken, profile]);

  const requestDelete = (venue: Venue) => {
    setError('');
    setIsDeleteComplete(false);
    setVenueToDelete(venue);
  };

  const closeDeleteDialog = () => {
    setIsDeleteComplete(false);
    setVenueToDelete(null);
  };

  const handleDelete = async () => {
    if (!accessToken || !venueToDelete) return;

    setError('');
    try {
      await deleteVenue(venueToDelete.id, accessToken);
      setVenues((currentVenues) =>
        currentVenues.filter(
          (currentVenue) => currentVenue.id !== venueToDelete.id
        )
      );
      setIsDeleteComplete(true);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'We could not delete this venue. Please try again later.'
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
                onDelete={requestDelete}
              />
            ))}
          </div>
        )}
      </section>
      <ConfirmDialog
        open={Boolean(venueToDelete)}
        title={isDeleteComplete ? 'Venue deleted' : 'Delete venue?'}
        confirmLabel="Delete venue"
        isComplete={isDeleteComplete}
        error={isDeleteComplete ? undefined : error}
        onCancel={closeDeleteDialog}
        onConfirm={handleDelete}
      >
        {isDeleteComplete
          ? `${venueToDelete?.name} has been deleted successfully.`
          : `This will permanently delete ${venueToDelete?.name}. This action cannot be undone.`}
      </ConfirmDialog>
    </DashboardShell>
  );
}

export default ManagerVenues;
