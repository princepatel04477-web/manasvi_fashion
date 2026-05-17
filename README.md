# Mansvi Fashion 🌸

A premium full-stack Indian women's ethnic wear e-commerce application.

## Features Built

- **Next.js 14 App Router:** Leveraging Server Components and Client Components appropriately.
- **Tailwind CSS + Custom Palette:** Implementation of exact brand colors (Cocoa, Blush, Salmon, Peachy, Tan).
- **3D Hero Animation:** React Three Fiber fabric simulation using GLSL Shaders on a PlaneGeometry.
- **Scroll Animations:** GSAP ScrollTrigger for parallax and Framer Motion for page/layout transitions.
- **State Management:** Zustand for Cart and Wishlist with local storage persistence.
- **Database:** Prisma ORM with SQLite (ready to be swapped to PostgreSQL).
- **Authentication:** NextAuth.js credentials provider (Email/Password).
- **Admin Dashboard:** Protected route with Sales Analytics (Recharts) and Product management table.

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup & Seeding:**
   The project uses SQLite for immediate local execution.
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

3. **Environment Variables:**
   Create a `.env` file in the root and add:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your_super_secret_string"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run the Application:**
   ```bash
   npm run dev
   ```

## Dummy Credentials

You can use the seeded admin credentials to test the protected `/admin` route:
- **Email:** admin@mansvifashion.com
- **Password:** admin123

*(Regular user accounts can be created or mocked during checkout/login flows)*

## Tech Stack Overview

- **Frontend:** Next.js 14, React, Tailwind CSS, Framer Motion, GSAP, Lenis Smooth Scroll, Three.js, React Three Fiber.
- **Backend:** Next.js API Routes, NextAuth.js.
- **Database:** Prisma ORM, SQLite.
- **Icons:** Lucide React.
- **Components:** Radix UI primitives.
