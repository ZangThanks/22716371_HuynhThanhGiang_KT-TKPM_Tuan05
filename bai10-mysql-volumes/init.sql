-- Create sample table
CREATE TABLE IF NOT EXISTS appdb.products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO appdb.products (name, price, description) VALUES
('Laptop Dell XPS', 1299.99, 'High-performance laptop'),
('iPhone 14', 999.99, 'Latest Apple smartphone'),
('Sony Headphones', 349.99, 'Noise-cancelling headphones');

-- Create users table
CREATE TABLE IF NOT EXISTS appdb.users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO appdb.users (username, email, password) VALUES
('user1', 'user1@example.com', 'hashed_password_1'),
('user2', 'user2@example.com', 'hashed_password_2');

-- Grant permissions
GRANT ALL PRIVILEGES ON appdb.* TO 'appuser'@'%';
FLUSH PRIVILEGES;
