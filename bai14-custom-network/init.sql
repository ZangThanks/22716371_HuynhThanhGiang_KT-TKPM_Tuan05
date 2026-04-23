-- Create database tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email) VALUES
('Service Web User', 'web@service.local'),
('Service API User', 'api@service.local'),
('Service DB User', 'db@service.local');

INSERT INTO logs (service_name, message) VALUES
('web', 'Web service connected to network'),
('api', 'API service started and listening'),
('postgres', 'Database initialized successfully');

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO db_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO db_user;
