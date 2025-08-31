-- Initialize database for Vulnerability Assistance Platform
-- This script is executed when the PostgreSQL container starts

-- Create database if it doesn't exist
-- Note: The database is already created by POSTGRES_DB environment variable
-- This file can be used for additional initialization if needed

-- Set timezone
SET timezone = 'America/Sao_Paulo';

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
