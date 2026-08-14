# Database Setup Guide

This guide explains how to set up and manage the PostgreSQL database for HomeDirect.

## Prerequisites

- PostgreSQL 15 or higher installed locally
- Node.js and npm installed
- Database user with sufficient privileges

## Quick Start with Docker

The easiest way to set up the database is using Docker Compose:

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Verify it's running
docker-compose ps postgres
```

The database will be available at `localhost:5432` with:
- Database: `homedirect`
- User: `homedirect`
- Password: `homedirect_password`

## Manual Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE homedirect;
CREATE USER homedirect WITH PASSWORD 'homedirect_password';
GRANT ALL PRIVILEGES ON DATABASE homedirect TO homedirect;
\q
```

### 2. Configure Environment Variables

Copy the example environment file and update it:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=homedirect
DB_USER=homedirect
DB_PASSWORD=homedirect_password
DB_SSL=false
```

### 3. Run Database Setup

```bash
cd relayer
npm run db:setup
```

This will:
- Connect to the database
- Execute the schema.sql to create all tables
- Execute seed.sql to populate sample data

### 4. Verify Setup

```bash
# Start the relayer server
npm run dev
```

Check the logs for:
```
Database connection pool initialized
Database connection test successful
Database connected successfully
```

## Database Schema

The database consists of 11 tables:

- **users** - User accounts and KYC status
- **properties** - Property listings
- **applications** - Rental applications
- **leases** - Active lease agreements
- **rent_payments** - Rent payment records
- **security_deposits** - Deposit escrow records
- **disputes** - Dispute records
- **payment_transactions** - Payment transaction logs
- **kyc_verifications** - KYC verification records
- **notifications** - User notifications
- **audit_logs** - Audit trail

## Database Operations

### Reset Database

To drop all tables and recreate with seed data:

```bash
npm run db:reset
```

⚠️ **Warning**: This will delete all data!

### Manual Schema Execution

If you need to execute the schema manually:

```bash
psql -U homedirect -d homedirect -f src/database/schema.sql
```

### Manual Seed Execution

To populate seed data manually:

```bash
psql -U homedirect -d homedirect -f src/database/seed.sql
```

## Connection Pooling

The application uses `pg` connection pooling for efficient database connections:

- Default pool size: 10 connections
- Configured in `src/database/connection.ts`
- Automatically handles connection lifecycle

## Troubleshooting

### Connection Refused

If you get "connection refused" errors:

1. Verify PostgreSQL is running: `pg_isready`
2. Check host and port in `.env`
3. Ensure database user has correct permissions

### Schema Already Exists

If you get "relation already exists" errors:

1. Run `npm run db:reset` to clean slate
2. Or manually drop tables before running setup

### Permission Denied

If you get permission errors:

```bash
# Grant privileges in PostgreSQL
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE homedirect TO homedirect;"
psql -U postgres -d homedirect -c "GRANT ALL ON SCHEMA public TO homedirect;"
psql -U postgres -d homedirect -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO homedirect;"
```

## Production Considerations

For production deployment:

1. **Use SSL**: Set `DB_SSL=true` in production
2. **Connection Pooling**: Adjust pool size based on traffic
3. **Backups**: Set up regular database backups
4. **Migration System**: Consider using a migration tool like `node-pg-migrate`
5. **Environment Variables**: Never commit `.env` file

## Database Backup

### Backup

```bash
pg_dump -U homedirect -d homedirect > backup.sql
```

### Restore

```bash
psql -U homedirect -d homedirect < backup.sql
```

## Next Steps

After database setup:

1. Implement authentication system
2. Connect API routes to database operations
3. Add data validation and error handling
4. Set up database monitoring
