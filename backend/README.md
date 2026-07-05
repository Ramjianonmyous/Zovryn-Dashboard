# Apex Dashboard Backend

The backend of the Apex Dashboard is a robust, production-ready REST API built with **Node.js, Express, and MongoDB (via Mongoose)**. It handles dashboard telemetry aggregation, product management, user administration, notifications, and security protocols including JWT and Admin Master Phrase verification.

---

## 🛠️ Tech Stack & Security

* **Runtime**: Node.js (v16+)
* **Web Framework**: Express.js
* **Database**: MongoDB Atlas (Data Modeling via Mongoose ODM)
* **Authentication**: JSON Web Tokens (JWT) signed with HS256
* **Security & Shielding**:
  * **Helmet**: Secure HTTP header configuration
  * **CORS**: Origin isolation and whitelist restrictions
  * **BCryptJS**: 12-round salted password hashing
  * **Master Phrase Verification**: Secondary code validation for Administrator accounts

---

## 🏗️ Architecture

The backend follows the standard **MVC (Model-View-Controller)** structural pattern:

```text
backend/
├── config/             # DB Connection Config
├── controllers/        # Core Controller Handlers (business logic)
├── middleware/         # Authentication and Route Shields
├── models/             # Mongoose Schemas (User, Product, Order, Notification, etc.)
├── routes/             # Express route mappings
└── seed/               # Database Seeding script
```

### Request Flow
```text
[Client Request] ──> [Express Router] ──> [Auth/Shield Middleware] ──> [Controller Handler] ──> [Mongoose Models] ──> [MongoDB Atlas]
```

---

## ⚙️ Environment Variables (`.env`)

Create a `.env` file in the `backend/` directory using the following keys:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Server Port | `5000` |
| `NODE_ENV` | Running Environment | `development` / `production` |
| `MONGODB_URI` | MongoDB Connection String | `mongodb://localhost:27017/zovryn-db` |
| `JWT_SECRET` | Secret Key for signing JWTs | `change-this-secret-in-production` |
| `JWT_EXPIRE` | JWT Expiry Duration | `7d` |
| `MASTER_PHRASE` | Secondary Admin Login Phrase | `TaskForgeSecret123` |

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Mock Database Data
Populates products, mock users, activities, and initial orders in the MongoDB database:
```bash
node seed/seed.js
```
* **Admin Login**: `admin@apex.io` / `admin123`
* **Default Master Security Phrase**: `TaskForgeSecret123`

### 3. Run Development Server
Starts the server with hot-reloading active via Nodemon:
```bash
npm run dev
```

### 4. Production Execution
```bash
npm start
```

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
* `POST /login` - Login user (challenges with `requiresMasterPhrase: true` for Admin accounts)
* `POST /register` - Create new user account
* `GET /me` - Fetch profile metadata for the authenticated user (requires token)
* `PUT /profile` - Update profile name and avatar details (requires token)
* `PUT /password` - Update account password (requires token)

### 📈 Dashboard Telemetry (`/api/dashboard`)
* `GET /overview?period=monthly` - High-level metrics (sales, revenue, average order value)
* `GET /activity` - Recent timeline activities
* `GET /revenue-chart?period=monthly` - Revenue performance history
* `GET /sales-by-category` - Distributed category breakdown
* `GET /order-stats` - Recent order entries

### 📦 Products CRUD (`/api/products`)
* `GET /` - Fetch all products
* `POST /` - Create product listing (requires Admin/Manager permissions)
* `PUT /:id` - Edit product details (requires Admin/Manager permissions)
* `DELETE /:id` - Remove product (requires Admin/Manager permissions)

### 👥 User Control (`/api/users`)
* `GET /public` - Fetch names and active states of all users
* `PUT /:id` - Toggle user active/inactive status (requires Admin permissions)

### 🔔 Alerts & Notifications (`/api/notifications`)
* `GET /` - Fetch unread and system notification list (requires token)
