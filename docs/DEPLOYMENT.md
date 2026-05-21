# GLOBALTALK AI Deployment Guide

This guide deploys the Phase 1 MVP with:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas M0 free cluster
- Cache/session/realtime support: Upstash Redis free/serverless database

## 1. Free Database

Use MongoDB Atlas M0 for the application database.

1. Create a MongoDB Atlas project.
2. Create an `M0` free cluster.
3. Create a database user.
4. Add Render outbound access to the Atlas IP access list. For quick MVP testing, Atlas can allow `0.0.0.0/0`; tighten this before production.
5. Copy the connection string into Render as:

```bash
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/globaltalk?retryWrites=true&w=majority
```

## 2. Free Redis

Use Upstash Redis for serverless Redis.

1. Create an Upstash Redis database.
2. Copy the Redis connection URL.
3. Add it to Render as:

```bash
REDIS_URL=rediss://default:<password>@<host>:<port>
```

Use `rediss://` when Upstash provides a TLS URL.

## 3. Backend on Render

Create a Render Web Service from the GitHub repository:

```text
Repository: Aman678317/viveknand-sharma-ai
Root Directory: backend
Runtime: Docker
Health Check Path: /api/health
```

Required Render environment variables:

```bash
NODE_ENV=production
CLIENT_ORIGIN=https://<your-vercel-app>.vercel.app
MONGO_URI=<mongodb-atlas-uri>
REDIS_URL=<upstash-redis-url>
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
GEMINI_API_KEY=<optional-primary-ai-key>
DEEPSEEK_API_KEY=<optional-fallback-ai-key>
OPENAI_API_KEY=<optional-fallback-ai-key>
STUN_SERVERS=stun:stun.l.google.com:19302
TURN_URL=
TURN_USERNAME=
TURN_CREDENTIAL=
```

After deployment, verify:

```text
https://<your-render-service>.onrender.com/api/health
```

## 4. Frontend on Vercel

Create a Vercel project from the same GitHub repository:

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Required Vercel environment variables:

```bash
VITE_API_URL=https://<your-render-service>.onrender.com/api
VITE_SOCKET_URL=https://<your-render-service>.onrender.com
```

Redeploy the frontend after setting these variables.

## 5. Final Wiring

After Vercel gives you the frontend URL:

1. Go back to Render.
2. Set `CLIENT_ORIGIN` to the exact Vercel URL.
3. Redeploy the Render backend.
4. Test signup, login, chat, and socket connection from the Vercel app.

## 6. Production Hardening

- Replace any broad Atlas IP allowlist with tighter network controls when moving beyond MVP.
- Add a managed TURN service for reliable WebRTC on mobile and restrictive networks.
- Keep all API keys in platform environment variables only.
- Use strong random values for `JWT_SECRET` and `JWT_REFRESH_SECRET`.
- Monitor Render logs for MongoDB, Redis, and Socket.io connection errors after deploy.
