import aboutQuotesData from '@/assets/mock/about-holidaze.json';

export interface AboutQuote {
  id: number;
  quote: string;
  author: string;
  location: string;
  rating: number;
}

const aboutQuotes = aboutQuotesData as AboutQuote[];

export const getRandomAboutQuote = (): AboutQuote | undefined => {
  if (aboutQuotes.length === 0) return undefined;

  const randomIndex = Math.floor(Math.random() * aboutQuotes.length);
  return aboutQuotes[randomIndex];
};
