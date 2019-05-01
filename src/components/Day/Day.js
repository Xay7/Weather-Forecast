import React from 'react';
import './Day.css';
import image from '../../assets/images/sunny.png';

const Day = (props) => {
    return (
        <div className="Day">
            <h3>{props.day}</h3>
            <img src={image} alt="Current weather" />
            <h4 className="Temperature">20</h4>
        </div>
    )
}

export default Day;