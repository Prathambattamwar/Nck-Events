import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { setupSocketHandlers } from "./socketHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    // HIGH CONCURRENCY OPTIMIZATIONS
    transports: ["websocket"], // Skip polling for faster connection & lower overhead
    allowUpgrades: false,
    pingInterval: 25000,
    pingTimeout: 20000,
    maxHttpBufferSize: 1e7, // 10MB limit for large payloads
    connectTimeout: 45000,
    // Enable performance optimizations
    perMessageDeflate: {
      threshold: 1024, // Only compress if payload > 1KB
    }
  });

  const PORT = 3001;

  // Initialize socket logic
  setupSocketHandlers(io);

  // API Routes
  app.get("/api/status", (req, res) => {
    res.json({ 
      status: "online",
      uptime: process.uptime(),
      connections: io.engine.clientsCount,
      root,
      cwd: process.cwd()
    });
  });

  app.get("/api/debug", (req, res) => {
    res.send(`Root: ${root}, CWD: ${process.cwd()}, Dirname: ${__dirname}`);
  });

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    console.log('Running in PRODUCTION mode');
    const distPath = path.join(root, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Standalone API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer();
