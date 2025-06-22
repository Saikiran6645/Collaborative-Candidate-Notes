# Collaborative Candidate Notes MVP

A real-time candidate evaluation tool for recruiters and hiring managers. Users can leave notes on candidates, mention others using `@username`, and receive live notifications and alerts. Built with React, Node.js, MongoDB, and Socket.IO.

---

## 🚀 Features

- **Secure Authentication**: Users register and log in using email/password. Authentication is handled via JWT stored in HttpOnly cookies.
- **Dashboard & Candidates List**: Authenticated users can view and create dummy candidates.
- **Real-Time Notes Room**: Each candidate has a shared notes page with live updates among participants.
- **Mentions & Tagging**:
  - Type `@username` to mention colleagues.
  - Tagged individuals receive an in-app notification, toast alert, and items appear in a global notification card.
- **Global Notifications**: All mention-based notifications are listed globally. Clicking a notification navigates to the specific note and highlights it.
- **Delete Notifications**: Users can delete notifications they have received.

---

## 🛠 Tech Stack

- **Frontend**:
  - React (v19.1), Vite
  - Tailwind CSS + ShadCN UI
  - Redux Toolkit for global state
  - React Query for data fetching
  - React Router for routing
  - Socket.IO client for real-time events
  - React-Toastify for in-app alerts

- **Backend**:
  - Node.js + Express
  - Socket.IO for real-time communication
  - MongoDB with Mongoose ODM
  - JWT-based authentication with cookies
  - Password security using bcrypt
  - CORS and cookie-parser middleware

---

## 🛡 Architecture Overview

1. **User Authentication**  
   Register/login via email and password → receive JWT in a secure, HttpOnly cookie.
2. **Dashboard & Data Fetching**  
   Frontend loads list of candidates and fetches notes on candidate page.
3. **Socket.IO**  
   Clients join a `candidateId` room on page load.  
   Sending a note triggers both a REST POST and a Socket.IO event.
4. **Real-Time Events**  
   Backend saves note → emits `receiveNote` to all clients in the candidate room.  
   Detects `@mentions` → creates notifications in MongoDB → emits `notification` to online tagged users.
5. **Frontend Notifications**  
   Clients handle `notification` events → display toast & add to global notifications UI.
6. **Navigation & Cleanup**  
   Clicking a notification navigates to the note view + highlights the item. Notifications can be deleted.


## 📦 Installation

Follow these steps to run the application locally:

### Prerequisites
Ensure the following are installed on your machine:
- Node.js and npm (v18+)
- MongoDB (local instance or Atlas)
### clone this repo
```bash
git clone https://github.com/Saikiran6645/Collaborative-Candidate-Notes.git
```
### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials:
# MONGO_URI, JWT_SECRET, JWT_EXPIRE, COOKIE_EXPIRE
npm run dev

```
### Frontend Setup 
```bash
cd frontend
npm install
npm run dev

```


