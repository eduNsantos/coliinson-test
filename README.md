# Weather Activity Ranking API

## Overview
This application receives a city or town and returns a ranking of how suitable it is to perform certain activities over the next 7 days, based on weather data.

### Activities
- Skiing
- Surfing
- Outdoor sightseeing
- Indoor sightseeing

The ranking is calculated using factors such as temperature, precipitation, and general weather conditions.

---

## Architecture

The project was built using **Domain-Driven Design (DDD)** and **Clean Architecture**.

This approach was chosen to keep the business rules independent from external concerns like frameworks or APIs, making the codebase easier to maintain, test, and evolve.

### Project structure

```
src/
├── domain/ # Core business logic
├── application/ # Use cases and DTOs
├── infrastructure/ # External integrations (APIs, etc.)
├── presentation/ # Resolvers GraphQL (NestJS)
```
---
AI was used as a support tool during development, mainly for:
- Defining and refining scoring rules
- Understanding some NestJS concepts
- Generating a simple frontend interface
- Read OpenMeteo docs and generate examples
---

## How to run the project

### Option 1: with Docker Compose (recommended)

Prerequisites:
- Docker
- Docker Compose

From the project root directory, run:

```bash
docker compose up --build
```

Available services:
- Frontend: http://localhost
- Backend: http://localhost:3000
- GraphQL: http://localhost:3000/graphql

To stop the containers:

```bash
docker compose down
```

### Option 2: running locally (without Docker)

Prerequisites:
- Node.js 20+
- npm

1. Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend available at: http://localhost:3000
Playground GraphQL: http://localhost:3000/graphql

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: http://localhost:5173

## Endpoint GraphQL

Main query:

```graphql
query GetRanking($input: GetRankingInput!) {
	ranking(input: $input) {
		date
		ranking {
			activity
			score
		}
	}
}
```

Variables:

```json
{
	"input": {
		"search": "Santos, SP"
	}
}
```

## Activity evaluation rules

Scoring rules are applied per day, and each activity receives a score from **0 to 100** (with rounding and min/max clamping).

### General scale

- Score range: 0 to 100
- Rounding: nearest integer
- Limits: any value below 0 becomes 0, and above 100 becomes 100
- "Good day" threshold for an activity: score >= 60

### Outdoor sightseeing (outdoor)

Goal: favor days with pleasant temperatures and low rain.

Formula:

```text
score = 100
	- |max_temperature - 24| * 3
	- rain * 8
```

### Surf

Goal: favor wind close to ideal, without excessive gusts, and with lower rain.

Formula:

```text
score = 100
	- |wind - 22| * 4
	- max(0, gust - 35) * 2
	- rain * 3
```

### Ski

Goal: favor snow and lower temperatures, while penalizing rain.

Formula:

```text
score = snow * 18
	+ max(0, 12 - max_temperature) * 4
	- rain * 6
```

### Indoor sightseeing (indoor)

Goal: favor poor conditions for outdoor activities (rain, excessive heat, and snow).

Formula:

```text
score = 20
	+ rain * 7
	+ max(0, max_temperature - 28) * 4
	+ snow * 3
```

### How the final ranking is built

- For each forecast day, the system calculates the 4 scores (surf, outdoor, ski, indoor).
- Then it sorts them from highest to lowest score.
- The API response returns the daily ranking with activities already ordered.

