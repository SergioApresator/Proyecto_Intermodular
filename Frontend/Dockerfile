# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve the application using Node.js
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json ./
RUN npm ci --only=production --legacy-peer-deps
EXPOSE 4000
ENV PORT=4000
CMD ["npm", "run", "serve:ssr:practicaFormApp"]
