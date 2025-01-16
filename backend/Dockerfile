# Use Node.js LTS image
FROM node

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the app port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
