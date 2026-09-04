import styles from './PageLoader.module.css';

type PageLoaderProps = {
  label?: string;
};

function PageLoader({
  label = 'Finding your next destination',
}: PageLoaderProps) {
  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <span className={styles.label}>{label}</span>
      <div className={styles.loader} aria-hidden="true" />
    </div>
  );
}

export default PageLoader;
