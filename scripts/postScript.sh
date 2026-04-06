#!/bin/bash

cd /home/ubuntu/node/LMS-Backend

echo "Installing dependencies..."
npm install
npm audit fix
npm audit fix --force

echo "Restarting server..."
pm2 restart backend

echo "Deployment completed!"