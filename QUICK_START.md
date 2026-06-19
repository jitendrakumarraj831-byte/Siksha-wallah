# Siksha Wallah - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Setup Environment Variables

Create `.env.local` file in root:

```env
# Firebase (Get from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Razorpay (Get from Razorpay Dashboard)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Optional Services
SENDGRID_API_KEY=your_sendgrid_key
NEXT_PUBLIC_GA_ID=your_ga_id
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Test Accounts

**Admin Account** (for testing admin features):
- Email: `admin@example.com`
- Password: `admin123`
- Create this account during registration and update role in Firebase

**Student Account** (for testing student features):
- Email: `student@example.com`
- Password: `student123`

---

## 📌 Key URLs

| Feature | URL |
|---------|-----|
| Home | http://localhost:3000 |
| Register | http://localhost:3000/auth/register |
| Login | http://localhost:3000/auth/login |
| Dashboard | http://localhost:3000/dashboard |
| Courses | http://localhost:3000/courses |
| Forum | http://localhost:3000/forum |
| Blog | http://localhost:3000/blog |
| Admin | http://localhost:3000/admin/dashboard |

---

## 🔐 Default Roles

- **Student**: Regular user, can enroll, make payments
- **Admin**: Can manage courses, students, payments, send notifications

Update roles in Firebase Console → Firestore → users collection

---

## 📁 Key Files to Know

```
src/
├── app/auth/          → Registration, Login, Password Reset
├── app/dashboard/     → Student Dashboard, Profile, Documents
├── app/courses/       → Course Listing and Details
├── app/admin/         → Admin Panel
├── app/forum/         → Community Forum
├── app/blog/          → Blog Articles
├── app/api/payment/   → Payment APIs
├── services/          → Business Logic
└── lib/firebase.ts    → Firebase Config
```

---

## 🧪 Testing the App

### 1. Register as Student
- Go to `/auth/register`
- Create account
- Verify email (Firebase sends verification link)

### 2. Browse Courses
- Go to `/courses`
- Filter by category
- Click on course to see details

### 3. Enroll in Course
- Click "Enroll Now" on course detail
- Fill enrollment form
- Submit application

### 4. Make Payment
- Go to `/payment/checkout`
- Enter test Razorpay credentials:
  - Card: 4111 1111 1111 1111
  - Expiry: 12/25
  - CVV: 123

### 5. Access Admin Panel
- Register as admin (set role in Firebase)
- Go to `/admin/dashboard`
- View analytics, students, applications

### 6. Use Forum
- Go to `/forum`
- Click "Create Post"
- Add title, content, category
- Publish

### 7. Read Blog
- Go to `/blog`
- Browse articles by category
- Click article to read

---

## 🐛 Common Issues & Fixes

### Firebase Connection Error
```
Error: Firebase config not loaded
→ Check .env.local has correct Firebase credentials
→ Verify Firebase project is active
```

### Payment Gateway Error
```
Error: Razorpay keys not found
→ Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local
→ Use test keys, not production keys
```

### Database Error
```
Error: Firestore permission denied
→ Check Firebase security rules are configured
→ Verify user is authenticated
```

### Build Error
```
npm run typecheck
→ Fix TypeScript errors shown
→ npm run build
```

---

## 🔧 Configuration Files

### `next.config.js`
- Next.js build configuration
- Image optimization settings
- API routes configuration

### `tailwind.config.js`
- Tailwind CSS configuration
- Custom theme colors
- Component styling

### `tsconfig.json`
- TypeScript configuration
- Path aliases
- Compiler settings

---

## 📊 Database Setup

### Create Firestore Database

1. Go to Firebase Console
2. Create Cloud Firestore database
3. Choose "Production" mode
4. Select region (closest to you)
5. Click "Create"

### Create Collections

The app automatically creates collections on first use. Or manually create:
- `users`
- `courses`
- `enrollments`
- `payments`
- `notifications`
- `forum_posts`
- `blog_posts`

---

## 💳 Payment Testing

### Razorpay Test Mode

Use these test credentials:
- **Success Card**: 4111 1111 1111 1111
- **Decline Card**: 4012001038443335
- **Expiry**: Any future date
- **CVV**: Any 3 digits

### Test Payment Flow
1. Go to `/payment/checkout`
2. Enter test card details
3. Click "Pay Now"
4. Should see success page

---

## 📧 Email Setup

### Using SendGrid

1. Create SendGrid account
2. Verify sender email
3. Get API key
4. Add to `.env.local`
5. Create email templates in SendGrid

---

## 🚀 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Siksha Wallah ready for deployment"
git push origin main
```

### Step 2: Create Vercel Project
- Go to vercel.com
- Click "Add New Project"
- Select GitHub repository
- Click "Import"

### Step 3: Add Environment Variables
- Go to Settings → Environment Variables
- Add all variables from `.env.local`
- Click "Deploy"

### Step 4: Monitor Deployment
- Check deployment status in Vercel
- Wait for "Ready" status
- Visit your live site

---

## 📚 Documentation

- **Features**: `/docs/FEATURES.md`
- **API**: `/docs/API.md`
- **Deployment**: `/docs/DEPLOYMENT.md`
- **Implementation**: `/docs/IMPLEMENTATION_SUMMARY.md`

---

## 🆘 Getting Help

1. Check documentation in `/docs`
2. Review API examples in `/docs/API.md`
3. Check GitHub issues
4. Review code comments in services

---

## ✅ Checklist Before Going Live

- [ ] Firebase project created
- [ ] Razorpay account created
- [ ] SendGrid account created
- [ ] Environment variables set
- [ ] Security rules configured
- [ ] All features tested locally
- [ ] Custom domain configured
- [ ] SSL certificate enabled
- [ ] Database backups enabled
- [ ] Error monitoring setup

---

## 🎯 Quick Command Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run typecheck        # Check TypeScript errors
npm run lint             # Run ESLint

# Database
firebase init            # Initialize Firebase
firebase deploy          # Deploy to Firebase

# Git
git add .                # Stage changes
git commit -m "message"  # Commit changes
git push                 # Push to GitHub
```

---

## 💡 Pro Tips

1. **Use Firestore Emulator** for local testing without real database
2. **Enable Realtime Database** if you need real-time features
3. **Setup GitHub Actions** for automated deployments
4. **Monitor Vercel Analytics** for performance metrics
5. **Use Redux DevTools** for state management debugging

---

## 🎊 You're Ready!

Everything is set up. Just add your credentials and start building!

**Happy coding! 🚀**

---

**For more details, see IMPLEMENTATION_COMPLETE.md**
