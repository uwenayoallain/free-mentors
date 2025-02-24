FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Build the react app for prod
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Install a lightweight http server
RUN npm install -g serve

# Serve the app
CMD ["serve", "-s", "build"]