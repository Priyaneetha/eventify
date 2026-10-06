# Event Management System (Full-Stack MERN Stack)

A complete, beginner-friendly Full-Stack Event Management System built with **React**, **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **JWT Authentication**, and **Tailwind CSS**.

This project is specifically designed to be simple, highly functional, and easy to explain in viva exams, interviews, and portfolio demonstrations.

---

## 🌟 Features

### 👤 User Features:
- **Browse & Filter Events**: View upcoming events with search, category filtering (Technology, Music, Workshop, Business, Arts, Sports), and price sorting.
- **Detailed Event View**: Check detailed descriptions, venue locations, schedule, capacity meter, and organizer info.
- **User Authentication**: Register a new account or log in using JWT tokens and bcrypt password hashing.
- **Interactive Ticket Booking**: Select ticket quantity with real-time seat availability check and total price computation.
- **Manage Bookings**: View active & past ticket reservations, and cancel bookings with instant seat restoration.
- **User Profile Management**: View profile details and update name, phone, or password.

### 🛡️ Admin Features:
- **Admin Dashboard**: Visual overview of key metrics (Total Events, Active Events, Total Bookings, Total Ticket Sales Revenue, Occupancy Rate).
- **Create Events**: Add new events with custom title, category, date, time, location, ticket price, capacity, and cover image URL.
- **Edit Events**: Modify details or status ('Upcoming', 'Completed', 'Cancelled') of existing events.
- **Delete Events**: Delete events with automatic cascade cancellation of associated bookings.
- **View All Bookings**: Comprehensive table of all attendee bookings across all users.

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js (v19) | Functional components with `useState`, `useEffect`, `useContext` |
| **Build Tool** | Vite | Ultra-fast frontend development server & builder |
| **Routing** | React Router (v7) | Client-side routing with `BrowserRouter`, `Routes`, `Route` |
| **Styling** | Tailwind CSS (v4) | Utility-first CSS with dark theme aesthetics & glassmorphism |
| **Backend** | Node.js & Express.js | REST API server with clean controllers and routes |
| **Database** | MongoDB & Mongoose | Document database with schema models (`User`, `Event`, `Booking`) |
| **Security** | JWT & bcryptjs | Token-based stateless auth and salted password hashing |
| **Icons** | Lucide React | Modern SVG iconography |

---

## 📁 Project Structure

```
event-management/
│
├── client/                      # React Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   │   ├── Navbar.jsx       # Header navigation bar
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   ├── EventCard.jsx    # Card component for event previews
│   │   │   ├── BookingModal.jsx # Ticket booking modal dialog
│   │   │   ├── ProtectedRoute.jsx # User & Admin route guards
│   │   │   └── CreateEditEventModal.jsx # Admin event form modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # React Context for login state & JWT storage
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Landing page with hero banner & top events
│   │   │   ├── EventsPage.jsx   # Catalog with search, filter & sorting
│   │   │   ├── EventDetailsPage.jsx # Full event summary page
│   │   │   ├── LoginPage.jsx    # Login page (with quick demo fill buttons)
│   │   │   ├── RegisterPage.jsx # Registration page with role selector
│   │   │   ├── MyBookingsPage.jsx # User bookings & ticket cancellation
│   │   │   ├── ProfilePage.jsx  # User profile details & update form
│   │   │   ├── AdminDashboardPage.jsx # Admin metrics & control panel
│   │   │   └── NotFoundPage.jsx # 404 page
│   │   ├── services/
│   │   │   └── api.js           # Centralized Axios HTTP client
│   │   ├── App.jsx              # Main App router
│   │   ├── index.css            # Tailwind & global CSS styles
│   │   └── main.jsx             # React DOM root entry
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js & Express Backend Application
│   ├── config/
│   │   └── db.js                # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile logic
│   │   ├── eventController.js   # Event CRUD operations
│   │   └── bookingController.js # Booking creation, listing, cancellation
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification & admin authorization
│   ├── models/
│   │   ├── User.js              # Mongoose User model
│   │   ├── Event.js             # Mongoose Event model
│   │   └── Booking.js           # Mongoose Booking model
│   ├── routes/
│   │   ├── authRoutes.js        # Auth REST endpoints
│   │   ├── eventRoutes.js       # Events REST endpoints
│   │   └── bookingRoutes.js     # Bookings REST endpoints
│   ├── seeder.js                # Database seeder script with demo data
│   ├── server.js                # Express app server entry point
│   ├── package.json
│   └── .env.example             # Sample environment variables
│
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local MongoDB instance or MongoDB Atlas connection string)

### 1. Backend Setup (`server/`)
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (or copy from .env.example)
# Add your MONGO_URI and JWT_SECRET
```

