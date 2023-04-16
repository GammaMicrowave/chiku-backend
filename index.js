import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
config();

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 8000, process.env.HOST || "localhost", () => {
  console.log(
    `Server started on http://${process.env.HOST || "localhost"}:${
      process.env.PORT || 8000
    }`
  );
});
