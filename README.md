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

## Como rodar o projeto

### Opção 1: com Docker Compose (recomendado)

Pré-requisitos:
- Docker
- Docker Compose

No diretório raiz do projeto, execute:

```bash
docker compose up --build
```

Serviços disponíveis:
- Frontend: http://localhost
- Backend: http://localhost:3000
- GraphQL: http://localhost:3000/graphql

Para parar os containers:

```bash
docker compose down
```

### Opção 2: rodando localmente (sem Docker)

Pré-requisitos:
- Node.js 20+
- npm

1. Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend disponível em: http://localhost:3000
Playground GraphQL: http://localhost:3000/graphql

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em: http://localhost:5173

## Endpoint GraphQL

Query principal:

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

Variáveis:

```json
{
	"input": {
		"search": "Santos, SP"
	}
}
```

