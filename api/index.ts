import express from "express";
import apiRouter from "../src/api-routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Mount the router
// Our rewrites in vercel.json point /api/(.*) to /api/index
// So /api/admin/login reaches here as /api/admin/login or just /admin/login depending on Vercel
// We mount it at /api and / for maximum compatibility
app.use("/api", apiRouter);
app.use("/", apiRouter);

export default app;
