# Configuration & Environment Setup

## Environment Variables

### Backend Configuration (.env)

**Copy `.backend/.env.example` to `backend/.env` and configure:**

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vehicle_pooling
DB_USER=pooling_user
DB_PASSWORD=your_secure_password

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# JWT AUTHENTICATION
# ============================================
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# ============================================
# FRONTEND URL (CORS)
# ============================================
FRONTEND_URL=http://localhost:3000

# ============================================
# THIRD-PARTY INTEGRATIONS (Optional)
# ============================================

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Stripe Payment Processing
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Email Service (Mailtrap, SendGrid, etc.)
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mail_user
MAIL_PASSWORD=your_mail_password
```

### Frontend Configuration (.env.local)

**Create `frontend/.env.local`:**

```env
# API URL
REACT_APP_API_URL=http://localhost:5000/api

# Optional: Google Maps API
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_api_key

# Optional: Environment
REACT_APP_ENV=development
```

## Database Setup

### Create PostgreSQL Database

```sql
-- Connect as admin
psql -U postgres

-- Create database
CREATE DATABASE vehicle_pooling;

-- Create user
CREATE USER pooling_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT CONNECT ON DATABASE vehicle_pooling TO pooling_user;
GRANT USAGE ON SCHEMA public TO pooling_user;
GRANT CREATE ON SCHEMA public TO pooling_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pooling_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pooling_user;

-- Exit psql
\q
```

### Connection String

If using external database:
```
postgresql://pooling_user:password@host:5432/vehicle_pooling
```

## JWT Configuration

### Generate Secure JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Copy output to JWT_SECRET in .env
```

### Token Configuration

```javascript
// In backend/.env
JWT_SECRET=your_generated_secret_here
JWT_EXPIRE=7d

// Valid JWT_EXPIRE values:
// 7d   - 7 days
// 24h  - 24 hours
// 72h  - 72 hours
// 30d  - 30 days
```

## Node Modules Setup

### Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Dependencies List

**Backend** (package.json):
- express@4.18.2 - Web framework
- pg@8.10.0 - PostgreSQL driver
- bcryptjs@2.4.3 - Password hashing
- jsonwebtoken@9.1.0 - JWT handling
- dotenv@16.3.1 - Environment variables
- cors@2.8.5 - CORS middleware
- socket.io@4.7.0 - Real-time updates
- axios@1.6.0 - HTTP client
- joi@17.11.0 - Data validation
- multer@1.4.5-lts.1 - File uploads
- stripe@13.10.0 - Payment processing

**Frontend** (package.json):
- react@18.2.0 - UI framework
- react-dom@18.2.0 - React DOM
- react-router-dom@6.18.0 - Routing
- axios@1.6.0 - HTTP client
- socket.io-client@4.7.0 - WebSocket client
- @react-google-maps/api@2.19.0 - Google Maps
- date-fns@2.30.0 - Date utilities
- react-toastify@9.1.3 - Notifications
- zustand@4.4.1 - State management

## Stripe Configuration

### Setup Stripe Account

1. Go to https://stripe.com
2. Create account
3. Get API keys from dashboard
4. Add to `.env`:
```env
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Testing Stripe

Use these test card numbers:
- Visa: 4242 4242 4242 4242
- Mastercard: 5555 5555 5555 4444
- Amex: 3782 822463 10005
- CVC: Any 3 digits
- Expiry: Any future date

## Google Maps Configuration

### Get API Key

1. Go to https://cloud.google.com
2. Create new project
3. Enable Maps API
4. Create API key
5. Restrict to HTTP referrers
6. Add to `.env`:
```env
GOOGLE_MAPS_API_KEY=your_key_here
```

### Enable Required APIs

- Maps JavaScript API
- Places API
- Distance Matrix API
- Geocoding API

## Email Service Configuration

### Using Mailtrap (Free)

1. Go to https://mailtrap.io
2. Sign up for free account
3. Create inbox
4. Get SMTP credentials
5. Add to `.env`:
```env
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_username
MAIL_PASSWORD=your_password
```

### Using SendGrid

1. Go to https://sendgrid.com
2. Sign up for free account
3. Create API key
4. Update `.env`:
```env
SENDGRID_API_KEY=your_api_key
```

## Database Backups

### Backup Database

```bash
# Full backup
pg_dump -U pooling_user vehicle_pooling > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -U pooling_user vehicle_pooling | gzip > backup.sql.gz
```

### Restore Database

```bash
# From SQL file
psql -U pooling_user vehicle_pooling < backup.sql

