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
import PageLoader from '../PageLoader/PageLoader';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import styles from './DashboardShell.module.css';

type DashboardShellProps = {
  children: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
};

function DashboardShell({
  children,
  isLoading = false,
  loadingLabel = 'Loading your dashboard',
}: DashboardShellProps) {
  const { profile, logout } = useAuth();

  if (!profile) return null;

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Dashboard navigation">
          <div className={styles.profileCard}>
            <ProfileAvatar profile={profile} />
            <div>
              <strong>{profile.name}</strong>
              <small>{profile.email}</small>
            </div>
          </div>
          <nav className={styles.sideNav} aria-label="Account sections">
            {profile.venueManager && (
              <NavLink
                className={({ isActive }) => (isActive ? styles.active : '')}
                to="/dashboard/manager/overview"
                end
              >
                <Eye aria-hidden="true" /> Overview
              </NavLink>
            )}
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
              <Pencil aria-hidden="true" /> Profile settings
            </NavLink>
          </nav>
          {!profile.venueManager && (
            <Link className={styles.managerLink} to="/become-manager">
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
          {isLoading ? <PageLoader label={loadingLabel} /> : children}
        </section>
      </div>
    </main>
  );
}

export default DashboardShell;
