# Use an official Node.js LTS (Long Term Support) version as a parent image
FROM node:16

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Expose port 4000 to the outside world
EXPOSE 3000

RUN npm run build

CMD npm start
