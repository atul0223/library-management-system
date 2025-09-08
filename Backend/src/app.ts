import express, { json, urlencoded } from "express";
import cors from "cors";
import userRoutes from "./routes/user.route"
import cookieParser from "cookie-parser";
import bookRoutes from "./routes/book.route"
const app: express.Application = express();
app.use(
  cors({
    origin:"*",
    credentials: true,
  })
);
app.use(json({ limit: "20kb" }));
app.use(cookieParser());
app.use(urlencoded({ extended: true, limit: "20kb" }));
app.use("/user", userRoutes);
app.use("/book", bookRoutes);

export default app;
