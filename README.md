# README
## Installation

```
pnpm i
```

Copy .env.example to .env.local, replace credentials appropriately.

## Run server
```
pnpm run dev
```

## Docker
```
cd main
docker build --no-cache -t capstone .
docker run -p 3000:3000 --env-file .env.local capstone
```

## .env.local format

Your main/.env.local should contain the following environment variables:

```
OPENAI_API_KEY

SUPABASE_PRIVATE_KEY
SUPABASE_URL

NEXT_PUBLIC_SUPABASE_PRIVATE_KEY
NEXT_PUBLIC_SUPABASE_URL

CHUNK_SIZE
CHUNK_OVERLAP
```