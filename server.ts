import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// API Proxy to Google Apps Script
app.all("/api/proxy", async (req, res) => {
  const gasUrl = process.env.GAS_URL;
  if (!gasUrl) {
    return res.status(500).json({ error: "GAS_URL not configured" });
  }

  try {
    const { method, body, query } = req;
    
    // Construct URL with query params
    const targetUrl = new URL(gasUrl);
    Object.entries(query).forEach(([key, value]) => {
      targetUrl.searchParams.append(key, value as string);
    });

    const response = await fetch(targetUrl.toString(), {
      method: method === "GET" ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: method !== "GET" ? JSON.stringify(body) : undefined,
      redirect: 'follow' // GAS often redirects to exec
    });

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch from GAS", details: error.message });
  }
});

// Simple Admin Login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  if (password === adminPassword) {
    res.json({ success: true, token: "mock-token-123" });
  } else {
    res.status(401).json({ success: false, error: "Invalid password" });
  }
});

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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// In standard environments (AI Studio, local), start the server
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  setupApp().then(() => {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  // On Vercel, we just need to ensure static routes are ready if used as a function
  setupApp();
}

export default app;
