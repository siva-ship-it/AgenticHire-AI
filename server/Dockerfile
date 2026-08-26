FROM node:20-alpine AS dependencies
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app/server
ENV NODE_ENV=production
COPY --from=dependencies /app/server/node_modules ./node_modules
COPY server/src ./src
COPY server/package.json ./package.json
COPY specs /app/specs
RUN mkdir -p uploads logs && chown -R node:node /app
USER node
EXPOSE 5000
CMD ["node", "src/index.js"]
