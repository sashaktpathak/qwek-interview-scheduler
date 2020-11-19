import React from 'react';
import classes from './Candidate.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const clickFunction = (e, props) => {
    let emailEle = e.target.previousSibling;
    console.log(e.target);
    if(e.target.previousSibling == null)
        emailEle = e.target.parentElement.previousSibling;
    props.delete(emailEle.value);
}

const Candidate = (props) => {
    let closeBtn = null;
    if(props.closeBtn)
        closeBtn = <FontAwesomeIcon style={{cursor: 'pointer'}} onClick={e => clickFunction(e, props)} icon={faTimes}/>
    return (
        <div  className={classes.candidate}>
            <span className={classes.username}>{props.username}</span>
            <input className="email" name="email" value={props.email} type="hidden" />
            {closeBtn}
        </div>
    );
};

export default Candidate;