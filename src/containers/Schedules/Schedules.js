import React, { Component } from 'react';
import classes from './Schedules.module.css';
import MaterialTable from 'material-table'
import Candidate from '../../components/Candidate/Candidate';
import axios from '../../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

const editFunction = (e) => {
    let bookingEle = e.target.nextSibling;

    if(e.target.nextSibling == null)
        bookingEle = e.target.parentElement.nextSibling;
    console.log(bookingEle.value);
}

class Schedule extends Component {
    
    state={
        details: []
    };

    componentDidMount() {
        axios.get('/showAllBookings')
        .then(response => {
            const data = response.data.data;
            let details = [];
            let users = [];
            let temp = {};
            let prev = -1;
            data.forEach(row => {
                if(prev !== row.booking_id){
                    if(users.length > 0 && temp !== {}){
                        temp['edit'] = <div className={classes.editBtn} onClick={(e)=>editFunction(e)}>
                            <FontAwesomeIcon icon={faEdit}/>
                            <input name="booking_id" className="booking_id" value={temp['booking_id']} type="hidden"/>
                        </div>
                        temp['participantsList'] = users;
                        details.push(temp);
                    }
                    temp = {};
                    users = [];
                    prev = row.booking_id;
                }
                temp['time'] = row.time;
                temp['date'] = row.date;
                temp['duration'] = row.duration;
                temp['booking_id'] = row.booking_id;
                users.push({
                    'username': row.username,
                    'email': row.email
                });
            });
            if(users.length > 0 && temp !== {}){
                temp['edit'] = <div className={classes.editBtn} onClick={(e)=>editFunction(e)} >
                    <FontAwesomeIcon icon={faEdit}/>
                    <input name="booking_id" className="booking_id" value={temp['booking_id']} type="hidden"/>
                </div>
                temp['participantsList'] = users;
                details.push(temp);
            }
            console.log(details);
            this.setState({details: details});
        });
    }

    render(){

        let options = [];
        let disp = [];
        this.state.details.forEach(data => {
            let row = {};
            row['time'] = data.time;
            row['duration'] = data.duration;
            row['date'] = data.date;
            row['edit'] = data.edit;
            row['participants'] = [];
            data.participantsList.forEach(userData => {
                row['participants'].push(
                    <Candidate key={userData.email} {...userData}/>
                );
                disp.push(
                    <Candidate key={userData.email} {...userData}/>
                );
            });
            row['participants'] = <div className={classes.candidateGroup}>{row['participants']}</div>
            options.push(row);
        });
        return (
            <div className={classes.ScheduleBox}>
                <MaterialTable
                    columns={[
                        { title: 'Participants', field: 'participants' },
                        { title: 'Date', field: 'date' },
                        { title: 'Time', field: 'time' },
                        { title: 'Duration', field: 'duration'},
                        { title: 'Edit', field: 'edit'}
                    ]}
                    data={options}
                    title="Interviews Schedule"
                />
            </div>
        );
    }
}

export default Schedule;