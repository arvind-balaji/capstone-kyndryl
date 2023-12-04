# README

## Storing environment variables

See main/.env.example to format your main/.env.local file

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

Copy .env.example to .env.local, replace credentials appropriately.

## How to run locally

### Installation

Install node.js version 20.9 and npm version 10.1.0

Using npm, install pnpm using the command below:

```
npm install -g pnpm
```

Run the command below to install all required packages

```
pnpm i
```

### Run server

After creating the main/.env.local file, use the command below to run the server

```
pnpm run dev
```

## How to run with Docker
```
cd main
docker build --no-cache -t capstone .
docker run -p 3000:3000 --env-file .env.local capstone
```

