# 🚀 Product API - REST CRUD

A simple REST API for Product management with full CRUD operations, built with **Node.js**, **Express**, and **PostgreSQL**. Includes **Docker** support for easy deployment.

## 📋 Features

- ✅ Full CRUD (Create, Read, Update, Delete) for Products
- ✅ PostgreSQL database with auto table creation
- ✅ Docker & Docker Compose support
- ✅ Health check endpoint
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled

## 🛠 Tech Stack

- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Database:** PostgreSQL 15
- **Containerization:** Docker & Docker Compose

## 📡 API Endpoints

| Method   | Endpoint             | Description         |
|----------|----------------------|---------------------|
| `GET`    | `/`                  | API info & docs     |
| `GET`    | `/health`            | Health check        |
| `GET`    | `/api/products`      | Get all products    |
| `GET`    | `/api/products/:id`  | Get product by ID   |
| `POST`   | `/api/products`      | Create new product  |
| `PUT`    | `/api/products/:id`  | Update a product    |
| `DELETE` | `/api/products/:id`  | Delete a product    |

## 🐳 Run with Docker (Recommended)

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove data
docker-compose down -v
```

The API will be available at `http://localhost:3000`

## 💻 Run Locally (without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/product-api.git
cd product-api

# Install dependencies
npm install

# Copy and edit environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Start the server
npm start

# Or with auto-reload (development)
npm run dev
```

## 📝 API Usage Examples

### Create a product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "iPhone 15", "description": "Latest Apple phone", "price": 999.99, "quantity": 100}'
```

### Get all products
```bash
curl http://localhost:3000/api/products
```

### Get product by ID
```bash
curl http://localhost:3000/api/products/1
```

### Update a product
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "iPhone 15 Pro", "price": 1199.99}'
```

### Delete a product
```bash
curl -X DELETE http://localhost:3000/api/products/1
```

## 🌐 Deploy to Free Hosting

### Option 1: Render.com (Recommended - Free tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node src/index.js`
5. Add a **PostgreSQL** database (free tier)
6. Set environment variables from the database connection info
7. Deploy! You'll get a free `*.onrender.com` subdomain

### Option 2: Railway.app

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Add PostgreSQL plugin
4. Railway auto-detects Node.js and deploys
5. Free subdomain: `*.up.railway.app`

### Option 3: Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login & launch
fly auth login
fly launch
fly postgres create
fly deploy
```

## 📂 Project Structure

```
product-api/
├── src/
│   ├── config/
│   │   ├── db.js          # PostgreSQL connection pool
│   │   └── initDB.js      # Auto-create tables
│   ├── controllers/
│   │   └── productController.js  # CRUD logic
│   ├── routes/
│   │   └── productRoutes.js      # API routes
│   └── index.js           # Entry point
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## 📜 License

MIT
