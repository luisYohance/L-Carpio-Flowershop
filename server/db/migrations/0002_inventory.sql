-- Create flowers table
CREATE TABLE IF NOT EXISTS "flowers" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "quantity" INTEGER NOT NULL DEFAULT 0
);

-- Create consumables table
CREATE TABLE IF NOT EXISTS "consumables" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

-- Insert default flowers
INSERT INTO "flowers" ("name", "quantity")
VALUES 
    ('Lily', 0),
    ('Rose', 0),
    ('Tulip', 0),
    ('Chrysanthemum', 0)
ON CONFLICT (name) DO NOTHING;

-- Insert default consumables
INSERT INTO "consumables" ("name")
VALUES 
    ('Wrapper'),
    ('Ribbon'),
    ('Sequins'),
    ('Silk')
ON CONFLICT (name) DO NOTHING; 