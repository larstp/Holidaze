import type { ProfileSummary } from '../../types/api';
import styles from './ProfileAvatar.module.css';

type ProfileAvatarProps = {
  profile: ProfileSummary;
  className?: string;
};

function ProfileAvatar({ profile, className = '' }: ProfileAvatarProps) {
  const avatarClassName = `${styles.avatar} ${className}`.trim();

  if (profile.avatar?.url) {
    return (
      <img
        className={avatarClassName}
        src={profile.avatar.url}
        alt={profile.avatar.alt || `${profile.name} profile`}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <span className={avatarClassName} aria-hidden="true">
      {profile.name.charAt(0).toUpperCase()}
    </span>
  );
}

export default ProfileAvatar;
