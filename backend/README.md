# GLOBALTALK AI Backend

Node.js, Express, Socket.io, MongoDB, Redis, JWT auth, AI translation fallback, and WebRTC signaling.

## Scripts

```bash
npm run dev
npm start
npm run lint
```

## Main Modules

- `config/`: environment, database, Redis
- `models/`: users, chats, messages, calls, notifications, languages, online sessions
- `services/`: chat, call, presence, AI provider manager, translation cache, usage tracking
- `sockets/`: authenticated Socket.io chat and call signaling
- `middleware/`: security, auth, validation, error handling

## Health Check

```bash
GET /api/health
```
