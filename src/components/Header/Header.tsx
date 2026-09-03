import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import buttonStyles from '../Button/Button.module.css';
import styles from './Header.module.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => document.documentElement.dataset.theme === 'dark'
  );

  const closeMenu = () => setIsMenuOpen(false);

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('holidaze-theme', nextTheme);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink className={styles.logoLink} to="/" onClick={closeMenu}>
          <span className={styles.logoGroup}>
            <img
              className={`${styles.logo} ${styles.logoLight}`}
              src="/images/logos/Logo-header+footerL-Black.svg"
              alt=""
              aria-hidden="true"
            />
            <img
              className={`${styles.logo} ${styles.logoDark}`}
              src="/images/logos/Logo-header+footerL-white.svg"
              alt=""
              aria-hidden="true"
            />
            <span className={styles.wordmark}>Holidaze</span>
          </span>
        </NavLink>

        <nav
          id="primary-navigation"
          className={`${styles.navigation} ${isMenuOpen ? styles.navigationOpen : ''}`}
          aria-label="Primary navigation"
        >
          <NavLink
            className={styles.exploreLink}
            to="/search"
            onClick={closeMenu}
          >
            Explore
          </NavLink>
          <NavLink className={styles.link} to="/search" onClick={closeMenu}>
            Search
          </NavLink>
          <NavLink
            className={styles.listLink}
            to="/become-manager"
            onClick={closeMenu}
          >
            List your venue
          </NavLink>
          <div className={styles.actions}>
            <button
              className={styles.themeButton}
              type="button"
              aria-label={isDarkMode ? 'Use light mode' : 'Use dark mode'}
              title={isDarkMode ? 'Use light mode' : 'Use dark mode'}
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <Sun aria-hidden="true" />
              ) : (
                <Moon aria-hidden="true" />
              )}
            </button>
            <NavLink
              className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.small} ${styles.loginLink}`}
              to="/login"
              onClick={closeMenu}
            >
              Sign in
            </NavLink>
            <NavLink
              className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.small} ${styles.registerLink}`}
              to="/register"
              onClick={closeMenu}
            >
              Register
            </NavLink>
          </div>
        </nav>

        <button
          className={styles.mobileThemeButton}
          type="button"
          aria-label={isDarkMode ? 'Use light mode' : 'Use dark mode'}
          title={isDarkMode ? 'Use light mode' : 'Use dark mode'}
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <Sun aria-hidden="true" />
          ) : (
            <Moon aria-hidden="true" />
          )}
        </button>

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
      </div>
    </header>
  );
}

export default Header;
