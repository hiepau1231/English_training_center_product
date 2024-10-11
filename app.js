const express = require('express');
const routes = require('./routes/index');
require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const route = require('./routes/');
const app = express();
const cors = require('cors');

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
