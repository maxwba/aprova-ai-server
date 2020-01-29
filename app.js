require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

require('./configs/passport');

//____________________________________________CONNECTING MONGOODB____________________________________________//

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: '${x.connections[0].name}'`,
    );
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });
const app_name = require('./package.json').name;
const debug = require('debug')(
  `${app_name}:${path.basename(__filename).split('.')[0]}`,
);

const app = express();

//____________________________________________MIDDLEWARE SETUP______________________________________________//

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//____________________________________________EXPRESS VIEW ENGINE SETUP_____________________________________//

app.use(express.static(path.join(__dirname, 'public')));

//____________________________________________SESSION SETTINGS______________________________________________//

app.use(
  session({
    secret: 'aprova-ai-eh-show ',
    resave: true,
    saveUninitialized: true,
  }),
);

//___________________________________PASSPORT .initialize() and .session()__________________________________//

app.use(passport.initialize());
app.use(passport.session());

//____________________________CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION__________________________//

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'] // <== this will be the URL of our React app (it will be running on port 3000)
  }),
);

//_____________________________________ROUTES MIDDLEWARE STARTS HERE________________________________________//

const index = require('./routes/index');
app.use('/', index);

app.listen(process.env.PORT, () => console.log(`Listening on Port: ${process.env.PORT}`));

module.exports = app;
