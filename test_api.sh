#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000/api"

# Test GET /rooms
echo "Testing GET /rooms"
curl -s -X GET "$BASE_URL/rooms" | jq
echo ""

# Test GET /rooms/1
echo "Testing GET /rooms/1"
curl -s -X GET "$BASE_URL/rooms/1" | jq
echo ""

# Test GET /class-schedules/daily?date=2024-03-19
echo "Testing GET /class-schedules/daily?date=2024-03-19"
curl -s -X GET "$BASE_URL/class-schedules/daily?date=2024-03-19" | jq
echo ""

# Test GET /import/templates/room
echo "Testing GET /import/templates/room"
curl -s -X GET "$BASE_URL/import/templates/room" --output room_template.xlsx
echo "Room template downloaded to room_template.xlsx"
echo ""

# Test POST /import/rooms (requires a valid Excel file)
echo "Testing POST /import/rooms"
curl -s -X POST "$BASE_URL/import/rooms" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@room_template.xlsx" | jq
echo ""

# Test GET /class-schedules/statistics
echo "Testing GET /class-schedules/statistics"
curl -s -X GET "$BASE_URL/class-schedules/statistics" | jq
echo ""

# Test GET /rooms/1/availability?startDate=2024-03-19&endDate=2024-03-20
echo "Testing GET /rooms/1/availability?startDate=2024-03-19&endDate=2024-03-20"
curl -s -X GET "$BASE_URL/rooms/1/availability?startDate=2024-03-19&endDate=2024-03-20" | jq
echo ""

# Test GET /rooms/1/history?startDate=2024-03-19&endDate=2024-03-20
echo "Testing GET /rooms/1/history?startDate=2024-03-19&endDate=2024-03-20"
curl -s -X GET "$BASE_URL/rooms/1/history?startDate=2024-03-19&endDate=2024-03-20" | jq
echo ""

echo "API testing completed"
