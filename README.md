# Production Online Tools Platform

## Frontend
cd frontend
npm install
npm run dev

## Backend
cd backend
npm install
npm run dev

## MongoDB
Use Docker:
docker-compose up

Backend runs on http://localhost:5000
Frontend runs on http://localhost:3000

For deployment:
- Backend reads `PORT` automatically and binds to `0.0.0.0`
- Set one of `ALLOWED_ORIGINS`, `CORS_ORIGIN`, or `FRONTEND_URL` to your deployed frontend URL
