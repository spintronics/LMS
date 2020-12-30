import express, { Request, Response } from "express";
import path from "path";
import { get_arg, log } from "./lib/util";
import morgan from "morgan";
import { registerClientRoutes } from "./routes/api";

const app = express();

app.use(morgan("tiny"));

app.use(express.json());

app.use(express.static(path.join(__dirname, "../../client")));

registerClientRoutes(app);

let port = +get_arg("port", "8080");

app.listen(port, "0.0.0.0", () => {
  console.log(`listening on port ${port}`);
});
