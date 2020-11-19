import React from 'react';
import classes from './Candidate.module.css';

const Candidate = (props) => {
    return (
        <div className={classes.candidate}>
            <span>{props.username}</span>
            <input className="email" name="email" value={props.email} type="hidden" />
        </div>
    );
};

export default Candidate;