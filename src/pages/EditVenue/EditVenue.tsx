import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreateVenue from '../CreateVenue/CreateVenue';
import PageLoader from '../../components/PageLoader/PageLoader';
import { useAuth } from '../../context/useAuth';
import { ApiError } from '../../lib/services/apiClient';
import { getVenue } from '../../lib/services/venueService';
import type { Venue } from '../../types/api';

function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, profile } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !accessToken || !profile) return;

    let isCurrentRequest = true;
    getVenue(id, '?_owner=true')
      .then((response) => {
        if (isCurrentRequest && response?.data) {
          if (response.data.owner?.name !== profile.name) {
            navigate('/dashboard/manager/venues', { replace: true });
            return;
          }
          setVenue(response.data);
        }
      })
      .catch((requestError: unknown) => {
        if (isCurrentRequest) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : 'We could not load this venue.'
          );
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [accessToken, id, navigate, profile]);

  if (!accessToken || !profile || !venue) {
    return <PageLoader label={error || 'Loading venue'} />;
  }

  return <CreateVenue venue={venue} />;
}

export default EditVenue;
