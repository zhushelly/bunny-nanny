# CLAUDE.md - Bunny Nanny Project Documentation

## Project Overview

**Bunny Nanny** is a web application that connects rabbit owners with trusted pet sitters in their neighborhood. The platform allows users to:
- Search for bunny sitters based on location and dates
- Register as a bunny nanny/sitter
- View sitter profiles and contact information
- Authenticate using Firebase Auth

The application consists of a React frontend and an Express.js backend with Firebase integration for authentication, data storage, and file uploads.

## Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **React Router DOM 6.24.1** - Client-side routing
- **Material-UI 5.16.0** - UI component library (@mui/material, @emotion/react, @emotion/styled)
- **Firebase 10.12.3** - Authentication, Firestore database, Storage
- **Google Maps API** - Location services via @react-google-maps/api 2.19.3
- **Axios 1.7.2** - HTTP client for API calls
- **Create React App** - Build tooling (react-scripts 5.0.1)

### Backend
- **Node.js & Express 4.19.2** - Server framework
- **Firebase Admin SDK 12.2.0** - Server-side Firebase operations
- **GeoFirestore 5.2.0** - Geospatial queries for Firebase
- **CORS 2.8.5** - Cross-origin resource sharing
- **Body-Parser 1.20.2** - Request body parsing

### Development Tools
- **ESLint** - Code linting (react-app configuration)
- **Jest** - Testing framework (via @testing-library)
- **Firebase Tools 13.13.0** - Firebase CLI and local emulation

## Project Structure

```
bunny-nanny/
├── src/                        # Frontend source code
│   ├── components/            # React components
│   │   ├── Header.js         # Navigation header
│   │   ├── Home.js           # Landing page with search
│   │   ├── UserHome.js       # Authenticated user dashboard
│   │   ├── Login.js          # Login form
│   │   ├── SignUp.js         # Registration form
│   │   ├── SignUpSuccess.js  # Post-registration confirmation
│   │   ├── NannyForm.js      # Nanny application form
│   │   ├── SearchResult.js   # Search results display
│   │   └── styles/           # Component CSS files
│   │       ├── Header.css
│   │       ├── Home.css
│   │       ├── NannyForm.css
│   │       ├── SearchResult.css
│   │       └── rabbit.jpg    # Background image
│   ├── App.js                # Main app component with routing
│   ├── firebase.js           # Firebase configuration
│   ├── index.js              # React entry point
│   ├── App.test.js           # App component tests
│   ├── setupTests.js         # Test configuration
│   └── reportWebVitals.js    # Performance monitoring
├── backend/                   # Backend server
│   ├── server.js             # Express server with API endpoints
│   ├── serviceAccountKey.json # Firebase admin credentials (gitignored)
│   └── package.json          # Backend dependencies
├── public/                    # Static assets
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── .env                      # Environment variables (gitignored)
├── .gitignore                # Git ignore configuration
├── package.json              # Frontend dependencies
└── README.md                 # Default CRA documentation
```

## Key Features

### 1. User Authentication
- Firebase Authentication integration
- Sign up with email/password
- Login/logout functionality
- Protected routes using PrivateRoute component
- Session persistence

### 2. Nanny Search
- Location-based search using Google Places API
- Date range selection for boarding/drop-in visits
- Proximity-based filtering (default 20 miles radius)
- Real-time results from Firestore

### 3. Nanny Registration
- Multi-field application form
- Google Places autocomplete for address
- Profile photo upload to Firebase Storage
- Data stored in Firestore with GeoPoint for location

### 4. Search Results Display
- List view of available nannies
- Display of nanny details (name, location, experience, headline, phone)
- Profile photo display (currently commented out)

## Environment Setup

### Required Environment Variables (.env file)

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google Maps API
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Backend Service Account
The backend requires a `serviceAccountKey.json` file in the `/backend` directory for Firebase Admin SDK authentication. This file should be obtained from Firebase Console and kept secure.

## Development Commands

### Frontend
```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (one-way operation)
npm run eject
```

### Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start server (port 3001)
npm start
# or
node server.js
```

## API Endpoints

### GET /api/nannies
Fetches nannies within a specified geographic radius.

**Query Parameters:**
- `lat` (required): Latitude of search center
- `lng` (required): Longitude of search center
- `radius` (optional): Search radius in miles (default: 20)

**Response:**
```json
[
  {
    "nannyName": "string",
    "location": {
      "latitude": number,
      "longitude": number
    },
    "profilePhoto": "string (URL)",
    "mobilePhoneNumber": "string",
    "petCareExperience": "string",
    "headline": "string",
    "userId": "string",
    "createdAt": "timestamp"
  }
]
```

**Error Response:**
```json
{
  "error": "Failed to fetch nannies",
  "details": "Error message"
}
```

## Database Schema

### Firestore Collections

#### `nanny` Collection
Stores nanny/sitter profiles.

**Document Structure:**
```javascript
{
  nannyName: string,              // Sitter's name
  location: GeoPoint,              // Firebase GeoPoint (lat, lng)
  profilePhoto: string,            // URL to uploaded photo in Storage
  mobilePhoneNumber: string,       // Contact number
  petCareExperience: string,       // Experience description (min 25 chars)
  headline: string,                // Profile headline
  userId: string,                  // Firebase Auth UID
  createdAt: serverTimestamp       // Registration timestamp
}
```

### Firebase Storage Structure
```
/profilePhotos/
  └── [uploaded_file_name]       // Profile photos for nannies
