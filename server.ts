import express from "express";
import path from "path";
import apiApp from "./api/index";

const app = express();

// Use the same API app
app.use(apiApp);

// Setup Vite or Static File Serving
async function setupApp() {
  try {
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
  } catch (error) {
    console.error("Error in setupApp:", error);
  }
}

// In standard environment, start the server
if (!process.env.VERCEL) {
  setupApp();
  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
