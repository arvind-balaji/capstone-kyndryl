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