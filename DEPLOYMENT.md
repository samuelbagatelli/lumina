# Deployment and Local Setup Guide

This guide will help you run **Lumina Library** on your local machine and deploy it to **Vercel**.

## 1. Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Steps

1. **Clone or Download** the source code.
2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env.local` file in the root directory and copy the contents from `.env.example`. Fill in your Firebase and Gemini API keys.

   ```bash
   cp .env.example .env.local
   ```

4. **Run Development Server**:

   ```bash
   npm run dev
   ```

5. **Open Browser**: Navigate to `http://localhost:3000`.

---

## 2. Vercel Deployment

### Prerequisites

- A [Vercel](https://vercel.com/) account.
- A [Firebase](https://console.firebase.google.com/) project set up with Firestore and Authentication (Google login).

### Steps

1. **Push to GitHub**: Upload your code to a GitHub repository.
2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click "Add New" -> "Project".
   - Import your GitHub repository.
3. **Configure Environment Variables**:
   During the setup process, click on **Environment Variables** and add the following from your `.env.local` (or Firebase Console):
   - `GEMINI_API_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_DATABASE_ID`
4. **Deploy**: Click "Deploy". Vercel will automatically build and host your app.

---

## 3. Firebase Configuration (Manual)

If you are setting up a new Firebase project manually:

1. **Firestore**: Enable Firestore in "Production Mode".
2. **Authentication**: Enable "Google" as a Sign-in provider.
3. **Security Rules**: Copy the content of `firestore.rules` from this project into the Firebase Console -> Firestore -> Rules.
4. **Authorized Domains**: Add your Vercel deployment URL (e.g., `myapp.vercel.app`) to the "Authorized Domains" list in Firebase Console -> Authentication -> Settings.

---

## 4. Gemini API Key

To use the "Explore" AI features, get an API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).
