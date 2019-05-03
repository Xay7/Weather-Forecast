import React from 'react';
import './Day.css';

const Day = (props) => {

    let tempClass = 'Temperature';

    if (props.updated) {
        tempClass = 'Temperature TemperatureUpdated';
    }

    let imgClass = 'WeatherImage';

    if (props.updated) {
        imgClass = 'WeatherImage WeatherImageUpdated';
    }

    let daysCSS = 'Days'


    if (props.selected) {
        daysCSS = 'Days DaysSelected';
    }


    return (
        <div className={daysCSS} onClick={props.onclick} >
            <h3 className="Day">{props.day}</h3>
            <img src={props.icon} alt="Current weather" className={imgClass} />
            <p className={tempClass}>{props.temperature}°</p>
        </div>
    )
}

export default Day;