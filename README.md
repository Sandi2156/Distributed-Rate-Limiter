# Distributed Rate Limiter

A scalable distributed rate limiter for managing API request limits across multiple services.

## Table of Contents

- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Important Commands](#important-commands)
- [Tech Stack used for Deployment](#tech-stack-used-for-deployment)

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

## Important Commands

### Lambda Commands

```cli
aws lambda update-function-configuration \
  --function-name my-function \
  --environment "Variables={BUCKET=amzn-s3-demo-bucket,KEY=file.txt}"

aws lambda update-function-configuration \
  --function-name my-function \
  --environment "Variables={BUCKET=amzn-s3-demo-bucket,KEY=file.txt}"
```

## Tech Stack used for Deployment

1. UI

- Stored static files in AWS S3
- Integrated with Route 53 to enable custom domain

2. API

- Deployed on AWS Lambda
- Routed using AWS Gateway

3. MongoDB

- MongoDB Atlas Free Cluster

4. Redis

- Free version in [Aiven](https://console.aiven.io/)
