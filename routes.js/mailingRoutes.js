var express = require('express');
var router = express.Router();
var mailingController = require('../controllers/mailingController');
var path = require('path');

var upload = require('../utils/multer');

router.post('/sendMails', function(req, res){
    mailingController.sendMail(req, res);
});

router.post('/uploadResume', (req, res) => {
    upload(req, res, (err)=>{
        console.log(err);
        if(err) res.send({status: 0});
        else{
            res.send({
                status: 1,
                msg: "File Uploaded",
                filename: res.req.file.filename
            })
        }
    });
});

//send Resume
router.post('/getResume', (req, res)=>{
    if(req.body.filename){
        const location = path.join(__dirname,'../uploads', req.body.filename);
        console.log(location)
        res.download(location, 'resume.pdf');
    }
    
});

module.exports = router;