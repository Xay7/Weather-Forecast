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
        firstDay: [],
        secondDay: [],
        thirdDay: [],
        fourthDay: [],
        fifthDay: [],
        firstDayClick: true,
        secondDayClick: false,
        thirdDayClick: false,
        fourthDayClick: false,
        fifthDayClick: false
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
                    return weatherData.temperature.push(Math.round(el.day.avgtemp_c));
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
                    firstDay: [],
                    secondDay: [],
                    thirdDay: [],
                    fourthDay: [],
                    fifthDay: [],
                    weeklyTime: [],
                }

                data.list.map(el => {
                    return weatherData.weeklyTime.push({
                        time: (el.dt_txt.slice(11, 16)),
                        temperature: (Math.round(el.main.temp))
                    });
                })
                console.dir(data.list);
                // Handle first day
                for (let i = 0; i < 9; i++) {
                    weatherData.firstDay[i] = weatherData.weeklyTime[i];
                }

                // Remove remaining first day hours
                for (let y = 0; y < 2; y++) {
                    if (weatherData.weeklyTime[y].time === "03:00" && weatherData.weeklyTime[y + 1].time === "06:00") {
                        break;
                    }
                    else {
                        y = 0;
                        weatherData.weeklyTime.shift();
                    }
                }
                // Handle other days

                let help = 0;

                for (let y = 0; y < 9; y++) {
                    weatherData.secondDay.push(weatherData.weeklyTime[0]);
                    if (weatherData.weeklyTime[0].time === "00:00" && help > 0) {
                        help = 0;
                        break;
                    }
                    help++;
                    weatherData.weeklyTime.shift();
                }

                for (let y = 0; y < 9; y++) {
                    weatherData.thirdDay.push(weatherData.weeklyTime[0]);
                    if (weatherData.weeklyTime[0].time === "00:00" && help > 0) {
                        help = 0;
                        break;
                    }
                    help++;
                    weatherData.weeklyTime.shift();
                }

                for (let y = 0; y < 9; y++) {
                    weatherData.fourthDay.push(weatherData.weeklyTime[0]);
                    if (weatherData.weeklyTime[0].time === "00:00" && help > 0) {
                        help = 0;
                        break;
                    }
                    help++;
                    weatherData.weeklyTime.shift();
                }

                for (let y = 0; y < 9; y++) {
                    weatherData.fifthDay.push(weatherData.weeklyTime[0]);
                    if (weatherData.weeklyTime[0].time === "00:00" && help > 0) {
                        help = 0;
                        break;
                    }
                    help++;
                    weatherData.weeklyTime.shift();
                }




                console.log(weatherData);


                this.setState({
                    firstDay: weatherData.firstDay,
                    secondDay: weatherData.secondDay,
                    thirdDay: weatherData.thirdDay,
                    fourthDay: weatherData.fourthDay,
                    fifthDay: weatherData.fifthDay,
                });
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

    onFirstDayClickHandler = () => {
        this.setState({
            firstDayClick: true,
            secondDayClick: false,
            thirdDayClick: false,
            fourthDayClick: false,
            fifthDayClick: false
        })
    }
    onSecondDayClickHandler = () => {
        this.setState({
            firstDayClick: false,
            secondDayClick: true,
            thirdDayClick: false,
            fourthDayClick: false,
            fifthDayClick: false
        })
    }

    onThirdDayClickHandler = () => {
        this.setState({
            firstDayClick: false,
            secondDayClick: false,
            thirdDayClick: true,
            fourthDayClick: false,
            fifthDayClick: false
        })
    }

    onFourthDayClickHandler = () => {
        this.setState({
            firstDayClick: false,
            secondDayClick: false,
            thirdDayClick: false,
            fourthDayClick: true,
            fifthDayClick: false
        })
    }

    onFifthDayClickHandler = () => {
        this.setState({
            firstDayClick: false,
            secondDayClick: false,
            thirdDayClick: false,
            fourthDayClick: false,
            fifthDayClick: true
        })
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

        if (this.state.firstDayClick) {
            data = this.state.firstDay;
        }

        if (this.state.secondDayClick) {
            data = this.state.secondDay;
        }

        if (this.state.thirdDayClick) {
            data = this.state.thirdDay;
        }
        if (this.state.fourthDayClick) {
            data = this.state.fourthDay;
        }

        if (this.state.fifthDayClick) {
            data = this.state.fifthDay;
        }

        const renderLineChart = (
            <LineChart width={720} height={150} data={data} margin={{ top: 25, right: 50, left: 50, bottom: 5 }} >
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" isAnimationActive={true} animationDuration={350} animationEasing="ease-in-out">
                    <LabelList dataKey="temperature" position="top" offset={15} />
                </Line>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ strokeWidth: 5 }} />
            </LineChart>)



        return (
            <Fragment>

                <div>
                    <input
                        type="text"
                        defaultValue="Paris"
                        className={inputCSS}
                        onKeyPress={this.onKeyEventHandler}
                        onBlur={this.onBlurHandler} />
                </div>
                <div className="Container">
                    <div className="Weather">
                        <Day day={days[0]} temperature={this.state.temperature[0]} icon={this.state.icon[0]} updated={this.state.updated} onclick={this.onFirstDayClickHandler}></Day>
                        <Day day={days[1]} temperature={this.state.temperature[1]} icon={this.state.icon[1]} updated={this.state.updated} onclick={this.onSecondDayClickHandler}></Day>
                        <Day day={days[2]} temperature={this.state.temperature[2]} icon={this.state.icon[2]} updated={this.state.updated} onclick={this.onThirdDayClickHandler}></Day>
                        <Day day={days[3]} temperature={this.state.temperature[3]} icon={this.state.icon[3]} updated={this.state.updated} onclick={this.onFourthDayClickHandler}></Day>
                        <Day day={days[4]} temperature={this.state.temperature[4]} icon={this.state.icon[4]} updated={this.state.updated} onclick={this.onFifthDayClickHandler}></Day>

                    </div >
                    <div>
                        {renderLineChart}
                    </div></div>


            </Fragment>
        );
    }
}

export default Weather;