```

## Authentication Flow

1. **Sign Up**:
   - User provides email/password
   - Account created via Firebase Auth
   - Redirects to success page

2. **Login**:
   - Email/password authentication
   - Sets auth session
   - Redirects to user home

3. **Protected Routes**:
   - `PrivateRoute` component checks `auth.currentUser`
   - Redirects to login if not authenticated
   - Currently protects `/user-home` route

4. **Session Management**:
   - Firebase handles session persistence
   - `onAuthStateChanged` listener in components
   - User state managed locally in components

## Component Architecture

```
App.js
├── Router
    ├── Home (/)
    │   ├── Header
    │   └── Search Form (with Google Places)
    ├── SignUp (/signup)
    │   └── Registration Form
    ├── Login (/login)
    │   └── Login Form
    ├── SignUpSuccess (/signup-success)
    ├── UserHome (/user-home) [Protected]
    │   └── Header
    ├── SearchResult (/search-results)
    │   ├── Header
    │   └── Nanny List
    └── NannyForm (/become-a-nanny)
        ├── Header
        └── Application Form
```

### Component Responsibilities

- **App.js**: Main routing configuration, PrivateRoute logic
- **Header.js**: Navigation bar, user status display
- **Home.js**: Landing page, search functionality, Google Maps integration
- **UserHome.js**: Authenticated user dashboard
- **Login.js**: User authentication
- **SignUp.js**: New user registration
- **NannyForm.js**: Nanny application with file upload and geolocation
- **SearchResult.js**: Display search results from backend API

## Deployment Considerations

### Production Checklist
- [ ] Secure environment variables in production
- [ ] Configure Firebase security rules for Firestore and Storage
- [ ] Set up proper CORS configuration for production domain
- [ ] Enable Firebase App Check for additional security
- [ ] Configure Google Maps API key restrictions
- [ ] Set up SSL/HTTPS for backend server
- [ ] Implement rate limiting on API endpoints
- [ ] Add error tracking/monitoring (e.g., Sentry)
- [ ] Set up proper logging for backend
- [ ] Configure CDN for static assets

### Firebase Security Rules
Ensure proper security rules are configured for:
- Firestore: Restrict read/write access based on authentication
- Storage: Limit file uploads by size and type
- Authentication: Enable appropriate sign-in methods

## Known Issues & TODOs

### Current Issues
1. **Modified File**: `src/components/Home.js` has uncommitted changes
2. **Security**: `serviceAccountKey.json` was previously tracked in git (now gitignored)
3. **Profile Photos**: Profile photo display is commented out in SearchResult.js
4. **Navigation**: After nanny form submission, navigates to '/somewhere' (needs proper route)
5. **Error Handling**: Limited error handling in frontend components
6. **State Management**: No global state management (could benefit from Context API or Redux)

### Suggested Improvements
1. **Search Enhancement**:
   - Add filters for availability, experience level, ratings
   - Implement pagination for search results
   - Add map view for search results

2. **User Features**:
   - User profiles and dashboards
   - Booking system with calendar integration
   - Messaging system between owners and sitters
   - Review and rating system
   - Payment integration

3. **Nanny Features**:
   - Availability calendar
   - Service pricing configuration
   - Profile editing capabilities
   - Booking management dashboard

4. **Technical Improvements**:
   - Add comprehensive error boundaries
   - Implement loading states consistently
   - Add form validation library (e.g., Formik, React Hook Form)
   - Optimize bundle size with code splitting
   - Add PWA capabilities
   - Implement automated testing
   - Add TypeScript for better type safety

5. **Backend Enhancements**:
   - Implement proper geospatial queries with Geohash
   - Add caching layer (Redis)
   - Implement GraphQL for more efficient data fetching
   - Add webhook support for real-time updates
   - Implement background jobs for notifications

## Development Notes

### Code Style
- Functional components with hooks
- CSS modules for styling (separate CSS files per component)
- Async/await for asynchronous operations
- Console.log statements present for debugging (should be removed in production)

### Testing
- Jest configuration via Create React App
- Testing libraries available: @testing-library/react, @testing-library/jest-dom
- Current test coverage: Minimal (only App.test.js)

### Browser Support
- Production: >0.2%, not dead, not op_mini all
- Development: Latest Chrome, Firefox, Safari

## Quick Start Guide

1. Clone the repository
2. Install dependencies: `npm install` and `cd backend && npm install`
3. Set up Firebase project and obtain configuration
4. Create `.env` file with required variables
5. Add `serviceAccountKey.json` to backend directory
6. Start backend: `cd backend && npm start`
7. Start frontend: `npm start` (from root directory)
8. Access application at http://localhost:3000

## Important Commands for Development

```bash
# Check for linting issues (if ESLint is configured)
npm run lint

# Format code (if Prettier is configured)
npm run format

# Check bundle size
npm run build && npm run analyze

# Run backend in development with nodemon (if configured)
cd backend && npx nodemon server.js
```

## Contact & Support

For issues or questions about this codebase:
- Check existing code comments and documentation
- Review Firebase and React documentation
- Consult Google Maps API documentation for location services

---

*Last Updated: Current as of project analysis*
*This document should be updated when significant changes are made to the architecture or functionality*