import { useEffect, useState } from 'react'
import './App.css'
import { baseURL } from './environment/environment'

interface WeatherData {
  date: string
  summary : string
  temperatureC : number
  temperatureF : number
}

function App() {

  const [weatherData, setWeatherData] = useState<WeatherData[] | undefined>();
  const [clicks, setClicks] = useState<number>(0)

  useEffect(() => {
    getWeatherData();
  }, []);

  function getWeatherData() {
    fetch(baseURL + "WeatherForecast")
      .then(response => response.json())
      .then(data => {
        setWeatherData(data);
      })
      .catch(error => 
        {console.log(error.message)});
  }

  function handleClick() {
    setClicks(clicks + 1);
    alert(`number of clicks: ${clicks}`);
  }

  return (
    <>
      <h1>Test App</h1>
      <button onClick={handleClick} >click me</button>
      {weatherData && weatherData.length > 0 ? (
        weatherData.map((wd, index) => (
          <div key={index}>
            <p><b>Date: {wd.date}</b></p>
            <p>Summary: {wd.summary}</p>
            <p>Temperature (C): {wd.temperatureC}</p>
            <p>Temperature (F): {wd.temperatureF}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>No weather data available</p>
      )}
    </>
  )
}



export default App
