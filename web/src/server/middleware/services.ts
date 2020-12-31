import axios from "axios";
import { RequestHandler } from "express";
import { get_arg } from "../lib/util.js";

const localIp = get_arg("mode") === "dev" ? "0.0.0.0" : "";

const ServiceIp = {
  "spaced-repitition": `http://${localIp || "spaced-repitition"}:1000`,
};

export function forwardServices(/**validServices */) {
  const middleware: RequestHandler = async (req, res, next) => {
    try {
      if (req.path.startsWith("/services")) {
        let sPath = req.path.split("/").filter(Boolean);
        console.log(sPath, sPath[1]);
        if (sPath[1] in ServiceIp) {
          let { data } = await axios.post(
            ServiceIp[sPath[1]] + "/" + sPath.slice(2, sPath.length).join("/"),
            req.body || {}
          );

          res.json(data);
          return;
        }
      }
    } catch (e) {
      console.log(e);
      next();
    } finally {
      next();
    }
  };
  return middleware;
}
