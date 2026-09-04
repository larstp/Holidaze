import { useEffect, useState } from 'react';
import styles from './ImageCarousel.module.css';

type ImageCarouselProps = {
  images: string[];
  interval?: number;
  className?: string;
};

function ImageCarousel({
  images,
  interval = 30000,
  className = '',
}: ImageCarouselProps) {
  const [activeImage, setActiveImage] = useState(() =>
    Math.floor(Math.random() * images.length)
  );

  useEffect(() => {
    images.forEach((imageSource) => {
      const image = new Image();
      image.src = imageSource;
    });

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches || images.length < 2) return;

    let timeoutId = window.setTimeout(function rotateImage() {
      setActiveImage((currentImage) => (currentImage + 1) % images.length);
      timeoutId = window.setTimeout(rotateImage, interval);
    }, interval);

    return () => window.clearTimeout(timeoutId);
  }, [images, interval]);

  if (images.length === 0) return null;

  return (
    <div className={`${styles.carousel} ${className}`} aria-hidden="true">
      <div
        key={images[activeImage]}
        className={styles.image}
        style={{ backgroundImage: `url('${images[activeImage]}')` }}
      />
    </div>
  );
}

export default ImageCarousel;
