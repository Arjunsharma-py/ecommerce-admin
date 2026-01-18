# Quick Setup Guide

Follow these steps to get the admin panel running:

## Step 1: Install Dependencies

```bash
cd admin-panel
npm install
```

## Step 2: Create Admin User

Before you can login, you need to create an admin user in the backend.

### Option A: Using the Backend Signup Endpoint

Make sure your backend is running, then execute:

```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "username": "admin",
    "full_name": "Admin User",
    "role": "admin"
  }'
```

### Option B: Directly in MongoDB

If you have MongoDB access, you can create an admin user directly:

1. Connect to your MongoDB database
2. Find a user in the `users` collection
3. Update their `role` field to "admin"

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Step 3: Start the Development Server

```bash
npm run dev
```

The admin panel will start at: **http://localhost:3000**

## Step 4: Login

1. Open **http://localhost:3000** in your browser
2. You'll be redirected to the login page
3. Enter your admin credentials:
   - Email: `admin@example.com`
   - Password: `Admin123!`
4. Click "Sign In"

You should now see the dashboard!

## Troubleshooting

### "Access denied. Admin privileges required"

This means the user you're logging in with doesn't have admin role. Make sure:
- The user exists in the database
- The user's `role` field is set to "admin" (not "user")

### API Connection Error

If you see connection errors:
1. Make sure the backend is running on `http://localhost:8000`
2. Check the backend logs for CORS errors
3. Verify the API base URL in `src/utils/api.js`

### Blank White Screen

1. Open browser console (F12)
2. Check for errors
3. Try clearing browser cache and localStorage
4. Make sure all dependencies are installed (`npm install`)

## Development Tips

### Hot Reload

The dev server has hot module replacement (HMR) enabled. Any changes you make to the code will automatically reload in the browser.

### API Proxy

The Vite dev server is configured to proxy API requests to avoid CORS issues. Requests to `/api/*` are automatically forwarded to `http://localhost:8000/api/*`.

### Tailwind CSS

Tailwind classes are available throughout the application. Check `src/index.css` for custom component classes like `btn-primary`, `card`, `badge`, etc.

## Next Steps

After successful login, you can:

1. **Add Categories** - Create product categories
2. **Add Products** - Add products to your catalog
3. **View Orders** - Monitor customer orders
4. **Update Order Status** - Process and fulfill orders

## Production Build

When ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Environment Variables

For production, you may want to use environment variables:

Create a `.env` file in the `admin-panel/` directory:

```
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

Then update `src/utils/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
```

## Happy Building! 🚀
