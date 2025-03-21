# How the API Works: A Complete Guide

I'll walk you through how all the components work together and how to test each endpoint with Postman.

## Setting Up Your Application

Your MERN stack application with React Native (Expo) has the following main features:

1. Certification management
2. Module structure within certifications
3. Question bank
4. Test taking system
5. Progress tracking

## 1. Setting Up Certifications

### Create Certifications (Admin Only)

```
POST /api/certifications
```

**Request Body:**

```json
{
  "title": "Personal Trainer Certification",
  "description": "Comprehensive certification for personal training professionals",
  "image": "https://example.com/image.jpg"
}
```

### Getting All Certifications

```
GET /api/certifications
```

This endpoint returns all available certifications that users can enroll in.

### Enrolling in a Certification

```
POST /api/certifications/:id/enroll
```

When a user clicks on a certification to enroll:

1. The system checks if the user is already enrolled
2. If not, adds the certification to their `enrolledCertifications` array
3. Returns a success message with the certification details

### Viewing Enrolled Certifications

```
GET /api/certifications/user/enrolled
```

This endpoint returns all certifications the current user is enrolled in.

## 2. Managing Modules

### Adding Modules to a Certification (Admin Only)

```
POST /api/modules
```

**Request Body:**

```json
{
  "title": "Anatomy Fundamentals",
  "description": "Basic understanding of human anatomy for fitness professionals",
  "certification": "60d21b4667d0d8992e610c85" // Certification ID
}
```

### Getting Modules for a Certification

```
GET /api/modules/certification/:certificationId
```

This returns all modules associated with a specific certification, which helps users navigate learning material.

## 3. Setting Up Questions

### Adding Questions (Admin Only)

```
POST /api/questions
```

**Request Body:**

```json
{
  "text": "Which of the following is not a major muscle group?",
  "options": [
    { "text": "Quadriceps", "isCorrect": false },
    { "text": "Biceps", "isCorrect": false },
    { "text": "Medialis", "isCorrect": true },
    { "text": "Hamstrings", "isCorrect": false }
  ],
  "difficulty": "medium",
  "explanation": "Medialis is not a major muscle group on its own but refers to part of other muscles like vastus medialis.",
  "module": "60d21b4667d0d8992e610c86" // Module ID
}
```

The system ensures at least one option is marked as correct.

## 4. Taking a Test

### Starting a Test

```
GET /api/questions/test
```

**Query Parameters:**

- `certificationId`: ID of the certification
- `moduleId`: (Optional) ID of specific module for focused tests
- `count`: Number of questions to include (default: 10)
- `difficulty`: (Optional) Filter by difficulty level

This endpoint:

1. Checks if the user has tests remaining (free users have limited tests)
2. Retrieves random questions based on criteria
3. Removes correct answer indicators before sending to client
4. Decrements the tests remaining counter for free users

### Submitting a Test

```
POST /api/tests/attempts
```

**Request Body:**

```json
{
  "certificationId": "60d21b4667d0d8992e610c85",
  "moduleId": "60d21b4667d0d8992e610c86", // Optional
  "isFullTest": false,
  "duration": 15, // Minutes taken
  "questionResponses": [
    {
      "questionId": "60d21b4667d0d8992e610c87",
      "selectedOption": 2
    },
    {
      "questionId": "60d21b4667d0d8992e610c88",
      "selectedOption": 0
    }
    // More responses...
  ]
}
```

This endpoint:

1. Validates the certification and module
2. Fetches the actual questions with correct answers
3. Processes user responses and calculates the score
4. Saves the attempt and returns results including pass/fail status

## 5. Tracking Progress

### Viewing Test Attempts

```
GET /api/tests/attempts
```

This returns all test attempts by the current user, sorted by date.

### Viewing Detailed Test Results

```
GET /api/tests/attempts/:id
```

This shows detailed information about a specific test, including:

- Questions asked
- User's responses
- Correct answers
- Explanations for each question

### Getting User Statistics

```
GET /api/tests/stats
```

**Query Parameters:**

- `certificationId`: (Optional) Filter stats by certification

This endpoint provides:

1. Total number of tests taken
2. Average score percentage
3. Overall accuracy (correct answers / total questions)
4. Individual certification statistics (if not filtered)
5. Subscription status and tests remaining

## Testing Flow in Postman

1. **Authentication**:

   - Sign up/login to get a JWT token
   - Set the token in Authorization header or as a cookie

2. **Create Test Data (Admin)**:

   - Create certifications
   - Add modules to certifications
   - Add questions to modules

3. **User Flow**:
   - Browse certifications
   - Enroll in a certification
   - View enrolled certifications
   - Start a test by requesting questions
   - Submit test answers
   - View results and statistics

## Example Testing Sequence

1. Create a certification (as admin)
2. Add 2-3 modules to the certification
3. Add 5+ questions to each module
4. As a user, enroll in the certification
5. Start a test with 10 questions
6. Submit random answers
7. Check the results
8. View your statistics
9. Take another test to see if stats update

The system tracks:

- Test attempts
- Score history
- Accuracy
- Remaining free tests

Users with a premium subscription can take unlimited tests, while free users are limited to 3 tests.

This comprehensive API allows you to create a complete fitness mock test application where users can practice for certification exams, track their progress, and focus on areas that need improvement.
