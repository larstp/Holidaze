import styles from './PageLoader.module.css';

type PageLoaderProps = {
  label?: string;
};

function PageLoader({ label = 'Loading page' }: PageLoaderProps) {
  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.loader} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default PageLoader;
