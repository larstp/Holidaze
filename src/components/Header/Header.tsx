import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink className={styles.logoLink} to="/" onClick={closeMenu}>
          <picture>
            <source
              media="(prefers-color-scheme: dark)"
              srcSet="/icons/Logo-header+footerL-white.svg"
            />
            <img
              className="logo"
              src="/icons/Logo-header+footerL-Black.svg"
              alt="Holidaze home"
            />
          </picture>
        </NavLink>

        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={
            isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav
          id="primary-navigation"
          className={`${styles.navigation} ${isMenuOpen ? styles.navigationOpen : ''}`}
          aria-label="Primary navigation"
        >
          <NavLink className={styles.link} to="/search" onClick={closeMenu}>
            Explore stays
          </NavLink>
          <NavLink className={styles.link} to="/dashboard" onClick={closeMenu}>
            Dashboard
          </NavLink>
          <div className={styles.actions}>
            <NavLink
              className={styles.loginLink}
              to="/login"
              onClick={closeMenu}
            >
              Log in
            </NavLink>
            <NavLink
              className={styles.registerLink}
              to="/register"
              onClick={closeMenu}
            >
              Register
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
