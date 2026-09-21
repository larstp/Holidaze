import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/layout.css';
import './styles/main.css';
import App from './App.tsx';

const savedTheme = localStorage.getItem('holidaze-theme');
const prefersDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;
const initialTheme =
  savedTheme === 'dark' || savedTheme === 'light'
    ? savedTheme
    : prefersDarkMode
      ? 'dark'
      : 'light';

document.documentElement.dataset.theme = initialTheme;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
