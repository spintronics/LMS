import express, { Request, Response } from "express";
import path from "path";
import { get_arg, log } from "./lib/util.js";
import morgan from "morgan";
import { registerClientRoutes } from "./routes/client.js";
import { limitExposure, redirectJs } from "./middleware/http.js";
import { forwardServices } from "./middleware/services.js";
import fs from "fs";
import { map, pipe, split } from "ramda";

const app = express();

app.use(
  morgan("tiny"),
  limitExposure(),
  redirectJs(),
  express.json(),
  forwardServices(),
  express.static(".")
);

registerClientRoutes(app);

let port = +get_arg("port", "8080");

app.listen(port, "0.0.0.0", () => {
  console.log(`listening on port ${port}`);
});
