import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertCategorySchema, insertTransactionSchema, insertInvoiceSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Categories
  app.get("/api/categories", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const categories = await storage.getCategoriesByUserId(req.user.id);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      console.log("Received category creation request:", req.body);
      const parsed = insertCategorySchema.parse({ ...req.body, userId: req.user.id });
      const category = await storage.createCategory(parsed);
      console.log("Created category:", category);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create category" });
    }
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const transactions = await storage.getTransactionsByUserId(req.user.id);
    res.json(transactions);
  });

  app.post("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertTransactionSchema.parse({ ...req.body, userId: req.user.id });
    const transaction = await storage.createTransaction(parsed);
    res.status(201).json(transaction);
  });

  // Invoices
  app.get("/api/invoices", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const invoices = await storage.getInvoicesByUserId(req.user.id);
    res.json(invoices);
  });

  app.post("/api/invoices", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertInvoiceSchema.parse({ ...req.body, userId: req.user.id });
    const invoice = await storage.createInvoice(parsed);
    res.status(201).json(invoice);
  });

  const httpServer = createServer(app);
  return httpServer;
}