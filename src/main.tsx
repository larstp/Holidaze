import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/layout.css';
import './styles/main.css';
import App from './App.tsx';

const savedTheme = localStorage.getItem('holidaze-theme');
document.documentElement.dataset.theme =
  savedTheme === 'dark' ? 'dark' : 'light';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
