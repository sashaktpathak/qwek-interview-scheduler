import React, { Component } from 'react';
import classes from './Model.module.css';
import Select from "react-dropdown-select";
import axios from '../../axios';
import qs from 'qs';
import Candidate from '../Candidate/Candidate';
import DatePicker from "react-datepicker";
import Timekeeper from 'react-timekeeper';
import Slider from 'rc-slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { sqlToDate, jsDate, formatDate } from '../../helper/utils';


const config = {

    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
};

class Model extends Component {

    state = {
        details: [],
        names: [],
        selectedNames: [],
        selectedDate: new Date(),
        startTime: "12:00PM",
        showTime: false,
        interviewDuration: 60,
        marks: {0: 15, 10: 30, 20: 45, 30: 60, 40: 75, 50: 90, 60: 105, 70: 120, 80: 135, 90: 150, 100: 165}
    }

    componentDidMount(){
        
        let payload = {
            booking_id: this.props.bookingId
        };
        payload = qs.stringify(payload);

        axios.post('/allBookingPerId', payload, config)
        .then(response => {
            const data = response.data.data;
            let details = [];
            let users = [];
            let temp = {};
            let prev = -1;
            data.forEach(row => {
                if(prev !== row.booking_id){
                    if(users.length > 0 && temp !== {}){
                        temp['participantsList'] = users;
                        details.push(temp);
                    }
                    temp = {};
                    users = [];
                    prev = row.booking_id;
                }
                temp['time'] = row.time;
                temp['date'] = sqlToDate(row.date);
                temp['duration'] = row.duration;
                temp['booking_id'] = row.booking_id;
                users.push({
                    'username': row.username,
                    'email': row.email
                });
            });
            if(users.length > 0 && temp !== {}){
                temp['participantsList'] = users;
                details.push(temp);
            }
            this.setState({
                details: details,
                startTime: details[0].time,
                selectedDate: jsDate(details[0].date),
                interviewDuration: details[0].duration,
                showTime: false
            });
        });

        axios.get('/getCandidates')
        .then((data) => {
            this.setState({names: data.data});
        });
    }
    render(){
        
        const removeCandidate = (email) => {
            if(this.state.details[0].participantsList.length <= 2)
                alert("Interview cannot contain less than 2 participants");
            else{
                let payload = {
                    removeEmail: email
                };
                payload = qs.stringify(payload);
                axios.post('/deleteUserBooking', payload, config)
                alert("Participant removed")
                update();
            }
        }

        const addCandidate = () => {
            const selectedEmails = [];
            this.state.selectedNames.forEach(value=>{
                if(value)
                selectedEmails.push(value.email);     
            });
            let payload = {
                bookingId: this.props.bookingId,
                participantsList: selectedEmails
            }
            if(selectedEmails.length > 0){
                payload = qs.stringify(payload);
                axios.post('/addCandidate', payload, config)
                .then(response => {
                    if(response.data.status === 0)
                        alert("Oops, some error occured");
                    else{
                        alert(response.data.msg);
                        this.setState({selectedNames: []});
                    }
                });
                update();
            }
            else    
                alert("Select at least 1 participant");
        }

        const updateInfo = () => {
            let payload = {
                time: this.state.startTime,
                date: formatDate(this.state.selectedDate, 0),
                duration: this.state.interviewDuration,
                booking_id: this.props.bookingId
            };
            payload = qs.stringify(payload);
            axios.post('/updateBooking', payload, config)
            .then(response => {
                if(response.data.status === 0)
                    alert("Error updating Info");
                else    
                    alert(response.data.msg);
            })
            update();
        }

        const deleteBooking = () => {
            const selectedEmails = [];
            this.state.details[0].participantsList.forEach(value=>{
                if(value)
                selectedEmails.push(value.email);     
            });
            let payload = {
                bookingId: this.props.bookingId,
                participantsList: selectedEmails
            }
            if(selectedEmails.length > 0){
                payload = qs.stringify(payload);
                axios.post('/deleteBooking', payload, config)
                .then(response => {
                    if(response.data.status === 0)
                        alert("Oops, some error occured");
                    else{
                        alert(response.data.msg);
                    }
                });
                update();
                this.props.closeFunction();
            }
        }

        const update = () =>{
            let payload = {
                booking_id: this.props.bookingId
            };
            payload = qs.stringify(payload);
    
            axios.post('/allBookingPerId', payload, config)
            .then(response => {
                const data = response.data.data;
                let details = [];
                let users = [];
                let temp = {};
                let prev = -1;
                data.forEach(row => {
                    if(prev !== row.booking_id){
                        if(users.length > 0 && temp !== {}){
                            temp['participantsList'] = users;
                            details.push(temp);
                        }
                        temp = {};
                        users = [];
                        prev = row.booking_id;
                    }
                    temp['time'] = row.time;
                    temp['date'] = sqlToDate(row.date);
                    temp['duration'] = row.duration;
                    temp['booking_id'] = row.booking_id;
                    users.push({
                        'username': row.username,
                        'email': row.email
                    });
                });
                if(users.length > 0 && temp !== {}){
                    temp['participantsList'] = users;
                    details.push(temp);
                }
                if(details[0]){
                    this.setState({
                        details: details,
                        startTime: details[0].time,
                        selectedDate: jsDate(details[0].date),
                        interviewDuration: details[0].duration,
                        showTime: false
                    });
                }
                else{
                    this.setState({
                        details: [],
                        startTime: "12:00PM",
                        selectedDate: new Date(),
                        interviewDuration: 60,
                        showTime: false
                    });
                }
            });
    
        }

        let disp = [];
        this.state.details.forEach(data => {
            data.participantsList.forEach(userData => {
               
                disp.push(
                    <Candidate delete={removeCandidate} key={userData.email} closeBtn {...userData}/>
                );
            });
        });
        
        return (
            <div className={classes.outerModel}>
                <div className={classes.modelBox}>
                    <div className={classes.editBox}>
                        <div className={classes.Title}>Interview Participants</div>
                        <div className={classes.candidateGroup}>{disp}</div>
                        <br />
                        <div className={classes.Title}>Add Participants</div>
                        {/* UserName selector */}
                        <div style={{marginBottom: '15px'}}onClick={() => addCandidate()} className={classes.addBtn}>ADD</div>
                        <Select 
                            values={this.state.selectedNames}
                            options={this.state.names}
                            multi={true}
                            labelField="username"
                            valueField="email"
                            placeholder="Select participants.."
                            onChange={(values) => this.setState((prevState)=>({selectedNames: values}))}
                        />
                        {/* Interview Info */}
                        <div className={classes.InterviewInfo}>
                            <div className={classes.DateAndTime}>
                                <div className={classes.Date}>
                                    <div className={classes.Title}>Select Interview Date</div>
                                    <DatePicker 
                                        selected={this.state.selectedDate} onChange={date => this.setState({selectedDate: date})}
                                    />
                                </div>
                                <div className={classes.StartTime}>
                                    <div className={classes.Title}>Select Start Time</div>
                                    {this.state.showTime && 
                                    <Timekeeper 
                                        time={this.state.startTime}
                                        onChange={(newTime) => this.setState({startTime: newTime.formatted12})}
                                        doneButton={(newTime) => (
                                            <div
                                                style={{ textAlign: 'center', padding: '10px 0', cursor: 'pointer' }}
                                                onClick={()=>this.setState({showTime: false})}
                                            >
                                                Close
                                            </div>
                                        )}
                                    />
                                    }
                                    <div className={classes.Time}>Interview Time {this.state.startTime}</div>
                                    {!this.state.showTime &&
                                        <button onClick={() => this.setState({showTime: true})}>Edit</button>
                                    }
                                </div>
                            </div>
                            <div className={classes.UploadAndDuration}>
                                <div className={classes.UploadBox}>
                                    <span>Upload Resume</span>
                                </div>
                            
                                <div className={classes.InterviewDuration}>
                                    <div className={classes.Title}>Select Interview Duration (In Minutes)</div>

                                    <Slider 
                                     min={0} defaultValue={((this.state.interviewDuration/15)-1)*10} marks={this.state.marks} step={null}
                                     onChange={(newDuration)=>{
                                        this.setState({interviewDuration: ((newDuration/10)+1)*15});
                                     }}
                                />
                                </div>
                            </div>
                            <div onClick={() => updateInfo()} className={classes.addBtn}>UPDATE INFO</div>
                        </div>
                    </div>
                    <div onClick={() => deleteBooking()} style={{backgroundColor: '#ff3b3b'}} className={classes.addBtn}>DELETE SCHEDULE</div>
                    <div className={classes.closeBtn}>
                        <FontAwesomeIcon onClick={(e) => this.props.closeFunction(e)} icon={faTimesCircle}/>
                    </div>
                </div>
            </div>
        );
    }
    

};

export default Model;