import React from 'react';
import classes from './Layout.module.css';
import NavBar from '../Navigations/SideBar/SideBar';
import { Switch, Route } from 'react-router-dom';
import InterviewScheduler from '../../containers/InterviewScheduler/InterviewScheduler';
import Schedule from '../../containers/Schedules/Schedules';

const Layout = (props) => {
    return (
        <div className={classes.Layout}>
            <div className={classes.NavBar}>
                <NavBar />
            </div>
            <div className={classes.Dashboard}>
                <Switch>
                    <Route path="/records">
                        <Schedule />
                    </Route>
                    <Route path="/">
                        <InterviewScheduler />
                    </Route>
                </Switch>
            </div>
        </div>
    );
};

export default Layout;