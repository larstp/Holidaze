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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUrl: string;
  venueManager: boolean;
};

const initialForm: RegisterForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  avatarUrl: '',
  venueManager: false,
};

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
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
    const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Enter your first and last name.');
      return;
    }

    if (!email.endsWith('@stud.noroff.no') && !email.endsWith('@noroff.no')) {
      setError('Use a stud.noroff.no or noroff.no email address.');
      return;
    }

    if (form.password.length < 8) {
      setError('Your password must be at least 8 characters.');
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
            <div className={styles.nameFields}>
              <label>
                <span>First name</span>
                <input
                  type="text"
                  autoComplete="given-name"
                  placeholder="Ada"
                  value={form.firstName}
                  onChange={(event) =>
                    updateField('firstName', event.target.value)
                  }
                  required
                />
              </label>
              <label>
                <span>Last name</span>
                <input
                  type="text"
                  autoComplete="family-name"
                  placeholder="Lovelace"
                  value={form.lastName}
                  onChange={(event) =>
                    updateField('lastName', event.target.value)
                  }
                  required
                />
              </label>
            </div>

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
          alt="Aerial view of a tropical beach"
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
