import { useState } from 'react';
import { TrendingUp, BarChart3, Clock, Zap } from 'lucide-react';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('24h');

  const trafficData = [
    { time: '00:00', vehicles: 120, efficiency: 85 },
    { time: '04:00', vehicles: 45, efficiency: 92 },
    { time: '08:00', vehicles: 890, efficiency: 72 },
    { time: '12:00', vehicles: 650, efficiency: 78 },
    { time: '16:00', vehicles: 920, efficiency: 68 },
    { time: '20:00', vehicles: 480, efficiency: 82 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-cyan-400" />
            Traffic Analytics
          </h2>
          <select
            value={timeRange}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimeRange(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            aria-label="Select time range"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Traffic Flow Chart */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Traffic Flow & Efficiency</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {trafficData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-800 rounded-t relative" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all duration-1000 ease-out"
                    style={{ 
                      height: `${(data.vehicles / 1000) * 100}%`,
                      minHeight: '10px'
                    }}
                  ></div>
                  <div
                    className="bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t absolute top-0 right-0 w-1/3 transition-all duration-1000 ease-out"
                    style={{ 
                      height: `${data.efficiency}%`,
                      minHeight: '5px'
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 mt-2">{data.time}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-cyan-500 rounded mr-2"></div>
              <span className="text-sm text-gray-300">Vehicle Count</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
              <span className="text-sm text-gray-300">Efficiency %</span>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">+12.5%</span>
            </div>
            <h3 className="text-white font-semibold">Traffic Flow</h3>
            <p className="text-gray-400 text-sm">Optimized vs baseline</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <span className="text-emerald-400 text-sm font-medium">-8.3%</span>
            </div>
            <h3 className="text-white font-semibold">Wait Times</h3>
            <p className="text-gray-400 text-sm">Average reduction</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <span className="text-emerald-400 text-sm font-medium">+15.7%</span>
            </div>
            <h3 className="text-white font-semibold">Efficiency</h3>
            <p className="text-gray-400 text-sm">System performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}