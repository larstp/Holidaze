import {
  Building2,
  CalendarDays,
  ClipboardList,
  Eye,
  LogOut,
  Pencil,
  Store,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import buttonStyles from '../Button/Button.module.css';
import PageLoader from '../PageLoader/PageLoader';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import styles from './DashboardShell.module.css';

type DashboardShellProps = {
  children: ReactNode;
  overviewHero?: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  desktopAt800?: boolean;
};

function DashboardShell({
  children,
  overviewHero,
  isLoading = false,
  loadingLabel = 'Loading your dashboard',
  desktopAt800 = false,
}: DashboardShellProps) {
  const { profile, logout } = useAuth();

  if (!profile) return null;

  return (
    <main
      className={`${styles.page} ${desktopAt800 ? styles.desktopAt800 : ''}`}
    >
      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Dashboard navigation">
          <div className={styles.profileCard}>
            <ProfileAvatar profile={profile} />
            <div>
              <strong>{profile.name}</strong>
              <small>{profile.email}</small>
            </div>
          </div>
          {overviewHero && (
            <div className={styles.mobileOverviewHero}>{overviewHero}</div>
          )}
          <nav className={styles.sideNav} aria-label="Account sections">
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : '')}
              to={
                profile.venueManager
                  ? '/dashboard/manager/overview'
                  : '/dashboard/overview'
              }
              end
            >
              <Eye aria-hidden="true" /> Overview
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : '')}
              to="/dashboard"
              end
            >
              <CalendarDays aria-hidden="true" /> My Trips
            </NavLink>
            {profile.venueManager && (
              <NavLink
                className={({ isActive }) => (isActive ? styles.active : '')}
                to="/dashboard/manager/venues"
              >
                <Building2 aria-hidden="true" /> My Venues
              </NavLink>
            )}
            {profile.venueManager && (
              <NavLink
                className={({ isActive }) => (isActive ? styles.active : '')}
                to="/dashboard/manager/bookings"
              >
                <ClipboardList aria-hidden="true" /> Incoming Bookings
              </NavLink>
            )}
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : '')}
              to="/dashboard/profile"
            >
              <Pencil aria-hidden="true" /> Profile Settings
            </NavLink>
          </nav>
          {!profile.venueManager && (
            <Link
              className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.small} ${styles.managerLink}`}
              to="/become-manager"
            >
              <Store aria-hidden="true" /> Become a Manager
            </Link>
          )}
          <button
            className={styles.logoutButton}
            type="button"
            onClick={logout}
          >
            <LogOut aria-hidden="true" /> Log out
          </button>
        </aside>
        <section className={styles.content}>
          {isLoading ? (
            <PageLoader label={loadingLabel} />
          ) : (
            <>
              {overviewHero && (
                <div className={styles.desktopOverviewHero}>{overviewHero}</div>
              )}
              {children}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default DashboardShell;
