import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { registerUser } from '../../lib/services/authService';
import { ApiError } from '../../lib/services/apiClient';
import { getRandomAboutQuote } from '../../lib/helpers/aboutQuotes';
import styles from './Register.module.css';

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  avatarUrl: string;
  venueManager: boolean;
};

const initialForm: RegisterForm = {
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
  avatarUrl: '',
  venueManager: false,
};

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aboutQuote] = useState(getRandomAboutQuote);

  const updateField = <Field extends keyof RegisterForm>(
    field: Field,
    value: RegisterForm[Field]
  ) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setError('');
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const name = form.username.trim();

    if (!name) {
      setError('Enter a username.');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    if (!email.endsWith('@stud.noroff.no')) {
      setError('Use a stud.noroff.no email address.');
      return;
    }

    if (form.password.length < 8) {
      setError('Your password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.repeatPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await registerUser({
        name,
        email,
        password: form.password,
        venueManager: form.venueManager,
        ...(form.avatarUrl.trim()
          ? {
              avatar: {
                url: form.avatarUrl.trim(),
                alt: `${name} profile picture`,
              },
            }
          : {}),
      });
      navigate('/login');
    } catch (submissionError) {
      setError(
        submissionError instanceof ApiError
          ? submissionError.message
          : 'We could not create your account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.formPanel} aria-labelledby="register-heading">
        <div className={styles.formContent}>
          <div className={styles.heading}>
            <h1 id="register-heading">Create your account</h1>
            <p>Join thousands of travellers discovering exceptional stays.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label>
              <span>
                Username <small>Letters, numbers, and underscores only</small>
              </span>
              <input
                type="text"
                autoComplete="username"
                placeholder="JulesVerne28"
                value={form.username}
                onChange={(event) =>
                  updateField('username', event.target.value)
                }
                required
              />
            </label>

            <label>
              <span>
                Email <small>Must end in @stud.noroff.no</small>
              </span>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@stud.noroff.no"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                required
              />
            </label>

            <label>
              <span>Password</span>
              <span className={styles.passwordField}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(event) =>
                    updateField('password', event.target.value)
                  }
                  minLength={8}
                  required
                />
                <button
                  className={styles.passwordToggle}
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((isVisible) => !isVisible)}
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" />
                  ) : (
                    <Eye aria-hidden="true" />
                  )}
                </button>
              </span>
            </label>

            <label>
              <span>Repeat password</span>
              <span className={styles.passwordField}>
                <input
                  type={showRepeatPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.repeatPassword}
                  onChange={(event) =>
                    updateField('repeatPassword', event.target.value)
                  }
                  required
                />
                <button
                  className={styles.passwordToggle}
                  type="button"
                  aria-label={
                    showRepeatPassword
                      ? 'Hide repeated password'
                      : 'Show repeated password'
                  }
                  onClick={() =>
                    setShowRepeatPassword((isVisible) => !isVisible)
                  }
                >
                  {showRepeatPassword ? (
                    <EyeOff aria-hidden="true" />
                  ) : (
                    <Eye aria-hidden="true" />
                  )}
                </button>
              </span>
            </label>

            <label>
              <span>
                Avatar URL <small>Optional</small>
              </span>
              <input
                type="url"
                autoComplete="url"
                placeholder="https://example.com/avatar.jpg"
                value={form.avatarUrl}
                onChange={(event) =>
                  updateField('avatarUrl', event.target.value)
                }
              />
            </label>

            <label className={styles.managerOption}>
              <input
                type="checkbox"
                checked={form.venueManager}
                onChange={(event) =>
                  updateField('venueManager', event.target.checked)
                }
              />
              <span>
                <strong>Sign up as a Manager</strong>
                <small>
                  You&apos;ll be able to create and manage your own venues
                </small>
              </span>
            </label>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className={styles.signInPrompt}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>

      <aside className={styles.imagePanel} aria-label="Holidaze inspiration">
        <img
          src="/images/photo-1507525428034-b723cf961d3e.jpg"
          alt="Photo of a tropical beach"
        />
        <div className={styles.quote}>
          <strong>
            “{aboutQuote?.quote ?? 'Find your next great stay with Holidaze.'}”
          </strong>
          <span>
            — {aboutQuote?.author ?? 'The Holidaze team'}
            {aboutQuote?.location ? `, ${aboutQuote.location}` : ''}
          </span>
        </div>
      </aside>
    </main>
  );
}

export default Register;
