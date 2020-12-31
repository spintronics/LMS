import express from "express";
import { get_files, log } from "../lib/util.js";
import path from "path";
import config from "../../config.js";

import axios from "axios";
import { filter, map, pipe, replace, split } from "ramda";
import { ApiUrl } from "../../lib/api.js";

export const registerClientRoutes = function registerClientRoutes(
  app: express.Application
) {
  app.get(ApiUrl.get_topics, async (req, res) => {
    try {
      let file_list = await get_files("topics");
      let normalized = map(
        pipe(replace(/.*topics/, ""), split(path.sep), filter(Boolean)),
        file_list
      );
      res.json({
        data: normalized,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  });

  // deliver services with middleware and unify the api route url/payload types
  // app.post(ApiUrl.select_question, async (req, res) => {
  //   try {
  //     let { data } = await axios.post(
  //       config.services.spaced_repition.url + "/select_question",
  //       req.body
  //     );
  //     res.json(data);
  //   } catch (e) {
  //     console.log(e);
  //     return res.status(500).send();
  //   }
  // });
};
