import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// API Proxy to Google Apps Script
const proxyHandler = async (req: express.Request, res: express.Response) => {
  const gasUrl = process.env.GAS_URL;
  if (!gasUrl) {
    console.error("GAS_URL is missing");
    return res.status(500).json({ error: "GAS_URL not configured" });
  }

  try {
    const { method, body, query } = req;
    
    // Construct URL with query params
    const targetUrl = new URL(gasUrl);
    Object.entries(query).forEach(([key, value]) => {
      targetUrl.searchParams.append(key, value as string);
    });

    console.log(`Proxying ${method} to GAS: ${targetUrl.toString()}`);

    const response = await fetch(targetUrl.toString(), {
      method: method === "GET" ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: method !== "GET" && Object.keys(body || {}).length > 0 ? JSON.stringify(body) : undefined,
      redirect: 'follow'
    });

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch from GAS", details: error.message });
  }
};

app.all("/api/proxy", proxyHandler);
app.all("/proxy", proxyHandler); // Fallback for stripped paths

// Simple Admin Login
const loginHandler = (req: express.Request, res: express.Response) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  console.log("Login attempt received");
  
  if (password === adminPassword) {
    console.log("Login success");
    res.json({ success: true, token: "mock-token-123" });
  } else {
    console.warn("Login failed: Invalid password");
    res.status(401).json({ success: false, error: "Invalid password" });
  }
};

app.post("/api/admin/login", loginHandler);
app.post("/admin/login", loginHandler); // Fallback for stripped paths

// Setup Vite or Static File Serving
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    // ONLY serve static files if NOT on Vercel (e.g. standard production start)
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// Check for required env vars and log warnings
if (!process.env.GAS_URL) console.warn("WARNING: GAS_URL is not set");
if (!process.env.ADMIN_PASSWORD) console.warn("WARNING: ADMIN_PASSWORD is not set, using default 'admin123'");

// Initialize app-level setups
if (process.env.NODE_ENV !== "production") {
  setupApp();
} else {
  // In production, we only need setupApp if we're not on Vercel (for standalone server)
  if (!process.env.VERCEL) {
    setupApp();
  }
}

// Start listener ONLY if not on Vercel
if (!process.env.VERCEL) {
  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
