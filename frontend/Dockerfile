FROM node:20-alpine

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# CRA dev server runs on 3000
EXPOSE 3000

# For running in Docker reliably
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["npm", "start"]
