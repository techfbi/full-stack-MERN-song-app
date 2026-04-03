#  MERN Stack Song App

A full-stack web application that allows users to create, manage, and interact with their favorite songs.

Users can sign up, log in, add songs, edit them, and manage their own collection in a clean and simple interface. (performs all the CRUD operations)

---

## Live Demo

[View Live App](#)

*https://favvy-song.vercel.app/*
*https://favvy-song.onrender.com/*

---

## What this project does

This app allows users to:

* Create an account and log in
* Add new songs with preffered rating
* Edit existing songs
* Delete songs
* View a list of songs
* See when songs were added
* sort songs

Each user manages their own songs securely.

---

## Tech Stack

### Frontend

* React (Vite)
* Context API
* Custom Hooks

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Authentication & Security

* JWT Authentication (access and refresh tokens)
* Protected Routes
* Rate Limiting
* Safe rendering (prevents XSS via React)
* Input sanitization
* HTTP + Secure cookies
* CSP headers

---

## Project Structure

```
frontend/
  components/   # UI components (Navbar, Song cards, Forms, Modal)
  pages/        # App pages (Login, Signup, Song list, About)
  contexts/     # Global state (Auth, Songs, Email reset)
  hooks/        # Custom hooks (auth, logout, etc.)

backend/
  models/       # MongoDB schemas (User, Song)
  routes/       # API endpoints
  middleware/   # Auth protection + rate limiter
  server.js     # App entry point
```

---

## Authentication Flow

* User signs up or logs in
* Backend generates a JWT access and refresh tokens
* Token is used to access protected routes
* Backend verifies token before allowing access
* Backend verifies access token on every request for 15 mins before it expires
* When access token expires, the refresh token is used to refresh the acccess token and get a new one without users being logged out
* Refresh token expires in a day, so users gets logged out

---

## UI / UX Decisions

* Simple and clean layout
* Responsive navbar (users mail display on tab and a profile icon on mobile)
* Modal is used when users adds more than 4 songs, to prevent continous scrolling
* Modal used for editing songs (better UX)
* Loading indicators for async actions (especially buttons)
* Time-based feedback (e.g. “3 minutes ago”)
* Conditional rendering (e.g. showing user email based on screen size)
* Edit icon shows on song title mouse hover in tablet and pc, it shows on song title click in mobile

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/techfbi/full-stack-MERN-song-app.git
cd your-repo
```

---

### 2️. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret
FRONTEND_URL=frontend_url
```

Run backend:

```bash
npm run dev
```

---

### 3️. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## Key Features

* Full CRUD functionality for songs
* User authentication with JWT
* Protected backend routes
* Global state management with Context API
* Custom React hooks for cleaner logic
* Rate limiting for basic API protection
* Modal-based editing
* Responsive navigation
* Input sanitization

---

## What I Learned

* Structuring a full MERN stack application
* Managing global state with Context API
* Building and protecting API routes
* Handling authentication with JWT
* Improving UI/UX with conditional rendering and modals
* Writing reusable logic with custom hooks
* Applying basic security practices (I am very big on security)

---

## Future Improvements

* Add search and filtering for songs
* Improve UI design and animations
* Improve user profile page
* Add pagination for large datasets
* Add music few mins play, like when selecting music in Instagram and snapchat so users can play their added song
* Add a general homepage for authenticated and non authenticated users

---

## Acknowledgement

This project was built as part of my learning journey in full-stack web development. And i really learnt a lot. 

---

## Contact

* Email: *femiwebfullstack@gmail.com*

