FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 3412
EXPOSE 3412

# Set environment variable for web port
ENV EXPO_WEB_PORT=3412

# Start the development server
CMD ["npm", "run", "web"] 