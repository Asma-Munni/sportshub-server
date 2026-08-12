import express, {
  Application,
  Request,
  Response,
} from "express";

import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth.js";

import adminRouter from "./routes/admin.route.js";
import jwtRouter from "./routes/jwt.route.js";
import router from "./routes/index.js";

const app: Application = express();

const frontendUrl =
  process.env.FRONTEND_URL ||
  "http://localhost:3000";

const allowedOrigins = Array.from(
  new Set([
    "http://localhost:3000",
    frontendUrl,
  ])
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// Better Auth must stay before express.json()
app.all(
  "/api/auth/*splat",
  toNodeHandler(auth)
);

app.use(express.json());

// Main application routes
app.use("/api", router);

// Admin routes
app.use("/api/admin", adminRouter);

// JWT protected routes
app.use("/api/jwt", jwtRouter);

// Health Check
app.get(
  "/",
  (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message:
        "SportsHub API is running successfully",
    });
  }
);

export default app;