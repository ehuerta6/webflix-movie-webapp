# Webflix - Movie & TV Show Web Application

## 🧾 Project Overview

Webflix is a modern web application built with React + Vite that allows users to explore, search, and manage movies and TV shows using the TMDB API.

## 🗂️ Folder & File Structure

### /src

- **App.jsx** - Main application component with routing
- **Header.jsx** - Navigation header component
- **/components** – Reusable UI components:
  - **MovieCard.jsx** - Card component for displaying movie/show information
  - **Footer.jsx** - Footer component with credits
  - **SearchBar.jsx** - Component for search functionality
  - **Home-section.jsx** - Section component for the home page
- **/pages** – Main route pages:
  - **Home.jsx** – Landing page with featured/random movies
  - **Movies.jsx** – Displays filtered movie content
  - **Shows.jsx** – Displays filtered show content
  - **SearchPage.jsx** – Search interface and results
  - **Auth.jsx** – Login & Register containers
  - **User.jsx** – User profile, stats, collections, and settings
  - **Details.jsx** – Detailed view for movies and shows
- **/assets**
  - **profile-pic.jpg** – Placeholder image for movies and user profile
  - **react.svg** - React logo
- **/services** - API integration services (currently empty, prepared for future API connections)

## ⚙️ Features Implemented

- 🔍 **Search** by movie, show, genre, or actor
- 📺 **Browse Movies & TV Shows**
- 📖 **Filter** by genre / sort by top rated, newest, etc.
- 🔐 **Auth page** with login/register (Google button included, not functional)
- 👤 **User page**:
  - Edit profile & favorite genres
  - View stats, watchlist, liked movies, and recommended content
- 🎬 **Details page** for viewing specific movie/show information
- 🌙 **Full dark theme** with consistent background (#121212)
- 📱 **Responsive & minimalistic design**
- 🔧 **Footer** with tech stack and credits (GDSC Mentorship)

## 🛠️ Technologies Used

- **React + Vite**
- **React Router**
- **Tailwind CSS**
- **Mock Data** for demonstration purposes (integrated into component files)

## 🙌 Credits

- **Project by**: Emiliano Huerta (Mentee)
- **Mentor**: Guillermo Jiménez
- Built as part of the **GDSC Mentorship Program**
