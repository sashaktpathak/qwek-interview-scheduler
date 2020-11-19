import React from'react';
import { Link } from 'react-router-dom';
import classes from './NavigationItems.module.css';

const NavigationItems = (props) => {
    
    return (
        <Link to={props.link}>
            <div className={classes.NavigationItem}>
                <div className={classes.icon}>{props.icon}</div>
                <span>{props.title}</span>
            </div>
        </Link>
    );
};

export default NavigationItems;