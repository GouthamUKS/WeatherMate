import React, { useState, useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { HourlyForecast } from "./HourlyForecast";
import { AirQuality } from "./AirQuality";

// Define the CurrentWeather component in this file
interface CurrentWeatherProps {
  weather: {
    temperature: number;
    weatherCode: number;
    isDay: boolean;
    apparentTemperature: number;
    humidity: number;
    windSpeed: number;
  };
  location: {
    name: string;
    admin1?: string;
    country: string;
  };
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, location }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-2">
        {location.name}, {location.country}
      </h2>
      <div className="text-6xl font-bold">{weather.temperature}°C</div>
      <p className="text-gray-400">Feels like {weather.apparentTemperature}°C</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400">Humidity</p>
          <p className="text-xl">{weather.humidity}%</p>
        </div>
        <div>
          <p className="text-gray-400">Wind Speed</p>
          <p className="text-xl">{weather.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
};

export { CurrentWeather }; // Add this export

export const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [airQualityData, setAirQualityData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = async (location: any) => {
    setLoading(true);
    const apiKey = "c994b521f4da9da1276c3940c4a3cf5d";

    try {
      // 1. Fetch Current Weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${apiKey}`
      );
      const wData = await weatherRes.json();

      // 2. Map the data to match your CurrentWeatherProps interface
      const weatherInfo = {
        temperature: Math.round(wData.main.temp),
        weatherCode: wData.weather[0].id,
        isDay: wData.dt > wData.sys.sunrise && wData.dt < wData.sys.sunset,
        apparentTemperature: Math.round(wData.main.feels_like),
        humidity: wData.main.humidity,
        windSpeed: Math.round(wData.wind.speed * 3.6), // Convert m/s to km/h
      };

      setWeatherData({
        current: weatherInfo,
        location: {
          name: location.name,
          admin1: location.admin1,
          country: location.country,
        },
        hourly: [], // If you have an hourly API, fetch and set it here
      });

      // 3. Fetch Air Quality
      const aqResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}`
      );
      const aqJson = await aqResponse.json();
      setAirQualityData(aqJson.list[0]);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <SearchBar onLocationSelect={handleLocationSelect} />
        
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {weatherData && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <CurrentWeather 
              weather={weatherData.current} 
              location={weatherData.location} 
            />
            
            {airQualityData && <AirQuality data={airQualityData} />}
            
            <div className="mt-6">
              {/* Change 'data' to 'hourly' and add 'isDay' prop */}
              <HourlyForecast 
                hourly={weatherData.hourly} 
                isDay={weatherData.current.isDay} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentWeather; // Add this at the end