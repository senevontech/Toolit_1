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

## Production baseline

Frontend:
- Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL`
- Run `npm run verify`
- Run `npm run build` from `frontend`

Backend:
- Copy `backend/.env.example` to your deployment environment
- Ensure MongoDB is reachable via `MONGO_URI`
- Ensure Redis is reachable via `REDIS_URL`
- Install Python 3 and `pip3 install -r requirements.txt`
- Install LibreOffice and set `LIBREOFFICE_PATH` if it is not on the default path
- Run `npm run verify`
- Run `npx nest build` or `npm run build`
- Run the API with `npm run start:prod`
- Run the worker with `npm run worker`

Operational checks:
- `GET /health` should return status `ok`
- `GET /health/ready` should report Mongo, Redis, and queue readiness plus queue counts
- Converter routes are rate-limited by environment-configurable limits
- Upload validation now checks file extension and detected file signature where possible
- Converter uploads enqueue async jobs and require the worker plus Redis to be running
- Queue jobs now retry with backoff and retain bounded completed/failed job history

## CI and quality gates

Frontend:
- `npm run validate:env`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

Backend:
- `npm run validate:env`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build:app`

GitHub Actions:
- Workflow file: `.github/workflows/ci.yml`
- Runs frontend and backend gates separately on push and pull request

## Containers

Frontend container:
- `frontend/Dockerfile`
- Serves the static export with Nginx

Backend container:
- `backend/Dockerfile`
- Includes Python, LibreOffice, and Poppler for file conversions

Full stack compose:
- `docker-compose.prod.yml`
- Builds frontend, backend API, worker, Redis, and MongoDB
