import { sql } from "drizzle-orm";
import { index, pgTableCreator, integer, varchar, real, timestamp, primaryKey, pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `dyiflowershop_${name}`);

// Rows
export const rows = createTable("rows", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  title: d.varchar({ length: 256 }).notNull(),
}));

// Bouquets
export const bouquets = createTable("bouquets", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  label: d.varchar({ length: 256 }).notNull(),
  image: d.varchar({ length: 1024 }).notNull(),
  price: d.real().notNull(),
  created_at: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

// Row-Bouquet join table (many-to-many)
export const rowBouquets = createTable("row_bouquets", (d) => ({
  row_id: d.integer().notNull(),
  bouquet_id: d.integer().notNull(),
}), (t) => [primaryKey(t.row_id, t.bouquet_id)]);

// Flowers per bouquet (name + quantity)
export const bouquetFlowers = createTable("bouquet_flowers", (d) => ({
  bouquet_id: d.integer().notNull(),
  flower_name: d.varchar({ length: 256 }).notNull(),
  quantity: d.integer().notNull(),
}), (t) => [primaryKey(t.bouquet_id, t.flower_name)]);

// Consumables per bouquet
export const bouquetConsumables = createTable("bouquet_consumables", (d) => ({
  bouquet_id: d.integer().notNull(),
  consumable_name: d.varchar({ length: 256 }).notNull(),
}), (t) => [primaryKey(t.bouquet_id, t.consumable_name)]);

export const flowers = pgTable('flowers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  quantity: integer('quantity').notNull().default(0),
});

export const consumables = pgTable('consumables', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
});

// Orders table
export const orders = pgTable("dyiflowershop_orders", {
  id: serial("id").primaryKey(),
  user_email: varchar("user_email", { length: 256 }).notNull(),
  total_price: real("total_price").notNull(),
  items: jsonb("items").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
});
