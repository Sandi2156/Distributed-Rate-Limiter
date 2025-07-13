# Use official Node image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY ./src ./src
COPY .env .env

# Expose port
EXPOSE 3000

# Command to run the app
CMD ["node", "src/index.js"]