#### Sample `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/event_management_db
JWT_SECRET=super_secret_event_management_jwt_key_2026
```

#### Seed Sample Database:
```bash
# Populate demo users & realistic events
npm run seed
```

> **Demo Credentials Created by Seeder:**
> - **Regular User**: Email: `john@example.com` | Password: `user123`
> - **System Admin**: Email: `admin@event.com` | Password: `admin123`

#### Start Backend Server:
```bash
# Start in development mode with nodemon
npm run dev

# Server runs at: http://localhost:5000
```

---

### 2. Frontend Setup (`client/`)
```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Frontend runs at: http://localhost:5173
```

---

## 📡 REST API Documentation

### 🔐 Auth Endpoints (`/api/auth`)
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`, `role`, `phone`) | Public |
| `POST` | `/api/auth/login` | Login user & return JWT token | Public |
| `GET` | `/api/auth/profile` | Get current user profile details | Private (User) |
| `PUT` | `/api/auth/profile` | Update profile information | Private (User) |

### 📅 Event Endpoints (`/api/events`)
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | List all events (supports `search` & `category` query params) | Public |
| `GET` | `/api/events/:id` | Get details of a single event | Public |
| `POST` | `/api/events` | Create a new event | Admin Only |
| `PUT` | `/api/events/:id` | Update an existing event | Admin Only |
| `DELETE`| `/api/events/:id` | Delete an event and related bookings | Admin Only |

### 🎟️ Booking Endpoints (`/api/bookings`)
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Book ticket(s) for an event | Private (User) |
| `GET` | `/api/bookings/my-bookings` | Get logged-in user's ticket bookings | Private (User) |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking & restore seats capacity | Private (User/Admin) |
| `GET` | `/api/bookings/admin/all` | View all bookings across all users | Admin Only |

---

## 🎓 Viva & Interview Preparation Guide

### Q1: What is JWT Authentication and how is it implemented here?
**Answer:**
JWT (JSON Web Token) is a stateless authentication method. 
1. When a user logs in with email and password, the backend verifies credentials with `bcrypt.compare`.
2. Upon verification, the server generates a signed token using `jwt.sign()` containing payload `{ id, email, role }` and a secret key.
3. The frontend stores this token in `localStorage`.
4. For protected routes, an Axios interceptor attaches the token in the `Authorization: Bearer <token>` header.
5. Backend middleware `verifyToken` verifies the token signature using `jwt.verify()` before giving access to protected controllers.

### Q2: How does capacity management work when booking or cancelling events?
**Answer:**
In `bookingController.js`:
- **When booking**: The controller checks `availableSeats = event.capacity - event.bookedSeats`. If `availableSeats >= ticketsCount`, the booking is saved and `event.bookedSeats += ticketsCount` is updated atomically.
- **When cancelling**: The booking status changes to `'Cancelled'` and `event.bookedSeats -= ticketsCount` releases the seats back into the available pool.

### Q3: What is the purpose of React Context API in this application?
**Answer:**
React Context API (`AuthContext.jsx`) avoids "prop drilling" by providing global authentication state (`user`, `token`, `isAdmin`) and auth methods (`login`, `logout`, `updateUser`) to any component in the application component tree.

### Q4: How is Role-Based Access Control (RBAC) enforced?
**Answer:**
RBAC is enforced on both backend and frontend:
- **Backend**: `authMiddleware.js` contains `isAdmin` middleware which verifies `req.user.role === 'admin'` before allowing administrative requests (`POST`, `PUT`, `DELETE` events).
- **Frontend**: `ProtectedRoute.jsx` exports `AdminRoute` which redirects non-admin users away from `/admin`.

---

## 📜 License
This project is open-source and free for educational and personal portfolio use.
