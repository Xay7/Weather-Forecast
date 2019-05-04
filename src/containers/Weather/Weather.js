import React, { Component, Fragment } from 'react';
import Day from '../../components/Day/Day';
import './Weather.css';
import { LineChart, Line, XAxis, LabelList, AreaChart, Area } from 'recharts';
import WeatherButton from '../../components/WeatherButton/WeatherButton';

class Weather extends Component {

    state = {
        dates: [],
        icon: [],
        error: false,
        updated: false,
        days: {
            first: [],
            second: [],
            third: [],
            fourth: [],
            fifth: [],
        },
        tempMin: [],
        tempMax: [],
        selected: [true, false, false, false, false],
        temperatureClick: true,
        humidityClick: false,
        windClick: false,
    }

    // 5 day 3 hour forecast provided by www.openweathermap.org
    fetchWeatherData = (city) => {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&appid=0044f0866f4b9b2160761fd5ce752fed')
            .then(res => {
                return res.json()
            })
            .then(data => {
                const weatherData = {
                    firstDay: [],
                    weeklyTime: [],
                    days: {
                        second: [],
                        third: [],
                        fourth: [],
                        fifth: []
                    }
                }

                let tempMin = [99, 99, 99, 99, 99];

                let tempMax = [-99, -99, -99, -99, -99];

                data.list.map(el => {
                    return weatherData.weeklyTime.push({
                        time: (el.dt_txt.slice(11, 16)),
                        temperature: (Math.round(el.main.temp)),
                        temperatureString: (Math.round(el.main.temp)).toString() + '°',
                        humidity: el.main.humidity,
                        humidityString: el.main.humidity + '%',
                        wind: el.wind.speed * 3.6,
                        windString: (Math.round(el.wind.speed * 3.6)).toString() + ' km/h',
                        tempMin: (Math.round(el.main.temp_min)),
                        tempMax: (Math.round(el.main.temp_max)),
                        dates: (el.dt_txt.slice(0, 10)),
                        icon: 'http://openweathermap.org/img/w/' + el.weather[0].icon + '.png'
                    });
                })

                // Handle first day data and format object for other days
                for (let i = 0; i < 9; i++) {
                    weatherData.firstDay[i] = weatherData.weeklyTime[i];

                    // Get minimum temperature and maximum temperature
                    if (weatherData.firstDay[i].tempMin < tempMin[0]) {
                        tempMin[0] = weatherData.firstDay[i].tempMin;
                    }
                    if (weatherData.firstDay[i].tempMax > tempMax[0]) {
                        tempMax[0] = weatherData.firstDay[i].tempMax;
                    }
                }

                for (let y = 0; y < 2; y++) {
                    if (weatherData.weeklyTime[y].time === "03:00" && weatherData.weeklyTime[y + 1].time === "06:00") {
                        break;
                    }
                    else {
                        y = 0;
                        weatherData.weeklyTime.shift();
                    }
                }

                // Handle other day data
                let noonDetector = 0;
                let objectKeySize = 1;

                for (var key in weatherData.days) {
                    for (let y = 0; y < 9; y++) {

                        weatherData.days[key].push(weatherData.weeklyTime[0]);

                        if (weatherData.days[key][y].tempMin < tempMin[objectKeySize]) {
                            tempMin[objectKeySize] = weatherData.days[key][y].tempMin;
                        }
                        if (weatherData.days[key][y].tempMax > tempMax[objectKeySize]) {
                            tempMax[objectKeySize] = weatherData.days[key][y].tempMax;
                        }


                        if (weatherData.weeklyTime[0].time === "00:00" && noonDetector > 0) {
                            noonDetector = 0;
                            break;
                        }
                        noonDetector++;
                        weatherData.weeklyTime.shift();
                    }
                    objectKeySize++;
                }

                let dates = [
                    weatherData.firstDay[0].dates,
                    weatherData.days.second[0].dates,
                    weatherData.days.third[0].dates,
                    weatherData.days.fourth[0].dates,
                    weatherData.days.fifth[0].dates,
                ];

                let icons = [
                    weatherData.firstDay[0].icon,
                    weatherData.days.second[4].icon,
                    weatherData.days.third[4].icon,
                    weatherData.days.fourth[4].icon,
                    weatherData.days.fifth[4].icon,
                ];
                this.setState({
                    days: {
                        first: weatherData.firstDay,
                        second: weatherData.days.second,
                        third: weatherData.days.third,
                        fourth: weatherData.days.fourth,
                        fifth: weatherData.days.fifth,
                    },
                    tempMin: tempMin,
                    tempMax: tempMax,
                    error: false,
                    dates: dates,
                    updated: true,
                    icon: icons
                });
            })
            .catch(error => {
                this.setState({ error: true });
                console.log("Error has occured: ", error);
            })
    }

