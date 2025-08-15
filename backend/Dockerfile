# Use official Node.js LTS version as base image
FROM node:18

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the port your backend listens on (e.g., 5000)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
