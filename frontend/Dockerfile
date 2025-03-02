FROM node:20-alpine

WORKDIR /app

# Install PNPM
RUN npm install -g pnpm

# Copy package.json and lockfile, then install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Build the React app with Vite & SWC
RUN pnpm build

# Expose port 3000
EXPOSE 3000

# Serve the built app using "serve" (installed as a project dependency)
RUN pnpm add serve

# Start the app
CMD ["pnpm", "serve", "-s", "dist", "-l", "3000"]

