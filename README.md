# RoomBook — Meeting Room Reservation System

A modern web application for reserving office meeting rooms and halls.

## Features

* User registration and login
* Dashboard with today's bookings
* Calendar-based room booking
* Room availability and status
* Search and filter rooms
* Create, edit, and cancel bookings
* Double-booking prevention
* Room capacity, location, and amenities
* Responsive design for desktop and mobile

## Tech Stack

* Next.js 16
* TypeScript
* Tailwind CSS
* Firebase Authentication
* Cloud Firestore
* Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run the application

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Add demo data

To add sample rooms and bookings:

```bash
npm run seed
```

## Firebase

The application uses Firebase for:

* Authentication
* Room data
* Booking data
* Firestore security

Make sure Email/Password authentication and Firestore are enabled in your Firebase project.

## Booking System

Room bookings include overlap prevention, so users cannot reserve the same room for overlapping time periods.

## Project Structure

```text
app/             Application pages and routes
components/      Reusable UI components
lib/             Firebase and application logic
scripts/         Database seed scripts
public/          Images and static assets
firestore.rules  Firestore security rules
```

## Deployment

The application can be deployed to Vercel.

Add the Firebase environment variables to the Vercel project before deployment.

## License

This project was developed as a university software project.
