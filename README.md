# E-commerce Admin Panel

Modern admin panel built with React, Vite, and Tailwind CSS for managing the e-commerce backend.

## Features

- **Dashboard** - Overview of sales, orders, and key metrics
- **Products Management** - Full CRUD operations for products
- **Categories Management** - Manage product categories
- **Orders Management** - View and update order statuses
- **User Management** - View registered users
- **Authentication** - Secure admin login with JWT

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

## Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:8000`

## Installation

1. Navigate to the admin panel directory:
```bash
cd admin-panel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The admin panel will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
admin-panel/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   ├── Pagination.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/           # React context providers
│   │   └── AuthContext.jsx
│   ├── pages/             # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Categories.jsx
│   │   ├── Orders.jsx
│   │   └── Users.jsx
│   ├── utils/             # Utility functions
│   │   ├── api.js        # API client and endpoints
│   │   └── helpers.js    # Helper functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Default Admin Credentials

You need to create an admin user in the backend first. Use the signup endpoint with role "admin".

Example using the backend:
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword123",
    "username": "admin",
    "full_name": "Admin User",
    "role": "admin"
  }'
```

Then login with:
- Email: `admin@example.com`
- Password: `adminpassword123`

## API Integration

The admin panel integrates with the following API endpoints:

### Authentication
- `POST /auth/login` - Admin login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh access token

### Products
- `GET /products` - List products (with pagination and filters)
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `PATCH /products/:id/stock` - Update stock

### Categories
- `GET /categories` - List categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Orders
- `GET /orders/admin/all` - List all orders (with filters)
- `GET /orders/admin/:id` - Get order details
- `PUT /orders/admin/:id/status` - Update order status
- `GET /orders/admin/stats/summary` - Get order statistics

## Features by Page

### Dashboard
- Total revenue display
- Order statistics (total, pending, completed)
- Recent orders list
- Quick action links

### Products
- Product list with pagination
- Search by name/description
- Filter by category
- Create/Edit/Delete products
- Manage stock levels
- Set featured products

### Categories
- Category list
- Create/Edit/Delete categories
- Hierarchical categories support
- Active/Inactive status

### Orders
- Order list with pagination
- Search by order number
- Filter by status
- View order details
- Update order status
- Add tracking numbers
- View shipping information

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      }
    }
  }
}
```

### API Base URL

Edit `src/utils/api.js` to change the API base URL:

```javascript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

Or configure the Vite proxy in `vite.config.js`.

## Troubleshooting

### API Connection Issues

If you're having trouble connecting to the API:

1. Make sure the backend is running on `http://localhost:8000`
2. Check CORS settings in the backend
3. Verify the API base URL in `src/utils/api.js`

### Authentication Issues

If login is not working:

1. Verify admin user exists in the database
2. Check that the user has role "admin"
3. Clear browser local storage and try again

### Build Issues

If the build fails:

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Try `npm run build` again

## License

MIT
