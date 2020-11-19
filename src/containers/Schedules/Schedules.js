import React, { Component } from 'react';
import classes from './Schedules.module.css';
import MaterialTable from 'material-table'
import Candidate from '../../components/Candidate/Candidate';
import axios from '../../axios';
import Model from '../../components/Model/Model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { sqlToDate } from '../../helper/utils';

class Schedule extends Component {
    
    state={
        details: [],
        editing: false,
        editingBookingId: null,
        editFunction: (e) => {
            let bookingEle = e.target.nextSibling;
            if(e.target.nextSibling == null)
                bookingEle = e.target.parentElement.nextSibling;
            if(bookingEle == null && e.target.nodeName ==="DIV")
                bookingEle = e.target.lastChild;
            this.setState({editing: true, editingBookingId: bookingEle.value});
        },
        closeFunction: (e) => {
            this.setState({editing: false});
            this.state.update();
        },
        update: () => {
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
                                temp['edit'] = <div className={classes.editBtn} onClick={(e)=>this.state.editFunction(e)}>
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
                        temp['date'] = sqlToDate(row.date);
                        temp['duration'] = row.duration;
                        temp['booking_id'] = row.booking_id;
                        users.push({
                            'username': row.username,
                            'email': row.email
                        });
                    });
                    if(users.length > 0 && temp !== {}){
                        temp['edit'] = <div className={classes.editBtn} onClick={(e)=>this.state.editFunction(e)} >
                            <FontAwesomeIcon icon={faEdit}/>
                            <input name="booking_id" className="booking_id" value={temp['booking_id']} type="hidden"/>
                        </div>
                        temp['participantsList'] = users;
                        details.push(temp);
                    }
                    this.setState({details: details});
                });
            }
    };

 

    componentDidMount() {
        this.state.update();
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
        let model = null;
        if(this.state.editing)
            model = <Model closeFunction={this.state.closeFunction} bookingId={this.state.editingBookingId} />;
        return (
            <div className={classes.ScheduleBox}>
                {model}
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