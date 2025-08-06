# Kinlia Next Steps & Implementation Plan

This plan sketches where to take the project next. Each step is small on purpose so you can vibe your way through at your own pace.

## 1. Explore the Running App
- **What:** Start the Docker services and click around the app.
- **Why:** Seeing it in action builds intuition before touching code.
- **How:** `make dev` (or `docker-compose up`) from the project root.

## 2. Polish the Onboarding Flow
- **What:** Add friendly screens for sign up, log in and profile view.
- **Why:** Good vibes start with a smooth first impression.
- **Ideas:** Use simple forms, store the received token, show the user name.

## 3. Build the Event Browser
- **What:** Show a list of events and a detail page for each one.
- **Why:** Events are the heart of Kinlia; the mobile app should make them easy to find.
- **Ideas:** Fetch `/events` from the backend, display title, date and location.

## 4. Implement Ticket Purchasing
- **What:** Let a user tap "Buy" and post to `/events/{id}/tickets`.
- **Why:** Buying a ticket is the main action users take.
- **Ideas:** Confirm the purchase, then show the ticket in a "My Tickets" view.

## 5. Organizer Dashboard (Optional)
- **What:** Special screens for people who create events.
- **Why:** Organizers need to see sales and manage their events.
- **Ideas:** Use `/organizer/events` and `/organizer/events/{id}/tickets` endpoints.

## 6. Add Background Matching Feedback
- **What:** Surface results from the worker that matches people to events.
- **Why:** Makes the app feel smart and personalized.
- **Ideas:** Poll for updates or use push notifications when matches are ready.

## 7. Hardening & Quality of Life
- **What:** Sprinkle tests, error messages and comments everywhere.
- **Why:** Future you (and collaborators) will thank you.
- **Ideas:** Write backend `pytest` cases, run `flake8`, add loading spinners.

Take these steps in whatever order feels fun. The goal is to keep shipping small pieces and learn as you go.
