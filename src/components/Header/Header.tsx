import { LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import buttonStyles from '../Button/Button.module.css';
import { useAuth } from '../../context/useAuth';
import styles from './Header.module.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => document.documentElement.dataset.theme === 'dark'
  );
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const { isAuthenticated, profile, logout } = useAuth();
  const dashboardPath = profile?.venueManager
    ? '/dashboard/manager/overview'
    : '/dashboard';
  const navigationRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setIsMenuOpen(false);

  const toggleMenu = () => {
    if (!isMenuOpen) setIsMenuVisible(true);
    setIsMenuOpen((isOpen) => !isOpen);
  };

  useEffect(() => {
    if (isMenuOpen) return;

    const timeoutId = window.setTimeout(() => setIsMenuVisible(false), 220);
    return () => window.clearTimeout(timeoutId);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        navigationRef.current?.contains(target) ||
        menuButtonRef.current?.contains(target)
      ) {
        return;
      }

      closeMenu();
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () =>
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [isMenuOpen]);

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
          ref={navigationRef}
          id="primary-navigation"
          className={`${styles.navigation} ${isMenuOpen ? styles.navigationOpen : ''} ${isMenuVisible && !isMenuOpen ? styles.navigationClosing : ''}`}
          aria-label="Primary navigation"
        >
          <NavLink
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.navLinkActive : ''}`
            }
            to="/"
            end
            onClick={closeMenu}
          >
            Home
          </NavLink>
          {isAuthenticated && (
            <NavLink
              className={({ isActive }) =>
                `${styles.link} ${styles.mobileOnlyLink} ${isActive ? styles.navLinkActive : ''}`
              }
              to={dashboardPath}
              onClick={closeMenu}
            >
              Profile
            </NavLink>
          )}
          <NavLink
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.navLinkActive : ''}`
            }
            to="/search"
            end
            onClick={closeMenu}
          >
            Search
          </NavLink>
          <NavLink className={styles.link} to="/search" end onClick={closeMenu}>
            All venues
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${styles.listLink} ${isActive ? styles.navLinkActive : ''}`
            }
            to={
              isAuthenticated && profile?.venueManager
                ? '/venues/create'
                : '/become-manager'
            }
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
            {isAuthenticated ? (
              <NavLink
                className={`${styles.profileLink} ${styles.desktopOnlyProfile}`}
                to={dashboardPath}
                onClick={closeMenu}
                aria-label="Open your dashboard"
                title="Open your dashboard"
              >
                {profile?.avatar?.url &&
                profile.avatar.url !== failedAvatarUrl ? (
                  <img
                    className={styles.profileAvatar}
                    src={profile.avatar.url}
                    alt=""
                    aria-hidden="true"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onError={() =>
                      setFailedAvatarUrl(profile.avatar?.url ?? null)
                    }
                  />
                ) : (
                  <span className={styles.profileInitial} aria-hidden="true">
                    {profile?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </NavLink>
            ) : (
              <>
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
              </>
            )}
            {isAuthenticated && (
              <button
                className={styles.mobileLogout}
                type="button"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                <LogOut aria-hidden="true" />
                <span>Log out</span>
              </button>
            )}
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
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={
            isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}

export default Header;
