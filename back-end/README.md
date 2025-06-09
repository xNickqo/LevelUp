# Generic CRUD API

A simple Node.js API that provides CRUD operations for any entity type using a JSON file as a database.

## Features

- Create, read, update, and delete any JSON entity
- Flexible schema - store any type of entity
- UUID generation for unique IDs
- JSON file storage - no database setup required
- Interactive API documentation with Swagger
- User authentication with JWT
- Protected API endpoints

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Usage

Start the development server:

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

The server will run on http://localhost:3000 by default.

## Authentication

All API endpoints require authentication. You need to:

1. Register a user (signup) or login (signin) to get a JWT token
2. Include the token in the Authorization header of your requests

### Authentication Endpoints

| Method | Endpoint     | Description               |
| ------ | ------------ | ------------------------- |
| POST   | /auth/signup | Register a new user       |
| POST   | /auth/signin | Login and get a JWT token |

### Example Authentication

#### Register a new user:

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "yourpassword", "name": "Your Name"}'
```

#### Login with existing user:

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "yourpassword"}'
```

Both endpoints will return a JWT token that you need to use in subsequent requests.

## API Documentation

The API documentation is available at http://localhost:3000/api-docs when the server is running.

This interactive documentation powered by Swagger allows you to:

- Explore all available endpoints
- See request/response models
- Test the API directly from your browser

## API Endpoints

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| GET    | /api/entities     | Get all entities          |
| GET    | /api/entities/:id | Get entity by ID          |
| POST   | /api/entities     | Create a new entity       |
| PUT    | /api/entities/:id | Update an existing entity |
| DELETE | /api/entities/:id | Delete an entity          |

## Example Requests

All API requests require the JWT token in the Authorization header.

### Create a new entity

```bash
curl -X POST http://localhost:3000/api/entities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "Example Entity", "description": "This is an example entity", "status": "active"}'
```

### Get all entities

```bash
curl http://localhost:3000/api/entities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get entity by ID

```bash
curl http://localhost:3000/api/entities/YOUR_ENTITY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update an entity

```bash
curl -X PUT http://localhost:3000/api/entities/YOUR_ENTITY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "Updated Entity", "status": "inactive"}'
```

### Delete an entity

```bash
curl -X DELETE http://localhost:3000/api/entities/YOUR_ENTITY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
