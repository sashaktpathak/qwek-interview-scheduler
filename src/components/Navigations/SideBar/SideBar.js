import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons';
import classes from './SideBar.module.css';

const SideBar = (props) => {
    const clockIcon = <FontAwesomeIcon icon={faClock} />;
    const listIcon = <FontAwesomeIcon icon={faList} />;
    return (
        <div className={classes.SideBar}>
            <div className={classes.heading}>
                <h3>Dashboard</h3>
                <div className="metaText">Interviews</div>
            </div>
            <div className={classes.lineDivider}></div>
            <NavigationItems 
            title="Interview Scheduler"
            link="/"
            icon={clockIcon}
            />
            <NavigationItems 
            title="Upcoming Interviews"
            link="/records"
            icon={listIcon}
            />
        </div>
    );
};

export default SideBar;
