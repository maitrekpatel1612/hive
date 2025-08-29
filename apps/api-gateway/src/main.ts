import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import axios from "axios";
import cookieParser from "cookie-parser";
import { error } from "console";

//Create express app
const app = express();

//Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());
app.set("trust proxy", 1);

//Rate Limiter Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100), // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests, Please try again later!",
  },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req:any) => ipKeyGenerator(req),
});

app.use(limiter);

//Health Route
app.get("/gateway-health", (req, res) => {
  res.send({ status: "healthy", message: "Welcome to API-Gateway!" });
});

//Proxy Route
app.use("/", proxy("http://localhost:6001"));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
