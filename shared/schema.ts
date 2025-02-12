import {
  pgTable,
  text,
  serial,
  integer,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  businessName: text("business_name").notNull(),
  defaultCurrency: text("default_currency").notNull().default("USD"),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // income or expense
  userId: integer("user_id").notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  categoryId: integer("category_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // income or expense
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  clientName: text("client_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // paid, pending, overdue
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

// List of supported currencies
export const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "INR",
  "MWK",
] as const;

export const insertUserSchema = createInsertSchema(users).extend({
  businessName: z.string().min(1, "Business name is required"),
  defaultCurrency: z.enum(SUPPORTED_CURRENCIES),
});

export const insertCategorySchema = createInsertSchema(categories).extend({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["income", "expense"], {
    required_error: "Type must be either income or expense",
  }),
  userId: z.number().int().positive(),
});

export const insertTransactionSchema = createInsertSchema(transactions).extend({
  // Ensure amount is handled as a decimal string
  amount: z.string().transform((val) => val.toString()),
  // Ensure categoryId is a number
  categoryId: z.number().int().positive(),
  // Ensure userId is a number
  userId: z.number().int().positive(),
  // Ensure date is properly handled
  date: z.coerce.date(),
  // Validate transaction type
  type: z.enum(["income", "expense"]),
  // Validate currency
  currency: z.enum(SUPPORTED_CURRENCIES),
});

export const insertInvoiceSchema = createInsertSchema(invoices).extend({
  // Ensure amount is handled as a decimal string
  amount: z.string().transform((val) => val.toString()),
  // Ensure dates are properly handled
  dueDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  // Validate status
  status: z.enum(["paid", "pending", "overdue"]),
  // Validate currency
  currency: z.enum(SUPPORTED_CURRENCIES),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
