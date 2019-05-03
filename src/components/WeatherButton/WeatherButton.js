import React from 'react';
import './WeatherButton.css';

const Button = (props) => {
    return (
        <button className="WeatherButton" onClick={props.onclick}>{props.children}</button>
    )
}

export default Button;