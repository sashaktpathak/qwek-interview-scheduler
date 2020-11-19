const express = require('express');
const bodyParser = require("body-parser");
const schedulerRoutes = require('./routes.js/schedulerRoutes');
const mailingRoutes = require('./routes.js/mailingRoutes');

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();

});

app.use('/', schedulerRoutes);
app.use('/mailing', mailingRoutes);

app.listen(1337);