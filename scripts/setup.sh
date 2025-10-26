#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check if required environment variables are set
if [ -z "$DATA_GOV_API_KEY" ]; then
  echo "Error: DATA_GOV_API_KEY environment variable is not set"
  exit 1
fi

# Install dependencies
npm install

# Build the application
npm run build

# Start Docker containers
docker-compose up -d

echo "Application is now running at http://localhost:3000"