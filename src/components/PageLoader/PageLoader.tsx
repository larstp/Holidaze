import styles from './PageLoader.module.css';

type PageLoaderProps = {
  label?: string;
  fullScreen?: boolean;
  overlay?: boolean;
};

function PageLoader({
  label = 'Finding your next destination',
  fullScreen = false,
  overlay = false,
}: PageLoaderProps) {
  const className = [
    styles.loaderContainer,
    fullScreen ? styles.fullScreen : '',
    overlay ? styles.overlay : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} role="status" aria-live="polite">
      <span className={styles.label}>{label}</span>
      <div className={styles.loader} aria-hidden="true" />
    </div>
  );
}

export default PageLoader;
