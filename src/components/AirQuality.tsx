import { Wind, Info } from "lucide-react";

interface AirQualityProps {
  data: {
    main: { aqi: number };
    components: {
      pm2_5: number;
      pm10: number;
      no2: number;
      o3: number;
    };
  };
}

export const AirQuality = ({ data }: any) => {
  const aqi = data.main.aqi;
  
  const getAQIConfig = (index: number) => {
    const configs: Record<number, { label: string; color: string; description: string }> = {
      1: { label: "Good", color: "text-green-400", description: "Air quality is satisfactory." },
      2: { label: "Fair", color: "text-yellow-400", description: "Air quality is acceptable." },
      3: { label: "Moderate", color: "text-orange-400", description: "Members of sensitive groups may experience effects." },
      4: { label: "Poor", color: "text-red-400", description: "Everyone may begin to experience health effects." },
      5: { label: "Very Poor", color: "text-purple-400", description: "Health warnings of emergency conditions." },
    };
    return configs[index] || { label: "Unknown", color: "text-gray-400", description: "" };
  };

  const config = getAQIConfig(aqi);

  return (
    <div className="glass-card p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 mt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg text-white">Air Quality</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white/10 ${config.color}`}>
          AQI {aqi}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className={`text-3xl font-bold mb-2 ${config.color}`}>{config.label}</p>
          <p className="text-sm text-gray-400 leading-relaxed">{config.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 border-l border-white/10 pl-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">PM2.5</p>
            <p className="text-sm font-medium text-white">{data.components.pm2_5.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">PM10</p>
            <p className="text-sm font-medium text-white">{data.components.pm10.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">O3</p>
            <p className="text-sm font-medium text-white">{data.components.o3.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">NO2</p>
            <p className="text-sm font-medium text-white">{data.components.no2.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
