-- Connect to the default 'postgres' database
\c postgres;

-- Create the database
CREATE DATABASE connectcampus_db;

-- Create the user with a password
CREATE USER connectcampus_user WITH ENCRYPTED PASSWORD 'securepassword';

-- Grant privileges to the user on the database
GRANT CONNECT ON DATABASE connectcampus_db TO connectcampus_user;

-- Switch to the newly created database
\c connectcampus_db;

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE connectcampus_db TO connectcampus_user;

-- Grant privileges to modify, add, delete, and insert tables
GRANT USAGE, CREATE ON SCHEMA public TO connectcampus_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO connectcampus_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO connectcampus_user;

-- Ensure future tables and sequences inherit privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO connectcampus_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO connectcampus_user;

