require("dotenv").config();
const express = require("express");
const app = express();
const { initAllDb, shutDb } = require("./controllers/sqlite");
const { logger } = require("./middleware/logEvents");
const errLogEvents = require("./middleware/errorHandle");
const port = process.env.PORT || 3500;
const path = require("path");
const methodOverride = require("method-override"); //overries <form/> get and post

//routes
const article = require("./routes/article");

//utilties
app.use(express.urlencoded({ extended: false })); //access  info from a form element
app.use(express.json()); // or app.use(bodyParser.json()); No need for body-parser
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));

//LogEvents logs
app.use(logger);

//landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

//routes
app.use("/article", article);

//404s
app.all("*", (req, res) => {
  res.send("404 page");
});

//error logs
app.use(errLogEvents);

/*
initializes the database and opens the express server on the port
if there is an error it stops the server
*/
initAllDb()
  .then(() => {
    app.listen(port, () => {
      console.log("listening on ", `http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

//shuts down the server in a way not to damage the database
const shutsDown = () => {
  shutDb()
    .catch(() => {})
    .then(() => {
      console.log("shuting down...");
      process.exit();
    });
};

process.on("SIGINT", shutsDown);
process.on("SIGTERM", shutsDown);
process.on("SIGUSR2", shutsDown);
