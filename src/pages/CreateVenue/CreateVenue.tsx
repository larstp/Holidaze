import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import PageLoader from '../../components/PageLoader/PageLoader';
import { useAuth } from '../../context/useAuth';
import { ApiError } from '../../lib/services/apiClient';
import { createVenue } from '../../lib/services/venueService';
import { updateVenue } from '../../lib/services/venueService';
import type { CreateVenueRequest, Venue, VenueMeta } from '../../types/api';
import styles from './CreateVenue.module.css';

type VenueForm = {
  name: string;
  description: string;
  price: string;
  maxGuests: string;
  imageUrl: string;
  imageAlt: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  continent: string;
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};

type VenueImage = {
  url: string;
  alt: string;
};

const initialForm: VenueForm = {
  name: '',
  description: '',
  price: '',
  maxGuests: '2',
  imageUrl: '',
  imageAlt: '',
  address: '',
  city: '',
  zip: '',
  country: '',
  continent: '',
  wifi: false,
  parking: false,
  breakfast: false,
  pets: false,
};

type CreateVenueProps = {
  venue?: Venue;
};

function CreateVenue({ venue }: CreateVenueProps) {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, profile } = useAuth();
  const [form, setForm] = useState<VenueForm>(() =>
    venue
      ? {
          name: venue.name,
          description: venue.description,
          price: String(venue.price),
          maxGuests: String(venue.maxGuests),
          imageUrl: '',
          imageAlt: '',
          address: venue.location.address ?? '',
          city: venue.location.city ?? '',
          zip: venue.location.zip ?? '',
          country: venue.location.country ?? '',
          continent: venue.location.continent ?? '',
          wifi: venue.meta.wifi,
          parking: venue.meta.parking,
          breakfast: venue.meta.breakfast,
          pets: venue.meta.pets,
        }
      : initialForm
  );
  const [images, setImages] = useState<VenueImage[]>(() => venue?.media ?? []);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isAuthenticated || !profile?.venueManager || !accessToken) {
    return <PageLoader label="Loading venue form" />;
  }

  const updateField = <Field extends keyof VenueForm>(
    field: Field,
    value: VenueForm[Field]
  ) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setError('');
  };

  const addImage = () => {
    const url = form.imageUrl.trim();
    if (!url) {
      setError('Enter an image URL before adding it.');
      return;
    }

    setImages((currentImages) => [
      ...currentImages,
      {
        url,
        alt: form.imageAlt.trim() || `Venue image ${currentImages.length + 1}`,
      },
    ]);
    setForm((currentForm) => ({
      ...currentForm,
      imageUrl: '',
      imageAlt: '',
    }));
    setError('');
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const price = Number(form.price);
    const maxGuests = Number(form.maxGuests);

    if (!name || !form.description.trim() || images.length === 0) {
      setError('Add a name, description, and at least one image.');
      return;
    }
    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(maxGuests) ||
      maxGuests < 1
    ) {
      setError('Enter a valid nightly price and guest capacity.');
      return;
    }

    const meta: VenueMeta = {
      wifi: form.wifi,
      parking: form.parking,
      breakfast: form.breakfast,
      pets: form.pets,
    };
    const payload: CreateVenueRequest = {
      name,
      description: form.description.trim(),
      media: images,
      price,
      maxGuests,
      meta,
      location: {
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        zip: form.zip.trim() || null,
        country: form.country.trim() || null,
        continent: form.continent.trim() || null,
        lat: null,
        lng: null,
      },
    };

    setIsSaving(true);
    setError('');
    try {
      if (venue) await updateVenue(venue.id, payload, accessToken);
      else await createVenue(payload, accessToken);
      navigate('/dashboard/manager/venues');
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'We could not create your venue. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Link className={styles.backLink} to="/dashboard/manager/venues">
          <ArrowLeft aria-hidden="true" /> Back to my venues
        </Link>
        <h1>{venue ? 'Edit venue' : 'Create venue'}</h1>
        <p className={styles.intro}>
          {venue
            ? 'Update your venue details and keep your listing accurate.'
            : 'Add a stay and start welcoming guests through Holidaze.'}
        </p>

        <section className={styles.section} aria-labelledby="photos-heading">
          <h2 id="photos-heading">Venue photos</h2>
          {images.length > 0 && (
            <div className={styles.imageList} aria-label="Added venue images">
              {images.map((image, index) => (
                <div className={styles.imageItem} key={`${image.url}-${index}`}>
                  <img src={image.url} alt={image.alt} />
                  <div>
                    <strong>{image.alt || `Image ${index + 1}`}</strong>
                    <button
                      type="button"
                      aria-label={`Remove image ${index + 1}`}
                      onClick={() =>
                        setImages((currentImages) =>
                          currentImages.filter(
                            (_, imageIndex) => imageIndex !== index
                          )
                        )
                      }
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={styles.imageInputRow}>
            <label>
              Image URL
              <input
                type="url"
                value={form.imageUrl}
                onChange={(event) =>
                  updateField('imageUrl', event.target.value)
                }
                placeholder="https://example.com/venue.jpg"
              />
            </label>
            <Button type="button" size="small" onClick={addImage}>
              Add
            </Button>
          </div>
          <label>
            Image description <small>Optional but recommended</small>
            <input
              type="text"
              value={form.imageAlt}
              onChange={(event) => updateField('imageAlt', event.target.value)}
              placeholder="A bright apartment overlooking the sea"
            />
          </label>
        </section>

        <section className={styles.section} aria-labelledby="details-heading">
          <h2 id="details-heading">Venue details</h2>
          <label>
            Venue name
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Coastal Dream Apartment"
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField('description', event.target.value)
              }
              rows={5}
              placeholder="Tell guests what makes this venue special"
              required
            />
          </label>
          <div className={styles.twoColumns}>
            <label>
              Price per night
              <span className={styles.priceField}>
                <span aria-hidden="true">€</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.price}
                  onChange={(event) => updateField('price', event.target.value)}
                  placeholder="120"
                  required
                />
              </span>
            </label>
            <label>
              Maximum guests
              <input
                type="number"
                min="1"
                step="1"
                value={form.maxGuests}
                onChange={(event) =>
                  updateField('maxGuests', event.target.value)
                }
                required
              />
            </label>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="location-heading">
          <h2 id="location-heading">Location</h2>
          <div className={styles.twoColumns}>
            <label>
              Address
              <input
                value={form.address}
                onChange={(event) => updateField('address', event.target.value)}
                placeholder="Beach Road 12"
              />
            </label>
            <label>
              City
              <input
                value={form.city}
                onChange={(event) => updateField('city', event.target.value)}
                placeholder="Lisbon"
              />
            </label>
            <label>
              Zip code
              <input
                value={form.zip}
                onChange={(event) => updateField('zip', event.target.value)}
                placeholder="1000"
              />
            </label>
            <label>
              Country
              <input
                value={form.country}
                onChange={(event) => updateField('country', event.target.value)}
                placeholder="Portugal"
              />
            </label>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="amenities-heading">
          <h2 id="amenities-heading">Amenities</h2>
          <div className={styles.amenities}>
            {(['wifi', 'parking', 'breakfast', 'pets'] as const).map(
              (amenity) => (
                <label key={amenity} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={form[amenity]}
                    onChange={(event) =>
                      updateField(amenity, event.target.checked)
                    }
                  />
                  {amenity === 'wifi'
                    ? 'Wi-Fi included'
                    : amenity === 'parking'
                      ? 'Free parking'
                      : amenity === 'breakfast'
                        ? 'Breakfast'
                        : 'Pet friendly'}
                </label>
              )
            )}
          </div>
        </section>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <Link className={styles.cancelButton} to="/dashboard/manager/venues">
            Cancel
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving
              ? venue
                ? 'Saving changes...'
                : 'Creating venue...'
              : venue
                ? 'Save changes'
                : 'Create venue'}
          </Button>
        </div>
      </form>
    </main>
  );
}

export default CreateVenue;
