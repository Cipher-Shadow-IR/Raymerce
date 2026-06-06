# Remirind Store - MERN E-Commerce Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js).

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB)
![Express](https://img.shields.io/badge/Express-4.21-000000)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![JWT](https://img.shields.io/badge/Auth-JWT-purple)

## 🚀 Features

### Authentication & Authorization
- User registration and login with JWT
- Password hashing with bcryptjs (12 salt rounds)
- Role-based access control (User / Admin)
- Protected admin routes with middleware

### Product Management
- Full CRUD operations for products
- Product schema: name, image, category, price, description, stock, featured
- Image URLs with automatic placeholder fallback
- Featured products section on homepage

### Product Listing & Discovery
- Responsive product grid with card layout
- Search by product name (regex, case-insensitive)
- Filter by category dropdown
- Filter by price range (min/max)
- Sort by: newest, oldest, price (low-high / high-low), name (A-Z / Z-A)
- Pagination (8 products per page)
- Combined filters work together with URL query params

### Shopping Cart
- Add to cart with quantity selection
- Remove items from cart
- Increase/decrease quantity (min 1, max stock)
- Cart total calculation (subtotal, item count)
- Persistent cart in localStorage
- Cart badge in navbar with real-time updates
- Clear cart functionality

### Admin Dashboard
- Dashboard statistics cards: total products, categories, low-stock items
- Product management table with image preview
- Add new product form
- Edit existing product form (pre-populated)
- Delete product with confirmation flow
- Admin-only route protection

### User Interface
- Modern e-commerce design with Tailwind CSS
- Fully responsive (mobile, tablet, desktop)
- Dark mode toggle with persistent preference
- Toast notifications for all actions
- Skeleton loading cards
- Loading spinner and error message components
- 404 page for unknown routes
- Mobile hamburger menu

## 🛠 Tech Stack

### Frontend
- **React 18** with **Vite** for fast development
- **React Router v6** for client-side routing
- **Axios** for HTTP requests with JWT interceptor
- **Tailwind CSS 3** for utility-first styling
- **React Hot Toast** for notifications
- **React Icons** (Feather icons)

### Backend
- **Node.js** with **Express.js** server
- **MongoDB Atlas** with **Mongoose** ODM
- **JWT** (jsonwebtoken) for authentication
- **bcryptjs** for password hashing
- **express-async-handler** for clean error handling
- **cors** for cross-origin requests

## 📁 Project Structure

```
Remirind-Store/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile
│   │   └── productController.js # CRUD + search/filter/sort/paginate
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT protect + admin guard
│   │   └── errorMiddleware.js   # Centralized error handling
│   ├── models/
│   │   ├── User.js              # User schema with bcrypt
│   │   ├── Product.js           # Product schema with text index
│   │   └── Order.js             # Order schema for future use
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/*
│   │   └── productRoutes.js     # /api/products/*
│   ├── utils/
│   │   └── generateToken.js     # JWT sign helper
│   ├── seed/
│   │   └── seed.js              # Database seeder (12 products, 2 users)
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Navbar with cart badge, dark mode, auth
│   │   │   ├── Footer.jsx       # Footer with links and contact
│   │   │   ├── ProductCard.jsx  # Product grid card
│   │   │   ├── SearchBox.jsx    # Search input
│   │   │   ├── Paginate.jsx     # Pagination component
│   │   │   ├── Loader.jsx       # Spinner loader
│   │   │   ├── SkeletonCard.jsx # Skeleton loader
│   │   │   ├── Message.jsx      # Alert/error messages
│   │   │   └── PrivateRoute.jsx # Admin route guard
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Product listing with filters
│   │   │   ├── ProductPage.jsx  # Product detail view
│   │   │   ├── CartPage.jsx     # Shopping cart
│   │   │   ├── LoginPage.jsx    # User login
│   │   │   ├── RegisterPage.jsx # User registration
│   │   │   ├── AdminDashboard.jsx   # Admin stats
│   │   │   ├── ProductListPage.jsx  # Admin product management
│   │   │   ├── ProductEditPage.jsx  # Add/Edit product form
│   │   │   └── NotFoundPage.jsx     # 404 page
│   │   ├── store/
│   │   │   └── cartStore.js     # localStorage cart
│   │   ├── api.js               # Axios instance with JWT interceptor
│   │   ├── App.jsx              # Root component with routes
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind + custom styles
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js           # Vite config with proxy
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── vercel.json                  # Vercel deployment config
├── render.yaml                  # Render deployment config
├── .gitignore
└── README.md
```

## 🚦 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | JWT |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products (search, filter, sort, paginate) | No |
| GET | `/api/products/featured` | Get featured products | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Query Parameters for GET /api/products
- `keyword` - Search by name
- `category` - Filter by category
- `minPrice` / `maxPrice` - Filter by price range
- `sort` - Sort option (`-createdAt`, `price`, `-price`, `name`, `-name`)
- `pageNumber` - Page number (default: 1)
- `pageSize` - Items per page (default: 8)

## 🧪 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/remirind-store.git
cd remirind-store
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Configure environment variables:
```bash
cd ../backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

5. Seed the database:
```bash
npm run seed
```

6. Start the backend (in one terminal):
```bash
npm run dev
```

7. Start the frontend (in another terminal):
```bash
cd ../frontend
npm run dev
```

8. Open http://localhost:3000 in your browser

### Demo Credentials
- **Admin:** admin@remirind.com / admin123
- **User:** user@test.com / user123

## ☁️ Deployment

### Backend on Render

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: A secure random string
   - `JWT_EXPIRES_IN`: `30d`

Alternatively, use the included `render.yaml`:
- Go to https://dashboard.render.com/blueprints
- Connect your repository
- Set the `MONGO_URI` and `JWT_SECRET` environment variables

### Frontend on Vercel

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure:
   - **Framework:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://remirind-store.onrender.com/api`)
5. Deploy

The `vercel.json` at the root handles SPA routing (all routes fallback to index.html).

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Home | Product grid with search, filters, sort, pagination |
| Product | Detail view with quantity selector and add to cart |
| Cart | Cart items with quantity controls and totals |
| Login | Login form with demo credentials |
| Admin | Dashboard with stats and product management |

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is created for internship evaluation purposes.
