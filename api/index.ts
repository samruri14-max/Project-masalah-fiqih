import express from "express";
import dotenv from "dotenv";

// Load env vars for local dev, Vercel loads them automatically
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Admin Login
app.post(["/api/admin/login", "/admin/login"], (req, res) => {
  try {
    const { password } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (password && password === adminPassword) {
      return res.status(200).json({ success: true, token: "mock-token-123" });
    } else {
      return res.status(401).json({ success: false, error: "Password tidak sesuai" });
    }
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Terjadi kesalahan internal server", details: error.message });
  }
});

// Proxy to Google Apps Script
app.all(["/api/proxy", "/proxy"], async (req, res) => {
  try {
    const gasUrl = process.env.GAS_URL;
    if (!gasUrl) {
      return res.status(500).json({ error: "GAS_URL tidak dikonfigurasi di Environment Variables" });
    }

    const { method, body, query } = req;
    const targetUrl = new URL(gasUrl);
    Object.entries(query).forEach(([key, value]) => {
      targetUrl.searchParams.append(key, value as string);
    });

    const response = await fetch(targetUrl.toString(), {
      method: method === "GET" ? "GET" : "POST",
      headers: { "Content-Type": "application/json" },
      body: method !== "GET" && body && Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
      redirect: 'follow'
    });

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ error: "Gagal menghubungi Google Apps Script", details: error.message });
  }
});

// Health check
app.get(["/api/health", "/health"], (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV, vercel: !!process.env.VERCEL });
});

export default app;
