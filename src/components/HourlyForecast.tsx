import React from 'react';
import { getWeatherIcon } from '@/lib/weather';

interface HourlyForecastProps {
  hourly: any[];
  isDay: boolean;
}

export const HourlyForecast = ({ hourly, isDay }: HourlyForecastProps) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="flex justify-between items-center min-w-full md:min-w-[800px] gap-4 px-2 overflow-x-auto scrollbar-hide">
      {hourly.map((item, index) => {
        const time = index === 0 ? "Now" : new Date(item.dt * 1000).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });

        return (
          <div 
            key={index} 
            className="flex flex-col items-center gap-3 transition-all hover:scale-110 duration-300 min-w-[90px] p-4 rounded-3xl bg-white/5 border border-white/5"
          >
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              {time}
            </p>
            
            <span className="text-3xl">
              {getWeatherIcon(item.weather[0].id, item.sys?.pod === 'd')}
            </span>
            
            <p className="text-xl font-bold tracking-tight text-white">
              {Math.round(item.main.temp)}°
            </p>
          </div>
        );
      })}
    </div>
  );
};