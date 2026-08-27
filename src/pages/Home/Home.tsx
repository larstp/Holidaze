import { CalendarDays, Heart, MapPin, Search, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './home.module.css';

function Home() {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" /> 2,000+ handpicked stays worldwide
          </p>
          <h1>
            Your next great
            <br />
            stay <em>awaits.</em>
          </h1>
          <p className={styles.intro}>
            Hotels, lodges, cabins, and villas - curated for travellers who
            <br className={styles.desktopOnly} /> care about the details.
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
                <input name="dateFrom" type="date" aria-label="Check-in date" />
                <CalendarDays size={15} aria-hidden="true" />
              </span>
            </label>
            <label className={styles.searchField}>
              <span>Check-out</span>
              <span className={styles.fieldValue}>
                <input name="dateTo" type="date" aria-label="Check-out date" />
                <CalendarDays size={15} aria-hidden="true" />
              </span>
            </label>
            <label className={styles.searchField}>
              <span>Guests</span>
              <select name="guests" defaultValue="2">
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
                <option value="5">5 guests</option>
              </select>
            </label>
            <button className={styles.searchButton} type="submit">
              <Search size={18} aria-hidden="true" />
              Search
            </button>
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

      <nav className={styles.mobileNavigation} aria-label="Mobile navigation">
        <Link to="/search">
          <Search aria-hidden="true" />
          <span>Explore</span>
        </Link>
        <Link to="/search">
          <CalendarDays aria-hidden="true" />
          <span>Stays</span>
        </Link>
        <Link to="/dashboard">
          <Heart aria-hidden="true" />
          <span>Saved</span>
        </Link>
        <Link to="/dashboard">
          <UserRound aria-hidden="true" />
          <span>Profile</span>
        </Link>
      </nav>
    </main>
  );
}

export default Home;
