# CampusGram - Campus Social Network MVP

A full-stack social network application for universities, built with Encore.ts backend and React frontend.

## Features

- **Authentication**: University email-based registration and login
- **Posts & Feed**: Create, view, like, and comment on posts with hashtags and location tags
- **Study Groups**: Create and join study groups for courses
- **Events**: Create and view campus events
- **Search**: Search for users, posts, and campus locations
- **Admin Panel**: Basic content moderation and university settings
- **Campus Integration**: University-scoped content and locations

## Tech Stack

- **Backend**: Encore.ts with PostgreSQL
- **Frontend**: React 18, TypeScript, Tailwind CSS, React Query
- **Database**: PostgreSQL with migrations
- **UI**: shadcn/ui components

## Getting Started

### Prerequisites

- [Encore CLI](https://encore.dev/docs/install)
- Node.js 18+
- PostgreSQL (managed by Encore)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd campus-gram
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Development

1. Start the Encore development server:
```bash
encore run
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

3. **Important**: On first run, visit `http://localhost:5173` and click "Seed Database" on the login page to populate with demo data.

### Demo Accounts

After seeding the database, you can login with:

- **Stanford Admin**: admin@stanford.edu / password123
- **Berkeley Admin**: admin@berkeley.edu / password123
- **Student Example**: alice0@stanford.edu / password123

## Database Schema

The application uses the following main entities:

- **Universities**: Multi-tenant university instances
- **Users**: Students and administrators with university affiliation
- **Posts**: User-generated content with images, hashtags, and locations
- **Comments**: Threaded comments on posts
- **Study Groups**: Course-based study groups with membership
- **Events**: Campus events with date/time and location
- **Campus Locations**: Predefined campus buildings and locations

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Posts
- `GET /posts` - List posts (paginated)
- `POST /posts` - Create new post
- `POST /posts/:id/like` - Toggle like on post

### Comments
- `GET /comments/:postId` - List comments for post
- `POST /comments` - Create new comment

### Study Groups
- `GET /study-groups` - List study groups
- `POST /study-groups` - Create study group
- `POST /study-groups/:id/join` - Join study group

### Events
- `GET /events` - List events
- `POST /events` - Create event

### Search
- `GET /search` - Search users, posts, and locations

### Utilities
- `POST /seed` - Seed database with demo data

## Features Overview

### Multi-tenancy
All data is scoped by university domain. Users can only see content from their own university.

### Content Management
- Rich text posts with hashtag support
- Image upload support (placeholder implementation)
- Location tagging with campus buildings
- Threaded comments with replies

### Social Features
- Like/unlike posts
- Follow hashtags
- Study group membership
- Event creation and discovery

### Admin Features
- Content moderation
- User management
- University branding customization

## Development Notes

- All API endpoints are automatically type-safe between frontend and backend
- Database migrations are handled automatically by Encore
- The frontend uses React Query for efficient data fetching and caching
- Authentication is handled with simple tokens (upgrade to JWT for production)

## Production Deployment

This application is designed to be easily deployable with Encore's built-in deployment system:

```bash
encore deploy --env production
```

For production use, consider:
- Implementing proper JWT authentication
- Adding rate limiting
- Setting up proper image storage (S3/CloudFlare R2)
- Configuring email verification
- Adding push notifications
- Implementing real-time features with WebSockets

## License

MIT License - see LICENSE file for details.
