import { Heart, House, LogOut, Search, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import styles from './Navbar.module.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav
      className={`${styles.navbar} ${isAuthenticated ? styles.authenticated : ''}`}
      aria-label="Mobile navigation"
    >
      <NavLink to="/" end>
        <House aria-hidden="true" />
        <span>Home</span>
      </NavLink>
      <NavLink to={isAuthenticated ? '/dashboard' : '/login'}>
        <UserRound aria-hidden="true" />
        <span>Profile</span>
      </NavLink>
      <NavLink to="/search" end>
        <Search aria-hidden="true" />
        <span>Search</span>
      </NavLink>
      {isAuthenticated && (
        <NavLink to="/dashboard">
          <Heart aria-hidden="true" />
          <span>Saved</span>
        </NavLink>
      )}
      {isAuthenticated && (
        <button className={styles.logoutButton} type="button" onClick={logout}>
          <LogOut aria-hidden="true" />
          <span>Log out</span>
        </button>
      )}
    </nav>
  );
}

export default Navbar;
