import React from 'react';
import classes from './Layout.module.css';
import NavBar from '../Navigations/SideBar/SideBar';
import InterviewScheduler from '../../containers/InterviewScheduler/InterviewScheduler';

const Layout = (props) => {
    return (
        <div className={classes.Layout}>
            <div className={classes.NavBar}>
                <NavBar />
            </div>
            <div className={classes.Dashboard}>
                <InterviewScheduler />
            </div>
        </div>
    );
};

export default Layout;