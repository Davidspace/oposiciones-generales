#!/bin/bash
echo "Building frontend for Vercel deployment..."
npx vite build --config vite.config.prod.ts
echo "Build completed successfully!"