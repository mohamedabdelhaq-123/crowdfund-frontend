# OasisFund Frontend

The React frontend for **OasisFund** (also branded as **FundEgypt**) — an Egyptian crowdfunding platform. Built with React 19, TypeScript, and TailwindCSS v4, it communicates with the Django REST API backend exclusively via httpOnly cookies, with no tokens ever stored in `localStorage`.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Pages & Features](#pages--features)
- [State Management](#state-management)
- [API Layer](#api-layer)
- [Form Validation](#form-validation)
- [Routing](#routing)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)

---

## Tech Stack

| Category | Library / Tool |
|---|---|
| UI Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Server State | TanStack Query v5 |
| Client State | Redux Toolkit |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (with interceptors) |
| Animations | Framer Motion |
| Carousel | Swiper |
| Icons | Lucide React + Google Material Symbols |
| Toasts | react-hot-toast |
| Date Utilities | date-fns |
| Package Manager | pnpm |
| Build Tool | Vite 8 |

---

## Architecture Overview

The app follows a clean separation between server state (TanStack Query), client/auth state (Redux), and UI rendering (React components).

```
src/
├── api/          → Axios functions, one file per domain
├── components/   → Reusable UI components and feature components
├── hooks/        → Custom hooks wrapping TanStack Query mutations/queries
├── pages/        → Route-level page components
├── store/        → Redux store + authSlice
├── types/        → TypeScript interfaces mirroring backend models
└── validation/   → Zod schemas for all forms
```

**Authentication flow:** On every app load, `App.tsx` dispatches `checkAuth()`, which calls `GET /auth/me/`. If the httpOnly cookie is valid, Redux is populated with the user. If it returns 401, the Axios interceptor silently calls `POST /auth/token/refresh/` and retries the original request. If the refresh also fails, the user is redirected to `/login?reason=session_expired`.

---

## Pages & Features

### Home Page (`/`)
- **Featured Hero** — full-screen Swiper carousel with fade effect and autoplay, showing featured projects
- **Category Gallery** — responsive grid of all categories with Unsplash cover images; clicking a category filters the project grid
- **Top Rated** — section showing the highest-rated projects (hidden when a search/filter is active)
- **Search & Discovery** — URL-driven search using `?q=` and `?c=` query params; state persists on refresh and is shareable as a link
- **Auto-scroll** — page smoothly scrolls to results when a search or category filter is applied
- **Pagination** — previous/next controls when filtered results exceed the page size
- **Active Filter Chips** — visual indicators for the current search query and selected category, with one-click clear
- **Normalization layer** — handles both paginated `{count, results}` objects and bare arrays from the search endpoint without crashing

### Project Details Page (`/projects/:id`)
- Image gallery with a custom bullet-based carousel
- Star rating display (rounded to nearest integer)
- Funding progress bar with percentage
- **Donate Now** button — disabled and replaced with "Donations Closed" when the project is cancelled
- Project tags displayed as pills
- Creator card with avatar
- Project start/end dates in the sidebar
- **Similar Projects** section (fetched by shared tags)
- **Community Voices** — full comment section (see below)

### Donation Page (`/projects/:id/donate`) — *Protected*
- Quick-select preset amounts (50, 100, 500 EGP)
- Free-entry amount input with Zod validation (minimum 10 EGP)
- Navigates back to the project page on success

### Auth Pages
- **Register** (`/register`) — full registration form with optional profile picture upload (preview before submit), Egyptian phone number validation, password confirmation, multipart/form-data submission
- **Login** (`/login`) — email/password form; shows a "Resend Activation" inline button if the backend returns `not_activated: true`; displays a session-expired banner when redirected with `?reason=session_expired`
- **Activate** (`/activate/:token`) — standalone page (no layout/navbar) that handles 4 states: `loading`, `success`, `already`, `expired`, `invalid`; the expired state shows a resend form with a 120-second client-side cooldown matching the backend's 2-minute rate limit

### Profile Page (`/profile`) — *Protected*
Three-tab layout with a persistent sidebar on desktop:

- **My Projects tab** — paginated grid (6 per page) of own projects with funding progress, status badge, and a cancel button that triggers a confirmation modal before calling the API
- **My Donations tab** — card grid of all donations with project name, amount, and date
- **Edit Profile tab** — inline form with live avatar preview; sends `multipart/form-data` if a new image is selected, otherwise JSON; account deletion is at the bottom of this tab behind a password confirmation modal

### Public Profile Page (`/profile/:id`) — *Protected*
Displays another user's avatar, name, country, Facebook link, and their public (pending) projects in a read-only `MyProjectsTab` with "View & Donate" links.

### Project Create Form (`/start-a-project`) — *Protected*
- Title, category dropdown (fetched from API), details, target amount, date range, comma-separated tags, and multi-image upload with live previews and per-image delete
- Navigates to the new project's detail page on success

### Project Edit Form (`/projects/:id/edit`) — *Protected*
Shares the same form structure as the create form. *(See Known Limitations.)*

---

## State Management

Redux Toolkit manages only authentication state — everything else uses TanStack Query.

```
store.auth
├── user: AuthUser | null     → { id, email, first_name, last_name, role, profile_pic }
├── isAuthenticated: boolean
└── isLoading: boolean        → starts true to prevent ProtectedRoute flash-redirect
```

**Async thunks:**

- `checkAuth` — calls `GET /auth/me/` on app mount; populates state from the cookie
- `logout` — calls `POST /auth/logout/` then clears state even on failure (cookie may already be gone)

**Sync actions:**

- `setCredentials(user)` — used after a successful login response
- `clearCredentials()` — used after account deletion

---

## API Layer

All API calls go through a single Axios instance in `src/api/client.ts`, configured with `withCredentials: true` so browsers automatically attach httpOnly cookies on every request.

**Interceptor logic:**

1. If a response is `401` and the request is not already a retry or a refresh call → silently POST to `/auth/token/refresh/` to get a new access token cookie
2. If the refresh succeeds → automatically retry the original request
3. If the refresh fails → redirect to `/login?reason=session_expired`

The API is split into domain files:

| File | Responsibility |
|---|---|
| `client.ts` | Axios instance + 401 interceptor |
| `home.ts` | Homepage feed data |
| `projects.ts` | Project list, search, similar projects |
| `projects-details.ts` | Project CRUD, image management |
| `category.ts` | Category list |
| `comments.ts` | Comment CRUD + reporting |
| `donations.ts` | Donate to a project |

---

## Form Validation

All forms use **React Hook Form** + **Zod** for schema-based validation.

**Auth schemas** (`authSchema.ts`):
- `registerSchema` — validates name, email, Egyptian phone regex (`/^01[0125][0-9]{8}$/`), password min-length 8, password confirmation match, optional birthdate/Facebook/country
- `loginSchema` — email and non-empty password

**Project schema** (`projectSchema.ts`):
- Required title (max 255), details, positive target amount, start date, end date
- Cross-field refinement: end date must be after start date
- Optional tags (string — split by comma before submission) and images (max 5 files)

---

## Routing

Routing is handled by React Router v7 with `createBrowserRouter`. Routes are structured as follows:

```
/activate/:token          → ActivatePage (standalone — no Layout)
/                         → Layout (navbar + footer wrapper)
  /                       → HomePage
  /register               → RegisterPage
  /login                  → LoginPage
  /projects/:id           → ProjectDetailsPage
  <ProtectedRoute>        → Requires authentication (redirects to /login)
    /profile              → ProfilePage (own)
    /profile/:id          → ProfilePage (public view)
    /profile/edit         → ProfilePage (edit tab)
    /projects/:id/donate  → DonationPage
    /start-a-project      → ProjectCreatePage
    /projects/:id/edit    → ProjectEditForm
  /*                      → ErrorState (404 fallback)
```

`ProtectedRoute` renders a spinner while `isLoading` is true (waiting for `checkAuth` to resolve), preventing a flash redirect on page refresh.

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+ (`corepack enable && corepack prepare pnpm@9 --activate`)
- The Django backend running at `http://localhost:8000`

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/mohamedabdelhaq-123/crowdfund-frontend.git
cd crowdfund-frontend

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env if your backend runs on a different port

# 4. Start the development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
pnpm build
pnpm preview   # preview the production build locally
```

---

## Environment Variables

```env
VITE_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
VITE_BASE_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:8000/api
```

`VITE_API_BASE_URL` is the only variable that affects runtime behaviour. It sets the Axios `baseURL`. If omitted, it defaults to `http://localhost:8000/api`.

---

## Docker

The Dockerfile runs the **Vite development server** (not a production build) inside a container. This is suitable for staging environments but should be replaced with a proper `pnpm build` + static file server setup for production.

```bash
# Build the image
docker build -t oasisfund-frontend .

# Run the container
docker run -p 5173:5173 oasisfund-frontend
```

The container uses `pnpm dev --host 0.0.0.0 --port 5173` as its entrypoint, making it accessible from outside the container.

---

## CI/CD

Deployments are automated via **GitHub Actions** (`.github/workflows/deploy-ec2.yml`), mirroring the backend pipeline.

**Trigger:** Push to the `dev` branch, or manual `workflow_dispatch`.

**Pipeline steps:**
1. SSH into the EC2 instance
2. Pull the latest code from `origin/dev` and hard reset
3. Rebuild and restart only the `frontend` Docker service (`docker compose up -d --build --no-deps frontend`)
4. Prune unused Docker builder cache, images, and volumes

A shared file lock (`/tmp/crowdfund-deploy.lock`) serializes frontend and backend deploys on the same host to prevent race conditions.

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `EC2_HOST` | EC2 public IP or domain |
| `EC2_USER` | SSH username (e.g., `ubuntu`) |
| `EC2_SSH_KEY` | Private SSH key |
| `EC2_PROJECT_PATH` | Absolute path to project root on the server |

---

## Project Structure

```
src/
├── App.tsx                  → Router definition + checkAuth dispatch on mount
├── main.tsx                 → ReactDOM root, Redux Provider, QueryClientProvider, Toaster
├── api/
│   ├── client.ts            → Axios instance with 401 → silent refresh interceptor
│   ├── home.ts              → Homepage feed
│   ├── projects.ts          → List, search, similar projects
│   ├── projects-details.ts  → CRUD, image management
│   ├── category.ts          → Category list
│   ├── comments.ts          → Comment CRUD + report toggle
│   └── donations.ts         → Donate to project
├── components/
│   ├── FeaturedHero.tsx     → Swiper fade carousel for featured projects
│   ├── CategoryGallery.tsx  → Responsive category grid with cover images
│   ├── ProjectCard.tsx      → Reusable card with progress bar and rating
│   ├── SimilarProjects.tsx  → Tag-based related projects grid
│   ├── ProtectedRoute.tsx   → Auth guard with loading spinner
│   ├── profile/             → EditProfileForm, MyProjectsTab, MyDonationsTab
│   └── project-comments/    → Full comment section with threading, edit, delete, report
├── hooks/
│   └── useProfileApi.ts     → TanStack Query hooks for all profile/user endpoints
├── pages/
│   ├── HomePage.tsx         → Hero + categories + search + project grid
│   ├── ProfilePage.tsx      → Own profile (tabbed) + public profile view
│   ├── auth/                → LoginPage, RegisterPage, ActivatePage
│   ├── project-details/     → ProjectDetailsPage, DonationPage
│   └── project-form/        → ProjectCreatePage, ProjectEditForm
├── store/
│   ├── store.ts             → Redux store configuration
│   └── slices/authSlice.ts  → Auth state + checkAuth/logout thunks
├── types/                   → TypeScript interfaces (auth, comment, profile, project)
└── validation/              → Zod schemas (authSchema, projectSchema)
```


## Team Members
  Rana Mohamed Abd Elhalim
  Mohamed Khaled Hussein
  Mohamed Sameh Mostafa Mohamed Elkholy
  Mohamed Abdelhaq Mohamed
  Andrew Emad Morris Philps


