# GraphQL Profile Dashboard

A React single-page application that visualizes your [Reboot01](https://learn.reboot01.com) learning profile using the platform's GraphQL API.

## Features

- **Authentication** — Login with your Reboot01 credentials (Basic Auth → JWT). Session persists across page reloads with automatic token validation.
- **Profile card** — Displays your name, email, audit ratio, current level, total XP, and a breakdown of XP earned per learning path.
- **XP Progression chart** — Area/line chart showing cumulative XP growth across completed projects over time.
- **Skills radar chart** — Radar chart of your top 6 skill transaction amounts.
- **Audit history** — Paginated table (and card view on mobile) of your past audits with status, dates, captain, and path.

## Tech Stack

| Tool            | Purpose                 |
| --------------- | ----------------------- |
| React 19        | UI framework            |
| React Router v7 | Client-side routing     |
| Recharts        | Data visualisation      |
| Vite 7          | Build tool & dev server |
| react-icons     | Icon set                |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Reboot01](https://learn.reboot01.com) account

### Install & run

```bash
npm install
npm run dev
```

Open `https://graphqlmbadawy.netlify.app/` in your browser, then log in with your Reboot01 username/email and password.

### Other scripts

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Project Structure

```
src/
├── components/
│   ├── Auth.jsx        # Login form
│   ├── Dashboard.jsx   # Root layout, fetches all GraphQL data
│   ├── Profile.jsx     # User card + XP-by-path table
│   ├── Graphs.jsx      # Wrapper that arranges the three chart panels
│   ├── FGraph.jsx      # XP progression (area + line chart)
│   ├── SGraph.jsx      # Skills distribution (radar chart)
│   └── Audits.jsx      # Paginated audit history
├── context/
│   └── AuthContext.jsx # JWT auth state, login/logout, token validation
├── queries/
│   ├── UserData.js     # GraphQL queries: user info, XP, level, audits
│   └── GraphQueries.js # GraphQL queries: XP transactions, skills
└── utils/
    └── formatters.js   # Number formatting, XP-by-path helpers
```

## How It Works

1. On login, credentials are Base64-encoded and sent to the Reboot01 `/api/auth/signin` endpoint, which returns a JWT.
2. The JWT is stored in `localStorage` and validated against the GraphQL API on every page load.
3. The `Dashboard` component fires six parallel GraphQL queries on mount and distributes the results to `Profile` and `Graphs`.
4. All charts are responsive — labels and sizing adapt for screens narrower than 768 px.
