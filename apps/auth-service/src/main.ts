import express from "express";
import cors from "cors";
import { errorMiddleware

 } from "../../../packages/error-handler/error-middleware";
import cookieParser from "cookie-parser";
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

app.use(express.json());
app.use(cookieParser());
//Routes

app.get("/", (req, res) => {
  res.send({ message: "Hello API from Auth-Service" });
});

//Error Middleware
app.use(errorMiddleware);
//Start server

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Auth Service listening at http://localhost:${port}/api`);
});

server.on("error", (err) => {
  console.log("Server Error :", err);
});
