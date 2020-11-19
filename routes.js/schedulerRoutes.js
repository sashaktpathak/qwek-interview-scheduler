var express = require('express');
var router = express.Router();
var schedulerController = require('../controllers/schedulerController');

// Get List of all participants.
router.get('/getCandidates', function (req, res) {
  schedulerController.getAllCandidates(req, res);
})

// Book Candidates based on Info recieved in Request
router.post('/bookCandidates', function(req, res){
    schedulerController.bookCandidates(req, res);
});

// Remove a candidate from Booking
router.post('/deleteUserBooking', function(req, res){
    schedulerController.deleteCandidate(req, res);
});

// Update booking details
router.post('/updateBooking', function(req, res){
    schedulerController.updateBooking(req, res);
});

//Get list of all Interviews scheduled
router.get('/showAllBookings', function(req, res){
    schedulerController.showBookings(req, res);
});

//Delete a booking
router.post('/deleteBooking', function(req, res){
    let participantsList = schedulerController.stringToArray(req.body.participantsList);
    req.body.specialDelete = true;
    participantsList.forEach((participant) => {
        req.body.removeEmail = participant;
        schedulerController.deleteCandidate(req, res);
    });
    schedulerController.deleteBooking(req, res);
});

module.exports = router;