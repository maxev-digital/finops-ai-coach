#!/bin/bash
set -e

PROJECT=/var/www/finops-ai-coach
cd "$PROJECT"

echo "==> Pulling latest main..."
git pull origin main

echo "==> Installing backend dependencies..."
cd backend
pip3 install -r requirements.txt
cd ..

echo "==> Building frontend..."
cd frontend
npm install
npm run build
cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
cp -r public .next/standalone/public 2>/dev/null || true
cd ..

echo "==> Restarting services..."
pm2 restart finops-coach-api || pm2 start ecosystem.config.js --only finops-coach-api
pm2 restart finops-coach-frontend || pm2 start ecosystem.config.js --only finops-coach-frontend

echo "==> Done. Status:"
pm2 list | grep finops
