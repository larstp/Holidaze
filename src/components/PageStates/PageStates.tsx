import { ChevronLeft, House, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import styles from './PageStates.module.css';

type PageStateProps = {
  title: string;
  message: string;
  children?: ReactNode;
};

function PageState({ title, message, children }: PageStateProps) {
  return (
    <main className={styles.page}>
      <section className={styles.content} aria-labelledby="page-state-heading">
        <h1 id="page-state-heading">{title}</h1>
        <p>{message}</p>
        <div className={styles.actions}>{children}</div>
      </section>
    </main>
  );
}

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageState
      title="Page not found"
      message="We could not find the page you were looking for."
    >
      <Button
        variant="secondary"
        size="small"
        icon={<ChevronLeft aria-hidden="true" />}
        onClick={() => navigate(-1)}
      >
        Go back
      </Button>
      <Button
        size="small"
        icon={<RotateCcw aria-hidden="true" />}
        onClick={() => window.location.reload()}
      >
        Try again
      </Button>
      <Button
        variant="secondary"
        size="small"
        icon={<House aria-hidden="true" />}
        onClick={() => navigate('/')}
      >
        Back to home
      </Button>
    </PageState>
  );
}

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <PageState
      title="Access denied"
      message="You do not have permission to view this page."
    >
      <Button
        variant="secondary"
        size="small"
        icon={<ChevronLeft aria-hidden="true" />}
        onClick={() => navigate(-1)}
      >
        Go back
      </Button>
    </PageState>
  );
}

type VenueNotFoundPageProps = {
  onRetry: () => void;
};

export function VenueNotFoundPage({ onRetry }: VenueNotFoundPageProps) {
  const navigate = useNavigate();

  return (
    <PageState
      title="We could not find this venue"
      message="The venue may have been removed or is temporarily unavailable."
    >
      <Button
        variant="secondary"
        size="small"
        icon={<RotateCcw aria-hidden="true" />}
        onClick={onRetry}
      >
        Try again
      </Button>
      <Button
        variant="secondary"
        size="small"
        icon={<House aria-hidden="true" />}
        onClick={() => navigate('/')}
      >
        Back to home
      </Button>
    </PageState>
  );
}
