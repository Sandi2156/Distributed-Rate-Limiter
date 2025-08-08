# Distributed Rate Limiter

A scalable distributed rate limiter for managing API request limits across multiple services.

## Table of Contents

- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/distributed-rate-limiter.git
   cd distributed-rate-limiter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

## Environment Variables

You need two `.env` files. One for api and another for ui.

### API

```env
PORT=3000
REDIS_HOST=redis://localhost:6379
MONGO_URI=''
JWT_SECRET=''
```

### UI

```env
VITE_API_BASE_URL=http://localhost:3000
```
