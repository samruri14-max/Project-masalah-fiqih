import express from "express";

const router = express.Router();

// API Proxy to Google Apps Script
router.all("/proxy", async (req, res) => {
  try {
    const gasUrl = process.env.GAS_URL;
    if (!gasUrl) {
      console.error("GAS_URL is missing");
      return res.status(500).json({ error: "GAS_URL not configured" });
    }

    const { method, body, query } = req;
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
});

// Simple Admin Login
router.post("/admin/login", (req, res) => {
  try {
    const { password } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    console.log("Login attempt received");
    
    if (password && password === adminPassword) {
      console.log("Login success");
      res.status(200).json({ success: true, token: "mock-token-123" });
    } else {
      console.warn("Login failed: Invalid password");
      res.status(401).json({ success: false, error: "Password tidak sesuai" });
    }
  } catch (error: any) {
    console.error("Login handler error:", error);
    res.status(500).json({ error: "Terjadi kesalahan internal pada server", details: error.message });
  }
});

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

export default router;
