require('dotenv').config();
const express = require('express');
const winston = require('winston');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({
//     extended: true
// }));

process.env['NODE_CONFIG_DIR'] = __dirname + '/../config';

require('./startup/logger')();
require('./startup/routes')(app);
require('./startup/db')();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
    winston.info(`Express server listening on port ${PORT} ...`)
);

app.use(express.static('../public'));
app.use(express.static(path.join(__dirname, '../front')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/index.html'));
});

module.exports = server;