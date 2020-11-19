import React, { Component } from 'react';
import Select from "react-dropdown-select";
import classes from './InterviewScheduler.module.css';
import DatePicker from "react-datepicker";
import Timekeeper from 'react-timekeeper';
import Slider from 'rc-slider';
import axios from '../../axios';
import { formatDate } from '../../helper/utils';
import qs from 'qs';
import 'rc-slider/assets/index.css';
import "react-datepicker/dist/react-datepicker.css";

const config = {

    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
}

const defaultState = {
    selectedDate: new Date(),
    startTime: "12:00PM",
    showTime: false,
    interviewDuration: 60,
    optionRenderer: true,
    names: [],
    selectedNames: [],
    marks: {0: 15, 10: 30, 20: 45, 30: 60, 40: 75, 50: 90, 60: 105, 70: 120, 80: 135, 90: 150, 100: 165}
};
class InterviewScheduler extends Component {
    state = {
        ...defaultState
    }
    
    componentDidMount(){
        axios.get('/getCandidates')
        .then((data) => {
            this.setState({names: data.data});
        });
       
    }

    render(){

        const sendMail = (payload) => {
            axios.post('/mailing/sendMails', payload, config)
            .then(response => {
                if(response.data.status === 0)
                    alert("Oops, some error occured");
                else{
                    alert(response.data.msg);
                }
            })
        };

        //Execute booking interview process
        const ScheduleInterview = () => {
            const selectedEmails = [];
            this.state.selectedNames.forEach(value=>{
                if(value)
                selectedEmails.push(value.email);     
            })
            
            let payload = {
                time: this.state.startTime,
                date: formatDate(this.state.selectedDate),
                duration: this.state.interviewDuration,
                participantsList: selectedEmails
            };
            if(payload.participantsList.length >=2 ){
                payload = qs.stringify(payload);
                axios.post('/bookCandidates', payload, config)
                .then(data => {
                    alert(data.data.msg);
                    if(window.confirm('Send E-Mail to participants?'))
                        sendMail(payload);
                    this.setState((prevState) => ({...defaultState, names: prevState.names}));
                });
            }
            else    
                alert('Select more than 2 participants to schedule Interview');
        };

        return (
            <div className={classes.InterviewScheduler}>
                
                <div>
                    
                    {/* UserName selector */}
                    <Select 
                        values={this.state.selectedNames}
                        options={this.state.names}
                        multi={true}
                        labelField="username"
                        valueField="email"
                        placeholder="Select participants.."
                        onChange={(values) => this.setState((prevState)=>({selectedNames: values}))}
                    />

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
                                    <div className={classes.scheduleBtn} onClick={() => this.setState({showTime: true})}>Edit</div>
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
                    </div>

                </div>
                <div>
                    <div onClick={()=>ScheduleInterview()} className={classes.scheduleBtn}>Schedule!</div>
                </div>
            </div>
        );
    }
}

export default InterviewScheduler;