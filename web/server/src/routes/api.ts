import e from "express";
import { get_files, log } from "../lib/util";
import path from "path";
import config from "../config.json";

import axios from "axios";
import { filter, map, pipe, replace, split } from "ramda";

export const registerClientRoutes = function registerClientRoutes(
  app: e.Application
) {
  app.get("/api/lms/topics", async (req, res) => {
    try {
      let file_list = await get_files(
        path.join(__dirname, "../../../client/topics")
      );
      let normalized = map(
        pipe(replace(/.*topics/, ""), split(path.sep), filter(Boolean)),
        file_list
      );
      log(normalized);
      res.json({
        data: normalized,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  });

  // deliver services with middleware and unify the api route url/payload types
  app.post("/api/lms/select_question", async (req, res) => {
    try {
      let { data } = await axios.post(
        config.services.spaced_repition.url + "/select_question",
        req.body
      );
      res.json(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send();
    }
  });
};
