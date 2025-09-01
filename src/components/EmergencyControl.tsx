import { useState, useEffect } from 'react';
import { AlertTriangle, Siren, Route, Phone } from 'lucide-react';

interface EmergencyControlProps {
  onEmergencyToggle: (active: boolean, priorityRoute?: string) => void;
}

export function EmergencyControl({ onEmergencyToggle }: EmergencyControlProps) {
  // ✅ Initialize from localStorage synchronously (no flicker / no overwrite)
  const [emergencyActive, setEmergencyActive] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      const raw = localStorage.getItem('emergencyActive');
      return raw ? JSON.parse(raw) === true : false;
    } catch {
      return false;
    }
  });

  const [emergencyRoute, setEmergencyRoute] = useState<string>(() => {
    try {
      if (typeof window === 'undefined') return '';
      return localStorage.getItem('emergencyRoute') ?? '';
    } catch {
      return '';
    }
  });

  const [routeDetails, setRouteDetails] = useState<{[key: string]: string[]}>({
    'Hospital Route A - Central to General Hospital': ['Main & Broadway', 'Central & 5th', 'Market & Union'],
    'Fire Station Route B - Downtown to Industrial': ['Downtown Hub', 'River & Pine', 'Park & Oak'],
    'Police Route C - Precinct to Highway Access': ['Central & 5th', 'Market & Union', 'River & Pine'],
    'Ambulance Route D - Medical Center to Airport': ['Park & Oak', 'Main & Broadway', 'Downtown Hub']
  });

  // ✅ Persist + notify parent whenever the active flag or route changes
  useEffect(() => {
    try {
      localStorage.setItem('emergencyActive', JSON.stringify(emergencyActive));
    } catch {}
    onEmergencyToggle(emergencyActive, emergencyRoute);
  }, [emergencyActive, emergencyRoute, onEmergencyToggle]);

  // ✅ Persist route when it changes
  useEffect(() => {
    try {
      localStorage.setItem('emergencyRoute', emergencyRoute);
    } catch {}
  }, [emergencyRoute]);

  const activateEmergency = () => {
    setEmergencyActive(true);
  };

  const deactivateEmergency = () => {
    setEmergencyActive(false);
    setEmergencyRoute('');
  };

  const emergencyRoutes = [
    'Hospital Route A - Central to General Hospital',
    'Fire Station Route B - Downtown to Industrial',
    'Police Route C - Precinct to Highway Access',
    'Ambulance Route D - Medical Center to Airport'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-400" />
          Emergency Vehicle Control
        </h2>

        {/* Emergency Status */}
        <div className={`p-3 sm:p-6 rounded-lg border-2 mb-4 sm:mb-6 transition-all duration-300 ${
          emergencyActive 
            ? 'border-red-600 bg-red-900/20 animate-pulse' 
            : 'border-gray-600 bg-gray-900/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Emergency Status</h3>
              <p className={`text-sm ${emergencyActive ? 'text-red-400' : 'text-gray-400'}`}>
                {emergencyActive ? 'EMERGENCY MODE ACTIVE' : 'Normal Operations'}
              </p>
            </div>
            <Siren className={`h-8 w-8 ${emergencyActive ? 'text-red-400 animate-spin' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white">Quick Actions</h3>
            
            {!emergencyActive ? (
              <button
                onClick={activateEmergency}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Activate Emergency Mode
              </button>
            ) : (
              <button
                onClick={deactivateEmergency}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                Deactivate Emergency Mode
              </button>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Priority Route Selection
              </label>
              <select
                value={emergencyRoute}
                onChange={(e) => setEmergencyRoute(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-white transition-all duration-200 ${
                  emergencyActive 
                    ? 'bg-gray-900 border-red-600 focus:ring-2 focus:ring-red-500' 
                    : 'bg-gray-700 border-gray-600'
                }`}
                disabled={!emergencyActive}
                aria-label="Select emergency route"
              >
                <option value="">Select Priority Route</option>
                {emergencyRoutes.map((route, index) => (
                  <option key={index} value={route}>{route}</option>
                ))}
              </select>
              {emergencyRoute && emergencyActive && (
                <div className="mt-2 text-sm">
                  <span className="text-red-400">Priority Route Active: </span>
                  <span className="text-white">{emergencyRoute}</span>
                  <div className="mt-1">
                    <span className="text-gray-400 text-xs">Priority Intersections: </span>
                    <span className="text-xs text-gray-300">
                      {routeDetails[emergencyRoute]?.join(' → ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Active Emergency Vehicles</h3>
            
            {emergencyActive ? (
              <div className="space-y-3">
                {emergencyRoute ? (
                  <>
                    <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-white font-medium">Emergency Vehicle En Route</p>
                          <p className="text-sm text-red-400">Priority Route Active</p>
                        </div>
                        <div className="flex items-center">
                          <Route className="h-5 w-5 text-red-400 mr-2" />
                          <span className="text-red-400 animate-pulse">●</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">
                        Traffic signals optimized for emergency route
                      </p>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-3 border border-red-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">EMERGENCY-001</p>
                          <p className="text-sm text-gray-400">Route: {emergencyRoute.split(' - ')[0]}</p>
                        </div>
                        <div className="flex items-center">
                          <Route className="h-4 w-4 text-red-400 mr-2" />
                          <span className="text-red-400 font-medium">Priority Active</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-amber-900/20 border border-amber-600 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-amber-400 text-sm">
                        No priority route selected. Select a route to optimize traffic flow.
                      </p>
                      <Route className="h-5 w-5 text-amber-400" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Siren className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active emergency vehicles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
