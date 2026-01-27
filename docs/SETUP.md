# Setup Guide

## Prerequisites

Before starting, ensure you have installed:

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** v12 or higher ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for cloning)

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages listed in `package.json`:
- Express.js - Web framework
- PostgreSQL driver - Database
- JWT - Authentication
- Socket.io - Real-time updates
- And more...

### Step 3: Create Database

Open PostgreSQL:

```bash
psql -U postgres
```

Create database and user:

```sql
CREATE DATABASE vehicle_pooling;
CREATE USER pooling_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE vehicle_pooling TO pooling_user;
```

### Step 4: Configure Environment

Copy the example file:

```bash
cp .env.example .env
```

Edit `.env` file with your settings:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vehicle_pooling
DB_USER=pooling_user
DB_PASSWORD=your_secure_password
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Step 5: Initialize Database Schema

```bash
npm run migrate
```

This creates all tables and indexes in the database.

### Step 6: Start Backend Server

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

You should see:
```
Vehicle Pooling Backend running on port 5000
Database schema initialized successfully
```

### Step 7: Test Backend

Check if server is running:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"Server is running","timestamp":"2024-01-27T..."}
```

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

Create `.env.local` file:

```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
```

### Step 4: Start Development Server

```bash
npm start
```

The application will automatically open at `http://localhost:3000`

If it doesn't open, manually navigate to http://localhost:3000

## Verification Checklist

- [ ] PostgreSQL is running
- [ ] Backend dependencies installed
- [ ] `.env` file configured with database credentials
- [ ] Database tables created successfully
- [ ] Backend server running on port 5000
- [ ] Backend health check passes
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 3000
- [ ] Can access home page
- [ ] Can register new account
- [ ] Can login with registered account

## Common Issues and Solutions

### PostgreSQL Connection Error

**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
1. Check PostgreSQL is running:
   ```bash
   psql -U postgres -c "SELECT version();"
   ```
2. Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in `.env`
3. Make sure database exists:
   ```bash
   psql -U postgres -l | grep vehicle_pooling
   ```

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE :::5000`

**Solution**:
1. Kill process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :5000
   kill -9 <PID>
   ```
2. Or change PORT in `.env`

### Module Not Found

**Problem**: `Cannot find module 'express'`

**Solution**:
```bash
cd backend
npm install
```

### CORS Error

**Problem**: `Access to XMLHttpRequest blocked by CORS`

**Solution**:
1. Verify FRONTEND_URL in `.env`:
   ```
   FRONTEND_URL=http://localhost:3000
   ```
2. Restart backend server

### JWT Error

**Problem**: `Invalid or expired token`

**Solution**:
1. Clear localStorage in browser:
   ```javascript
   localStorage.clear()
   ```
2. Login again
3. Or generate new JWT_SECRET in `.env` and restart server

## Database Backup

### Backup Database

```bash
pg_dump -U pooling_user vehicle_pooling > backup.sql
```

### Restore Database

```bash
psql -U pooling_user vehicle_pooling < backup.sql
```

## Development Tips

### Debug Backend

Set DEBUG environment variable:
```bash
DEBUG=app:* npm run dev
```

### View Database

```bash
psql -U pooling_user vehicle_pooling

# List tables
\dt

# View specific table
SELECT * FROM users;

# Exit
\q
```

### Reset Database

⚠️ **Warning**: This deletes all data

```bash
# Drop and recreate database
psql -U postgres

DROP DATABASE vehicle_pooling;
CREATE DATABASE vehicle_pooling;
GRANT ALL PRIVILEGES ON DATABASE vehicle_pooling TO pooling_user;

# Exit psql
\q

# Run migration again
npm run migrate
```

### Test API Endpoints

Using curl:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Using Postman:
1. Import API endpoints
2. Set Authorization: Bearer {{token}}
3. Test endpoints

## Production Deployment

### Backend

1. Set production environment:
   ```
   NODE_ENV=production
   ```

2. Use strong JWT_SECRET (generate with):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Configure database for production:
   - Use managed database service (AWS RDS, etc.)
   - Enable SSL connections
   - Set strong passwords

4. Deploy with PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "vehicle-pooling"
   pm2 startup
   pm2 save
   ```

### Frontend

1. Build for production:
   ```bash
   npm run build
   ```

2. Deploy build folder to web server (Vercel, Netlify, AWS, etc.)

3. Set API URL environment variable:
   ```
   REACT_APP_API_URL=https://api.vehiclepooling.com
   ```

## Next Steps

- [ ] Read [API Documentation](API.md)
- [ ] Review [Database Schema](DATABASE_SCHEMA.md)
- [ ] Understand [Matching Algorithm](MATCHING_ALGORITHM.md)
- [ ] Configure API integrations (Google Maps, Stripe)
- [ ] Set up email service
- [ ] Configure error logging
- [ ] Set up monitoring and alerts
