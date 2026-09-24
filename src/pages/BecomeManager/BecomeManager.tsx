import { Headphones, LineChart, ShieldCheck, Globe2 } from 'lucide-react';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import buttonStyles from '../../components/Button/Button.module.css';
import { useAuth } from '../../context/useAuth';
import { ApiError } from '../../lib/services/apiClient';
import { updateProfile } from '../../lib/services/profileService';
import styles from './BecomeManager.module.css';

const benefits = [
  {
    icon: Globe2,
    title: 'Global reach',
    text: 'Your venue is visible to 50,000+ active travellers from over 80 countries.',
  },
  {
    icon: LineChart,
    title: 'Simple dashboard',
    text: 'Manage bookings, availability, and pricing all from one clear interface.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure payments',
    text: 'Payouts land in your account within 24 hours of each guest check-in.',
  },
  {
    icon: Headphones,
    title: 'Dedicated support',
    text: 'Our manager support team is available 7 days a week via chat and email.',
  },
];

const steps = [
  [
    '01',
    'Create an account',
    'Register with your Noroff email and select Manager during sign-up, or upgrade any time from your dashboard.',
  ],
  [
    '02',
    'List your venue',
    'Add photos, a description, pricing, and availability. It takes about 10 minutes to go live.',
  ],
  [
    '03',
    'Welcome your guests',
    'Confirm bookings once they arrive already briefed. You focus on the experience.',
  ],
];

type BecomeManagerProps = {
  upgradeOnly?: boolean;
};

function BecomeManager({ upgradeOnly = false }: BecomeManagerProps) {
  const { accessToken, isAuthenticated, profile, setProfile } = useAuth();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (upgradeOnly && !isAuthenticated)
    return <Navigate to="/register" replace />;

  const handleManagerUpgrade = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!accessToken || !profile) return;

    if (!isConfirmed || !hasAcceptedTerms) {
      setError('Confirm the manager role and accept the terms to continue.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateProfile(
        profile.name,
        { venueManager: true },
        accessToken
      );
      if (response?.data) setProfile(response.data);
      setSuccess('You are now set up as a venue manager.');
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'We could not update your account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated && upgradeOnly) {
    return (
      <main className={styles.accountPage}>
        <section
          className={styles.accountPanel}
          aria-labelledby="manager-heading"
        >
          <p className={styles.eyebrow}>For venue managers</p>
          <h1 id="manager-heading">
            {profile?.venueManager
              ? 'You are a venue manager'
              : 'Make room for more good stays.'}
          </h1>
          <p className={styles.accountIntro}>
            {profile?.venueManager
              ? 'You can now create and manage venues, view bookings, and welcome guests through Holidaze.'
              : 'Turn your place into a destination. As a manager, you can list venues, manage availability, and host curious travellers.'}
          </p>

          {!profile?.venueManager && (
            <>
              <ul className={styles.rules}>
                <li>Only list venues you own or are authorised to manage.</li>
                <li>Keep availability, pricing, and venue details accurate.</li>
                <li>Respond to guests and honour confirmed bookings.</li>
              </ul>

              <form
                className={styles.managerForm}
                onSubmit={handleManagerUpgrade}
              >
                <label className={styles.checkOption}>
                  <input
                    type="checkbox"
                    checked={isConfirmed}
                    onChange={(event) => {
                      setIsConfirmed(event.target.checked);
                      setError('');
                    }}
                  />
                  <span>Make me a venue manager</span>
                </label>
                <label className={styles.checkOption}>
                  <input
                    type="checkbox"
                    checked={hasAcceptedTerms}
                    onChange={(event) => {
                      setHasAcceptedTerms(event.target.checked);
                      setError('');
                    }}
                  />
                  <span>
                    I accept the <a href="#terms">terms &amp; conditions</a>
                  </span>
                </label>
                {error && (
                  <p className={styles.feedbackError} role="alert">
                    {error}
                  </p>
                )}
                {success && (
                  <p className={styles.feedbackSuccess} role="status">
                    {success}
                  </p>
                )}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating account...' : 'Become a manager'}
                </Button>
              </form>
            </>
          )}

          {profile?.venueManager && (
            <Link
              className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.small} ${styles.primaryLink}`}
              to="/venues/create"
            >
              Create your first venue
            </Link>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className={styles.publicPage}>
      <section className={styles.publicHero}>
        <img
          src="/images/drif-riadh-YpkuRn54y4w-unsplash.jpg"
          alt="The Grand Canyon with a river running through it"
        />
        <div className={styles.heroOverlay} />
        <div className={styles.publicHeroContent}>
          <p className={styles.eyebrow}>For managers</p>
          <h1>List your venue on Holidaze</h1>
          <p>
            Turn your space into a destination. Reach thousands of travellers
            and earn on your schedule.
          </p>
          <Link
            className={`${buttonStyles.button} ${buttonStyles.tertiary} ${buttonStyles.small} ${styles.heroButton}`}
            to={isAuthenticated ? '/become-manager/upgrade' : '/register'}
          >
            Get started
          </Link>
        </div>
      </section>

      <section
        className={styles.benefitsSection}
        aria-labelledby="benefits-heading"
      >
        <div className={styles.sectionContent}>
          <h2 id="benefits-heading">Why list with Holidaze?</h2>
          <p>Everything you need to host with confidence.</p>
          <div className={styles.benefitGrid}>
            {benefits.map(({ icon: Icon, title, text }) => (
              <article className={styles.benefit} key={title}>
                <span className={styles.benefitIcon}>
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.stepsSection} aria-labelledby="steps-heading">
        <div className={styles.sectionContent}>
          <h2 id="steps-heading">How it works</h2>
          <div className={styles.stepsGrid}>
            {steps.map(([number, title, text]) => (
              <article className={styles.step} key={number}>
                <strong>{number}</strong>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.publicCta}>
        <img
          src="/images/anete-lusina-GOZxrAlNIt4-unsplash.jpg"
          alt="Travel gear and a photograph on a wooden table"
        />
        <div className={styles.heroOverlay} />
        <div className={styles.ctaContent}>
          <h2>Ready to start hosting?</h2>
          <p>Create your free account and list your first venue today.</p>
          <div className={styles.ctaActions}>
            <Link
              className={`${buttonStyles.button} ${buttonStyles.tertiary} ${buttonStyles.small} ${styles.heroButton}`}
              to={isAuthenticated ? '/become-manager/upgrade' : '/register'}
            >
              Register as Manager
            </Link>
            <Link
              className={`${buttonStyles.button} ${buttonStyles.secondaryDark} ${buttonStyles.small} ${styles.darkButton}`}
              to={isAuthenticated ? '/become-manager/upgrade' : '/login'}
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BecomeManager;
