# Siksha Wallah Platform - Deployment Checklist

## Pre-Deployment Setup

### 1. Firebase Configuration
- [ ] Create Firebase Project
- [ ] Get Firebase credentials (API Key, Auth Domain, Project ID, etc.)
- [ ] Enable Firestore Database
- [ ] Enable Firebase Authentication
- [ ] Set up Firestore security rules
- [ ] Create collections: users, courses, enrollments, payments, applications, notifications, forum_posts, blog_posts, testimonials
- [ ] Add `.env.local` variables:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=your_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  ```

### 2. Payment Gateway Setup (Razorpay)
- [ ] Create Razorpay Account
- [ ] Get API Keys (Key ID and Key Secret)
- [ ] Enable Razorpay Dashboard access
- [ ] Set up webhook (optional)
- [ ] Add to `.env.local`:
  ```
  RAZORPAY_KEY_ID=your_key_id
  RAZORPAY_KEY_SECRET=your_key_secret
  ```

### 3. Email Service (SendGrid)
- [ ] Create SendGrid Account
- [ ] Generate API Key
- [ ] Verify sender email
- [ ] Add to `.env.local`:
  ```
  SENDGRID_API_KEY=your_api_key
  ```

### 4. SMS Service (Twilio) - Optional
- [ ] Create Twilio Account
- [ ] Get Account SID and Auth Token
- [ ] Get Twilio phone number
- [ ] Add to `.env.local`:
  ```
  TWILIO_ACCOUNT_SID=your_account_sid
  TWILIO_AUTH_TOKEN=your_auth_token
  TWILIO_PHONE_NUMBER=your_phone_number
  ```

### 5. Analytics (Google Analytics) - Optional
- [ ] Create Google Analytics property
- [ ] Get Measurement ID
- [ ] Add to `.env.local`:
  ```
  NEXT_PUBLIC_GA_ID=your_ga_id
  ```

### 6. API Configuration
- [ ] Set API URL in `.env.local`:
  ```
  NEXT_PUBLIC_API_URL=https://your-domain.com
  ```

---

## Local Testing Checklist

### Core Features
- [ ] User can register successfully
- [ ] User can login with credentials
- [ ] Password reset works
- [ ] User dashboard loads and displays data
- [ ] Profile page works and allows edits
- [ ] Document upload functionality works
- [ ] Course browsing and filtering works
- [ ] Course enrollment process works
- [ ] Payment checkout loads Razorpay
- [ ] Admin dashboard is accessible
- [ ] Forum post creation works
- [ ] Blog articles display correctly

### Mobile Testing
- [ ] Navigation menu collapse/expand works
- [ ] All buttons clickable on mobile
- [ ] Forms display properly
- [ ] WhatsApp button visible and functional
- [ ] No horizontal scroll on mobile

### Security Testing
- [ ] Unauth users cannot access /dashboard
- [ ] Unauth users cannot access /admin
- [ ] Admin users cannot access student features
- [ ] Student users cannot access admin features
- [ ] Middleware properly redirects

---

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub `main` branch
2. Import project in Vercel console
3. Add environment variables
4. Deploy
5. Enable auto-deploy on push

### Option 2: Firebase App Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init apphosting`
3. Configure secrets: `firebase apphosting:secrets:set KEY_NAME`
4. Deploy: `firebase deploy --only hosting`

### Option 3: Self-Hosted (AWS/DigitalOcean/etc)
1. Build project: `npm run build`
2. Copy `.next` folder to server
3. Install Node.js on server
4. Run: `npm run start`
5. Configure reverse proxy (Nginx/Apache)

---

## Post-Deployment Verification

### Functionality Checks
- [ ] Homepage loads without errors
- [ ] Navigation works across all pages
- [ ] Auth system fully functional
- [ ] Courses page displays all offerings
- [ ] Payment gateway functional
- [ ] Admin panel accessible
- [ ] Forum operational
- [ ] Blog articles loading

### Performance Checks
- [ ] Page load time < 3 seconds
- [ ] Mobile performance good
- [ ] API responses < 500ms
- [ ] Database queries optimized

### Security Checks
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] API keys not exposed
- [ ] Database rules restrictive
- [ ] CORS properly configured

### Monitoring Setup
- [ ] Google Analytics tracking
- [ ] Error tracking (Sentry/Rollbar)
- [ ] Uptime monitoring
- [ ] Performance monitoring

---

## Environment Variables Summary

### Required Variables (Must Have)
```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Razorpay
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET

# API
NEXT_PUBLIC_API_URL
```

### Optional Variables (Nice to Have)
```
# Email
SENDGRID_API_KEY

# SMS
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN

# Analytics
NEXT_PUBLIC_GA_ID
```

---

## Common Issues & Solutions

### Issue: Firebase auth not working
**Solution**: Verify API keys and Auth Domain in `.env.local`

### Issue: Payment gateway showing errors
**Solution**: Check Razorpay keys and ensure they're production keys

### Issue: Emails not sending
**Solution**: Verify SendGrid API key and sender email is verified

### Issue: Mobile layout broken
**Solution**: Check responsive breakpoints in Tailwind config

### Issue: Admin routes not protected
**Solution**: Verify middleware.ts is properly configured

---

## Support Resources

- **Documentation**: See `/docs` folder
- **API Reference**: `/docs/API.md`
- **Deployment Guide**: `/docs/DEPLOYMENT.md`
- **Features List**: `/docs/FEATURES.md`
- **Quick Start**: `/QUICK_START.md`
- **QA Report**: `/QA_REPORT.md`

---

## Sign-Off

**Deployment Date**: _______________
**Deployed By**: _______________
**Environment**: ☐ Development ☐ Staging ☐ Production
**Status**: ☐ Successful ☐ Issues Found

**Verified By**: _______________
**Date**: _______________

---

**Next Steps After Deployment**:
1. Monitor error logs for first 48 hours
2. Test all user workflows
3. Collect feedback from admin users
4. Monitor performance metrics
5. Plan Phase 2 improvements
