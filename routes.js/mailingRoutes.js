var express = require('express');
var router = express.Router();
var mailingController = require('../controllers/mailingController');

router.post('/sendMails', function(req, res){
    mailingController.sendMail(req, res);
});

module.exports = router;