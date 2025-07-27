# Kinlia Frontend

A React Native app built with Expo, featuring authentication and event management.

## Features

- **Authentication**: Login and signup screens with JWT token management
- **Navigation**: React Navigation with stack navigator
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Secure Storage**: JWT tokens stored securely using expo-secure-store
- **Event Feed**: Placeholder screen for displaying events

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI (optional, for development)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
# For web
npm run web

# For iOS
npm run ios

# For Android
npm run android
```

## Docker

To run the frontend using Docker:

```bash
# Build and run with docker-compose (recommended)
docker-compose up frontend

# Or build and run manually
docker build -t kinlia-frontend .
docker run -p 3412:3412 kinlia-frontend
```

The app will be available at `http://localhost:3412` when running in web mode.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   └── EventFeedScreen.tsx
├── services/       # API and business logic
│   └── api.ts
└── types/          # TypeScript type definitions
    └── index.ts
```

## Configuration

The app is configured to connect to the backend API at `http://localhost:8000`. You can modify this in `src/services/api.ts`.

## Development

- The app uses TypeScript for type safety
- NativeWind is configured for styling (TailwindCSS classes)
- JWT tokens are automatically included in API requests
- Authentication state is persisted across app restarts 