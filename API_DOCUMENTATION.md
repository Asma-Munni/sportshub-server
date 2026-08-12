# SportsHub REST API Documentation

## Project
SportsHub REST API

## Local Base URL
http://localhost:5000

## Production Base URL
To be added after deployment.

## Standard Response Format

Success response:
{ "success": true, "message": "Operation successful", "data": {} }

Error response:
{ "success": false, "message": "Error message" }

---

## Authentication

| Method | Endpoint | Access | Description | Request Body | Success Status |
|---|---|---|---|---|---|
| POST | /api/auth/sign-up/email | Public | Register a new user | { "name": "User Name", "email": "user@email.com", "password": "password123" } | 200/201 |
| POST | /api/auth/sign-in/email | Public | Login with email and password | { "email": "user@email.com", "password": "password123" } | 200 |
| POST | /api/auth/sign-out | Authenticated | Logout current user | None | 200 |

Authentication is handled using Better Auth. Passwords are securely hashed using bcrypt.

---

## Users

| Method | Endpoint | Access | Description | Request Body | Success Status |
|---|---|---|---|---|---|
| GET | /api/users/me | Authenticated | Get current authenticated user | None | 200 |
| GET | /api/users | Admin | Get all users | None | 200 |
| GET | /api/users/:id | Admin | Get a user by ID | None | 200 |
| PATCH | /api/users/:id | Admin | Update a user | Updated user fields | 200 |
| DELETE | /api/users/:id | Admin | Soft delete a user | None | 200 |

Users support role-based authorization with USER and ADMIN roles.

---

## Categories

| Method | Endpoint | Access | Description | Request Body | Success Status |
|---|---|---|---|---|---|
| POST | /api/categories | Admin | Create a category | { "name": "Football", "slug": "football", "description": "Football products" } | 201 |
| GET | /api/categories | Public | Get all active categories | None | 200 |
| GET | /api/categories/:id | Public | Get category by ID | None | 200 |
| PATCH | /api/categories/:id | Admin | Update category | Updated category fields | 200 |
| DELETE | /api/categories/:id | Admin | Soft delete category | None | 200 |

---

## Products

| Method | Endpoint | Access | Description | Request Body | Success Status |
|---|---|---|---|---|---|
| POST | /api/products | Admin | Create a product | { "name": "Football", "slug": "football-1", "description": "Premium football", "price": 3500, "stock": 20, "image": "IMAGE_URL", "categoryId": "CATEGORY_ID" } | 201 |
| GET | /api/products | Public | Get all available products | None | 200 |
| GET | /api/products/:id | Public | Get product by ID | None | 200 |
| PATCH | /api/products/:id | Admin | Update product | Updated product fields | 200 |
| DELETE | /api/products/:id | Admin | Soft delete product | None | 200 |

Product stock and availability status are maintained by the backend.

---

## Wishlist

| Method | Endpoint | Access | Description | Request Body | Success Status |
|---|---|---|---|---|---|
| POST | /api/wishlist | Authenticated | Add a product to wishlist | { "productId": "PRODUCT_ID" } | 201 |
| GET | /api/wishlist | Authenticated | Get current user's wishlist | None | 200 |
| DELETE | /api/wishlist/:id | Authenticated | Remove wishlist item using soft delete | None | 200 |

---

## Reviews

| Method | Endpoint | Access | Description | Request Body | Success Status |
|---|---|---|---|---|---|
| POST | /api/reviews | Authenticated | Create product review | { "rating": 5, "comment": "Excellent product", "productId": "PRODUCT_ID" } | 201 |
| GET | /api/reviews | Public | Get all reviews | None | 200 |
| GET | /api/reviews?productId=PRODUCT_ID | Public | Get reviews for a product | None | 200 |
| GET | /api/reviews/:id | Public | Get review by ID | None | 200 |
| PATCH | /api/reviews/:id | Owner/Admin | Update review | { "rating": 4, "comment": "Updated review" } | 200 |
| DELETE | /api/reviews/:id | Owner/Admin | Soft delete review | None | 200 |

Rating must be between 1 and 5.

A user cannot create multiple active reviews for the same product.

---

## Orders

| Method | Endpoint | Access | Description | Request Body | Success Status |
|---|---|---|---|---|---|
| POST | /api/orders | Authenticated | Create an order | { "shippingAddress": "Dhaka, Bangladesh", "items": [{ "productId": "PRODUCT_ID", "quantity": 2 }] } | 201 |
| GET | /api/orders/my-orders | Authenticated | Get current user's orders | None | 200 |
| GET | /api/orders/:id | Owner/Admin | Get order by ID | None | 200 |
| GET | /api/orders | Admin | Get all orders | None | 200 |
| PATCH | /api/orders/:id | Admin | Update order/payment status | { "status": "CONFIRMED", "paymentStatus": "PAID" } | 200 |
| DELETE | /api/orders/:id | Admin | Soft delete order | None | 200 |

When an order is created, the backend:

- validates every product
- validates quantity
- checks available stock
- calculates total amount
- creates OrderItem records
- decreases product stock
- marks products OUT_OF_STOCK when necessary

Default order status: PENDING

Default payment status: UNPAID

---

## HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Access forbidden |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Security Features

- Better Auth authentication
- bcrypt password hashing
- JWT support
- Role-based authorization
- USER and ADMIN roles
- Blocked-user protection
- Soft deletion
- CORS
- Environment variables
- PostgreSQL relational database
- Prisma ORM

---

## Main Technologies

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Better Auth
- bcrypt
- JWT
- CORS
- dotenv