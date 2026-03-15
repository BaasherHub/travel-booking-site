# ✈️ SkyVoyager — Travel Booking Site

SkyVoyager is a full-stack travel booking web application built with Next.js 14. It lets users search and compare flights and hotels worldwide, manage bookings, and complete a multi-step checkout flow — all with a clean, modern UI.

## ✨ Features

- **Flight Search** — Search hundreds of flights by origin, destination, date, cabin class, and passenger count
- **Hotel Search** — Browse hotels by city, check-in/check-out dates, and guest count
- **Detail Pages** — Rich flight and hotel detail pages with pricing breakdown
- **Multi-Step Booking** — Guided booking flow: traveler details → payment → confirmation
- **User Authentication** — Email/password and Google OAuth sign-in via NextAuth.js
- **User Dashboard** — View and manage all past bookings (flights & hotels)
- **About & Contact** — Company story, team, FAQ accordion and contact form
- **SEO Ready** — Metadata on all pages with Open Graph and Twitter card support
- **Responsive** — Fully mobile-responsive design using Tailwind CSS

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) |
| Database | PostgreSQL via [Prisma ORM](https://www.prisma.io/) |
| Auth | [NextAuth.js v4](https://next-auth.js.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Validation | [Zod](https://zod.dev/) |
| Deployment | [Railway](https://railway.app/) |

## 📸 Screenshots

> _Add screenshots here_

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use Railway)
- `npm` or `yarn`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/BaasherHub/travel-booking-site.git
cd travel-booking-site

# 2. Install dependencies
npm install

# 3. Copy the environment variables
cp .env.example .env.local

# 4. Edit .env.local with your values (see below)

# 5. Push the Prisma schema to your database
npx prisma db push

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Random secret for NextAuth (generate with `openssl rand -base64 32`) | ✅ |
| `NEXTAUTH_URL` | Full URL of your app (e.g. `http://localhost:3000`) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `AMADEUS_API_KEY` | Amadeus flight search API key | Optional |
| `AMADEUS_API_SECRET` | Amadeus flight search API secret | Optional |
| `TRAVELPAYOUTS_TOKEN` | Travelpayouts API token | Optional |
| `TRAVELPAYOUTS_MARKER` | Travelpayouts affiliate marker | Optional |
| `NEXT_PUBLIC_APP_URL` | Public app URL for Open Graph metadata | Optional |

> **Note:** The app works fully with mock data when API keys are not provided.

## 📁 Project Structure

```
src/
├── app/                   # Next.js App Router pages & API routes
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/  # NextAuth handler
│   │   │   └── register/       # User registration endpoint
│   │   ├── flights/            # Flight search & detail API
│   │   ├── hotels/             # Hotel search & detail API
│   │   └── bookings/           # Bookings CRUD API (auth-protected)
│   ├── about/             # About page
│   ├── booking/           # Multi-step booking flow
│   ├── contact/           # Contact page with FAQ
│   ├── dashboard/         # Protected user dashboard
│   ├── flights/           # Flight search + detail pages
│   ├── hotels/            # Hotel search + detail pages
│   ├── login/             # Sign-in page
│   └── register/          # Registration page
├── components/
│   ├── booking/           # BookingForm, PaymentForm, BookingSummary
│   ├── flights/           # FlightCard, FlightList, FlightFilters, FlightSearchForm
│   ├── hotels/            # HotelCard, HotelList, HotelFilters, HotelSearchForm
│   ├── home/              # Landing page sections
│   ├── layout/            # Navbar, Footer
│   ├── shared/            # Shared components (ErrorMessage, StarRating, etc.)
│   └── ui/                # Base UI primitives (Button, Card, Badge, Input, etc.)
├── context/               # React context (SearchContext, BookingContext)
├── hooks/                 # Custom hooks (useFlightSearch, useHotelSearch)
├── lib/
│   ├── api/               # External API clients (Amadeus, Travelpayouts)
│   ├── auth.ts            # NextAuth configuration
│   ├── mock-data.ts       # Mock flight, hotel & booking data
│   ├── prisma.ts          # Prisma client singleton
│   └── utils.ts           # Utility functions (formatPrice, formatDate, etc.)
└── types/                 # TypeScript type definitions
```

## 🚢 Deployment (Railway)

The project is pre-configured for Railway deployment:

1. Push your code to GitHub
2. Create a new project on [Railway](https://railway.app/)
3. Add a **PostgreSQL** plugin to your project
4. Connect your GitHub repository
5. Set the environment variables in the Railway dashboard
6. Railway will automatically build and deploy using the `Dockerfile`

The `railway.toml` and `Dockerfile` are already included in the repository.

## 📄 License

MIT

