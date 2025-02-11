import { User, InsertUser, Category, Transaction, Invoice } from "@shared/schema";
import type { Store } from "express-session";

export interface IStorage {
  sessionStore: Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category operations
  createCategory(category: Omit<Category, "id">): Promise<Category>;
  getCategoriesByUserId(userId: number): Promise<Category[]>;

  // Transaction operations
  createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;

  // Invoice operations
  createInvoice(invoice: Omit<Invoice, "id">): Promise<Invoice>;
  getInvoicesByUserId(userId: number): Promise<Invoice[]>;
}
