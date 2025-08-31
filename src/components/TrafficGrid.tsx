import { useState, useEffect, useMemo } from 'react';
import { MapPin, Wifi, Signal } from 'lucide-react';
import { getRouteIntersections } from '../services/emergencyRoutes';

interface TrafficGridProps {
  emergencyMode: boolean;
  emergencyRoute?: string;
}

interface TrafficLight {
  id: string;
  intersection: string;
  currentPhase: 'green' | 'yellow' | 'red';
  timeRemaining: number;
  sensorStatus: 'online' | 'offline' | 'maintenance';
  vehicleCount: number;
  adaptiveMode: boolean;
}

export function TrafficGrid({ emergencyMode, emergencyRoute }: TrafficGridProps) {
  const priorityIntersections = useMemo(() => {
    if (!emergencyMode || !emergencyRoute) return new Set<string>();
    return new Set(getRouteIntersections(emergencyRoute));
  }, [emergencyMode, emergencyRoute]);
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>(() => {
    // Get persisted adaptive mode states from localStorage
    const savedAdaptiveStates = JSON.parse(localStorage.getItem('adaptiveModeStates') || '{}');
    
    // Initial traffic lights with persisted adaptive mode states
    const initialLights: TrafficLight[] = [
      { id: 'Traffic Light 1', intersection: 'Main & Broadway', currentPhase: 'green' as const, timeRemaining: 35, sensorStatus: 'online', vehicleCount: 12, adaptiveMode: false },
      { id: 'Traffic Light 2', intersection: 'Central & 5th', currentPhase: 'red' as const, timeRemaining: 28, sensorStatus: 'online', vehicleCount: 28, adaptiveMode: false },
      { id: 'Traffic Light 3', intersection: 'Park & Oak', currentPhase: 'green' as const, timeRemaining: 42, sensorStatus: 'online', vehicleCount: 8, adaptiveMode: false },
      { id: 'Traffic Light 4', intersection: 'Market & Union', currentPhase: 'red' as const, timeRemaining: 15, sensorStatus: 'maintenance', vehicleCount: 45, adaptiveMode: false },
      { id: 'Traffic Light 5', intersection: 'River & Pine', currentPhase: 'yellow' as const, timeRemaining: 5, sensorStatus: 'online', vehicleCount: 15, adaptiveMode: false },
      { id: 'Traffic Light 6', intersection: 'Downtown Hub', currentPhase: 'green' as const, timeRemaining: 60, sensorStatus: 'offline', vehicleCount: 34, adaptiveMode: false }
    ];

    // Apply saved adaptive mode states
    return initialLights.map(light => ({
      ...light,
      adaptiveMode: savedAdaptiveStates[light.id] || false
    }));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficLights(prev => prev.map(light => {
        let newTimeRemaining = light.timeRemaining - 1;
        let newPhase = light.currentPhase;
        let newVehicleCount = Math.max(0, light.vehicleCount + Math.floor(Math.random() * 6 - 3));

        if (newTimeRemaining <= 0) {
          if (light.currentPhase === 'green') {
            newPhase = 'yellow';
            newTimeRemaining = 5;
          } else if (light.currentPhase === 'yellow') {
            newPhase = 'red';
            const isPriorityIntersection = priorityIntersections.has(light.id);
            
            if (isPriorityIntersection && emergencyMode) {
              // Shorter red light for priority intersections
              newTimeRemaining = 10;
            } else if (light.adaptiveMode) {
              newTimeRemaining = emergencyMode ? 15 : Math.min(60, Math.max(20, Math.floor(newVehicleCount * 1.5)));
            } else {
              newTimeRemaining = emergencyMode ? 15 : Math.floor(Math.random() * 40 + 20);
            }
          } else {
            newPhase = 'green';
            const isPriorityIntersection = priorityIntersections.has(light.id);
            
            if (isPriorityIntersection && emergencyMode) {
              // Longer green light for priority intersections
              newTimeRemaining = 45;
            } else if (light.adaptiveMode) {
              newTimeRemaining = emergencyMode ? 20 : Math.min(90, Math.max(30, Math.floor(newVehicleCount * 2)));
            } else {
              newTimeRemaining = emergencyMode ? 20 : Math.floor(Math.random() * 50 + 30);
            }
          }
        }

        return {
          ...light,
          currentPhase: newPhase,
          timeRemaining: newTimeRemaining,
          vehicleCount: newVehicleCount
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [emergencyMode]);

  const toggleAdaptiveMode = (id: string) => {
    setTrafficLights(prev => prev.map(light => 
      light.id === id ? { ...light, adaptiveMode: !light.adaptiveMode } : light
    ));
    // Persist adaptive mode state to localStorage
    const adaptiveModeStates = JSON.parse(localStorage.getItem('adaptiveModeStates') || '{}');
    adaptiveModeStates[id] = !adaptiveModeStates[id];
    localStorage.setItem('adaptiveModeStates', JSON.stringify(adaptiveModeStates));
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'green': return 'bg-emerald-500 shadow-emerald-500/50';
      case 'yellow': return 'bg-amber-500 shadow-amber-500/50';
      case 'red': return 'bg-red-500 shadow-red-500/50';
      default: return 'bg-gray-500';
    }
  };

  const getSensorStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-emerald-400';
      case 'offline': return 'text-red-400';
      case 'maintenance': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Signal className="h-5 w-5 mr-2 text-cyan-400" />
          Traffic Signal Control Grid
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trafficLights.map((light) => (
            <div
              key={light.id}
              className={`bg-gray-900 rounded-lg p-4 border transition-all duration-300 ${
                emergencyMode && priorityIntersections.has(light.id)
                  ? 'border-red-600 shadow-lg shadow-red-900/50'
                  : emergencyMode
                  ? 'border-amber-700 animate-pulse'
                  : 'border-gray-700 hover:border-gray-600 hover:scale-105'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm font-medium text-white">{light.intersection}</span>
                </div>
                <span className="text-xs text-gray-500">{light.id}</span>
              </div>

              {/* Traffic Light Visual */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-800 rounded-lg p-2 border border-gray-600">
                  <div className="space-y-1">
                    <div className={`w-4 h-4 rounded-full ${light.currentPhase === 'red' ? getPhaseColor('red') : 'bg-gray-700'} shadow-lg`}></div>
                    <div className={`w-4 h-4 rounded-full ${light.currentPhase === 'yellow' ? getPhaseColor('yellow') : 'bg-gray-700'} shadow-lg`}></div>
                    <div className={`w-4 h-4 rounded-full ${light.currentPhase === 'green' ? getPhaseColor('green') : 'bg-gray-700'} shadow-lg`}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Remaining:</span>
                  <span className="font-medium text-white">{light.timeRemaining}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vehicles:</span>
                  <span className="font-medium text-white">{light.vehicleCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sensor:</span>
                  <div className="flex items-center">
                    <Wifi className={`h-3 w-3 mr-1 ${getSensorStatusColor(light.sensorStatus)}`} />
                    <span className={`capitalize ${getSensorStatusColor(light.sensorStatus)}`}>
                      {light.sensorStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => toggleAdaptiveMode(light.id)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    light.adaptiveMode
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {light.adaptiveMode ? 'Adaptive Mode ON' : 'Manual Mode'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}