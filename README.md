# ✈️ AlterTravel — Premium Affiliate Travel Booking Platform

AlterTravel is a full-stack travel booking web application built with Next.js 14. Users can search and compare flights and hotels worldwide, and complete bookings through affiliate partner links — earning commission on every booking.

## ✨ Features

- **Flight Search** — Search hundreds of airlines with real-time pricing via Amadeus API (mock data fallback)
- **Hotel Search** — Browse 200,000+ hotels worldwide via Travelpayouts API (mock data fallback)
- **Affiliate Booking Flow** — Instead of direct payment, users are redirected to affiliate partners (Amadeus, Booking.com, Expedia) so you earn commission on every booking
- **Commission Tracking** — Each booking records estimated commission amount and affiliate URL
- **User Authentication** — Email/password + Google OAuth via NextAuth
- **User Dashboard** — View and manage personal bookings
- **Admin Dashboard** — Overview stats, bookings table with status management, commission tracking
- **Responsive Design** — Mobile-first UI with AlterTravel premium design system

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (Credentials + Google OAuth)
- **Styling**: Tailwind CSS + Radix UI components
- **APIs**: Amadeus API, Travelpayouts API (with mock data fallback)
- **Deployment**: Railway (Docker + railway.toml)

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/BaasherHub/travel-booking-site
cd travel-booking-site
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret — run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Same as `NEXTAUTH_URL` |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `GOOGLE_CLIENT_ID` | Google OAuth (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth (optional) |
| `AMADEUS_API_KEY` | Amadeus flight API (optional) |
| `AMADEUS_API_SECRET` | Amadeus flight API (optional) |
| `TRAVELPAYOUTS_TOKEN` | Travelpayouts API (optional) |
| `TRAVELPAYOUTS_MARKER` | Travelpayouts affiliate marker (optional) |
| `BOOKING_COM_AID` | Booking.com affiliate ID (optional) |
| `EXPEDIA_AFFILIATE_ID` | Expedia affiliate ID (optional) |

> **Note:** The app works fully with mock data when API keys are not provided.

### 3. Initialize Database

```bash
npx prisma db push
# or for production migrations:
npx prisma migrate dev --name init
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚂 Railway Deployment

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub Repo**
2. Select `BaasherHub/travel-booking-site`
3. Add a **PostgreSQL** plugin (Railway auto-sets `DATABASE_URL`)
4. Set environment variables in Railway dashboard:
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your Railway URL (e.g., `https://your-app.up.railway.app`)
   - `NEXT_PUBLIC_APP_URL` — same as `NEXTAUTH_URL`
   - `ADMIN_EMAILS` — your admin email(s)
5. Generate a public domain: Settings → Networking → Generate Domain
6. Railway auto-builds using `Dockerfile`, runs `prisma db push`, and starts the server

## 📁 Project Structure

```
src/
  app/
    api/
      auth/[...nextauth]/    # NextAuth handler
      auth/register/         # User registration
      flights/               # Flight search + details
      hotels/                # Hotel search + details
      bookings/              # Booking CRUD + [id] route
      admin/stats/           # Admin stats endpoint
      admin/bookings/        # Admin bookings management
      health/                # Railway healthcheck
    about/                   # About AlterTravel
    admin/                   # Admin dashboard
    booking/                 # Booking flow
    contact/                 # Contact page
    dashboard/               # User dashboard
    flights/[id]/            # Flight detail page
    hotels/[id]/             # Hotel detail page
    login/                   # Login page
    register/                # Registration page
  components/
    booking/                 # BookingForm, BookingSummary, PaymentForm
    flights/                 # FlightCard, FlightFilters, FlightSearchForm
    hotels/                  # HotelCard, HotelFilters, HotelSearchForm
    home/                    # HeroSection, WhyChooseUs, Testimonials, etc.
    layout/                  # Navbar, Footer
    shared/                  # Reusable UI components
    ui/                      # Radix UI component wrappers
  lib/
    api/                     # Amadeus + Travelpayouts API clients
    auth.ts                  # NextAuth config
    constants.ts             # App constants
    mock-data.ts             # Mock flights/hotels/destinations
    prisma.ts                # Prisma client
    utils.ts                 # Utility functions
```

## 💰 Affiliate Integration

AlterTravel uses an affiliate model instead of direct payments:

1. User searches for flights/hotels
2. User selects a result and views the booking summary
3. **"Book via Partner"** button opens the affiliate partner URL in a new tab
4. A booking record is created with `status: "pending"` and estimated commission
5. Admin dashboard shows all bookings and commission tracking

Affiliate links are generated using:
- **Amadeus**: Deep-link flight booking URLs
- **Travelpayouts**: Marker-based affiliate URLs
- **Booking.com**: AID-based hotel booking URLs
- **Expedia**: Affiliate ID-based hotel booking URLs

## 🔐 Admin Access

Set `ADMIN_EMAILS` environment variable to a comma-separated list of admin email addresses:

```
ADMIN_EMAILS="admin@altertravel.com,you@example.com"
```

Admin dashboard is available at `/admin` (only accessible to listed emails).
