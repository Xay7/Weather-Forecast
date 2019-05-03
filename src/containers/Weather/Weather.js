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
        firstDay: [],
        secondDay: [],
        thirdDay: [],
        fourthDay: [],
        fifthDay: [],
        tempMin: [],
        tempMax: [],
        selected: [true, false, false, false, false],
        temperatureClick: true,
        humidityClick: false,
        windClick: false,
    }

    // Weather data provided by APIXU
    fetchData = (city) => {
        fetch('https://api.apixu.com/v1/forecast.json?key=ca7637b4f307488b97a144627190105&q=' + city + '&days=7&units=metric')
            .then(res => {
                return res.json();
            })
            .then(data => {
                const weatherData = {
                    dates: [],
                    icon: []
                }

                data.forecast.forecastday.map(el => {
                    return weatherData.dates.push(el.date);
                });

                data.forecast.forecastday.map(el => {
                    return weatherData.icon.push(el.day.condition.icon);
                });
                this.setState({
                    dates: weatherData.dates,
                    icon: weatherData.icon,
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
                console.log(data);

                let tempMin = [99, 99, 99, 99, 99];

                let tempMax = [-99, -99, -99, -99, -99];

                data.list.map(el => {
                    return weatherData.weeklyTime.push({
                        time: (el.dt_txt.slice(11, 16)),
                        temperature: (Math.round(el.main.temp)),
                        temperatureString: (Math.round(el.main.temp)).toString() + '°',
                        humidity: el.main.humidity,
                        humidityString: el.main.humidity + '%',
                        wind: (el.wind.speed * 3.6).toFixed(1),
                        windString: (el.wind.speed * 3.6).toFixed(1).toString() + ' km/h',
                        tempMin: (Math.round(el.main.temp_min)),
                        tempMax: (Math.round(el.main.temp_max))
                    });
                })
                console.log(weatherData);

                // Get first 9 3-hours for first day
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


                // Remove remaining first day hours for remaining days
                for (let y = 0; y < 2; y++) {
                    if (weatherData.weeklyTime[y].time === "03:00" && weatherData.weeklyTime[y + 1].time === "06:00") {
                        break;
                    }
                    else {
                        y = 0;
                        weatherData.weeklyTime.shift();
                    }
                }

                // Handle other days hours

                let help = 0;


                for (let y = 0; y < 9; y++) {
                    weatherData.secondDay.push(weatherData.weeklyTime[0]);

                    if (weatherData.secondDay[y].tempMin < tempMin[1]) {
                        tempMin[1] = weatherData.secondDay[y].tempMin;
                    }
                    if (weatherData.secondDay[y].tempMax > tempMax[1]) {
                        tempMax[1] = weatherData.secondDay[y].tempMax;
                    }


                    if (weatherData.weeklyTime[0].time === "00:00" && help > 0) {
                        help = 0;
                        break;
                    }
                    help++;
                    weatherData.weeklyTime.shift();
                }

                for (let y = 0; y < 9; y++) {
                    weatherData.thirdDay.push(weatherData.weeklyTime[0]);

                    if (weatherData.thirdDay[y].tempMin < tempMin[2]) {
                        tempMin[2] = weatherData.thirdDay[y].tempMin;
                    }
                    if (weatherData.thirdDay[y].tempMax > tempMax[2]) {
                        tempMax[2] = weatherData.thirdDay[y].tempMax;
                    }

                    if (weatherData.weeklyTime[0].time === "00:00" && help > 0) {
                        help = 0;
                        break;
                    }
                    help++;
                    weatherData.weeklyTime.shift();
                }

                for (let y = 0; y < 9; y++) {
                    weatherData.fourthDay.push(weatherData.weeklyTime[0]);


                    if (weatherData.fourthDay[y].tempMin < tempMin[3]) {
                        tempMin[3] = weatherData.fourthDay[y].tempMin;
                    }
                    if (weatherData.fourthDay[y].tempMax > tempMax[3]) {
                        tempMax[3] = weatherData.fourthDay[y].tempMax;
                    }

                    if (weatherData.weeklyTime[0].time === "00:00" && help > 0) {
                        help = 0;
                        break;
                    }
                    help++;
                    weatherData.weeklyTime.shift();
                }

                for (let y = 0; y < 9; y++) {
                    weatherData.fifthDay.push(weatherData.weeklyTime[0]);

                    if (weatherData.fifthDay[y].tempMin < tempMin[4]) {
                        tempMin[4] = weatherData.fifthDay[y].tempMin;
                    }
                    if (weatherData.fifthDay[y].tempMax > tempMax[4]) {
                        tempMax[4] = weatherData.fifthDay[y].tempMax;
                    }

                    if (weatherData.weeklyTime[0].time === "00:00" && help > 0) {
                        help = 0;
                        break;
                    }
                    help++;
                    weatherData.weeklyTime.shift();
                }


                this.setState({
                    firstDay: weatherData.firstDay,
                    secondDay: weatherData.secondDay,
                    thirdDay: weatherData.thirdDay,
                    fourthDay: weatherData.fourthDay,
                    fifthDay: weatherData.fifthDay,
                    tempMin: tempMin,
                    tempMax: tempMax
                });
                console.log(this.state);
            })
            .catch(error => {
                console.log("Error has occured: ", error);
            })
    }

    // Show a data sample when page loads
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
        let arr = [...this.state.selected];

        arr.map((_el, index) => {
            if (index === 0) {
                return arr[index] = true;
            } else return arr[index] = false;
        })

        this.setState({ selected: arr })
    }
    onSecondDayClickHandler = () => {

        let arr = [...this.state.selected];

        arr.map((_el, index) => {
            if (index === 1) {
                return arr[index] = true;
            } else return arr[index] = false;
        })

        this.setState({ selected: arr })
    }

    onThirdDayClickHandler = () => {
        let arr = [...this.state.selected];

        arr.map((_el, index) => {
            if (index === 2) {
                return arr[index] = true;
            } else return arr[index] = false;
        })

        this.setState({ selected: arr })
    }

    onFourthDayClickHandler = () => {
        let arr = [...this.state.selected];

        arr.map((_el, index) => {
            if (index === 3) {
                return arr[index] = true;
            } else return arr[index] = false;
        })

        this.setState({ selected: arr })
    }

    onFifthDayClickHandler = () => {
        let arr = [...this.state.selected];

        arr.map((_el, index) => {
            if (index === 4) {
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

        if (this.state.selected[0]) {
            data = this.state.firstDay;
        }

        if (this.state.selected[1]) {
            data = this.state.secondDay;

        }

        if (this.state.selected[2]) {
            data = this.state.thirdDay;
        }
        if (this.state.selected[3]) {
            data = this.state.fourthDay;
        }

        if (this.state.selected[4]) {
            data = this.state.fifthDay;
        }

        // Charts by www.recharts.org
        let chart = null;

        if (this.state.temperatureClick) {
            chart = (
                <LineChart width={720} height={250} data={data} margin={{ top: 25, right: 50, left: 50, bottom: 5 }} >
                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" isAnimationActive={true} animationDuration={350} animationEasing="ease-in-out" dot={false}>
                        <LabelList dataKey="temperatureString" position="top" offset={15} />
                    </Line>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                </LineChart>
            )
        }

        if (this.state.windClick) {
            chart = (
                <LineChart width={720} height={250} data={data} margin={{ top: 25, right: 50, left: 50, bottom: 5 }} >
                    <Line type="monotone" dataKey="wind" stroke="#8884d8" isAnimationActive={true} animationDuration={350} animationEasing="ease-in-out" dot={false}>
                        <LabelList dataKey="windString" position="top" offset={20} />
                    </Line>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                </LineChart>
            )
        }

        if (this.state.humidityClick) {
            chart = (
                <AreaChart width={720} height={250} data={data} margin={{ top: 25, right: 50, left: 50, bottom: 5 }} >
                    <Area type="monotone" dataKey="humidity" isAnimationActive={true} animationDuration={350} animationEasing="ease-in-out" fillOpacity={0.2}>
                        <LabelList dataKey="humidityString" position="top" offset={15} />
                    </Area>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                </AreaChart>
            )
        }

        return (
            <Fragment>
                <h1 className="Title">5 day weather forecast</h1>
                <div >
                    <input
                        type="text"
                        defaultValue="Paris"
                        className={inputCSS}
                        onKeyPress={this.onKeyEventHandler}
                        onBlur={this.onBlurHandler} />
                </div>
                <div className="Container">
                    <div className="Weather">
                        <Day day={days[0]} temperatureMin={this.state.tempMin[0]} temperatureMax={this.state.tempMax[0]} icon={this.state.icon[0]} updated={this.state.updated} onclick={this.onFirstDayClickHandler} selected={this.state.selected[0]}></Day>
                        <Day day={days[1]} temperatureMin={this.state.tempMin[1]} temperatureMax={this.state.tempMax[1]} icon={this.state.icon[1]} updated={this.state.updated} onclick={this.onSecondDayClickHandler} selected={this.state.selected[1]}></Day>
                        <Day day={days[2]} temperatureMin={this.state.tempMin[2]} temperatureMax={this.state.tempMax[2]} icon={this.state.icon[2]} updated={this.state.updated} onclick={this.onThirdDayClickHandler} selected={this.state.selected[2]}></Day>
                        <Day day={days[3]} temperatureMin={this.state.tempMin[3]} temperatureMax={this.state.tempMax[3]} icon={this.state.icon[3]} updated={this.state.updated} onclick={this.onFourthDayClickHandler} selected={this.state.selected[3]}></Day>
                        <Day day={days[4]} temperatureMin={this.state.tempMin[4]} temperatureMax={this.state.tempMax[4]} icon={this.state.icon[4]} updated={this.state.updated} onclick={this.onFifthDayClickHandler} selected={this.state.selected[4]}></Day>

                    </div >
                    <div className="WeatherButtonContainer">
                        <WeatherButton onclick={() => this.setState({ humidityClick: false, temperatureClick: true, windClick: false })} test={this.state.temperatureClick}>Temperature</WeatherButton>
                        <WeatherButton onclick={() => this.setState({ humidityClick: false, temperatureClick: false, windClick: true })} test={this.state.windClick}>Wind</WeatherButton>
                        <WeatherButton onclick={() => this.setState({ humidityClick: true, temperatureClick: false, windClick: false })} test={this.state.humidityClick}>Humidity</WeatherButton>
                    </div>
                    <div>

                        {chart}
                    </div></div>


            </Fragment>
        );
    }
}

export default Weather;