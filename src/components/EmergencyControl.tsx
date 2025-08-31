import { useState, useEffect } from 'react';
import { AlertTriangle, Siren, Route, Phone } from 'lucide-react';

interface EmergencyControlProps {
  onEmergencyToggle: (active: boolean) => void;
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

  // ✅ Persist + notify parent whenever the active flag changes
  useEffect(() => {
    try {
      localStorage.setItem('emergencyActive', JSON.stringify(emergencyActive));
    } catch {}
    onEmergencyToggle(emergencyActive);
  }, [emergencyActive, onEmergencyToggle]);

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
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
          Emergency Vehicle Control
        </h2>

        {/* Emergency Status */}
        <div className={`p-6 rounded-lg border-2 mb-6 transition-all duration-300 ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            
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
                Emergency Route
              </label>
              <select
                value={emergencyRoute}
                onChange={(e) => setEmergencyRoute(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                disabled={!emergencyActive}
                aria-label="Select emergency route"
              >
                <option value="">Select Emergency Route</option>
                {emergencyRoutes.map((route, index) => (
                  <option key={index} value={route}>{route}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Active Emergency Vehicles</h3>
            
            {emergencyActive ? (
              <div className="space-y-3">
                <div className="bg-gray-900 rounded-lg p-3 border border-red-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">AMBULANCE-001</p>
                      <p className="text-sm text-gray-400">ETA: 3 minutes</p>
                    </div>
                    <div className="flex items-center">
                      <Route className="h-4 w-4 text-red-400 mr-2" />
                      <span className="text-red-400 font-medium">Priority 1</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-3 border border-amber-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">FIRE-TRUCK-005</p>
                      <p className="text-sm text-gray-400">ETA: 7 minutes</p>
                    </div>
                    <div className="flex items-center">
                      <Route className="h-4 w-4 text-amber-400 mr-2" />
                      <span className="text-amber-400 font-medium">Priority 2</span>
                    </div>
                  </div>
                </div>
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
