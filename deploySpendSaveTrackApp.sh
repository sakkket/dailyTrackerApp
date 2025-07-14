#!/bin/bash

echo "Pulling latest code from Git..."
git pull origin main || { echo "Git pull failed"; exit 1; }

echo " Building React app..."
npm install
npm run build || { echo "Build failed"; exit 1; }

echo "Restarting PM2 process..."
pm2 restart react-app || { echo "PM2 restart failed"; exit 1; }

echo "Deployment complete!"

