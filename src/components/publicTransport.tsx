import { useState, useEffect } from 'react';
import { Bus, Clock, MapPin, Users } from 'lucide-react';

interface BusRoute {
  id: string;
  routeNumber: string;
  destination: string;
  nextArrival: number;
  passengers: number;
  capacity: number;
  status: 'on-time' | 'delayed' | 'early';
}

export function PublicTransport() {
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([
    { id: '1', routeNumber: '101', destination: 'Downtown Terminal', nextArrival: 3, passengers: 28, capacity: 40, status: 'on-time' },
    { id: '2', routeNumber: '205', destination: 'University Campus', nextArrival: 8, passengers: 35, capacity: 40, status: 'delayed' },
    { id: '3', routeNumber: '150', destination: 'Airport Express', nextArrival: 12, passengers: 22, capacity: 50, status: 'early' },
    { id: '4', routeNumber: '075', destination: 'Shopping District', nextArrival: 5, passengers: 31, capacity: 40, status: 'on-time' },
    { id: '5', routeNumber: '320', destination: 'Medical Center', nextArrival: 15, passengers: 18, capacity: 35, status: 'on-time' },
    { id: '6', routeNumber: '180', destination: 'Industrial Zone', nextArrival: 7, passengers: 12, capacity: 30, status: 'delayed' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBusRoutes(prev => prev.map(route => ({
        ...route,
        nextArrival: Math.max(1, route.nextArrival - 1 + Math.floor(Math.random() * 2)),
        passengers: Math.max(0, Math.min(route.capacity, route.passengers + Math.floor(Math.random() * 6 - 3))),
        status: Math.random() > 0.9 ? 
          (['on-time', 'delayed', 'early'][Math.floor(Math.random() * 3)] as 'on-time' | 'delayed' | 'early') : 
          route.status
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'text-emerald-400 bg-emerald-900/20';
      case 'delayed': return 'text-red-400 bg-red-900/20';
      case 'early': return 'text-cyan-400 bg-cyan-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Bus className="h-5 w-5 mr-2 text-cyan-400" />
          Public Transportation Integration
        </h2>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Bus className="h-5 w-5 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Active</span>
            </div>
            <h3 className="text-white font-semibold text-lg">24</h3>
            <p className="text-gray-400 text-sm">Buses in Service</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">+8.2%</span>
            </div>
            <h3 className="text-white font-semibold text-lg">892</h3>
            <p className="text-gray-400 text-sm">Total Passengers</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <span className="text-emerald-400 text-sm font-medium">-2.1%</span>
            </div>
            <h3 className="text-white font-semibold text-lg">4.2 min</h3>
            <p className="text-gray-400 text-sm">Avg Delay</p>
          </div>
        </div>

        {/* Bus Routes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {busRoutes.map((route) => {
            const occupancyPercentage = (route.passengers / route.capacity) * 100;
            
            return (
              <div
                key={route.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-cyan-600 text-white rounded-lg px-2 py-1 text-sm font-bold mr-3">
                      {route.routeNumber}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{route.destination}</h3>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(route.status)}`}>
                        {route.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{route.nextArrival} min</p>
                    <p className="text-xs text-gray-400">Next arrival</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Occupancy:</span>
                    <span className="text-white font-medium">{route.passengers}/{route.capacity}</span>
                  </div>
                  
                  {/* Occupancy Bar */}
                  <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${getOccupancyColor(occupancyPercentage)}`}
                      style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center text-xs text-gray-400">
                    <MapPin className="h-3 w-3 mr-1" />
                    Real-time GPS tracking active
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}