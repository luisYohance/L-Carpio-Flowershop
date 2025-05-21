-- Create rows table
CREATE TABLE IF NOT EXISTS dyiflowershop_rows (
    id SERIAL PRIMARY KEY,
    title VARCHAR(256) NOT NULL
);

-- Create bouquets table
CREATE TABLE IF NOT EXISTS dyiflowershop_bouquets (
    id SERIAL PRIMARY KEY,
    label VARCHAR(256) NOT NULL,
    image VARCHAR(1024) NOT NULL,
    price REAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create row_bouquets join table
CREATE TABLE IF NOT EXISTS dyiflowershop_row_bouquets (
    row_id INTEGER NOT NULL,
    bouquet_id INTEGER NOT NULL,
    PRIMARY KEY (row_id, bouquet_id),
    FOREIGN KEY (row_id) REFERENCES dyiflowershop_rows(id) ON DELETE CASCADE,
    FOREIGN KEY (bouquet_id) REFERENCES dyiflowershop_bouquets(id) ON DELETE CASCADE
);

-- Create bouquet_flowers table
CREATE TABLE IF NOT EXISTS dyiflowershop_bouquet_flowers (
    bouquet_id INTEGER NOT NULL,
    flower_name VARCHAR(256) NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (bouquet_id, flower_name),
    FOREIGN KEY (bouquet_id) REFERENCES dyiflowershop_bouquets(id) ON DELETE CASCADE
);

-- Create bouquet_consumables table
CREATE TABLE IF NOT EXISTS dyiflowershop_bouquet_consumables (
    bouquet_id INTEGER NOT NULL,
    consumable_name VARCHAR(256) NOT NULL,
    PRIMARY KEY (bouquet_id, consumable_name),
    FOREIGN KEY (bouquet_id) REFERENCES dyiflowershop_bouquets(id) ON DELETE CASCADE
); 