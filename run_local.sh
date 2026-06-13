#!/bin/bash

# Configuration
PORT=8001

echo "========================================="
echo "Starting local server for Portfolio..."
echo "========================================="

# Find any process using port 8001
PID=$(lsof -t -i :$PORT)

if [ -n "$PID" ]; then
    echo "⚠️ Port $PORT is already in use by PID: $PID"
    echo "Shutting down the existing server..."
    kill -9 $PID
    sleep 1
    echo "Done."
else
    echo "✓ Port $PORT is free."
fi

echo "🚀 Starting server at http://localhost:$PORT..."
echo "Press Ctrl+C to stop the server."
echo "-----------------------------------------"

# Run python server in foreground to display logs directly
python3 -m http.server $PORT
