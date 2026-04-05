#!/bin/bash

cd /home/ubuntu/node/LMS-Backend

echo "Installing dependencies..."
npm install

echo "Restarting server..."
pm2 start index.js

echo "Deployment completed!"