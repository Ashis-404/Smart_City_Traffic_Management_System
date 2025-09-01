import { useState, useEffect } from 'react';
import { Navigation, MapPin, Users } from 'lucide-react';

interface TrafficStatusProps {
  emergencyMode: boolean;
}

type ControlMode = 'adaptive' | 'manual';

interface TrafficControl {
  mode: ControlMode;
  manualPhases: { [key: string]: 'horizontal' | 'vertical' };
}

interface TrafficHistory {
  timestamp: number;
  vehicles: number;
  avgSpeed: number;
  congestionLevel: number; // 0-100 scale
}

interface Intersection {
  id: string;
  name: string;
  status: 'optimal' | 'congested' | 'critical';
  vehicles: number;
  avgSpeed: number;
  signalPhase: 'horizontal' | 'vertical';
  cycleLength: number;
  history: TrafficHistory[];
  predictions: TrafficHistory[]; // Next hour predictions
}

export function TrafficStatus({ emergencyMode }: TrafficStatusProps) {
  const [trafficControl, setTrafficControl] = useState<TrafficControl>(() => {
    const saved = localStorage.getItem('trafficControl');
    return saved ? JSON.parse(saved) : {
      mode: 'adaptive' as ControlMode,
      manualPhases: {} as { [key: string]: 'horizontal' | 'vertical' }
    };
  });

  const [intersections, setIntersections] = useState<Intersection[]>([
    { 
      id: '1', 
      name: 'Main St & Broadway', 
      status: 'optimal', 
      vehicles: 12, 
      avgSpeed: 35, 
      signalPhase: 'horizontal',
      cycleLength: 60,
      history: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() - (59 - i) * 1000,
        vehicles: Math.max(0, 12 + Math.floor(Math.sin(i / 10) * 5)),
        avgSpeed: Math.max(5, Math.min(50, 35 + Math.floor(Math.cos(i / 10) * 3))),
        congestionLevel: Math.max(0, Math.min(100, 30 + Math.floor(Math.sin(i / 10) * 20)))
      })),
      predictions: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        vehicles: Math.max(0, 12 + Math.floor(Math.sin((60 + i) / 10) * 5)),
        avgSpeed: Math.max(5, Math.min(50, 35 + Math.floor(Math.cos((60 + i) / 10) * 3))),
        congestionLevel: Math.max(0, Math.min(100, 30 + Math.floor(Math.sin((60 + i) / 10) * 20)))
      }))
    },
    { 
      id: '2', 
      name: 'Central Ave & 5th St', 
      status: 'congested', 
      vehicles: 28, 
      avgSpeed: 18, 
      signalPhase: 'vertical',
      cycleLength: 90,
      history: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() - (59 - i) * 1000,
        vehicles: Math.max(0, 28 + Math.floor(Math.sin(i / 8) * 8)),
        avgSpeed: Math.max(5, Math.min(50, 18 + Math.floor(Math.cos(i / 8) * 5))),
        congestionLevel: Math.max(0, Math.min(100, 70 + Math.floor(Math.sin(i / 8) * 15)))
      })),
      predictions: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        vehicles: Math.max(0, 28 + Math.floor(Math.sin((60 + i) / 8) * 8)),
        avgSpeed: Math.max(5, Math.min(50, 18 + Math.floor(Math.cos((60 + i) / 8) * 5))),
        congestionLevel: Math.max(0, Math.min(100, 70 + Math.floor(Math.sin((60 + i) / 8) * 15)))
      }))
    },
    { 
      id: '3', 
      name: 'Park Blvd & Oak St', 
      status: 'optimal', 
      vehicles: 8, 
      avgSpeed: 40, 
      signalPhase: 'horizontal',
      cycleLength: 45,
      history: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() - (59 - i) * 1000,
        vehicles: Math.max(0, 8 + Math.floor(Math.sin(i / 12) * 4)),
        avgSpeed: Math.max(5, Math.min(50, 40 + Math.floor(Math.cos(i / 12) * 3))),
        congestionLevel: Math.max(0, Math.min(100, 20 + Math.floor(Math.sin(i / 12) * 15)))
      })),
      predictions: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        vehicles: Math.max(0, 8 + Math.floor(Math.sin((60 + i) / 12) * 4)),
        avgSpeed: Math.max(5, Math.min(50, 40 + Math.floor(Math.cos((60 + i) / 12) * 3))),
        congestionLevel: Math.max(0, Math.min(100, 20 + Math.floor(Math.sin((60 + i) / 12) * 15)))
      }))
    },
    { 
      id: '4', 
      name: 'Market St & Union Ave', 
      status: 'critical', 
      vehicles: 45, 
      avgSpeed: 8, 
      signalPhase: 'vertical',
      cycleLength: 120,
      history: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() - (59 - i) * 1000,
        vehicles: Math.max(0, 45 + Math.floor(Math.sin(i / 6) * 10)),
        avgSpeed: Math.max(5, Math.min(50, 8 + Math.floor(Math.cos(i / 6) * 4))),
        congestionLevel: Math.max(0, Math.min(100, 90 + Math.floor(Math.sin(i / 6) * 10)))
      })),
      predictions: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        vehicles: Math.max(0, 45 + Math.floor(Math.sin((60 + i) / 6) * 10)),
        avgSpeed: Math.max(5, Math.min(50, 8 + Math.floor(Math.cos((60 + i) / 6) * 4))),
        congestionLevel: Math.max(0, Math.min(100, 90 + Math.floor(Math.sin((60 + i) / 6) * 10)))
      }))
    },
    { 
      id: '5', 
      name: 'River Rd & Pine St', 
      status: 'optimal', 
      vehicles: 15, 
      avgSpeed: 32, 
      signalPhase: 'horizontal',
      cycleLength: 60,
      history: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() - (59 - i) * 1000,
        vehicles: Math.max(0, 15 + Math.floor(Math.sin(i / 10) * 6)),
        avgSpeed: Math.max(5, Math.min(50, 32 + Math.floor(Math.cos(i / 10) * 4))),
        congestionLevel: Math.max(0, Math.min(100, 35 + Math.floor(Math.sin(i / 10) * 20)))
      })),
      predictions: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        vehicles: Math.max(0, 15 + Math.floor(Math.sin((60 + i) / 10) * 6)),
        avgSpeed: Math.max(5, Math.min(50, 32 + Math.floor(Math.cos((60 + i) / 10) * 4))),
        congestionLevel: Math.max(0, Math.min(100, 35 + Math.floor(Math.sin((60 + i) / 10) * 20)))
      }))
    },
    { 
      id: '6', 
      name: 'Downtown Hub', 
      status: 'congested', 
      vehicles: 34, 
      avgSpeed: 22, 
      signalPhase: 'vertical',
      cycleLength: 90,
      history: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() - (59 - i) * 1000,
        vehicles: Math.max(0, 34 + Math.floor(Math.sin(i / 8) * 8)),
        avgSpeed: Math.max(5, Math.min(50, 22 + Math.floor(Math.cos(i / 8) * 5))),
        congestionLevel: Math.max(0, Math.min(100, 75 + Math.floor(Math.sin(i / 8) * 15)))
      })),
      predictions: Array.from({ length: 60 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        vehicles: Math.max(0, 34 + Math.floor(Math.sin((60 + i) / 8) * 8)),
        avgSpeed: Math.max(5, Math.min(50, 22 + Math.floor(Math.cos((60 + i) / 8) * 5))),
        congestionLevel: Math.max(0, Math.min(100, 75 + Math.floor(Math.sin((60 + i) / 8) * 15)))
      }))
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntersections(prev => prev.map(intersection => {
        // Update traffic metrics
        const newVehicles = Math.max(0, intersection.vehicles + Math.floor(Math.random() * 10 - 5));
        const newSpeed = Math.max(5, Math.min(50, intersection.avgSpeed + Math.floor(Math.random() * 6 - 3)));
        
        // Determine new status based on vehicle count and speed
        let newStatus = intersection.status;
        if (newVehicles > 40 || newSpeed < 10) {
          newStatus = 'critical';
        } else if (newVehicles > 25 || newSpeed < 20) {
          newStatus = 'congested';
        } else if (newVehicles <= 25 && newSpeed >= 20) {
          newStatus = 'optimal';
        }

        // Determine signal phase based on control mode
        let newPhase = intersection.signalPhase;
        let newCycleLength = intersection.cycleLength;

        if (trafficControl.mode === 'adaptive') {
          // Calculate adaptive signal phase based on cycle time
          const timeInCycle = Math.floor(Date.now() / 1000) % intersection.cycleLength;
          newPhase = timeInCycle < intersection.cycleLength / 2 ? 'horizontal' : 'vertical';

          // Adjust cycle length based on traffic conditions
          if (newStatus === 'critical') {
            newCycleLength = 120; // Longer cycles for critical traffic
          } else if (newStatus === 'congested') {
            newCycleLength = 90; // Medium cycles for congested traffic
          } else {
            newCycleLength = 60; // Normal cycles for optimal traffic
          }
        } else {
          // Use manual phase settings if available
          newPhase = trafficControl.manualPhases[intersection.id] || intersection.signalPhase;
          newCycleLength = 60; // Fixed cycle length in manual mode
        }

        // Emergency mode forces faster cycles
        if (emergencyMode) {
          newCycleLength = Math.max(30, newCycleLength / 2);
        }

        return {
          ...intersection,
          vehicles: newVehicles,
          avgSpeed: newSpeed,
          status: newStatus as 'optimal' | 'congested' | 'critical',
          signalPhase: newPhase,
          cycleLength: newCycleLength
        };
      }));
    }, 1000); // Update every second for smoother transitions

    return () => clearInterval(interval);
  }, [emergencyMode]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-emerald-400 bg-emerald-900/20 border-emerald-600';
      case 'congested': return 'text-amber-400 bg-amber-900/20 border-amber-600';
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-600';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600';
    }
  };

  const getSignalColor = (phase: 'horizontal' | 'vertical', status: 'optimal' | 'congested' | 'critical') => {
    if (status === 'critical') {
      return 'bg-red-500 animate-pulse';
    }
    return phase === 'horizontal' ? 'bg-emerald-500' : 'bg-amber-500';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 flex flex-col h-[525px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Navigation className="h-4 w-4 mr-1.5 text-cyan-400" />
            Real-Time Traffic Status
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newControl = { ...trafficControl, mode: 'adaptive' as ControlMode };
                setTrafficControl(newControl);
                localStorage.setItem('trafficControl', JSON.stringify(newControl));
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                trafficControl.mode === 'adaptive' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Adaptive
            </button>
            <button
              onClick={() => {
                const newControl = { ...trafficControl, mode: 'manual' as ControlMode };
                setTrafficControl(newControl);
                localStorage.setItem('trafficControl', JSON.stringify(newControl));
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                trafficControl.mode === 'manual' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Manual
            </button>
          </div>
        </div>
        {emergencyMode && (
          <div className="animate-pulse bg-red-600 px-3 py-1 rounded-full text-sm font-medium">
            PRIORITY MODE
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 overflow-y-auto custom-scrollbar p-0.5">
        {intersections.map((intersection) => (
          <div
            key={intersection.id}
            className={`bg-gray-900 rounded-lg border h-[140px] ${getStatusColor(intersection.status)} ${
              emergencyMode ? 'animate-pulse' : ''
            }`}
          >
            <div className="p-2.5 h-full flex flex-col">
              {/* Intersection name and controls */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center truncate mr-2 flex-1">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                  <h3 className="font-medium text-sm truncate text-gray-200">{intersection.name}</h3>
                </div>
                <div className="flex-shrink-0">
                  {trafficControl.mode === 'manual' ? (
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          const newPhases = { ...trafficControl.manualPhases, [intersection.id]: 'horizontal' as const };
                          setTrafficControl({ ...trafficControl, manualPhases: newPhases });
                          localStorage.setItem('trafficControl', JSON.stringify({ ...trafficControl, manualPhases: newPhases }));
                        }}
                        className={`w-7 h-7 rounded flex items-center justify-center transition-colors text-sm ${
                          intersection.signalPhase === 'horizontal' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        H
                      </button>
                      <button
                        onClick={() => {
                          const newPhases = { ...trafficControl.manualPhases, [intersection.id]: 'vertical' as const };
                          setTrafficControl({ ...trafficControl, manualPhases: newPhases });
                          localStorage.setItem('trafficControl', JSON.stringify({ ...trafficControl, manualPhases: newPhases }));
                        }}
                        className={`w-7 h-7 rounded flex items-center justify-center transition-colors text-sm ${
                          intersection.signalPhase === 'vertical' 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        V
                      </button>
                    </div>
                  ) : (
                    <div className={`w-2.5 h-2.5 rounded-full ${getSignalColor(intersection.signalPhase, intersection.status)}`} />
                  )}
                </div>
              </div>

              {/* Status and Metrics */}
              <div className="flex-1 flex flex-col justify-between">
                {/* Status Badge */}
                <div className={`rounded px-2 py-1 flex items-center justify-between ${
                  intersection.status === 'optimal' ? 'bg-emerald-900/50' : 
                  intersection.status === 'congested' ? 'bg-amber-900/50' : 
                  'bg-red-900/50'
                }`}>
                  <span className="text-sm text-gray-400">Status</span>
                  <span className={`font-medium capitalize ml-2 px-2 py-1 rounded text-sm w-20 text-center ${
                    intersection.status === 'optimal' ? 'bg-emerald-500/20 text-emerald-300' : 
                    intersection.status === 'congested' ? 'bg-amber-500/20 text-amber-300' : 
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {intersection.status}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-800/50 rounded py-1 px-1.5">
                    <div className="text-xs text-gray-500 mb-1">Vehicles</div>
                    <div className="flex items-center justify-between">
                      <Users className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium tabular-nums w-8 text-right">{intersection.vehicles}</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded py-1 px-1.5">
                    <div className="text-xs text-gray-500 mb-1">Speed</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium tabular-nums w-8 text-right">{intersection.avgSpeed}</span>
                      <span className="text-xs text-gray-500">mph</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}