import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import type { Profile } from '../../types/api';
import styles from './ProfileHero.module.css';

type ProfileHeroProps = {
  profile: Profile;
  headingId?: string;
};

function ProfileHero({ profile, headingId }: ProfileHeroProps) {
  return (
    <div
      className={styles.profileHero}
      style={
        profile.banner?.url
          ? { backgroundImage: `url("${profile.banner.url}")` }
          : undefined
      }
    >
      <div className={styles.profileHeroOverlay} />
      <ProfileAvatar profile={profile} className={styles.avatar} />
      <div className={styles.profileHeroContent}>
        <h1 id={headingId}>Welcome back, {profile.name}</h1>
        {profile.bio && <p>{profile.bio}</p>}
      </div>
    </div>
  );
}

export default ProfileHero;
