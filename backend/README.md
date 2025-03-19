# CertPrep API Testing Guide with Postman

This guide will help you test all the API endpoints of your certification preparation application using Postman.

## Setup

Before testing, make sure to:

1. Have your server running locally or deployed
2. Create a Postman collection for your project
3. Set up environment variables:
   - `BASE_URL`: Your API base URL (e.g., `http://localhost:3000`)
   - `TOKEN`: Will store the JWT after login

## Authentication Endpoints

### Register User

```
POST {{BASE_URL}}/api/auth/register
```

**Body (JSON):**

```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**Expected Response:**

- Status: 200 OK
- Body: Contains a JWT token
- Save the token to the `TOKEN` environment variable
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdkOTlkMTljMGJkMDRhZmUzMGIxMTViIn0sImlhdCI6MTc0MjMxNDc3NywiZXhwIjoxNzQyOTE5NTc3fQ.pwmqYMLWIVTe2Q8ZaPbEwrKN6Kjo_t9lS8lB7JcWC3I

### Login User

```
POST {{BASE_URL}}/api/auth/login
```

**Body (JSON):**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**

- Status: 200 OK
- Body: Contains a JWT token
- Save the token to the `TOKEN` environment variable

## Certification Endpoints

### Get All Certifications

```
GET {{BASE_URL}}/api/certifications
```

**Expected Response:**

- Status: 200 OK
- Body: Array of certifications with populated modules

### Get Certification by ID

```
GET {{BASE_URL}}/api/certifications/{{certificationId}}
```

**Expected Response:**

- Status: 200 OK
- Body: Certification details with populated modules

### Enroll in a Certification

```
POST {{BASE_URL}}/api/certifications/enroll/{{certificationId}}
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Expected Response:**

- Status: 200 OK
- Body: Success message and certification details

## Module Endpoints

### Get Module by ID

```
GET {{BASE_URL}}/api/modules/{{moduleId}}
```

**Expected Response:**

- Status: 200 OK
- Body: Module details

## Test Endpoints

### Get Test Questions for a Module

```
GET {{BASE_URL}}/api/tests/module/{{moduleId}}?count=25
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Query Parameters:**

- `count`: Number of questions (optional, default 25)

**Expected Response:**

- Status: 200 OK
- Body: Array of questions without correct answers
- For free users, should decrease testsRemaining by 1

### Get Test Questions for a Certification

```
GET {{BASE_URL}}/api/tests/certification/{{certId}}?count=50
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Query Parameters:**

- `count`: Number of questions (optional, default 50)

**Expected Response:**

- Status: 200 OK
- Body: Array of questions without correct answers
- For free users, should decrease testsRemaining by 1

### Submit Test

```
POST {{BASE_URL}}/api/tests/submit
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Body (JSON):**

```json
{
  "testType": "module", // or "full"
  "moduleId": "{{moduleId}}", // only required if testType is "module"
  "certificationId": "{{certificationId}}",
  "responses": [
    {
      "questionId": "{{questionId1}}",
      "selectedOption": 1
    },
    {
      "questionId": "{{questionId2}}",
      "selectedOption": 0
    }
    // Add more responses as needed
  ],
  "duration": 30 // Duration in minutes
}
```

**Expected Response:**

- Status: 200 OK
- Body: Score details and testAttemptId
- Save the testAttemptId to use in the next test

### Get Test Results with Explanations

```
GET {{BASE_URL}}/api/tests/results/{{testAttemptId}}
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Expected Response:**

- Status: 200 OK
- Body: Test attempt details with questions, selected options, and explanations

## Subscription Endpoints

### Get Subscription Plans

```
GET {{BASE_URL}}/api/subscriptions/plans
```

**Expected Response:**

- Status: 200 OK
- Body: Array of available subscription plans

### Create Order

```
POST {{BASE_URL}}/api/subscriptions/create-order
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Body (JSON):**

```json
{
  "subscriptionId": "{{subscriptionId}}"
}
```

**Expected Response:**

- Status: 200 OK
- Body: Razorpay order details including orderId

### Verify Payment

```
POST {{BASE_URL}}/api/subscriptions/verify-payment
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Body (JSON):**

```json
{
  "razorpay_order_id": "order_123456789",
  "razorpay_payment_id": "pay_123456789",
  "razorpay_signature": "generated_signature"
}
```

**Expected Response:**

- Status: 200 OK
- Body: Success message and subscription expiry date

## Error Testing

For each endpoint, also test error scenarios:

1. **Authentication Failures:**

   - Missing or invalid token
   - Expected: 401 Unauthorized

2. **Free User Limits:**

   - Test module/certification when testsRemaining is 0
   - Expected: 403 Forbidden

3. **Not Found Scenarios:**

   - Request with invalid IDs
   - Expected: 404 Not Found

4. **Bad Requests:**
   - Missing required fields
   - Expected: 400 Bad Request

## Test Data Setup

Before testing, you'll need to seed your database with:

1. User accounts (free and premium)
2. Certifications
3. Modules linked to certifications
4. Questions with different difficulty levels
5. Subscription plans

## Common Issues to Watch For

1. Check for proper token usage in auth-protected routes
2. Verify that free users' test count decreases appropriately
3. Make sure premium users don't have test limitations
4. Confirm that enrollment works correctly
5. Verify that submitted responses properly calculate scores
