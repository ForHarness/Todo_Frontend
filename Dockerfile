# Use a Node.js image that contains both build tools and runtime environment
FROM node:20-alpine AS builder

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
FROM node:20-alpine

WORKDIR /app

# Copy only the build folder from builder stage
COPY --from=builder /app/build /app/build

# Install serve globally
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "/app/build", "-l", "3000"]
