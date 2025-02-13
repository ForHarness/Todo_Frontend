# Use a Node.js image that contains both build tools and runtime environment
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Create a lightweight production image
FROM node:20-alpine

WORKDIR /app

# Copy only the build folder and necessary files from builder stage
COPY --from=builder /app/build /app/build

# Install serve globally
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Set the command to run the application
CMD ["serve", "-s", "/app/build", "-l", "3000"]

# Metadata (optional)
LABEL maintainer="shubham@example.com"
LABEL version="1.0"
LABEL description="A simple React app served with serve."
