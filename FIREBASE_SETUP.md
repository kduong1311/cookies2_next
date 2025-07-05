# Firebase Setup Guide for Frontend

## Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (the same one you use for backend)
3. Click on the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Click on the web app icon (</>) to add a web app if you haven't already
7. Register your app with a nickname
8. Copy the Firebase config object

## Step 2: Update Firebase Configuration

Replace the placeholder config in `src/lib/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 3: Enable Authentication Methods

In Firebase Console:
1. Go to "Authentication" → "Sign-in method"
2. Enable "Email/Password"
3. Enable "Google" (and configure OAuth consent screen if needed)

## Step 4: Install Dependencies

```bash
cd frontend/cookies2_next
npm install
```

## Step 5: Test the Implementation

The login flow now works as follows:

1. **Email/Password Login:**
   - User enters email/password
   - Firebase authenticates the user
   - Frontend gets ID token from Firebase
   - Frontend sends ID token to your backend
   - Backend verifies token and creates/updates user

2. **Google Login:**
   - User clicks "Login with Google"
   - Firebase opens Google OAuth popup
   - User authenticates with Google
   - Frontend gets ID token from Firebase
   - Frontend sends ID token to your backend
   - Backend verifies token and creates/updates user

3. **Registration:**
   - User enters email/password for registration
   - Firebase creates new user account
   - Frontend gets ID token from Firebase
   - Frontend sends ID token to your backend
   - Backend creates user record in database

## Important Notes

- **No service account key needed in frontend** - The frontend uses Firebase SDK with public config
- **Backend still needs service account key** - For verifying tokens server-side
- **Same Firebase project** - Both frontend and backend should use the same Firebase project
- **Security** - The frontend config is safe to expose (it's designed to be public)

## Troubleshooting

1. **"Firebase App named '[DEFAULT]' already exists"**
   - This is normal if Firebase is initialized multiple times
   - The code handles this automatically

2. **"auth/operation-not-allowed"**
   - Make sure you've enabled Email/Password and Google sign-in methods in Firebase Console

3. **"auth/invalid-api-key"**
   - Check that your Firebase config is correct
   - Make sure you're using the web app config, not the service account key

4. **"auth/user-not-found"**
   - User doesn't exist in Firebase (for login)
   - Use registration instead

5. **"auth/email-already-in-use"**
   - User already exists in Firebase (for registration)
   - Use login instead 