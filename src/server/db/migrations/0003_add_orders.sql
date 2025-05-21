-- Drop the table if it exists to ensure clean state
DROP TABLE IF EXISTS dyiflowershop_orders;

-- Create the orders table
CREATE TABLE dyiflowershop_orders (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(256) NOT NULL,
    total_price REAL NOT NULL,
    items JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
); 