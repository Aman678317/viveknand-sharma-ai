# GLOBALTALK AI Architecture

This document defines the scalable Phase 1 architecture and the future service boundaries for GLOBALTALK AI. It is intentionally focused on folder/module structure only.

## Root

```text
.
├── backend/                 Node.js API, Socket.io, WebRTC signaling, AI orchestration
├── frontend/                React/Vite client, realtime UI, WebRTC client
├── docs/                    Architecture and engineering notes
├── docker-compose.yml       Local multi-service runtime
├── render.yaml              Render deployment blueprint
└── README.md                Setup and product overview
```

## Backend Structure

```text
backend/
├── src/
│   ├── adapters/            External provider adapters: AI, email, storage, TURN, payments
│   ├── config/              Environment, MongoDB, Redis, runtime configuration
│   ├── controllers/         HTTP request handlers
│   ├── events/              Domain events and future async processing contracts
│   ├── jobs/                Background jobs for retries, cleanup, analytics, AI work
│   ├── middleware/          Auth, validation, security, error handling
│   ├── models/              Mongoose schemas
│   ├── observability/       Logging, metrics, tracing, health probes
│   ├── repositories/        Database access abstraction layer
│   ├── routes/              Express route modules
│   ├── services/            Domain services and orchestration
│   ├── sockets/             Socket.io auth, chat, presence, WebRTC signaling
│   ├── utils/               Shared helpers
│   └── validators/          Request validation rules
├── Dockerfile
├── package.json
└── railway.json
```

## Frontend Structure

```text
frontend/
├── src/
│   ├── animations/          Framer Motion variants and motion utilities
│   ├── components/          Reusable UI components
│   │   ├── call/            Audio/video calling components
│   │   ├── chat/            Message list, composer, receipts, typing indicators
│   │   └── layout/          Navigation and shell components
│   ├── contexts/            Cross-app React providers
│   ├── hooks/               Reusable React hooks
│   ├── layouts/             Routed page layouts
│   ├── pages/               Route-level screens
│   ├── services/            HTTP/API clients
│   ├── sockets/             Socket.io client and realtime bindings
│   ├── store/               Zustand state stores
│   ├── styles/              Tailwind/global styles
│   └── webrtc/              WebRTC client managers and media utilities
├── Dockerfile
├── package.json
├── vercel.json
└── vite.config.js
```

## Service Boundaries

- Auth service: signup, login, refresh rotation, logout, protected sessions.
- User service: profiles, language preferences, contacts, presence metadata.
- Chat service: direct chats, messages, read receipts, delivery state.
- Translation service: provider fallback, caching, usage tracking, monitoring.
- Realtime service: Socket.io auth, presence, typing, message delivery.
- Calling service: call lifecycle, WebRTC signaling, call history, quality metrics.
- Notification service: future push/email/in-app notifications.
- Observability service: metrics, logs, traces, health checks.

## Future Microservice Extraction

The monolith is modular by boundary so it can later split into:

- `identity-service`
- `chat-service`
- `translation-service`
- `realtime-gateway`
- `webrtc-signaling-service`
- `notification-service`
- `marketplace-service`
- `meeting-ai-service`

## Step 1 Validation

- Backend has clear module boundaries for API, data, realtime, AI, and infrastructure.
- Frontend has clear module boundaries for pages, state, realtime, WebRTC, and reusable UI.
- Add `.gitkeep` to directories that are part of the planned architecture but will contain no code in Phase 1. Examples: `backend/src/events`, `backend/src/observability`, `frontend/src/components/chat`.
- No secrets are committed; environment variables remain in `.env.example` files only.
