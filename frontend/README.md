# Webflix

A modern, responsive web application for browsing movies and TV shows using the TMDB (The Movie Database) API.

![Webflix Preview](https://via.placeholder.com/800x400?text=Webflix+Preview)

## Project Overview

Webflix is a React-based streaming platform UI that allows users to:

- Browse trending and popular movies and TV shows
- View detailed information about specific titles
- Search for content across the TMDB database
- Create user accounts to maintain favorites and watchlists
- Manage their profile and preferences

The application features a clean, minimalist design with a dark theme and light blue accent colors for a modern streaming experience.

## Setup Instructions

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd webflix-movie-webapp
```

2. Install dependencies:

```bash
cd frontend
npm install
```

3. Create a `.env` file in the frontend directory with your TMDB API key:

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Connecting to the TMDB API

### Setting Up Your API Key

1. Create an account on [The Movie Database](https://www.themoviedb.org/)
2. Go to your account settings → API and request an API key
3. Add the API key to your `.env` file as shown in the installation steps

### API Integration

The application uses the following TMDB API endpoints:

- `/trending` - For the home page featured and trending content
- `/movie/{id}` and `/tv/{id}` - For the details pages
- `/discover/movie` and `/discover/tv` - For the browse pages
- `/search/multi` - For the search functionality

Example API request:

```javascript
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

// Fetch trending movies
const fetchTrending = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/all/week?api_key=${API_KEY}`
    )
    const data = await response.json()
    return data.results
  } catch (error) {
    console.error('Error fetching trending content:', error)
    return []
  }
}
```

For more details, refer to the [TMDB API Documentation](https://developers.themoviedb.org/3/getting-started/introduction).

## Application Structure

### Pages

1. **Home Page** (`/`)

   - Featured content banner
   - Trending movies and shows
   - Popular content categories
   - Top-rated sections

2. **Details Page** (`/movie/:id` or `/tv/:id`)

   - Title, poster, backdrop
   - Release date, runtime, genres
   - Rating and overview
   - Cast information
   - Similar content recommendations

3. **Browse Page** (`/browse/movies` or `/browse/shows`)

   - Filtering options (genre, year, rating)
   - Sorting options
   - Grid view of content
   - Pagination

4. **Authentication Pages**

   - Login form (`/login`)
   - Registration form (`/register`)
   - Password reset (`/reset-password`)

5. **User Profile** (`/profile`)
   - Account information
   - Favorites list
   - Watchlist
   - Settings

### Components

The project uses a component-based architecture with the following key components:

- `Header` - Navigation and user profile access
- `MovieCard` - Reusable card for displaying movie/show information
- `Section` - Container for grouping content by category
- `Carousel` - Horizontal scrolling container for content
- `SearchBar` - Input for searching content
- `AuthForm` - Reusable form for authentication
- `ProfileSection` - Displays user profile information

## Required Libraries

This project uses the following dependencies:

- **React** - UI library
- **React Router** - For navigation and routing
- **Tailwind CSS** - For styling
- **Axios** - For API requests
- **React Query** - For data fetching and caching
- **Vite** - Build tool and development server

Additional optional libraries:

- **React Icons** - For UI icons
- **Framer Motion** - For animations
- **React Hook Form** - For form handling
- **Zod** - For form validation

## Folder Structure

```
frontend/
├── public/
├── src/
│   ├── assets/          # Static assets like images
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Shared components (buttons, inputs, etc.)
│   │   ├── layout/      # Layout components (header, footer, etc.)
│   │   └── sections/    # Larger feature-specific components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── Home/
│   │   ├── Details/
│   │   ├── Browse/
│   │   ├── Auth/
│   │   └── Profile/
│   ├── services/        # API services and utilities
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── package.json
└── vite.config.js
```

## Development Roadmap

1. **Phase 1: Setup and Basic Structure**

   - Set up project with Vite and React
   - Implement routing with React Router
   - Create basic layout components (Header, Footer)
   - Style with Tailwind CSS

2. **Phase 2: API Integration**

   - Create API service for TMDB
   - Implement data fetching with React Query
   - Build Home page with featured and trending content
   - Create MovieCard component

3. **Phase 3: Details and Browse Pages**

   - Implement Details page for movies and shows
   - Create Browse page with filtering
   - Add search functionality

4. **Phase 4: User Authentication**

   - Set up authentication forms
   - Implement user login/registration logic
   - Create protected routes

5. **Phase 5: User Features**

   - Build Profile page
   - Implement favorites and watchlist functionality
   - Add user settings

6. **Phase 6: Polish and Optimize**
   - Add loading states and error handling
   - Implement responsive design improvements
   - Optimize performance
   - Add animations and transitions

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the development framework
