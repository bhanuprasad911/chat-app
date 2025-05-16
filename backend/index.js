import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import dbConnection from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.use("/api/user", authMiddleware, userRouter);

app.use("/api/chat", authMiddleware, chatRouter);


if (process.env.NODE_ENV === "production") {
 app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*path", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
}
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  dbConnection();
});
