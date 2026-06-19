# Siksha Wallah - Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase account
- Razorpay account
- SendGrid account (for emails)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/jitendrakumarraj831-byte/Siksha-wallah.git
cd Siksha-wallah
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Setup Firebase**
- Go to [Firebase Console](https://console.firebase.google.com)
- Create a new project
- Enable Authentication (Email/Password)
- Create a Firestore database
- Create a Storage bucket
- Get your credentials from Project Settings

4. **Create .env.local file**
```bash
cp .env.example .env.local
```

5. **Fill in environment variables**
```
# Firebase Credentials (from Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Razorpay (from Razorpay Dashboard)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# SendGrid (from SendGrid Account)
SENDGRID_API_KEY=your_sendgrid_key

# Optional: Twilio for SMS
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_ga_id

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

6. **Setup Firestore Security Rules**

In Firebase Console, go to Firestore Database → Rules and add:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    // Courses are readable by everyone
    match /courses/{courseId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Students can read their enrollments
    match /enrollments/{enrollmentId} {
      allow read, write: if request.auth.uid == resource.data.uid || isAdmin();
    }

    // Public forum posts
    match /forum_posts/{postId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.uid) || isAdmin();
    }

    // Public blog posts
    match /blog_posts/{postId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Notifications (user-specific)
    match /notifications/{notificationId} {
      allow read, write: if request.auth.uid == resource.data.uid;
    }

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return request.auth.uid == uid;
    }

    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

7. **Run development server**
```bash
npm run dev
```

Visit http://localhost:3000

---

## Deploy to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your repository
5. Click "Import"

### Step 3: Add Environment Variables

In Vercel project settings:

1. Go to "Settings" → "Environment Variables"
2. Add all variables from your .env.local
3. Make sure to add them for all environments (Production, Preview, Development)

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
SENDGRID_API_KEY
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

---

## Configure Custom Domain

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update your domain's DNS records to point to Vercel
4. Wait for DNS propagation (usually 24-48 hours)

---

## Post-Deployment Setup

### 1. Update Firebase Settings

Go to Firebase Console → Authentication:
- Add your Vercel domain to authorized domains
- Update CORS settings if needed

### 2. Update Razorpay Settings

In Razorpay Dashboard:
- Add webhook URL: `https://your-domain.com/api/payment/webhook`
- Update Success/Failure URLs

### 3. Configure SendGrid

In SendGrid Dashboard:
- Setup sender authentication
- Create email templates
- Configure DKIM and SPF records

### 4. Setup Monitoring

- Enable Vercel Analytics
- Connect Google Analytics
- Setup error tracking with Sentry (optional)

---

## Performance Optimization

### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image 
  src="/image.jpg" 
  alt="description"
  width={800}
  height={600}
  priority
/>
```

### Code Splitting
Already handled by Next.js App Router - components are automatically code-split.

### Database Queries
- Use Firestore indexes for complex queries
- Implement pagination for large datasets
- Cache frequently accessed data

### API Routes
```typescript
// Add caching headers
export async function GET() {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
```

---

## Monitoring & Logging

### Vercel Analytics
Already available in Vercel dashboard - shows Core Web Vitals, performance metrics.

### Error Tracking
Install Sentry (optional):
```bash
npm install @sentry/nextjs
```

### Custom Logging
```typescript
// Create a logger utility
export const logger = {
  info: (msg: string, data?: any) => console.log(msg, data),
  error: (msg: string, error?: Error) => console.error(msg, error),
  warn: (msg: string, data?: any) => console.warn(msg, data),
};
```

---

## Backup & Recovery

### Firebase Backup
1. Go to Firebase Console
2. Enable automatic backups (paid feature)
3. Alternatively, export data regularly:
```bash
firebase firestore:export gs://your-bucket/backup-$(date +%s)
```

### Code Backup
- GitHub handles version control
- Create regular commits
- Use branch protection rules

---

## Scaling Considerations

### Database Scaling
- Firestore automatically scales
- Monitor read/write operations
- Optimize queries with indexes

### API Scaling
- Vercel automatically scales functions
- Monitor function execution time
- Consider caching frequently accessed data

### Storage Scaling
- Use Firebase Storage for files
- Implement cleanup for old files
- Monitor storage costs

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
vercel build --prod
```

### Firebase Connection Issues
- Verify credentials in .env
- Check Firebase project is active
- Verify Firestore database is created

### Payment Gateway Issues
- Test with Razorpay test keys first
- Verify webhook URLs are correct
- Check API keys are not rotated

### Email Not Sending
- Verify SendGrid API key
- Check sender domain is verified
- Review email templates
- Check spam filters

---

## Performance Benchmarks

Target metrics for Siksha Wallah:
- Lighthouse Score: > 90
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.5s

Monitor these in Vercel Analytics dashboard.

---

## Security Checklist

- [x] Firebase security rules configured
- [x] Environment variables not exposed
- [x] HTTPS enforced
- [x] Authentication implemented
- [x] Rate limiting ready
- [x] Input validation present
- [ ] SSL certificate installed
- [ ] Security headers configured
- [ ] Regular backups scheduled
- [ ] Monitoring and alerts setup

---

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com)

---

## Maintenance Schedule

- **Daily**: Check Vercel analytics for errors
- **Weekly**: Monitor Firebase usage and costs
- **Monthly**: Review security logs and updates
- **Quarterly**: Database optimization and cleanup
- **Yearly**: Security audit and backup verification
