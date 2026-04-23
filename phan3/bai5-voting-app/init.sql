-- Initialize voting database

CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    option VARCHAR(50) NOT NULL,
    vote_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO votes (option, vote_count) VALUES
('Option A', 0),
('Option B', 0),
('Option C', 0)
ON CONFLICT DO NOTHING;

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for timestamp
DROP TRIGGER IF EXISTS update_votes_timestamp ON votes;
CREATE TRIGGER update_votes_timestamp
BEFORE UPDATE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
