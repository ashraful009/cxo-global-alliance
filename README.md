# CXO Global Alliance

A professional executive networking platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

- `frontend/`: React + Vite application with Tailwind CSS.
- `backend/`: Node.js + Express REST API.

## Prerequisites

- Node.js
- MongoDB
- Cloudinary account for image hosting

## Environment Variables

Create a `.env` file in the `backend/` directory based on `backend/.env.example`.

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

## How to Run

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default and proxies `/api` requests to the backend on `http://localhost:5000`.
