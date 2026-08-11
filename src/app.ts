import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth.js";

import adminRouter from "./routes/admin.route.js";
import jwtRouter from "./routes/jwt.route.js";
import router from "./routes/index.js";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// Better Auth must stay before express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Main application routes
app.use("/api", router);

// Other test/protected routes
app.use("/api/admin", adminRouter);
app.use("/api/jwt", jwtRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "SportsHub API is running successfully",
  });
});

export default app;