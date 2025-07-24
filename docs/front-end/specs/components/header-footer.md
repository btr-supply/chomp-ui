# Header & Footer Components Specification

This document outlines the design and functionality of the global Header and Footer components for the Chomp frontend.

## 1. Overview

The Header and Footer provide consistent navigation, branding, and essential information across all pages of the application, following the dark theme design shown in the reference images.

## 2. Header Component

The Header is the primary navigation element, always visible at the top of the page with a dark background and yellow accent elements.

### 2.1. Purpose

- Display the Chomp logo + wordmark for brand identity and as a link to the homepage.
- Provide primary navigation links (public: Schema / Docs, admin: Nodes / Schema / Config / Users)
- Show user authentication status (extreme right) and provide login/logout actions.
- Offer access to configuration and notification/log viewer (icons to the left of the login/logout button)

### 2.2. Component Breakdown

- **Logo & Wordmark**: The Chomp logo with "CHOMP" text in yellow, linking to the homepage (`/`).
- **Navigation Links** (Center of header):
  - **Public Navigation** (when not authenticated):
    - `schema`: Links to `/resources` (the schema viewer page).
    - `docs`: Links to external documentation or `/docs`.
  - **Admin Navigation** (when authenticated):
    - `nodes`: Links to `/dashboard/instances` (ingester instance management).
    - `schema`: Links to `/dashboard/resources` (resource monitoring).
    - `config`: Links to `/dashboard/config` (configuration management).
    - `users`: Links to `/dashboard/users` (user management - not yet implemented).
- **Right Side Icons & Auth**:
  - **Icon Group** (from left to right):
    - Telegram icon (external link)
    - GitHub icon (external link)
    - Notification bell icon (opens notification panel)
    - Settings/gear icon (quick access to config)
  - **Auth Button**:
    - If not authenticated: Yellow "login" button linking to `/login`.
    - If authenticated: Yellow "logout" button that executes logout action.

### 2.3. Data & State

- Relies on the global authentication store (Zustand) to determine if a user is logged in and show appropriate navigation.
- Relies on the global logs store (Zustand) to show a badge on the notification icon if there are unread logs.

### 2.4. Visual Design Details

- Dark background (#1a1a1a or similar)
- Yellow accent color for logo text, buttons, and active states
- Clean, minimal typography
- Icons are white/light gray with hover states
- Navigation links are white text with yellow underline/highlight on active state

## 3. Footer Component

The Footer is a minimal dark bar at the bottom with basic information and a status indicator.

### 3.1. Purpose

- Display connection status and response time
- Show "see source code" link
- Display the Chomp branding

### 3.2. Component Breakdown

- **Left Side**:
  - Green status dot with response time (e.g., "120ms")
  - "see source code" link
- **Right Side**:
  - "CHOMP" text in yellow

### 3.3. Visual Design Details

- Same dark background as header
- Green status indicator for healthy connection
- Yellow "CHOMP" branding text
- Minimal height, unobtrusive

## 4. Responsive Behavior

- On mobile, navigation may collapse into a hamburger menu
- Icon group may be simplified on smaller screens
- Footer remains minimal across all screen sizes
