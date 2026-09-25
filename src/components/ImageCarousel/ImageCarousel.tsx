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
  const [loadedImages, setLoadedImages] = useState(
    () => new Set([activeImage])
  );

  useEffect(() => {
    const activeImageSource = images[activeImage];
    const activeImagePreload = new Image();
    activeImagePreload.fetchPriority = 'high';
    activeImagePreload.src = activeImageSource;

    let nextPreloadIndex = 0;
    let isCurrentEffect = true;
    const preloadNextImage = () => {
      while (nextPreloadIndex === activeImage) nextPreloadIndex += 1;
      if (nextPreloadIndex >= images.length) return;

      const indexToLoad = nextPreloadIndex;
      nextPreloadIndex += 1;
      const image = new Image();
      image.fetchPriority = 'low';
      image.onload = () => {
        if (!isCurrentEffect) return;
        setLoadedImages((currentImages) => {
          const nextImages = new Set(currentImages);
          nextImages.add(indexToLoad);
          return nextImages;
        });
        preloadNextImage();
      };
      image.src = images[indexToLoad];
    };

    const deferredPreloadId = window.setTimeout(preloadNextImage, 1500);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches || images.length < 2) {
      return () => window.clearTimeout(deferredPreloadId);
    }

    let timeoutId = window.setTimeout(function rotateImage() {
      setActiveImage((currentImage) => (currentImage + 1) % images.length);
      timeoutId = window.setTimeout(rotateImage, interval);
    }, interval);

    return () => {
      isCurrentEffect = false;
      window.clearTimeout(timeoutId);
      window.clearTimeout(deferredPreloadId);
    };
  }, [activeImage, images, interval]);

  if (images.length === 0) return null;

  return (
    <div className={`${styles.carousel} ${className}`} aria-hidden="true">
      {images.map((imageSource, index) =>
        loadedImages.has(index) ? (
          <div
            className={`${styles.image} ${index === activeImage ? styles.active : ''}`}
            key={imageSource}
            style={{ backgroundImage: `url('${imageSource}')` }}
          />
        ) : null
      )}
    </div>
  );
}

export default ImageCarousel;
