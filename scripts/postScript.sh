#!/bin/bash

cd /home/ubuntu/node/LMS-Backend

echo "Installing dependencies..."
npm install
npm audit fix
npm audit fix --force

echo "Restarting server..."
pm2 stop 1
pm2 start 1
pm2 restart 1


echo "Deployment completed!"