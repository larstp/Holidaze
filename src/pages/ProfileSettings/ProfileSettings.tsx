import { Pencil } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import buttonStyles from '../../components/Button/Button.module.css';
import ProfileAvatar from '../../components/ProfileAvatar/ProfileAvatar';
import DashboardShell from '../../components/DashboardShell/DashboardShell';
import PageLoader from '../../components/PageLoader/PageLoader';
import { useAuth } from '../../context/useAuth';
import styles from './ProfileSettings.module.css';

function ProfileSettings() {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();

  if (!isAuthenticated || !profile) {
    navigate('/login', { replace: true });
    return <PageLoader label="Loading your profile" />;
  }

  return (
    <DashboardShell>
      <section className={styles.panel} aria-labelledby="profile-heading">
        <div className={styles.headingRow}>
          <div>
            <h1 id="profile-heading">Profile settings</h1>
            <p>Review your public profile and account settings.</p>
          </div>
          <Link
            className={`${buttonStyles.button} ${buttonStyles.primary} ${styles.editButton}`}
            to="/dashboard/profile/edit"
          >
            <Pencil aria-hidden="true" /> Edit profile
          </Link>
        </div>

        <div className={styles.profileHeader}>
          <ProfileAvatar profile={profile} />
          <div>
            <strong>{profile.name}</strong>
            <small>{profile.email}</small>
          </div>
        </div>

        <dl className={styles.details}>
          <div>
            <dt>Display name</dt>
            <dd>{profile.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt>Account type</dt>
            <dd>{profile.venueManager ? 'Venue manager' : 'Traveller'}</dd>
          </div>
          <div>
            <dt>Password</dt>
            <dd>••••••••</dd>
          </div>
        </dl>

        <div className={styles.dangerZone}>
          <strong>Danger zone</strong>
          <button type="button" disabled>
            Delete account
          </button>
        </div>
      </section>
    </DashboardShell>
  );
}

export default ProfileSettings;
