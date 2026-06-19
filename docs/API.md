# Siksha Wallah API Documentation

## Overview
Complete API reference for Siksha Wallah - Education Admission Platform

## Authentication
All protected endpoints require a Firebase authentication token in the header:
```
Authorization: Bearer <firebase_token>
```

---

## Authentication Service

### Register
**POST** `/api/auth/register`
```json
{
  "email": "student@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "9876543210"
}
```

### Login
**POST** `/api/auth/login`
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

### Forgot Password
**POST** `/api/auth/forgot-password`
```json
{
  "email": "student@example.com"
}
```

### Logout
**POST** `/api/auth/logout`
- Requires authentication
- Clears user session

---

## Student Service

### Get Student Profile
**GET** `/api/student/profile` (Protected)
```json
{
  "uid": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "Address details",
  "enrollments": [],
  "updatedAt": "2024-01-01"
}
```

### Update Profile
**PUT** `/api/student/profile` (Protected)
```json
{
  "name": "John Doe Updated",
  "phone": "9876543210",
  "address": "New Address"
}
```

### Upload Document
**POST** `/api/student/documents` (Protected)
```json
{
  "name": "10th Marksheet",
  "type": "marksheet",
  "url": "document_url"
}
```

### Get Documents
**GET** `/api/student/documents` (Protected)
- Returns list of uploaded documents

---

## Course Service

### Get All Courses
**GET** `/api/courses`
```json
{
  "courses": [
    {
      "id": "course_id",
      "name": "B.Ed",
      "category": "Education",
      "duration": "2 years",
      "eligibility": "12th Pass",
      "seats": 100,
      "enrolled": 45,
      "fee": 150000
    }
  ]
}
```

### Get Course Details
**GET** `/api/courses/:courseId`
```json
{
  "id": "course_id",
  "name": "B.Ed",
  "description": "Full description",
  "category": "Education",
  "duration": "2 years",
  "eligibility": "12th Pass",
  "curriculum": [],
  "instructors": [],
  "seats": 100,
  "enrolled": 45,
  "fee": 150000
}
```

---

## Enrollment Service

### Enroll in Course
**POST** `/api/enrollment/enroll` (Protected)
```json
{
  "courseId": "course_id",
  "status": "pending"
}
```

### Get My Enrollments
**GET** `/api/enrollment/my-enrollments` (Protected)

### Get Enrollment Details
**GET** `/api/enrollment/:enrollmentId` (Protected)

---

## Payment Service

### Create Order
**POST** `/api/payment/create-order` (Protected)
```json
{
  "enrollmentId": "enrollment_id",
  "amount": 150000,
  "currency": "INR"
}
```
Returns:
```json
{
  "orderId": "razorpay_order_id",
  "amount": 150000,
  "currency": "INR"
}
```

### Verify Payment
**POST** `/api/payment/verify` (Protected)
```json
{
  "razorpay_payment_id": "pay_...",
  "razorpay_order_id": "order_...",
  "razorpay_signature": "signature"
}
```

### Get Payment History
**GET** `/api/payment/history` (Protected)

---

## Admin Service

### Get Dashboard Analytics
**GET** `/api/admin/analytics` (Admin Only)
```json
{
  "totalStudents": 150,
  "totalEnrollments": 200,
  "totalRevenue": 30000000,
  "conversionRate": 45.5,
  "topCourses": [
    {
      "courseId": "course_id",
      "enrollments": 50
    }
  ]
}
```

### Get All Students
**GET** `/api/admin/students` (Admin Only)
- Pagination supported with `?page=1&limit=20`

### Get Applications
**GET** `/api/admin/applications` (Admin Only)
```json
{
  "applications": [
    {
      "id": "app_id",
      "studentName": "John Doe",
      "courseId": "course_id",
      "status": "pending",
      "submittedAt": "2024-01-01"
    }
  ]
}
```

### Update Application Status
**PUT** `/api/admin/applications/:appId` (Admin Only)
```json
{
  "status": "approved"
}
```

### Send Notification
**POST** `/api/admin/notifications` (Admin Only)
```json
{
  "uids": ["uid1", "uid2"],
  "title": "Important Update",
  "message": "Message content"
}
```

---

## Notification Service

### Get My Notifications
**GET** `/api/notifications` (Protected)

### Mark as Read
**PUT** `/api/notifications/:notificationId/read` (Protected)

### Mark All as Read
**PUT** `/api/notifications/mark-all-read` (Protected)

---

## Forum Service

### Get Forum Posts
**GET** `/api/forum/posts`
- Query params: `?category=general&limit=20`

### Get Post Details
**GET** `/api/forum/posts/:postId`

### Create Post
**POST** `/api/forum/posts` (Protected)
```json
{
  "title": "Post Title",
  "content": "Post content",
  "category": "general",
  "tags": ["tag1", "tag2"]
}
```

### Get Post Replies
**GET** `/api/forum/posts/:postId/replies`

### Add Reply
**POST** `/api/forum/posts/:postId/replies` (Protected)
```json
{
  "content": "Reply content"
}
```

---

## Blog Service

### Get Published Posts
**GET** `/api/blog/posts`
- Query params: `?category=admissions&limit=10`

### Get Post by Slug
**GET** `/api/blog/posts/:slug`

### Get Testimonials
**GET** `/api/blog/testimonials`

### Submit Testimonial
**POST** `/api/blog/testimonials` (Protected)
```json
{
  "studentName": "John Doe",
  "course": "B.Ed",
  "rating": 5,
  "message": "Testimonial message"
}
```

---

## Error Handling

All error responses follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Common Error Codes
- `INVALID_CREDENTIALS`: Login failed
- `USER_NOT_FOUND`: User not found
- `INSUFFICIENT_BALANCE`: Payment failed
- `ENROLLMENT_NOT_FOUND`: Enrollment not found
- `UNAUTHORIZED`: Not authenticated
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `SERVER_ERROR`: Internal server error

---

## Rate Limiting
- 100 requests per minute per IP for public endpoints
- 500 requests per minute per user for authenticated endpoints

## Database Schema

### Collections
- `users`: User profiles and accounts
- `courses`: Course information
- `enrollments`: Student enrollments
- `payments`: Payment records
- `notifications`: User notifications
- `forum_posts`: Forum discussion posts
- `forum_replies`: Forum post replies
- `blog_posts`: Blog articles
- `testimonials`: Student testimonials
- `analytics_events`: Analytics tracking

---

## Environment Variables Required
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `SENDGRID_API_KEY`
- `TWILIO_ACCOUNT_SID` (Optional)
- `TWILIO_AUTH_TOKEN` (Optional)
