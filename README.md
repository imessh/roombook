# RoomBook — Meeting Room Reservations

A Next.js 16 + TypeScript app for reserving office meeting rooms and halls, built on
Firebase (Auth + Firestore) and deployable to Vercel in a few minutes.

## Features

- Employee login / signup (Firebase Auth, email + password)
- Dashboard with today's bookings and quick stats
- Calendar view — rooms as rows, time as columns, colored booking pills, live "now" line
- Room directory with search, capacity, location, amenities, and per-room schedule
- Book a slot by clicking an open space on the timeline, or via **Add New**
- Edit and cancel existing bookings
- **Overlap-safe booking**: every create/update runs inside a Firestore transaction
  that re-checks the room's bookings for that date immediately before writing, so two
  people can never double-book the same room/time — even if they click at the same instant
- Status badges: Available / Reserved / Ongoing
- Responsive layout (desktop, tablet, mobile) with a bottom tab bar on small screens
- Keyboard-accessible: every interactive control is reachable and operable via keyboard,
  with visible focus states and `Escape`-to-close dialogs

## 1. Create your Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. In **Build → Authentication**, click **Get started**, then enable the **Email/Password** sign-in method.
3. In **Build → Firestore Database**, click **Create database** (start in production mode).
4. In **Project settings → General → Your apps**, click the **</>** (Web) icon to register a web app, and copy the config values shown.
5. In the Firestore console, open the **Rules** tab and paste in the contents of `firestore.rules` from this repo, then **Publish**.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the six `NEXT_PUBLIC_FIREBASE_*` values from step 1.4.

## 3. Install, seed, and run locally

```bash
npm install
npm run seed   # creates 5 demo rooms + 6 demo bookings for "today"
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), click **Create an account** to sign up as an employee, then sign in.

> The seed script is idempotent — if rooms or bookings already exist it won't duplicate them, so it's safe to re-run.

## 4. Deploy to Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. In [vercel.com](https://vercel.com), **Add New → Project**, import the repo.
3. Under **Environment Variables**, add the same six `NEXT_PUBLIC_FIREBASE_*` keys from your `.env.local`.
4. Deploy. Vercel auto-detects Next.js — no extra build config needed.
5. In the Firebase console, go to **Authentication → Settings → Authorized domains** and add your `*.vercel.app` domain (and any custom domain) so login works in production.

## Project structure

```
app/                Next.js App Router pages (login, signup, dashboard, calendar, rooms, bookings)
components/          UI components (calendar grid, modals, cards, nav)
lib/                 Firebase client, types, date helpers, Firestore data layer, auth context
scripts/seed.ts      Demo data seed script
firestore.rules       Security rules — deploy these to your Firestore project
```

## Data model

**rooms**: `name, location, capacity, amenities[], openTime, closeTime`

**bookings**: `roomId, roomName, name, date (YYYY-MM-DD), startTime, endTime (HH:mm 24h), category, note, createdAt, createdBy`

## Notes on the overlap guard

`lib/bookings.ts` exposes `createBookingSafely` and `updateBookingSafely`. Both wrap
their write in `runTransaction`, re-query all bookings for that `roomId` + `date`, and
throw `BookingConflictError` if the requested range overlaps any existing booking
(excluding the booking being edited). This is enforced server-side by Firestore's
transaction guarantees, not just in the UI — so it holds even under concurrent requests.
