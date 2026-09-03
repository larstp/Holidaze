import { ChevronDown, MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './Home.module.css';

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

const HERO_ROTATION_MS = 30000;

const getToday = () => new Date().toISOString().split('T')[0];

function Home() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [activeImage, setActiveImage] = useState(() =>
    Math.floor(Math.random() * heroImages.length)
  );

  useEffect(() => {
    heroImages.forEach((imageSource) => {
      const image = new Image();
      image.src = imageSource;
    });

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    let timeoutId = window.setTimeout(function rotateHeroImage() {
      setActiveImage((currentImage) => (currentImage + 1) % heroImages.length);
      timeoutId = window.setTimeout(rotateHeroImage, HERO_ROTATION_MS);
    }, HERO_ROTATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div
          key={heroImages[activeImage]}
          className={styles.heroImage}
          style={{ backgroundImage: `url('${heroImages[activeImage]}')` }}
          aria-hidden="true"
        />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" /> 2,000+ handpicked stays worldwide
          </p>
          <h1>
            Your next great
            <br />
            adventure <em>awaits.</em>
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
                <input name="q" placeholder="Search destinations" />
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
              <strong>2,400</strong>
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
    </main>
  );
}

export default Home;
