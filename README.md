# Daily Activities & Wellness Management System

## Overview

This comprehensive Next.js application serves as a dynamic platform for managing and suggesting daily wellness activities. The system is designed to provide users with a structured approach to maintaining physical and mental well-being through carefully curated activities across multiple domains.

## Core Features

### Activity Management

- **Day-based Organization**: Activities systematically organized by days of the week
- **Category Classification**: Activities segregated into distinct categories:
  - Fitness & Exercise
  - Mental Wellness & Meditation
  - Nutritional Guidance
  - Mindfulness Practices

### Detailed Activity Specifications

Each activity in the system is comprehensively documented with:

- Detailed step-by-step descriptions
- Precise duration metrics
- Difficulty level indicators (Beginner to Advanced)
- Required equipment listings
- Expected benefits and outcomes
- Category-specific metadata including:
  - Calorie information for fitness activities
  - Dietary specifications for nutrition plans
  - Time-of-day recommendations
  - Equipment requirements
  - Exercise intervals and sequences

## Technical Architecture

### Frontend

- **Framework**: Next.js 14 with App Router
- **Styling**: Modern CSS practices
- **Image Handling**: Optimized image loading through Next.js Image component
- **Data Fetching**: Server-side and client-side data fetching strategies

### Backend

- **Database**: Neon Database (Serverless PostgreSQL)
- **API Layer**: Next.js API Routes
- **Database Interface**: @neondatabase/serverless driver
- **Data Structure**: Normalized database schema with comprehensive activity modeling

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm/yarn/pnpm package manager
- PostgreSQL database access (Neon Database credentials)

### Environment Configuration

1. Create a `.env.local` file with necessary database credentials:
   ```
   DATABASE_URL=your_neon_database_url
   ```

### Installation Steps

1. Clone the repository:

   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Access the application at [http://localhost:3000](http://localhost:3000)

## Database Schema

The application utilizes a robust database schema including:

- Activities table with comprehensive fields
- Category relationships
- Time-based organization
- Equipment and resource mapping

## API Endpoints

### GET /api/activities

- Supports filtering by day and category
- Returns structured activity data
- Includes all associated metadata

## Future Enhancements

- User authentication and personalization
- Activity scheduling and reminders
- Progress tracking and analytics
- Social sharing features
- Mobile application development

## Contributing

Contributions are welcome. Please follow the standard fork and pull request workflow.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
