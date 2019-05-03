import React from 'react';
import './WeatherButton.css';

const Button = (props) => {

    let btnCSS = 'WeatherButton';

    if (props.test) {
        btnCSS = 'WeatherButton WeatherButtonClicked'
    }
    return (
        <button className={btnCSS} onClick={props.onclick}>{props.children}</button>
    )
}

export default Button;