# Siksha Wallah Hub - Deployment Guide

Siksha Wallah Hub ko Firebase App Hosting par deploy karne ke liye neeche diye gaye steps follow karein.

## Prerequisites
1. Apne code ko **GitHub** par push karein.
2. Firebase CLI install karein:
   ```bash
   npm install -g firebase-tools
   ```

## Step 1: Firebase Login
Terminal khol kar login karein:
```bash
firebase login
```

## Step 2: Initialize App Hosting
Project folder mein jaakar ye command chalayein:
```bash
firebase init apphosting
```
- Apna **Firebase Project** select karein.
- Apna **GitHub Repository** connect karein.
- Branch select karein (e.g., `main`).

## Step 3: Create Backend (CLI se)
Agar aap terminal se hi backend banana chahte hain:
```bash
firebase apphosting:backends:create --location us-central1 sikshawallah-backend
```

## Step 4: Setup Secrets (Important)
Kyunki hum `.env` variables use kar rahe hain, unhein Firebase mein register karna hoga taaki app crash na ho:
```bash
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_PROJECT_ID
# Isi tarah baaki keys bhi set karein
```

## Step 5: Automatic Deploy
Ab jab bhi aap GitHub par `git push` karenge, Firebase automatically aapka naya version build aur deploy kar dega.

Aap deployment status Firebase Console ke **App Hosting** tab mein dekh sakte hain.
