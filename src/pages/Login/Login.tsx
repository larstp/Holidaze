import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/useAuth';
import { getRandomAboutQuote } from '../../lib/helpers/aboutQuotes';
import { ApiError } from '../../lib/services/apiClient';
import { loginUser } from '../../lib/services/authService';
import { getProfile } from '../../lib/services/profileService';
import styles from './Login.module.css';

type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const initialForm: LoginForm = {
  email: '',
  password: '',
  rememberMe: false,
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken, setProfile } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aboutQuote] = useState(getRandomAboutQuote);

  const updateField = <Field extends keyof LoginForm>(
    field: Field,
    value: LoginForm[Field]
  ) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setError('');
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();

    if (!email || !form.password) {
      setError('Enter your email and password.');
      return;
    }

    if (!email.endsWith('@stud.noroff.no')) {
      setError('Use a stud.noroff.no email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await loginUser({ email, password: form.password });
      const accessToken = response?.data.accessToken;

      if (!accessToken) {
        throw new Error('The login response did not include an access token.');
      }

      const profileResponse = await getProfile(
        response.data.name,
        '',
        accessToken
      );
      const loggedInProfile = profileResponse?.data ?? response.data;
      setAccessToken(accessToken, form.rememberMe);
      setProfile(loggedInProfile, form.rememberMe);
      const requestedDestination = (location.state as { from?: string } | null)
        ?.from;
      const destination =
        requestedDestination ??
        (loggedInProfile.venueManager
          ? '/dashboard/manager/overview'
          : '/dashboard');
      navigate(destination, { replace: true });
    } catch (submissionError) {
      setAccessToken(null);
      setProfile(null);
      setError(
        submissionError instanceof ApiError
          ? submissionError.message
          : 'We could not sign you in. Check your details and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <aside className={styles.imagePanel} aria-label="Holidaze inspiration">
        <img
          src="/images/karsten-winegeart-fd1cQ3mmBTE-unsplash.jpg"
          alt="A peaceful nature resort in Hawaii"
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

      <section className={styles.formPanel} aria-labelledby="login-heading">
        <div className={styles.formContent}>
          <div className={styles.heading}>
            <h1 id="login-heading">Welcome back</h1>
            <p>Sign in to manage your bookings and venues.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label>
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
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
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(event) =>
                    updateField('password', event.target.value)
                  }
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

            <div className={styles.formOptions}>
              <label className={styles.rememberOption}>
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(event) =>
                    updateField('rememberMe', event.target.checked)
                  }
                />
                <span>Remember me</span>
              </label>
              <span className={styles.forgotPassword}>Forgot password?</span>
            </div>

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
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className={styles.registerPrompt}>
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