# From compressed file
gunzip < backup.sql.gz | psql -U pooling_user vehicle_pooling
```

### Automatic Backups

**Using cron (Linux/Mac)**:
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * pg_dump -U pooling_user vehicle_pooling | gzip > ~/backups/backup_$(date +\%Y\%m\%d).sql.gz
```

## Production Configuration

### Backend Production .env

```env
# Security
NODE_ENV=production
PORT=5000

# Database (Use managed service)
DB_HOST=your-rds-instance.amazonaws.com
DB_PORT=5432
DB_NAME=vehicle_pooling
DB_USER=pooling_user
DB_PASSWORD=very_strong_password_here

# JWT (Generate new secret)
JWT_SECRET=generate_new_secure_secret_for_production
JWT_EXPIRE=7d

# Frontend (Your domain)
FRONTEND_URL=https://your-domain.com

# Third-party services
STRIPE_SECRET_KEY=sk_live_your_live_key
GOOGLE_MAPS_API_KEY=your_production_key
SENDGRID_API_KEY=your_production_key
```

### Frontend Production .env

```env
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_ENV=production
```

## SSL/TLS Configuration

### For Self-Signed Certificate (Development)

```bash
# Generate certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Use in Node.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(5000);
```

### For Production (Let's Encrypt)

```bash
# Using Certbot
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
```

## Logging Configuration

### Enable Debug Logging

```bash
# Backend
DEBUG=app:* npm run dev

# Frontend (Check browser console)
# DevTools > Console
```

### File Logging

```javascript
// Add to backend/utils/logger.js
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'app.log');

const log = (message, level = 'INFO') => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${level}: ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
  console.log(logMessage);
};

module.exports = log;
```

## Rate Limiting (Future)

### Configuration Template

```javascript
// backend/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // More strict for auth
  message: 'Too many login attempts'
});

module.exports = { limiter, authLimiter };
```

## Redis Cache Configuration (Optional)

### Setup Redis

```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis-server

# Docker
docker run -p 6379:6379 redis:latest
```

### Add to Backend

```javascript
// backend/config/redis.js
const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

client.on('error', (err) => console.error('Redis error:', err));
client.on('connect', () => console.log('Redis connected'));

module.exports = client;
```

## Monitoring & Analytics (Optional)

### Application Performance Monitoring

- **Datadog** - https://www.datadoghq.com
- **New Relic** - https://newrelic.com
- **Sentry** - https://sentry.io

### Error Tracking

```javascript
// Add Sentry
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.errorHandler());
```

## Environment-Specific Configs

### Development
```env
NODE_ENV=development
DEBUG=app:*
CORS_ORIGIN=http://localhost:3000
```

### Staging
```env
NODE_ENV=staging
DEBUG=app:*
CORS_ORIGIN=https://staging.your-domain.com
```

### Production
```env
NODE_ENV=production
DEBUG=
CORS_ORIGIN=https://your-domain.com
```

## Validation & Testing

### Test Configuration

```bash
# Run tests
npm test

# Test coverage
npm test -- --coverage

# E2E tests
npm run test:e2e
```

### Pre-deployment Checklist

- [ ] All environment variables set
- [ ] Database backups created
- [ ] SSL certificates configured
- [ ] API keys secured
- [ ] Error tracking enabled
- [ ] Logging configured
- [ ] Rate limiting tested
- [ ] CORS origins verified
- [ ] Security headers set
- [ ] Dependencies updated

---

For more help, see the [SETUP.md](docs/SETUP.md) guide.