    // Show a data sample when page loads
    componentDidMount() {
        this.fetchWeatherData('Paris');
    }

    // Event handlers
    onKeyEventHandler = (event) => {

        if (event.charCode === 13) {
            this.fetchWeatherData(event.target.value);
            this.setState({ updated: false });
            document.activeElement.blur();
        }
    }

    onClickHandler = (event) => {
        event.target.select();
    }

    onBlurHandler = () => {

        this.setState({ error: false });
    }

    onDayClickHandler = (dayNumber) => {
        let arr = [...this.state.selected];

        arr.map((_el, index) => {
            if (index === dayNumber) {
                return arr[index] = true;
            } else return arr[index] = false;
        })

        this.setState({ selected: arr })
    }

    render() {

        // Convert numeric dates into string dates for user friendly interface
        function getDayName(dateStr, locale) {
            var date = new Date(dateStr);
            return date.toLocaleDateString(locale, { weekday: 'long' });
        }

        let days = [];

        // Shorten strings to 3 chars + dot 
        this.state.dates.map(el => {
            return days.push(getDayName(el, "en-US").slice(0, 3) + '.');
        });

        // Change input CSS based on error 
        let inputCSS = 'City CityFocus';

        if (this.state.error) {
            inputCSS = 'City CityError';
        }


        // Dynamic data display on graph based on a selected day
        let data = null;

        // Change data based on element clicked 
        this.state.selected.map((el, i) => {
            if (el) {
                return data = Object.values(this.state.days)[i];
            } else return false;
        })
        // Charts by www.recharts.org
        let chart = null;

        if (this.state.temperatureClick) {
            chart = (
                <LineChart width={720} height={300} data={data} margin={{ top: 25, right: 50, left: 50, bottom: 5 }} >
                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" isAnimationActive={true} animationDuration={350} animationEasing="ease-in-out" dot={false}>
                        <LabelList dataKey="temperatureString" position="top" offset={15} />
                    </Line>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                </LineChart>
            )
        }

        if (this.state.windClick) {
            chart = (
                <LineChart width={720} height={300} data={data} margin={{ top: 25, right: 50, left: 50, bottom: 5 }} >
                    <Line type="monotone" dataKey="wind" stroke="#8884d8" isAnimationActive={true} animationDuration={350} animationEasing="ease-in-out" dot={false}>
                        <LabelList dataKey="windString" position="top" offset={15} />
                    </Line>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                </LineChart>
            )
        }

        if (this.state.humidityClick) {
            chart = (
                <AreaChart width={720} height={300} data={data} margin={{ top: 25, right: 50, left: 50, bottom: 5 }} >
                    <Area type="monotone" dataKey="humidity" isAnimationActive={true} animationDuration={350} animationEasing="ease-in-out" fillOpacity={0.2}>
                        <LabelList dataKey="humidityString" position="top" offset={15} />
                    </Area>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                </AreaChart>
            )
        }


        // Render number of days based on number of dates in state
        let numberOfDays = this.state.dates.map((_el, i) => (
            <Day
                key={this.state.dates[i]}
                day={days[i]}
                temperatureMin={this.state.tempMin[i]}
                temperatureMax={this.state.tempMax[i]}
                icon={this.state.icon[i]}
                updated={this.state.updated}
                onclick={() => this.onDayClickHandler(i)}
                selected={this.state.selected[i]}>
            </Day>
        ))


        return (
            <Fragment>
                <h1 className="Title">5 day weather forecast</h1>
                <div >
                    <input
                        type="text"
                        defaultValue="Paris"
                        className={inputCSS}
                        onKeyPress={this.onKeyEventHandler}
                        onBlur={this.onBlurHandler}
                        onClick={this.onClickHandler} />
                </div>
                <div className="Container">
                    <div className="Weather">
                        {numberOfDays}
                    </div >
                    <div className="WeatherButtonContainer">
                        <WeatherButton onclick={() => this.setState({ humidityClick: false, temperatureClick: true, windClick: false })} buttonClicked={this.state.temperatureClick}>Temperature</WeatherButton>
                        <WeatherButton onclick={() => this.setState({ humidityClick: false, temperatureClick: false, windClick: true })} buttonClicked={this.state.windClick}>Wind</WeatherButton>
                        <WeatherButton onclick={() => this.setState({ humidityClick: true, temperatureClick: false, windClick: false })} buttonClicked={this.state.humidityClick}>Humidity</WeatherButton>
                    </div>
                    <div>
                        {chart}
                    </div>
                </div>


            </Fragment >
        );
    }
}

export default Weather;