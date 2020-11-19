import React from'react';
import classes from './NavigationItems.module.css';

const NavigationItems = (props) => {
    
    return (
        <div className={classes.NavigationItem}>
            <div className={classes.icon}>{props.icon}</div>
            <span>{props.title}</span>
        </div>
    );
};

export default NavigationItems;