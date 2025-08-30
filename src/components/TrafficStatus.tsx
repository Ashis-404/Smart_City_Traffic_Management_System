import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Users } from 'lucide-react';

interface TrafficStatusProps {
  emergencyMode: boolean;
}

interface Intersection {
  id: string;
  name: string;
  status: 'optimal' | 'congested' | 'critical';
  vehicles: number;
  avgSpeed: number;
  signalPhase: 'green' | 'yellow' | 'red';
}

export function TrafficStatus({ emergencyMode }: TrafficStatusProps) {
  const [intersections, setIntersections] = useState<Intersection[]>([
    { id: '1', name: 'Main St & Broadway', status: 'optimal', vehicles: 12, avgSpeed: 35, signalPhase: 'green' },
    { id: '2', name: 'Central Ave & 5th St', status: 'congested', vehicles: 28, avgSpeed: 18, signalPhase: 'red' },
    { id: '3', name: 'Park Blvd & Oak St', status: 'optimal', vehicles: 8, avgSpeed: 40, signalPhase: 'green' },
    { id: '4', name: 'Market St & Union Ave', status: 'critical', vehicles: 45, avgSpeed: 8, signalPhase: 'red' },
    { id: '5', name: 'River Rd & Pine St', status: 'optimal', vehicles: 15, avgSpeed: 32, signalPhase: 'yellow' },
    { id: '6', name: 'Downtown Hub', status: 'congested', vehicles: 34, avgSpeed: 22, signalPhase: 'green' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntersections(prev => prev.map(intersection => ({
        ...intersection,
        vehicles: Math.max(0, intersection.vehicles + Math.floor(Math.random() * 10 - 5)),
        avgSpeed: Math.max(5, Math.min(50, intersection.avgSpeed + Math.floor(Math.random() * 6 - 3))),
        signalPhase: ['green', 'yellow', 'red'][Math.floor(Math.random() * 3)] as 'green' | 'yellow' | 'red',
        status: Math.random() > 0.8 ? 
          (['optimal', 'congested', 'critical'][Math.floor(Math.random() * 3)] as 'optimal' | 'congested' | 'critical') : 
          intersection.status
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-emerald-400 bg-emerald-900/20 border-emerald-600';
      case 'congested': return 'text-amber-400 bg-amber-900/20 border-amber-600';
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-600';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600';
    }
  };

  const getSignalColor = (phase: string) => {
    switch (phase) {
      case 'green': return 'bg-emerald-500';
      case 'yellow': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Navigation className="h-5 w-5 mr-2 text-cyan-400" />
          Real-Time Traffic Status
        </h2>
        {emergencyMode && (
          <div className="animate-pulse bg-red-600 px-3 py-1 rounded-full text-sm font-medium">
            PRIORITY MODE
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {intersections.map((intersection) => (
          <div
            key={intersection.id}
            className={`bg-gray-900 rounded-lg p-4 border transition-all duration-300 hover:scale-105 ${getStatusColor(intersection.status)} ${
              emergencyMode ? 'animate-pulse' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <h3 className="font-semibold text-sm">{intersection.name}</h3>
              </div>
              <div className={`w-3 h-3 rounded-full animate-pulse ${getSignalColor(intersection.signalPhase)}`}></div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vehicles:</span>
                <span className="font-medium flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {intersection.vehicles}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg Speed:</span>
                <span className="font-medium">{intersection.avgSpeed} mph</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className={`font-medium capitalize ${intersection.status === 'optimal' ? 'text-emerald-400' : intersection.status === 'congested' ? 'text-amber-400' : 'text-red-400'}`}>
                  {intersection.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}