import express, { RequestHandler } from "express";
import { get_arg } from "../lib/util.js";

let dev = get_arg("mode") === "dev";

const protectedRoutes = [
  dev ? "" : "/src",
  "/build/server",
  "/build/config.json",
  "/build.sh",
  "/package.json",
  "/tsconfig.json",
  "/dockerfile",
].filter(Boolean);

export function limitExposure(routes = protectedRoutes) {
  const middleware: RequestHandler = (req, res, next) => {
    for (let route of routes) {
      if (req.path.startsWith(route)) {
        res.status(404).send();
        return;
      }
    }
    next();
  };
  return middleware;
}

export function redirectJs() {
  const middleware: RequestHandler = (req, res, next) => {
    let spath = req.path.split("/").filter(Boolean);
    if (spath[0] == "build" && !spath[spath.length - 1].includes(".js")) {
      res.redirect(req.path + ".js");
    } else {
      next();
    }
  };
  return middleware;
}
