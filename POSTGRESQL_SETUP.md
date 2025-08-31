# PostgreSQL Setup Guide

This guide explains how to set up PostgreSQL for the Vulnerability Assistance Platform.

## 🐘 PostgreSQL Installation Options

### Option 1: Local PostgreSQL Installation

#### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
createdb vulnerability_platform
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb vulnerability_platform
```

#### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Use pgAdmin or command line to create the database

### Option 2: Docker PostgreSQL (Recommended for Development)

```bash
# Start PostgreSQL container
docker run --name postgres-vulnerability \
  -e POSTGRES_DB=vulnerability_platform \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps

# Connect to database (optional)
docker exec -it postgres-vulnerability psql -U postgres -d vulnerability_platform
```

### Option 3: Cloud PostgreSQL Services

#### Supabase (Free tier available)
1. Go to https://supabase.com
2. Create a new project
3. Get the connection string from Settings > Database

#### Railway (Free tier available)
1. Go to https://railway.app
2. Create a PostgreSQL service
3. Get the connection string from the service dashboard

#### Neon (Free tier available)
1. Go to https://neon.tech
2. Create a database
3. Copy the connection string

## 🔧 Environment Configuration

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` file:**
   ```env
   # For local PostgreSQL
   DATABASE_URL="postgresql://postgres:password@localhost:5432/vulnerability_platform?schema=public"
   
   # For Docker PostgreSQL
   DATABASE_URL="postgresql://postgres:password@localhost:5432/vulnerability_platform?schema=public"
   
   # For cloud services (example)
   DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
   
   PORT=3002
   JWT_SECRET="your-secure-jwt-secret-key-here"
   ```

## 🗄️ Database Schema & Migrations

### Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Create and apply migrations
npm run db:migrate
```

### Database Schema Overview

The platform creates the following tables:

- **users** - Missionaries and investors
- **projects** - Assistance projects by region
- **persons** - Vulnerable individuals
- **dynamic_metadata** - Flexible event tracking
- **checkpoints** - Progress milestones
- **checkpoint_progress** - Individual progress tracking
- **person_missionary_assignments** - Person-missionary relationships
- **project_persons** - Project-person associations
- **project_users** - Project-user associations

### Seed Sample Data
```bash
npm run db:seed
```

This creates:
- 2 sample users (1 missionary, 1 investor)
- 1 sample project
- 2 sample persons
- 3 sample checkpoints
- Sample metadata and progress entries

## 🔍 Database Management

### Prisma Studio (Database GUI)
```bash
npm run db:studio
```
Opens a web interface at http://localhost:5555 to view and edit data.

### Reset Database
```bash
npm run db:reset
```
⚠️ **Warning:** This deletes all data and recreates the schema.

### Manual Database Connection
```bash
# Using psql
psql "postgresql://postgres:password@localhost:5432/vulnerability_platform"

# Using Docker
docker exec -it postgres-vulnerability psql -U postgres -d vulnerability_platform
```

## 🚀 Testing the Integration

### 1. Start the Application
```bash
npm start
```

### 2. Test API Endpoints
```bash
# Health check
curl http://localhost:3002/health

# List users (should show seeded data)
curl http://localhost:3002/api/users

# Create a new user
curl -X POST http://localhost:3002/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Test User",
    "email": "test@example.com",
    "senha": "123456",
    "tipo_usuario": "missionario"
  }'
```

## 🔧 Troubleshooting

### Common Issues

#### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Ensure PostgreSQL is running and accessible on port 5432.

#### Authentication Failed
```
Error: password authentication failed for user "postgres"
```
**Solution:** Check username/password in DATABASE_URL.

#### Database Does Not Exist
```
Error: database "vulnerability_platform" does not exist
```
**Solution:** Create the database manually or use Docker setup.

#### Migration Errors
```
Error: Migration failed to apply cleanly to the shadow database
```
**Solution:** Reset the database with `npm run db:reset`.

### Useful Commands

```bash
# Check PostgreSQL status (macOS)
brew services list | grep postgresql

# Check PostgreSQL status (Linux)
sudo systemctl status postgresql

# View database logs (Docker)
docker logs postgres-vulnerability

# Connect to database
psql $DATABASE_URL

# List all tables
\dt

# Describe table structure
\d users
```

## 📊 Performance Considerations

### Connection Pooling
For production, consider using connection pooling:

```env
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public&connection_limit=5&pool_timeout=10"
```

### Indexes
The schema includes automatic indexes on:
- Primary keys (UUIDs)
- Unique constraints (email, id_interno, project names)
- Foreign key relationships

### Monitoring
Use Prisma's built-in logging:
```javascript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

## 🔒 Security Best Practices

1. **Use strong passwords** for database users
2. **Limit database access** to application servers only
3. **Use SSL connections** in production
4. **Regular backups** of production data
5. **Monitor database logs** for suspicious activity

## 📈 Scaling Considerations

- **Read replicas** for read-heavy workloads
- **Connection pooling** (PgBouncer, Prisma Accelerate)
- **Database sharding** for very large datasets
- **Caching layer** (Redis) for frequently accessed data
