import express from "express";
import bodyParser from "body-parser";
import Busboy from "busboy";

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


app.post("/upload", (request, response) => {
  let busboy = new Busboy({ headers: request.headers });
  /*eslint-disable no-unused-vars*/
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

    file.on("data", (data) => {

    });
    file.on("end", () => {

    });
  });

  busboy.on("field", (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
    // log val
  });

  busboy.on("finish", () => {
    response.writeHead(303, { Connection: "close", Location: "/" });
    response.end();
  });

  request.pipe(busboy);

});

/*eslint no-console: ["error", { allow: ["log", "warn"] }] */
app.listen(5000, () => console.log("Example app listening on port 5000!"));
