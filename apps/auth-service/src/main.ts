import express from "express";
import cors from "cors";

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

//Routes

app.get("/", (req, res) => {
  res.send({ message: "Hello API from Auth-Service" });
});

//Start server

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Auth Service listening at http://localhost:${port}/api`);
});

server.on("error", (err) => {
  console.log("Server Error :", err);
});
