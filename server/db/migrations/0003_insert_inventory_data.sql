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