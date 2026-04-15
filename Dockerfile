FROM node:24-alpine

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@9 --activate && pnpm install
EXPOSE 5173

CMD ["sh", "-c", "pnpm install && pnpm dev --host 0.0.0.0 --port 5173"]
