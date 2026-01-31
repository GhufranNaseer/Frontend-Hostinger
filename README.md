# BOQ Task Management System - Frontend

This is the frontend application for the BOQ Task Management System.

## 🚀 Recent Changes
- **Date:** 2026-01-31
- **Feature:** Department Management
- **Summary:** Implemented a new management interface for Administrators to manage departments and their assigned roles.
- **Changes:**
  - Added `Departments.tsx` page in the `admin` section.
  - Enriched `departments.service.ts` with full CRUD operations.
  - Updated `AppRoutes.tsx` and `Navbar.tsx` for new navigation.
  - Updated `types` to support department roles.
- **Infrastructure:** Added `.htaccess` to `public/` directory to fix SPA routing 404 errors on Hostinger.
- **Bug Fix (v2):** Refactored `Departments.tsx` to handle state updates explicitly, removing dependency on `useFetch` functional updates to prevent `map` crashes due to caching or type issues.
- **Bug Fix:** Fixed `TypeError: departments.map is not a function` by updating the `useFetch` hook to support functional state updates.

## 🛠️ Tech Stack
- React + Vite
- TypeScript
- Tailwind CSS
- Axios

## 📦 Getting Started
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables: `cp .env.example .env`
4. Run development server: `npm run dev`
