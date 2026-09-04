import reviewsData from '@/assets/mock/reviews.json';

export interface Review {
  id: number;
  rating: number;
  author: string;
  subtitle: string;
  comment: string;
}

const reviews: Review[] = reviewsData as Review[];

export const getRandomReviews = (count: number = 3): Review[] => {
  const shuffled = [...reviews];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, count);
};

export const getRandomReview = (): Review | undefined => {
  const randomIndex = Math.floor(Math.random() * reviews.length);
  return reviews[randomIndex];
};
