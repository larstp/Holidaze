import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import buttonStyles from '../../components/Button/Button.module.css';
import { useAuth } from '../../context/useAuth';
import { ApiError } from '../../lib/services/apiClient';
import { updateProfile } from '../../lib/services/profileService';
import styles from './EditProfile.module.css';

function EditProfile() {
  const navigate = useNavigate();
  const { accessToken, profile, setProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar?.url ?? '');
  const [bannerUrl, setBannerUrl] = useState(profile?.banner?.url ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [failedAvatarPreview, setFailedAvatarPreview] = useState<string | null>(
    null
  );
  const [failedBannerPreview, setFailedBannerPreview] = useState<string | null>(
    null
  );
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!profile || !accessToken) return null;

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const response = await updateProfile(
        profile.name,
        {
          bio: bio.trim(),
          avatar: avatarUrl.trim()
            ? { url: avatarUrl.trim(), alt: `${profile.name} profile` }
            : undefined,
          banner: bannerUrl.trim()
            ? { url: bannerUrl.trim(), alt: `${profile.name} profile banner` }
            : undefined,
        },
        accessToken
      );
      if (response?.data) setProfile(response.data);
      navigate('/dashboard/profile');
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'We could not save your profile. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Link className={styles.backLink} to="/dashboard/profile">
          <ChevronLeft aria-hidden="true" /> Back to profile settings
        </Link>
        <h1>Edit profile</h1>
        <p className={styles.intro}>
          Update your public profile and account settings.
        </p>

        <section className={styles.section} aria-labelledby="photos-heading">
          <h2 id="photos-heading">Profile photos</h2>
          <div
            className={styles.photoPreviews}
            aria-label="Live photo previews"
          >
            <div className={styles.bannerPreview}>
              {bannerUrl && bannerUrl !== failedBannerPreview ? (
                <img
                  src={bannerUrl}
                  alt="Live profile banner preview"
                  onError={() => setFailedBannerPreview(bannerUrl)}
                />
              ) : (
                <span>Banner preview</span>
              )}
            </div>
            <div className={styles.avatarPreview}>
              {avatarUrl && avatarUrl !== failedAvatarPreview ? (
                <img
                  src={avatarUrl}
                  alt="Live profile avatar preview"
                  onError={() => setFailedAvatarPreview(avatarUrl)}
                />
              ) : (
                <span aria-hidden="true">{profile.name.charAt(0)}</span>
              )}
            </div>
          </div>
          <label>
            Banner URL
            <input
              type="url"
              value={bannerUrl}
              onChange={(event) => setBannerUrl(event.target.value)}
              placeholder="https://example.com/banner.jpg"
            />
          </label>
          <label>
            Avatar URL
            <input
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </label>
        </section>

        <section className={styles.section} aria-labelledby="personal-heading">
          <h2 id="personal-heading">Personal information</h2>
          <label>
            Display name <small>Name changes are not available here.</small>
            <input value={profile.name} disabled />
          </label>
          <label>
            Email <small>Email changes are not available here.</small>
            <input value={profile.email} disabled />
          </label>
          <label>
            Bio
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={4}
              placeholder="Tell travellers a little about yourself"
            />
          </label>
        </section>

        <section className={styles.section} aria-labelledby="account-heading">
          <h2 id="account-heading">Account type</h2>
          <label>
            Password <small>Password changes are not available here yet.</small>
            <input value="••••••••" disabled />
          </label>
          <label className={styles.disabledToggle}>
            Manager account
            <input
              type="checkbox"
              checked={profile.venueManager}
              disabled
              readOnly
            />
          </label>
        </section>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <Link
            className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.small} ${styles.cancelButton}`}
            to="/dashboard/profile"
          >
            Cancel
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving changes...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </main>
  );
}

export default EditProfile;
