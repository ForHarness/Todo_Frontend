# Use a stable Node.js version (18 instead of 20)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Clear npm cache before installing dependencies
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Create a lightweight production image
FROM node:18-alpine

WORKDIR /app

# Copy only the build folder from builder stage
COPY --from=builder /app/build /app/build

# Install serve globally
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "/app/build", "-l", "3000"]
