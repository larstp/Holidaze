import { useState } from 'react';
import styles from './ImageWithFallback.module.css';

type ImageWithFallbackProps = {
  src?: string;
  alt: string;
  className?: string;
};

function ImageWithFallback({
  src,
  alt,
  className = '',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(!src);

  if (hasError) {
    return (
      <span
        className={`${styles.fallback} ${className}`}
        role="img"
        aria-label={alt}
      >
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
      onError={() => setHasError(true)}
    />
  );
}

export default ImageWithFallback;
