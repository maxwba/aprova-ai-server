require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

require("./configs/passport");

// ____________________________________________CONNECTING MONGOODB________________________________//

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: '${x.connections[0].name}'`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });
const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// ____________________________________________MIDDLEWARE SETUP________________________________//

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// ____________________________________________EXPRESS VIEW ENGINE SETUP________________________________//

app.use(express.static(path.join(__dirname, "public")));

// ____________________________________________SESSION SETTINGS___________________________________//

app.use(
  session({
    secret: "aprova-ai-eh-show ",
    resave: true,
    saveUninitialized: true
  })
);

// _______________________________PASSPORT .initialize() and .session()__________________________//

app.use(passport.initialize());
app.use(passport.session());

// ____________________________CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION______________//

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"] // <== this will be the URL of our React app (it will be running on port 3000)
  })
);

// _____________________________________ROUTES MIDDLEWARE STARTS HERE___________________________//

const auth = require("./routes/auth.routes");
const clients = require("./routes/clients");
const form = require("./routes/form");
const task = require("./routes/tasks");

app.use("/api", auth);
app.use("/api/client", clients);
app.use("/api/form", form);
app.use("/api/task", task);

app.listen(process.env.PORT, () =>
  console.log(`Listening on Port: ${process.env.PORT}`)
);

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
