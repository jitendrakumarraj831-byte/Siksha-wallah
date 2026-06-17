# Siksha Wallah Hub - Deployment Guide

Siksha Wallah Hub ko Firebase App Hosting par deploy karne ke liye neeche diye gaye steps follow karein.

## Step 0: GitHub Par New Repo Setup (Terminal Commands)

Pehle GitHub.com par jayein aur ek **New Repository** banayein (Empty, bina README/License ke). Phir ye commands apne terminal mein chalayein:

```bash
# 1. Git initialize karein
git init

# 2. Saari files stage karein
git add .

# 3. Pehla commit karein
git commit -m "Initial commit for Siksha Wallah Hub"

# 4. Main branch set karein
git branch -M main

# 5. Remote origin add karein (Apni repo ka URL yahan paste karein)
git remote add origin <YOUR_GITHUB_REPO_URL>

# 6. GitHub par code push karein
git push -u origin main
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

## Step 3: Setup Secrets (Important)
Firebase App Hosting environment variables ko secure rakhne ke liye secrets use karta hai:
```bash
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_PROJECT_ID
# Isi tarah baaki keys (Auth Domain, App ID etc.) bhi set karein
```

## Step 4: Automatic Deploy
Ab jab bhi aap GitHub par `git push` karenge, Firebase automatically aapka naya version build aur deploy kar dega.

Aap deployment status Firebase Console ke **App Hosting** tab mein dekh sakte hain.