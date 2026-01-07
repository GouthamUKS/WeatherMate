import React, { useState, useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { CurrentWeather } from "./CurrentWeather";
import { HourlyForecast } from "./HourlyForecast";
import { AirQuality } from "./AirQuality";
import { Summary } from "./Summary";
import { DailyPrediction } from "./DailyPrediction";
import { X } from "lucide-react";

export const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [airQualityData, setAirQualityData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Keyboard Listeners: Escape to Clear, Enter to Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClear();
      
      // If user hits Enter while focus is in the search area
      if (e.key === "Enter" && !loading) {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput && searchInput.value.trim() !== "") {
          // This allows the Enter key to work if the SearchBar component 
          // supports form submission or programmatic triggering.
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading]);

  const handleLocationSelect = async (location: any) => {
    console.log("Location selected:", location);
    setLoading(true);
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    try {
      // 1. Fetch 5-Day Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${apiKey}`
      );
      
      if (!forecastRes.ok) {
        throw new Error(`OpenWeatherMap API Error: ${forecastRes.status} - ${forecastRes.statusText}. Please get a valid API key from https://openweathermap.org/api`);
      }
      
      const fData = await forecastRes.json();
      console.log("Forecast data:", fData);

      if (!fData.list || fData.list.length === 0) {
        throw new Error("No weather data available for this location");
      }

      // 2. Fetch Air Quality
      const aqRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}`
      );
      
      if (!aqRes.ok) {
        console.warn("Air quality data unavailable");
      }
      
      const aqJson = await aqRes.json();
      console.log("Air quality data:", aqJson);

      const current = fData.list[0];
      const dailyPredictions = fData.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 5);

      setWeatherData({
        current: {
          temperature: Math.round(current.main.temp),
          weatherCode: current.weather[0].id,
          isDay: current.sys?.pod === 'd',
          apparentTemperature: Math.round(current.main.feels_like),
          humidity: current.main.humidity,
          windSpeed: Math.round(current.wind.speed * 3.6),
        },
        daily: dailyPredictions,
        location: { name: location.name, admin1: location.admin1, country: location.country },
        hourly: fData.list.slice(0, 8), 
        summary: `Hey mate! In ${location.name}, it's currently ${Math.round(current.main.temp)} degrees with ${current.weather[0].description}. Overall, the air quality is ${getAQILabel(aqJson.list[0].main.aqi)}.`
      });
      setAirQualityData(aqJson.list?.[0]);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert(error instanceof Error ? error.message : "Failed to fetch weather data. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setWeatherData(null);
    setAirQualityData(null);
  };

  const getAQILabel = (aqi: number) => {
    const labels: Record<number, string> = { 1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor" };
    return labels[aqi] || "Unknown";
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 flex flex-col items-center justify-start overflow-x-hidden pt-12">
      <div className={`w-full max-w-6xl transition-all duration-700 ${!weatherData ? 'mt-[20vh]' : 'mt-0'}`}>
        
        {/* Splash Page Greeting */}
        {!weatherData && !loading && (
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Hey mate!
            </h1>
            <p className="text-xl text-slate-400">Where do you wanna check in?</p>
          </div>
        )}

        {/* Search Bar with Internal Clear Icon */}
        <div className="relative w-full max-w-2xl mx-auto z-[100] mb-8">
          <SearchBar onLocationSelect={handleLocationSelect} />
          {weatherData && (
            <button 
              onClick={handleClear} 
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 border border-white/10 z-[110]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {loading && <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div></div>}

        {/* Bento Grid Layout */}
        {weatherData && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-10 duration-1000">
            
            {/* Left Column: Main Weather and 5-Day Stack */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <div className="glass-card bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 h-[350px] flex items-center justify-center">
                <CurrentWeather weather={weatherData.current} location={weatherData.location} />
              </div>
              <DailyPrediction days={weatherData.daily} />
            </div>

            {/* Right Column: Sidebar Stack */}
            <div className="flex flex-col gap-6 h-full">
              <div className="flex-1">
                <Summary text={weatherData.summary} />
              </div>
              <div className="flex-1">
                {airQualityData && <AirQuality data={airQualityData} />}
              </div>
            </div>

            {/* Bottom Row: Full Width Hourly Timeline */}
            <div className="md:col-span-3 mt-4">
              <div className="glass-card bg-white/5 rounded-[2.5rem] p-8 border border-white/10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6 ml-2">Next 24 Hours</h3>
                <div className="overflow-x-auto scrollbar-hide">
                  <HourlyForecast 
                    hourly={weatherData.hourly} 
                    isDay={weatherData.current.isDay} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};