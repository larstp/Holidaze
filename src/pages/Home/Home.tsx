import {
  Car,
  ChevronDown,
  Coffee,
  MapPin,
  PawPrint,
  ShieldCheck,
  Search,
  Star,
  Zap,
  Wifi,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import PageLoader from '../../components/PageLoader/PageLoader';
import VenueCard from '../../components/VenueCard/VenueCard';
import { useVenues } from '../../hooks/useVenues';
import {
  getPopularDestinations,
  selectRandomVenues,
} from '../../lib/helpers/venueHelpers';
import styles from './home.module.css';

const heroImages = [
  '/images/alexandre-chambon-aapSemzfsOk-unsplash.jpg',
  '/images/anete-lusina-GOZxrAlNIt4-unsplash.jpg',
  '/images/david-vives-ELf8M_YWRTY-unsplash.jpg',
  '/images/drif-riadh-YpkuRn54y4w-unsplash.jpg',
  '/images/ethan-robertson-SYx3UCHZJlo-unsplash.jpg',
  '/images/geojango-maps-CWbbJW_7Fsw-unsplash.jpg',
  '/images/hugh-whyte-SBOHLtENzEY-unsplash.jpg',
  '/images/ishan-seefromthesky-qE1Y8GQKhEk-unsplash.jpg',
  '/images/julian-timmerman-Fn27DlI8bZ8-unsplash.jpg',
  '/images/karsten-winegeart-fd1cQ3mmBTE-unsplash.jpg',
  '/images/la-so-vk4vjTNVrTg-unsplash.jpg',
  '/images/lance-asper-mNDVSSmMt0Y-unsplash.jpg',
  '/images/robson-hatsukami-morgan-r8hw4Zs38zo-unsplash.jpg',
  '/images/tron-le-JsuBKjHGDMM-unsplash.jpg',
  '/images/upgraded-points-KVym2PAn1gA-unsplash.jpg',
];

const featuredReviews = [
  {
    rating: 5,
    author: 'Amara & Tobias',
    subtitle: 'Honeymoon Vacation',
    comment:
      'Found our dream honeymoon villa through Holidaze in under 10 minutes. The experience was seamless from booking to check-out - nothing came close.',
  },
  {
    rating: 5,
    author: 'Marcus H.',
    subtitle: 'Backpacking',
    comment:
      "The lodge selection is incredible. We stayed somewhere our friends had never heard of but couldn't stop talking about it for months afterward.",
  },
];

const getToday = () => new Date().toISOString().split('T')[0];

function Home() {
  const { venues, venueCount, isLoading, error, refetch } = useVenues();
  const featuredVenues = useMemo(() => selectRandomVenues(venues, 4), [venues]);
  const popularDestinations = getPopularDestinations(venues, 5);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  return (
    <main className={styles.home}>
      {isLoading && <PageLoader />}
      <section className={styles.hero}>
        <ImageCarousel images={heroImages} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" /> Explore stays around the world
          </p>
          <h1>
            Your next great
            <br />
            adventure <em className={styles.highlight}>awaits.</em>
          </h1>
          <p className={styles.intro}>
            Find your way to the good kind of daze with our curated selection
            <br className={styles.desktopOnly} /> of hotels, lodges, apartments,
            and experiences.
          </p>

          <form className={styles.searchPanel} action="/search" method="get">
            <label className={styles.searchField}>
              <span>Where</span>
              <span className={styles.fieldValue}>
                <MapPin size={16} aria-hidden="true" />
                <input name="q" placeholder="Destinations" />
              </span>
            </label>
            <label className={styles.searchField}>
              <span>Check-in</span>
              <span className={styles.fieldValue}>
                <input
                  name="dateFrom"
                  type="date"
                  aria-label="Check-in date"
                  min={getToday()}
                  value={checkIn}
                  onChange={(event) => {
                    setCheckIn(event.target.value);
                    if (checkOut && event.target.value > checkOut) {
                      setCheckOut('');
                    }
                  }}
                />
              </span>
            </label>
            <label className={styles.searchField}>
              <span>Check-out</span>
              <span className={styles.fieldValue}>
                <input
                  name="dateTo"
                  type="date"
                  aria-label="Check-out date"
                  min={checkIn || getToday()}
                  value={checkOut}
                  onChange={(event) => setCheckOut(event.target.value)}
                />
              </span>
            </label>
            <label className={styles.searchField}>
              <span>Guests</span>
              <span className={styles.selectWrapper}>
                <select name="guests" defaultValue="2">
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5">5 guests</option>
                </select>
                <ChevronDown aria-hidden="true" />
              </span>
            </label>
            <Button
              className={styles.searchButton}
              type="submit"
              icon={<Search size={18} aria-hidden="true" />}
            >
              Search
            </Button>
          </form>

          <div className={styles.stats} aria-label="Holidaze highlights">
            <div>
              <strong>50K+</strong>
              <span>Happy travellers</span>
            </div>
            <div>
              <strong>{venueCount.toLocaleString()}</strong>
              <span>Curated properties</span>
            </div>
            <div>
              <strong>
                4.9<small>★</small>
              </strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className={styles.sectionContent}>
          <p className={styles.sectionEyebrow}>Explore</p>
          <h2>Browse by amenity</h2>
          <p className={styles.sectionIntro}>
            Find the details that make your stay feel just right.
          </p>
          <div className={styles.amenityGrid}>
            {(
              [
                ['wifi', 'Wi-Fi included', Wifi],
                ['parking', 'Parking', Car],
                ['breakfast', 'Breakfast', Coffee],
                ['pets', 'Pet friendly', PawPrint],
              ] as const
            ).map(([amenity, label, Icon]) => {
              const count = venues.filter(
                (venue) => venue.meta[amenity]
              ).length;

              return (
                <a
                  className={styles.amenityCard}
                  href={`/search?amenity=${amenity}`}
                  key={amenity}
                >
                  <span className={styles.amenityIcon}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <strong>{label}</strong>
                  <span>{count} stays</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className={styles.sectionContent}>
          <p className={styles.sectionEyebrow}>Explore</p>
          <h2>Popular destinations</h2>
          <p className={styles.sectionIntro}>
            Explore stays in the world's most sought-after locations.
          </p>
          {!isLoading && popularDestinations.length === 0 && (
            <p className={styles.status}>
              Destinations will appear as venues are added.
            </p>
          )}
          {!isLoading && popularDestinations.length > 0 && (
            <div className={styles.destinationGrid}>
              {popularDestinations.map((destination) => (
                <Link
                  className={styles.destinationCard}
                  key={`${destination.city}-${destination.country}`}
                  to={`/search?city=${encodeURIComponent(destination.city)}&country=${encodeURIComponent(destination.country)}`}
                >
                  <img
                    src={
                      destination.image?.url ??
                      '/images/photo-1507525428034-b723cf961d3e.jpg'
                    }
                    alt={
                      destination.image?.alt ??
                      `${destination.city}, ${destination.country}`
                    }
                  />
                  <span className={styles.destinationCount}>
                    {destination.count}{' '}
                    {destination.count === 1 ? 'stay' : 'stays'}
                  </span>
                  <span className={styles.destinationOverlay}>
                    <strong>{destination.city}</strong>
                    <span>Explore stays -&gt;</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className={styles.sectionContent}>
          <p className={styles.sectionEyebrow}>Explore</p>
          <h2>Featured stays</h2>
          <p className={styles.sectionIntro}>
            Hand-picked places for your next stay.
          </p>
          {isLoading && <p className={styles.status}>Loading stays...</p>}
          {error && (
            <div className={styles.status} role="alert">
              <p>We could not load stays right now.</p>
              <button type="button" onClick={refetch}>
                Try again
              </button>
            </div>
          )}
          {!isLoading && !error && venues.length === 0 && (
            <p className={styles.status}>No stays are available yet.</p>
          )}
          {!isLoading && !error && venues.length > 0 && (
            <div className={styles.venueGrid}>
              {featuredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.trustSection} aria-label="Why choose Holidaze">
        <div className={styles.trustContent}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <ShieldCheck size={18} aria-hidden="true" />
            </span>
            <div>
              <h3>Verified properties</h3>
              <p>Every listing is carefully reviewed before going live.</p>
            </div>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <Star size={18} aria-hidden="true" />
            </span>
            <div>
              <h3>Honest ratings</h3>
              <p>Clear venue ratings help you choose with confidence.</p>
            </div>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <Zap size={18} aria-hidden="true" />
            </span>
            <div>
              <h3>Instant booking</h3>
              <p>Confirm your stay in seconds, without waiting for approval.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="reviews-heading">
        <div className={styles.sectionContent}>
          <h2 id="reviews-heading">What travellers say</h2>
          <div className={styles.reviewGrid}>
            {featuredReviews.map((review) => (
              <article className={styles.reviewCard} key={review.author}>
                <div
                  className={styles.reviewRating}
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {'★'.repeat(review.rating)}
                </div>
                <p className={styles.reviewComment}>
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className={styles.reviewer}>
                  <span className={styles.reviewerAvatar} aria-hidden="true">
                    {review.author
                      .split(/\s|&/)
                      .filter(Boolean)
                      .map((name) => name[0])
                      .join('')}
                  </span>
                  <div>
                    <strong>{review.author}</strong>
                    <span>{review.subtitle}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection} aria-labelledby="cta-heading">
        <ImageCarousel images={heroImages} />
        <div className={styles.ctaOverlay} aria-hidden="true" />
        <div className={styles.ctaContent}>
          <h2 id="cta-heading">Ready to find your perfect stay?</h2>
          <p>
            Join travellers who book their next good kind of daze with Holidaze.
          </p>
          <div className={styles.ctaActions}>
            <Link className={styles.ctaPrimary} to="/search">
              Start exploring
            </Link>
            <Link className={styles.ctaSecondary} to="/become-manager">
              List your venue
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
