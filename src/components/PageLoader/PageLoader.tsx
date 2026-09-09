import styles from './PageLoader.module.css';

type PageLoaderProps = {
  label?: string;
  fullScreen?: boolean;
};

function PageLoader({
  label = 'Finding your next destination',
  fullScreen = false,
}: PageLoaderProps) {
  return (
    <div
      className={`${styles.loaderContainer} ${fullScreen ? styles.fullScreen : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.label}>{label}</span>
      <div className={styles.loader} aria-hidden="true" />
    </div>
  );
}

export default PageLoader;
