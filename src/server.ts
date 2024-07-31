import express from "express";
import authController from "./controllers/auth.controller";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const port = process.env.PORT || "3000";

app.use("/auth", authController);

app.listen(parseInt(port), () => {
  console.log("Server is running");
});