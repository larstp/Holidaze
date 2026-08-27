import { CalendarDays, Heart, Search, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar} aria-label="Mobile navigation">
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
  );
}

export default Navbar;
