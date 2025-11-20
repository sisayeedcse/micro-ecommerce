# Order Service

Node.js microservice that manages user orders for a simple e-commerce platform. It exposes REST endpoints, persists data in MySQL, fetches product data from `product-service`, and authenticates requests with JWTs issued by `user-service`.

## Requirements

- Node.js 18+
- MySQL (tested with XAMPP/phpMyAdmin)
- Product service reachable at `http://product-service` (configurable via env)

## Environment

Copy `.env` and adjust if needed:

```
PORT=4002
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=order_service
DB_PORT=3306
JWT_SECRET=mysecret
PRODUCT_SERVICE_URL=http://product-service
```

## Install & Run

```bash
npm install
npm run dev   # nodemon
# or
npm start     # plain node
```

The service automatically ensures the `orders` table exists on startup via `CREATE TABLE IF NOT EXISTS`.

## Authentication Flow (user-service → order-service)

1. A client authenticates with `user-service` (or auth gateway) and receives a JWT containing at least `id`, `name`, and `email` claims.
2. The client calls any `/orders` endpoint with `Authorization: Bearer <token>`.
3. `order-service` verifies the token using `JWT_SECRET`. If valid, it attaches `req.user = { id, name, email }` and uses `user.id` as `user_id` for all queries. Payloads never accept `user_id` directly, eliminating spoofing risks.

## Product-Service Integration (axios)

- `order-service` calls `GET ${PRODUCT_SERVICE_URL}/products/:id` through axios before every order creation.
- Response is expected to expose at least `price` and `stock`.
- The service aborts order creation if the product is unavailable or stock is insufficient and computes `total_price = price * quantity` locally before inserting the order.

## API Endpoints

All endpoints require `Authorization: Bearer <jwt>`.

### POST /orders

Create an order using the authenticated user and product data.

**Request**
```
POST http://localhost:4002/orders
Headers:
  Content-Type: application/json
  Authorization: Bearer <jwt>
Body:
{
  "product_id": 12,
  "quantity": 2
}
```

**Response** `201`
```
{
  "id": 5,
  "user_id": 3,
  "product_id": 12,
  "quantity": 2,
  "total_price": "199.98",
  "status": "pending",
  "created_at": "2025-11-21T10:24:18.000Z"
}
```

### GET /orders

Fetch all orders for the authenticated user.

**Request**
```
GET http://localhost:4002/orders
Headers:
  Authorization: Bearer <jwt>
```

**Response** `200`
```
[
  {
    "id": 5,
    "user_id": 3,
    "product_id": 12,
    "quantity": 2,
    "total_price": "199.98",
    "status": "pending",
    "created_at": "2025-11-21T10:24:18.000Z"
  }
]
```

### GET /orders/:id

Fetch a single order (only if owned by the user).

**Request**
```
GET http://localhost:4002/orders/5
Headers:
  Authorization: Bearer <jwt>
```

**Response** `200`
```
{
  "id": 5,
  "user_id": 3,
  "product_id": 12,
  "quantity": 2,
  "total_price": "199.98",
  "status": "pending",
  "created_at": "2025-11-21T10:24:18.000Z"
}
```

### DELETE /orders/:id

Cancel an order if it is still `pending`.

**Request**
```
DELETE http://localhost:4002/orders/5
Headers:
  Authorization: Bearer <jwt>
```

**Response** `200`
```
{
  "id": 5,
  "user_id": 3,
  "product_id": 12,
  "quantity": 2,
  "total_price": "199.98",
  "status": "cancelled",
  "created_at": "2025-11-21T10:24:18.000Z"
}
```

## Testing with Postman

1. Create a collection called `Order Service`.
2. Add the four requests above, set the base URL variable if desired.
3. Under the collection, add an auth token (in `Authorization` tab) or set `Authorization` header manually.
4. Save example responses to share with the team.

## Notes

- Ensure the `order_service` database exists; the service creates only the `orders` table.
- Customize pool size via environment variables if needed.
- Extend status transitions (e.g., `confirmed`) through additional endpoints or message brokers as the system evolves.
