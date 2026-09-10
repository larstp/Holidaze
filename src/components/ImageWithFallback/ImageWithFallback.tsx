import { useState } from 'react';
import styles from './ImageWithFallback.module.css';

type ImageWithFallbackProps = {
  src?: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
};

function ImageWithFallback({
  src,
  alt,
  className = '',
  loading = 'eager',
  fetchPriority = 'auto',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(!src);

  if (hasError) {
    return (
      <span className={styles.fallback} role="img" aria-label={alt}>
        <img
          className={styles.logo}
          src="/images/logos/Logo-Black.svg"
          alt=""
          aria-hidden="true"
        />
        <span>
          Oops, this image missed its flight. We&apos;ll be right back.
        </span>
      </span>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
}

export default ImageWithFallback;
