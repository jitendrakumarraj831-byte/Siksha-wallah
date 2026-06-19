# Siksha Wallah - Education Admission Platform

A comprehensive education platform built with Next.js, React 19, Firebase, and modern technologies for seamless student admissions, course enrollment, and educational management.

## 🚀 Features Implemented

### ✅ Complete Authentication System
- User registration & login with Firebase
- Password reset functionality
- Role-based access control (Student/Admin)
- Protected routes with middleware
- Session management

### ✅ Student Portal
- Complete dashboard with analytics widgets
- Profile management with document uploads
- Application tracking
- Enrollment management
- Payment history & invoices
- Notification center

### ✅ Course Management
- Advanced course directory with filters
- Course detail pages with eligibility checker
- Real-time seat availability
- Enrollment applications
- Course materials access
- Instructor profiles

### ✅ Payment Integration
- Razorpay payment gateway
- Secure checkout process
- Invoice generation
- Payment verification & tracking
- EMI support ready
- Refund management

### ✅ Admin Dashboard
- Comprehensive analytics dashboard
- Student management system
- Application review & approval
- Payment tracking
- Bulk notification system
- Email/SMS communications
- Course management
- Activity logs

### ✅ Community Features
- Forum with categories (general, doubts, courses, admission, payment)
- Post creation and replies
- Upvoting system
- Blog & news management
- Success stories & testimonials
- Comment system

### ✅ Analytics & Reporting
- Event tracking
- Conversion funnel analysis
- Student acquisition metrics
- Revenue tracking
- Course-wise analytics
- User behavior analysis

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Student dashboard
│   ├── courses/           # Course listing & details
│   ├── payment/           # Payment pages
│   ├── admin/             # Admin panel
│   ├── forum/             # Forum pages
│   ├── blog/              # Blog pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # UI components
├── services/              # Business logic
│   ├── auth-service.ts
│   ├── student-service.ts
│   ├── course-service.ts
│   ├── payment-service.ts
│   ├── admin-service.ts
│   ├── forum-service.ts
│   ├── blog-service.ts
│   └── analytics-service.ts
├── lib/
│   ├── firebase.ts        # Firebase config
│   └── auth-service.ts
└── middleware.ts          # Protected routes
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **UI Components**: shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Payments**: Razorpay
- **Email**: SendGrid
- **SMS**: Twilio (Optional)
- **Hosting**: Vercel / Firebase App Hosting
- **State Management**: React Context + SWR

## 📋 Environment Variables

Create a `.env.local` file with:

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# SendGrid
SENDGRID_API_KEY=

# Twilio (Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# Analytics
NEXT_PUBLIC_GA_ID=

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Create .env.local with your credentials
cp .env.example .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

- **[Features Documentation](./docs/FEATURES.md)** - Complete feature list
- **[API Documentation](./docs/API.md)** - API endpoints & examples
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deployment instructions
- **[Blueprint](./docs/blueprint.md)** - Project design & architecture

## 🔐 Security

- Firebase authentication with secure tokens
- Protected API routes with role-based access
- Input validation and sanitization
- CORS configuration
- Security rules for Firestore
- Rate limiting ready
- HTTPS enforced in production

## 📊 Database Collections

- `users` - User profiles
- `courses` - Course information
- `enrollments` - Student enrollments
- `payments` - Payment records
- `notifications` - User notifications
- `forum_posts` - Forum discussions
- `blog_posts` - Blog articles
- `testimonials` - Student testimonials
- `analytics_events` - Event tracking

## 🧪 Testing

```bash
# Type checking
npm run typecheck

# Build
npm run build

# Run build locally
npm run start
```

## 📞 Support & Contribution

For issues or feature requests, open an issue on GitHub.

For contributions:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] AI-powered course recommendations
- [ ] Video conferencing integration
- [ ] Assignment & exam system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment gateway expansion
- [ ] Integration with educational councils

---

Made with ❤️ for Indian students by Siksha Wallah
