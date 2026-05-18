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
  } else {
    // In production (e.g. locally with npm run build), serve static files from dist
    // NOTE: On Vercel, static files are usually handled by Vercel's edge network via vercel.json
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Check if file exists, if not send index.html for SPA
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// Check for required env vars and log warnings
if (!process.env.GAS_URL) console.warn("WARNING: GAS_URL is not set");
if (!process.env.ADMIN_PASSWORD) console.warn("WARNING: ADMIN_PASSWORD is not set, using default 'admin123'");

// In standard environments (AI Studio, local), start the server
async function start() {
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    await setupApp();
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } else {
    // On Vercel, routes inside setupApp are not strictly needed if vercel.json handles static,
    // but we run it just in case. Note: on Vercel we don't 'listen'
    setupApp();
  }
}

start().catch(err => {
  console.error("Failed to start server:", err);
});

export default app;
