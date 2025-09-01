import { useState, useEffect } from 'react';
import { MetricCard } from './MetricCard';
import { TrafficStatus } from './TrafficStatus';
import { AlertPanel } from './AlerPanel';
import AdvancedAnalytics from "./AdvancedAnalytics";

import { Car, Clock, Zap, TrendingDown } from 'lucide-react';

interface DashboardProps {
  emergencyMode: boolean;
}

export function Dashboard({ emergencyMode }: DashboardProps) {
  const [metrics, setMetrics] = useState({
    totalVehicles: 12840,
    avgWaitTime: 42,
    signalEfficiency: 87,
    emissionReduction: 23
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        totalVehicles: prev.totalVehicles + Math.floor(Math.random() * 20 - 10),
        avgWaitTime: Math.max(20, prev.avgWaitTime + Math.floor(Math.random() * 6 - 3)),
        signalEfficiency: Math.min(100, Math.max(70, prev.signalEfficiency + Math.floor(Math.random() * 4 - 2))),
        emissionReduction: Math.min(50, Math.max(10, prev.emissionReduction + Math.floor(Math.random() * 2 - 1)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 ">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Vehicles"
          value={metrics.totalVehicles.toLocaleString()}
          icon={Car}
          color="cyan"
          trend="+2.3%"
        />
        <MetricCard
          title="Avg. Wait Time"
          value={`${metrics.avgWaitTime}s`}
          icon={Clock}
          color="amber"
          trend="-5.2%"
        />
        <MetricCard
          title="Signal Efficiency"
          value={`${metrics.signalEfficiency}%`}
          icon={Zap}
          color="emerald"
          trend="+8.1%"
        />
        <MetricCard
          title="Emission Reduction"
          value={`${metrics.emissionReduction}%`}
          icon={TrendingDown}
          color="emerald"
          trend="+1.4%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <TrafficStatus emergencyMode={emergencyMode} />
        </div>
        <div>
          <AlertPanel emergencyMode={emergencyMode} />
        </div>
      </div>

      {/* Advanced Analytics Section */}
      <div className="mt-6">
        <AdvancedAnalytics />
      </div>

      {/* AI Recommendations */}
       <div className="mt-6 bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">AI Traffic Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.signalEfficiency < 80 && (
            <div className="bg-amber-900/50 rounded-lg p-4 animate-fadeIn">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                ⚡ Signal Timing Adjustment
              </h3>
              <p className="text-gray-300 text-sm">
                Increase green light duration for north-south traffic during peak hours.
              </p>
            </div>
          )}
          {metrics.avgWaitTime > 30 && (
            <div className="bg-red-900/50 rounded-lg p-4 animate-fadeIn">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                🚦 Congestion Alert
              </h3>
              <p className="text-gray-300 text-sm">
                High wait times detected. Implement emergency traffic flow patterns.
              </p>
            </div>
          )}
          {metrics.emissionReduction < 20 && (
            <div className="bg-emerald-900/50 rounded-lg p-4 animate-fadeIn">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                🌿 Environmental Impact
              </h3>
              <p className="text-gray-300 text-sm">
                Optimize signal timing to reduce vehicle idle time and improve air quality.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}