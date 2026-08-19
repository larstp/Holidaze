# Holidaze — Accommodation Booking Platform

This README is currently a placeholder and will be updated with full documentation, setup guides, and project links upon completion.

---

## 📁 Project Structure

```text
Holidaze/
├── .husky/                  # Git pre-commit hooks
├── public/                  # Static public assets
├── src/
│   ├── assets/              # Static media (images, SVGs)
│   ├── components/          # Reusable UI components (co-located CSS Modules)
│   │   ├── Button/
│   │   ├── Footer/
│   │   └── Header/
│   ├── context/             # Global React Contexts (Auth, State)
│   ├── hooks/               # Custom React hooks (Data fetching, logic)
│   ├── lib/
│   │   ├── constants/       # API endpoints and configuration
│   │   ├── helpers/         # Utility functions
│   │   └── services/        # API client and network requests
│   ├── pages/               # Page components & page-specific styles
│   │   ├── Home/
│   │   └── User/
│   ├── styles/              # Global styles, layout, and CSS variables
│   │   ├── layout.css
│   │   └── main.css
│   ├── types/               # TypeScript interfaces & types
│   ├── App.tsx              # Main App wrapper & Router setup
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite TypeScript declaration types
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
