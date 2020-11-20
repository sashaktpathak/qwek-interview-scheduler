const db = require('../db/db_connection');

/**
 * 
 * @param {Object} err  
 * @param {Object} res Response object 
 * @param {*} data Date needed to be sent when error occurs
 */
const throwError = (err, res, data) => {
    console.error(err);
    if(res)
        res.send(data);
}

/**
 * 
 * @param {string} str String to be converted
 * @param {string} delim Delim character (Default: ,)
 */
exports.stringToArray = stringToArray = (str, delim=',') =>{
    let arr = str.split(delim);
    let newArr = arr.map((email)=>{
        if(email[0] == '[' || email[0] == ' ')
            email = email.slice(1);
        if(email.slice(-1) == ']' || email.slice(-1) == ' ')
            email = email.slice(0,-1);
        return email;
    });
    return newArr;
}

exports.getAllCandidates = (req, res) => {
        db.query('select id, username, email from participants', (err, result, fields)=>{
            if(err) throwError(err, res, {});
            res.send(result);
        });
    
};

exports.bookCandidates = (req, res) => {
    console.log(req.body);
    let insertValues = [];
    insertValues.push(req.body.time);
    insertValues.push(req.body.date);
    insertValues.push(parseInt(req.body.duration));
    insertValues.push(0);
    insertValues.push(req.body.filename);
    insertValues = [insertValues];
    let participants = req.body.participantsList;
    //let participants = stringToArray(req.body.participantsList);
    let query = `SELECT email, booked from participants where email in (${db.escape(participants)})`;
    db.query(query, (err, result)=>{
        if(err) throwError(err, res, {});
        console.log(result);

        for(row in result){
            if(result[row].booked == 1){
                res.send({
                    status: 0,
                    msg: "Participant(s) already booked!"
                });
                return;
            }
        }
        let sql = "INSERT INTO booking (time, date, duration, status, resume) VALUES ?";
        db.query(sql, [insertValues], (err, result) => {
            if(err) throwError(err, res, {});
            let updateQuery = `UPDATE participants SET booked=1, booking_id=${result.insertId} where email in (${db.escape(participants)})`;
            db.query(updateQuery, (err, updateResult) => {
                if(err) throwError(err, res, {});
                    res.send({
                        status: 1,
                        msg: "success"
                    });
            });
        });
    }) ;    
        
};

exports.deleteCandidate = (req, res) => {
    let query = `UPDATE participants set booked=0, booking_id=null where email='${req.body.removeEmail.trim()}'`;
    db.query(query, (err, result)=>{
        if(err) throwError(err, res, {status: 0});
        if(result.affectedRows < 1 && !req.body.specialDelete)
            res.send({
                status: 1,
                msg: "No user found"
            })
        if(!req.body.specialDelete)
            res.send({
                status: 1,
                msg: "Participant removed"
            });
    });
}

exports.updateBooking = (req, res) => {
    console.log(req.body);
    let query = `UPDATE booking set time='${req.body.time.trim()}', date='${req.body.date.trim()}', duration=${req.body.duration} where id = ${req.body.booking_id}`;
    db.query(query, (err, result)=>{
        if(err) throwError(err, res, {status: 0});
        res.send({
            status: 1,
            msg: "Booking Updated"
        });
    });
}

exports.showBookings = (req, res) => {
    let query = `select username, email, booking_id, time, date, duration, resume from participants p inner join booking b on p.booking_id = b.id order by booking_id`;
    db.query(query, (err, result)=>{
        if(err) throwError(err, res, {status: 0});
        res.send({
            status: 1,
            data: result
        });
    });
}

exports.deleteBooking = (req, res) => {
    let query = `DELETE FROM booking where id=${req.body.bookingId}`;
    db.query(query, (err, result)=>{
        if(err) throwError(err, res, {status: 0});
        res.send({
            status: 1,
            msg: "Interview Cancelled"
        });
    });
}

exports.showBookingsPerId = (req, res) => {
    let query = `select username, email, booking_id, time, date, duration from participants p inner join booking b on p.booking_id = b.id where p.booking_id=${req.body.booking_id} order by booking_id`;
    db.query(query, (err, result)=>{
        if(err) throwError(err, res, {status: 0});
        res.send({
            status: 1,
            data: result
        });
    });
}

exports.addCandidate = (req, res) => {
    console.log(req.body);
    
    let participants = req.body.participantsList;
    //let participants = stringToArray(req.body.participantsList);
    let query = `SELECT email, booked from participants where email in (${db.escape(participants)})`;
    db.query(query, (err, result)=>{
        if(err) throwError(err, res, {});
        console.log(result);

        for(row in result){
            if(result[row].booked == 1){
                res.send({
                    status: 0,
                    msg: "Participant(s) already booked!"
                });
                return;
            }
        }
        let updateQuery = `UPDATE participants SET booked=1, booking_id=${req.body.bookingId} where email in (${db.escape(participants)})`;
        db.query(updateQuery, (err, updateResult) => {
            if(err) throwError(err, res, {});
                res.send({
                    status: 1,
                    msg: "success"
                });
        });
    });
}

exports.updateBooking