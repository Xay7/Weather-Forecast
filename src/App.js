import React from 'react';
import './App.css';
import Weather from './containers/Weather/Weather';
import Logo from './assets/images/github-logo.png';
function App() {
  return (

    <div className="App">
      <Weather />
      <a href="https://github.com/Xay7/Weather-Forecast" target="_blank" rel="noopener noreferrer">
        <img src={Logo} alt="Github logo" className="Github" />
      </a>
    </div>

  );
}

export default App;
