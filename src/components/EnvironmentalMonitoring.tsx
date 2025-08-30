import { useState, useEffect } from 'react';
import { Leaf, Wind, Volume2, Thermometer } from 'lucide-react';

export function EnvironmentalMonitoring() {
  const [environmentalData, setEnvironmentalData] = useState({
    airQuality: 85,
    noiseLevel: 68,
    temperature: 72,
    co2Levels: 420,
    carbonSaved: 2.4
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setEnvironmentalData(prev => ({
        airQuality: Math.max(0, Math.min(100, prev.airQuality + Math.floor(Math.random() * 6 - 3))),
        noiseLevel: Math.max(30, Math.min(90, prev.noiseLevel + Math.floor(Math.random() * 8 - 4))),
        temperature: Math.max(60, Math.min(85, prev.temperature + Math.floor(Math.random() * 2 - 1))),
        co2Levels: Math.max(350, Math.min(500, prev.co2Levels + Math.floor(Math.random() * 10 - 5))),
        carbonSaved: Math.max(0, prev.carbonSaved + Math.random() * 0.2 - 0.1)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getAirQualityColor = (value: number) => {
    if (value >= 80) return 'text-emerald-400 bg-emerald-900/20';
    if (value >= 60) return 'text-amber-400 bg-amber-900/20';
    return 'text-red-400 bg-red-900/20';
  };

  const getNoiseColor = (value: number) => {
    if (value <= 50) return 'text-emerald-400 bg-emerald-900/20';
    if (value <= 70) return 'text-amber-400 bg-amber-900/20';
    return 'text-red-400 bg-red-900/20';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Leaf className="h-5 w-5 mr-2 text-emerald-400" />
          Environmental Monitoring
        </h2>

        {/* Environmental Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${getAirQualityColor(environmentalData.airQuality)}`}>
            <div className="flex items-center justify-between mb-2">
              <Wind className="h-5 w-5" />
              <span className="text-sm font-medium">{environmentalData.airQuality}/100</span>
            </div>
            <h3 className="font-semibold">Air Quality</h3>
            <p className="text-xs opacity-75">Real-time AQI</p>
          </div>

          <div className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${getNoiseColor(environmentalData.noiseLevel)}`}>
            <div className="flex items-center justify-between mb-2">
              <Volume2 className="h-5 w-5" />
              <span className="text-sm font-medium">{environmentalData.noiseLevel} dB</span>
            </div>
            <h3 className="font-semibold">Noise Level</h3>
            <p className="text-xs opacity-75">Average decibels</p>
          </div>

          <div className="text-cyan-400 bg-cyan-900/20 p-4 rounded-lg border border-cyan-600 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <Thermometer className="h-5 w-5" />
              <span className="text-sm font-medium">{environmentalData.temperature}°F</span>
            </div>
            <h3 className="font-semibold">Temperature</h3>
            <p className="text-xs opacity-75">Current temp</p>
          </div>

          <div className="text-emerald-400 bg-emerald-900/20 p-4 rounded-lg border border-emerald-600 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <Leaf className="h-5 w-5" />
              <span className="text-sm font-medium">{environmentalData.carbonSaved.toFixed(1)} tons</span>
            </div>
            <h3 className="font-semibold">Carbon Saved</h3>
            <p className="text-xs opacity-75">Today</p>
          </div>
        </div>

        {/* CO2 Monitoring */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">CO2 Levels Monitoring</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{environmentalData.co2Levels} ppm</p>
              <p className="text-gray-400 text-sm">Current atmospheric CO2</p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${environmentalData.co2Levels <= 400 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {environmentalData.co2Levels <= 400 ? 'Good' : 'Moderate'}
              </p>
              <p className="text-gray-400 text-sm">Air quality status</p>
            </div>
          </div>
          
          {/* CO2 Level Bar */}
          <div className="mt-4">
            <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${environmentalData.co2Levels <= 400 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${Math.min(100, (environmentalData.co2Levels / 500) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}