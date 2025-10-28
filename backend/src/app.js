const express = require('express');
const cors = require('cors'); // added
require('dotenv').config();
const api = require('./routes/index');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // allow dev frontend only
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files
app.use('/public', express.static(require('path').join(__dirname, '..', 'public')));

// mount API
app.use('/api', api);

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'server error' });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`API listening on http://localhost:${port}/api`));
}

module.exports = app;