# Environment Variables

This document describes the environment variables required to run the Medical Assistant app.

## Required Variables

### `ANTHROPIC_API_KEY`
Your Claude API key from Anthropic. Get one at https://console.anthropic.com/

```
ANTHROPIC_API_KEY=sk-ant-...
```

### `REDIS_URL`
Connection URL for Railway Redis. Get this from your Railway dashboard after creating a Redis instance.

```
REDIS_URL=redis://default:password@host:port
```

## Optional Variables

### `NODE_ENV`
Set to `production` for production deployments.

```
NODE_ENV=development
```

## Setting Up on Railway

1. Create a new project on Railway
2. Add a Redis service
3. Add a Web service from your GitHub repo
4. Add the environment variables above to your web service
5. Deploy

## Local Development

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=your_key_here
REDIS_URL=redis://localhost:6379
```

For local Redis, you can use Docker:
```bash
docker run -d -p 6379:6379 redis:alpine
```
