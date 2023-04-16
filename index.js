import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import { config } from "dotenv";
config();

import passport from "./passport.config.js";
import { getLogin } from "./controller/admin.controller.js";

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_DB_CONN_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  });

const app = express();

app.use(cors());

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", getLogin);

app.listen(process.env.PORT || 8000, process.env.HOST || "localhost", () => {
  console.log(
    `Server started on http://${process.env.HOST || "localhost"}:${
      process.env.PORT || 8000
    }`
  );
});
