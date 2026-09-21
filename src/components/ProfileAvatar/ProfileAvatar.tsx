import { useState } from 'react';
import type { ProfileSummary } from '../../types/api';
import styles from './ProfileAvatar.module.css';

type ProfileAvatarProps = {
  profile: ProfileSummary;
  className?: string;
};

function ProfileAvatar({ profile, className = '' }: ProfileAvatarProps) {
  const avatarClassName = `${styles.avatar} ${className}`.trim();
  const [hasAvatarError, setHasAvatarError] = useState(false);

  if (profile.avatar?.url && !hasAvatarError) {
    return (
      <img
        className={avatarClassName}
        src={profile.avatar.url}
        alt={profile.avatar.alt || `${profile.name} profile`}
        loading="lazy"
        decoding="async"
        onError={() => setHasAvatarError(true)}
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
