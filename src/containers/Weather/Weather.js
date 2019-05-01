import React, { Component } from 'react';
import Day from '../../components/Day/Day';
import './Weather.css';

class Weather extends Component {

    state = {
        dates: [],
        temperature: []
    }

    // Weather data provided by APIXU
    componentDidMount() {
        fetch('https://api.apixu.com/v1/forecast.json?key=ca7637b4f307488b97a144627190105&q=Bydgoszcz&days=7')
            .then(res => {
                return res.json();
            })
            .then(data => {

                let dates = [];

                data.forecast.forecastday.map(el => {
                    return dates.push(el.date);
                });

                this.setState({
                    dates: dates
                });
            })
            .catch(error => console.log("Error has occured: ", error));
    }

    render() {

        // Convert numeric dates into string dates for dynamic day display
        function getDayName(dateStr, locale) {
            var date = new Date(dateStr);
            return date.toLocaleDateString(locale, { weekday: 'long' });
        }

        let days = [];

        this.state.dates.map(el => {
            return days.push(getDayName(el, "en-US").slice(0, 3) + '.');
        });

        return (
            <div className="Weather">
                <Day day={days[0]}></Day>
                <Day day={days[1]}></Day>
                <Day day={days[2]}></Day>
                <Day day={days[3]}></Day>
                <Day day={days[4]}></Day>
                <Day day={days[5]}></Day>
                <Day day={days[6]}></Day>
            </div >
        );
    }
}

export default Weather;