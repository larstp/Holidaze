# Holidaze — Accommodation Booking Platform

Holidaze is an accommodation booking platform built with React an TypeScript. Visitors can browse and search venues, customers can make bookings, and venue managers can manage their own venues.

## API code structure

Runtime API code is separated:

- `src/lib/constants/api.ts`: base URL, environment values, and endpoint paths.
- `src/types/api.ts`: shared request, response, venue, booking, and profile types.
- `src/lib/services/apiClient.ts`: fetch wrapper, headers, JSON handling, and typed API errors.
- `src/lib/services/authService.ts`: register and login requests.
- `src/lib/services/venueService.ts`: venue list, search, detail, and manager CRUD.
- `src/lib/services/bookingService.ts`: booking list, detail, create, update, and delete.
- `src/lib/services/profileService.ts`: profile, profile bookings, profile venues, and profile updates.
- `src/context/AuthContext.tsx`: the planned home for the current profile, access token, login, and logout state.

Pages and components should call resource services instead of constructing URLs or fetch headers themselves.

## Useful commands:

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

---

## Project Structure

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
