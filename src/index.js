import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { PdfReader } from "pdfreader";

import { parse } from "./core/parser";

const app = express();

const allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(allowCrossDomain);

// Router
app.get("/", (request, response) => {
  response.json({
    logs: request.body
  });
});

app.get("/logs", (request, response) => {
  response.json({
    logs: { }
  });
});

app.get("/logs/:id", (request, response) => {
  response.json({
    logsById: { }
  });
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("log"), (request, response) => {
  const buffer = request.file.buffer;
  const pdfreader = new PdfReader();

  pdfreader.parseBuffer(buffer, (error, data) => {
    if (error) {
      response.json({ error: `Error converting PDF data: ${error}`});
    }

    parse(data.text)
  });
});



/*eslint no-console: ["error", { allow: ["log", "warn"] }] */
app.listen(5000, () => console.log("Example app listening on port 5000!"));
