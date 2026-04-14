# 10B - Premium Fashion & Footwear Platform

A production-ready full-stack e-commerce platform for elite fashion, featuring real-time inventory management and a modern, high-performance UI.

## Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Zustand, Socket.io-client.
- **Backend**: Node.js, Express, PostgreSQL (Sequelize), Socket.io, JWT.
- **Tools**: Axios, Lucide React, BcryptJS.

## Key Features
- **Real-time Synchronization**: Product updates from the admin panel are instantly reflected across all clients via WebSockets.
- **Premium Design System**: Custom-built with a focus on luxury aesthetics, smooth animations, and dark mode support.
- **Robust Authentication**: Secure registration and login with JWT-based sessions and role-based access control.
- **Advanced Shop System**: Search, filter, and dynamic product discovery with persistent cart management.
- **Dedicated Dashboards**: User profiles for order history and a powerful organizer panel for full inventory control.

## Team
- **Prabin Raj Dhungana**: CEO & CTO (Pulchowk Campus)
- **Diwas Adhikari**: Event Manager
- **Dinesh Subedi**: Finance Manager
- **Samip Benpal**: Marketing Manager

## Quick Start

### 1. Requirements
- Node.js installed
- PostgreSQL running locally (default: `postgres://postgres:password@localhost:5432/10B`)

### 2. Backend Setup
```bash
cd server
npm install
node seeder.js # Populate initial products
npm run dev # Starts on port 5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev # Starts on port 5173
```

## Real-time Showcase
Open the platform in two browser windows. Log in as an admin in one and browse as a user in the other. Update a product price or delete an item in the Admin Dashboard, and watch it update instantly on the User Shop without a refresh.
