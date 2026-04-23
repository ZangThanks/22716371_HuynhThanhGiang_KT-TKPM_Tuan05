-- Create tables
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(id),
    project_id INT NOT NULL REFERENCES projects(id),
    role VARCHAR(50),
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO employees (name, email, department, salary) VALUES
('John Doe', 'john@example.com', 'Engineering', 80000),
('Jane Smith', 'jane@example.com', 'Marketing', 70000),
('Bob Johnson', 'bob@example.com', 'Sales', 75000);

INSERT INTO projects (name, description, start_date, end_date) VALUES
('Web App Redesign', 'Modernize the company website', '2024-01-01', '2024-03-31'),
('Mobile App', 'Build iOS and Android app', '2024-02-01', '2024-06-30');

INSERT INTO assignments (employee_id, project_id, role) VALUES
(1, 1, 'Lead Developer'),
(1, 2, 'Backend Developer'),
(2, 1, 'UI Designer'),
(3, 2, 'Product Manager');

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE mydb TO "user";
