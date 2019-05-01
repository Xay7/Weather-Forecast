import React from 'react';
import './Day.css';


const Day = (props) => {
    return (
        <div className="Day">
            <h3>{props.day}</h3>
        </div>
    )
}

export default Day;