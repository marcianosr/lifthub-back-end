import express from "express";
import bodyParser from "body-parser";

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

/*eslint no-console: ["error", { allow: ["log", "warn"] }] */
app.listen(5000, () => console.log("Example app listening on port 5000!"));
