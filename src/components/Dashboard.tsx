import { useState, useEffect } from 'react';
import { MetricCard } from './MetricCard';
import { TrafficStatus } from './TrafficStatus';
import { AlertPanel } from './AlerPanel';
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
    <div className="space-y-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficStatus emergencyMode={emergencyMode} />
        </div>
        <div>
          <AlertPanel emergencyMode={emergencyMode} />
        </div>
      </div>
    </div>
  );
}