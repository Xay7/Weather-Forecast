import React, { Component } from 'react';
import Day from '../../components/Day/Day';
import './Weather.css';

class Weather extends Component {
    render() {
        return (
            <div className="Weather">
                <Day day="Monday"></Day>
                <Day day="Tuesday"></Day>
                <Day day="Wednesday"></Day>
                <Day day="Thursday"></Day>
                <Day day="Friday"></Day>
                <Day day="Saturday"></Day>
                <Day day="Sunday"></Day>
            </div >
        );
    }
}

export default Weather;