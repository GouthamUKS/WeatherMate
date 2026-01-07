import { getWeatherIcon } from '@/lib/weather';

export const DailyPrediction = ({ days }: { days: any[] }) => {
  return (
    <div className="grid grid-cols-5 gap-2 mt-4">
      {days.map((day, i) => (
        <div key={i} className="glass-card p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
          <p className="text-xs text-slate-500 font-medium mb-2">
            {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
          </p>
          <span className="text-2xl mb-2 block">
            {getWeatherIcon(day.weather[0].id, true)}
          </span>
          <p className="text-sm font-bold">{Math.round(day.main.temp)}°</p>
        </div>
      ))}
    </div>
  );
};