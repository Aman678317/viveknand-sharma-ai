# GLOBALTALK AI

GLOBALTALK AI is a production-oriented Phase 1 MVP for multilingual realtime communication: secure auth, profiles, direct chat, AI translation, Socket.io presence, and WebRTC one-to-one audio/video calling.

## Architecture

```text
frontend/
  src/pages              routed app screens
  src/components         reusable chat/call/layout UI
  src/store              Zustand auth and chat state
  src/services           Axios API client
  src/sockets            Socket.io client
  src/webrtc             RTCPeerConnection manager

backend/
  src/config             env, MongoDB, Redis
  src/controllers        HTTP handlers
  src/services           auth-adjacent domain logic, AI, chat, call, presence
  src/routes             API route modules
  src/middleware         auth, validation, security, error handling
  src/models             Mongoose schemas
  src/sockets            Socket.io chat and WebRTC signaling
```

## Phase 1 Features

- JWT access tokens plus rotating refresh-token cookies
- Signup, login, logout, refresh, protected user profile routes
- User profile metadata, preferred language, online status, contacts-ready schema
- Direct chat creation, chat history, message persistence, read/delivery fields
- Realtime Socket.io events: `user-online`, `user-offline`, `send-message`, `receive-message`, `typing-start`, `typing-stop`, `message-read`, `reconnect-user`
- AI translation orchestration with Gemini, DeepSeek, then OpenAI fallback
- Redis translation cache, AI usage counters, presence sessions, active call state
- WebRTC signaling events: `call-user`, `incoming-call`, `accept-call`, `reject-call`, `offer`, `answer`, `ice-candidate`, `end-call`, `reconnect-call`
- Audio/video calling UI with mic, camera, fullscreen, timer-ready quality monitoring
- Docker Compose for MongoDB, Redis, backend, and frontend
- Vercel, Railway, and Render deployment config

## Local Setup

1. Copy `.env.example` to `.env`.
2. Fill `JWT_SECRET`, `JWT_REFRESH_SECRET`, `MONGO_URI`, `REDIS_URL`, and any AI provider keys.
3. Install dependencies:

```bash
cd backend
npm install
cd ../frontend
npm install
```

4. Start the backend:

```bash
cd backend
npm run dev
```

5. Start the frontend:

```bash
cd frontend
npm run dev
```

The app runs at `http://localhost:5173`; the API runs at `http://localhost:4000`.

## Docker

```bash
docker compose up --build
```

This starts MongoDB, Redis, the Node API, and an Nginx-served frontend.

## Environment

Important variables:

```bash
CLIENT_ORIGIN=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/globaltalk
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
GEMINI_API_KEY=
DEEPSEEK_API_KEY=
OPENAI_API_KEY=
STUN_SERVERS=stun:stun.l.google.com:19302
TURN_URL=
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

## API Surface

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/users/profile`
- `PATCH /api/users/profile`
- `GET /api/users/search`
- `GET /api/users/status`
- `POST /api/chat/create`
- `GET /api/chat`
- `GET /api/chat/messages/:chatId`
- `POST /api/chat/send`
- `GET /api/calls/history`
- `GET /api/calls/status`
- `POST /api/translate/message`

## Production Notes

Use MongoDB Atlas and Redis Cloud in production. Add a managed TURN service such as Twilio/Numb, Metered, or your own Coturn deployment for reliable WebRTC behind restrictive networks. Keep AI keys in platform secrets only; never commit `.env`.

The backend is ready for future service extraction: AI orchestration, chat, calls, presence, and auth are already isolated by module boundaries.
# viveknand-sharma-ai
