import React, { Component, Fragment } from 'react';
import Day from '../../components/Day/Day';
import './Weather.css';
import { LineChart, Line, XAxis, LabelList } from 'recharts';

class Weather extends Component {

    state = {
        dates: [],
        temperature: [],
        icon: [],
        loading: true,
        error: false,
        updated: false,
        weatherData: [],
        secondDay: [],
        thirdDay: [],
        fourthDay: [],
        fifthDay: [],
        clickedOnToday: true
    }

    // Weather data provided by APIXU
    fetchData = (city) => {
        fetch('https://api.apixu.com/v1/forecast.json?key=ca7637b4f307488b97a144627190105&q=' + city + '&days=7')
            .then(res => {
                return res.json();
            })
            .then(data => {

                const weatherData = {
                    dates: [],
                    temperature: [],
                    icon: []
                }

                data.forecast.forecastday.map(el => {
                    return weatherData.dates.push(el.date);
                });

                data.forecast.forecastday.map(el => {
                    return weatherData.temperature.push(el.day.avgtemp_c);
                });

                data.forecast.forecastday.map(el => {
                    return weatherData.icon.push(el.day.condition.icon);
                });


                this.setState({
                    dates: weatherData.dates,
                    temperature: weatherData.temperature,
                    icon: weatherData.icon,
                    loading: false,
                    error: false,
                    updated: true
                });
            })
            .catch(error => {
                this.setState({ error: true });
                console.log("Error has occured: ", error)
            });
    }


    // 3 hour daily forecast provided by www.openweathermap.org
    fetchGraphData = (city) => {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&appid=0044f0866f4b9b2160761fd5ce752fed')
            .then(res => {
                return res.json()
            })
            .then(data => {

                const weatherData = {
                    weatherData: [],
                    weeklyTime: []
                }

                data.list.map(el => {
                    return weatherData.weeklyTime.push(el.dt_txt.slice(11, 16));
                })

                for (let i = 0; i < 9; i++) {
                    weatherData.weatherData[i] = { time: weatherData.weeklyTime[i], temperature: Math.round(data.list[i].main.temp) };
                }
                this.setState({ weatherData: weatherData.weatherData });
            })
            .catch(error => {
                console.log("Error has occured: ", error);
            })
    }

    componentDidMount() {
        this.fetchData('Paris');
        this.fetchGraphData('Paris');
    }

    // Event handlers

    onKeyEventHandler = (event) => {

        if (event.charCode === 13) {
            this.fetchData(event.target.value);
            this.fetchGraphData(event.target.value);
            this.setState({ updated: false });
        }
    }

    onBlurHandler = () => {
        this.setState({ error: false });
    }

    onDayClickHandler = () => {
        this.setState({ clickedOnToday: false })
    }

    onTodayClickHandler = () => {
        this.setState({ clickedOnToday: true })
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

        // Dynamic input CSS based on error state
        let inputCSS = 'City CityFocus';

        if (this.state.error) {
            inputCSS = 'City CityError';
        }


        // Dynamic data display on graph based on a selected day
        let data = null;

        if (this.state.clickedOnToday) {
            data = this.state.weatherData;
        } else data = [{ time: "00:00" }, { time: "03:00" }, { time: "06:00" }, { time: "09:00" }, { time: "12:00" }, { time: "15:00" }, { time: "18:00" }, { time: "21:00" }, { time: "00:00" },]



        const renderLineChart = (
            <LineChart width={720} height={200} data={data} margin={{ top: 25, right: 50, left: 50, bottom: 5 }} >
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" isAnimationActive={false}>
                    <LabelList dataKey="temperature" position="top" offset="15" />
                </Line>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ strokeWidth: 5 }} />
            </LineChart>)

        return (
            <Fragment>
                <div className="Container">
                    <div>
                        <input
                            type="text"
                            defaultValue="Paris"
                            className={inputCSS}
                            onKeyPress={this.onKeyEventHandler}
                            onBlur={this.onBlurHandler} />
                    </div>
                    <div className="Weather">
                        <Day day={days[0]} temperature={this.state.temperature[0]} icon={this.state.icon[0]} updated={this.state.updated} onclick={this.onTodayClickHandler}></Day>
                        <Day day={days[1]} temperature={this.state.temperature[1]} icon={this.state.icon[1]} updated={this.state.updated} onclick={this.onDayClickHandler}></Day>
                        <Day day={days[2]} temperature={this.state.temperature[2]} icon={this.state.icon[2]} updated={this.state.updated} onclick={this.onDayClickHandler}></Day>
                        <Day day={days[3]} temperature={this.state.temperature[3]} icon={this.state.icon[3]} updated={this.state.updated} onclick={this.onDayClickHandler}></Day>
                        <Day day={days[4]} temperature={this.state.temperature[4]} icon={this.state.icon[4]} updated={this.state.updated} onclick={this.onDayClickHandler}></Day>

                    </div >
                    <div>
                        {renderLineChart}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Weather;