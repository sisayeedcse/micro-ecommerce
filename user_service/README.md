# user-service

Node.js microservice responsible for user registration and authentication. Built with Express.js, MySQL (mysql2), and JWT-based authentication.

## Features
- Ensures the `users` table exists on startup (no migrations/ORM required).
- Secure password hashing with `bcryptjs`.
- JWT-based login with 7-day expiry and payload containing only `id`, `name`, and `email`.
- Minimal Express.js stack with CORS enabled for cross-service calls.

## Prerequisites
- Node.js 18+ and npm.
- Running MySQL instance (e.g., XAMPP/phpMyAdmin) with database `user_service`.

## Environment Variables
Copy `.env` (or create your own) and update values as needed:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=user_service
DB_PORT=3306
JWT_SECRET=replace_with_strong_secret
```

## Installation & Running
```bash
npm install
npm run dev   # uses nodemon
# or
npm start
```
The service listens on `http://localhost:5000` by default and automatically creates the `users` table if it does not exist.

## API Endpoints
- `POST /register` – Body: `{ "name": "John Doe", "email": "john@example.com", "password": "Secret123" }`. Creates a new user (role defaults to `customer`).
- `POST /login` – Body: `{ "email": "john@example.com", "password": "Secret123" }`. Returns `{ "token": "<jwt>" }` with 7-day expiry.

### Example Postman Requests
**Register**
```
POST http://localhost:5000/register
Content-Type: application/json

{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "P@ssw0rd!"
}
```

**Login**
```
POST http://localhost:5000/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "P@ssw0rd!"
}
```

## JWT Validation In Other Microservices
Other services (e.g., `product-service`, `order-service`) can validate tokens by using the shared `JWT_SECRET`:
```js
const jwt = require('jsonwebtoken');

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

try {
  const payload = verifyToken(incomingToken); // { id, name, email }
  // authorize request based on payload.id or email
} catch (err) {
  // token invalid or expired
}
```
No role information is embedded in the JWT; downstream services should derive permissions from their own data stores or request the user-service for additional user details if required.
