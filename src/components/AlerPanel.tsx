import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';

interface AlertPanelProps {
  emergencyMode: boolean;
}

interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  location: string;
  timestamp: Date;
  resolved: boolean;
}

export function AlertPanel({ emergencyMode }: AlertPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      message: 'Heavy congestion detected',
      location: 'Market St & Union Ave',
      timestamp: new Date(Date.now() - 5 * 60000),
      resolved: false
    },
    {
      id: '2',
      type: 'warning',
      message: 'Sensor maintenance required',
      location: 'Park Blvd & Oak St',
      timestamp: new Date(Date.now() - 15 * 60000),
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      message: 'Emergency vehicle cleared',
      location: 'Central Ave & 5th St',
      timestamp: new Date(Date.now() - 8 * 60000),
      resolved: true
    }
  ]);

  useEffect(() => {
    if (emergencyMode) {
      const emergencyAlert: Alert = {
        id: Date.now().toString(),
        type: 'critical',
        message: 'Emergency vehicle route activated',
        location: 'All intersections',
        timestamp: new Date(),
        resolved: false
      };
      setAlerts(prev => [emergencyAlert, ...prev]);
    }
  }, [emergencyMode]);

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-600 bg-red-900/20';
      case 'warning': return 'border-amber-600 bg-amber-900/20';
      case 'info': return 'border-cyan-600 bg-cyan-900/20';
      default: return 'border-gray-600 bg-gray-900/20';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning': return <Clock className="h-4 w-4 text-amber-400" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-cyan-400" />;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2 text-amber-400" />
        System Alerts
      </h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${getAlertColor(alert.type)} ${
                alert.resolved ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getAlertIcon(alert.type)}
                    <span className="ml-2 font-medium text-white">{alert.message}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{alert.location}</p>
                  <p className="text-xs text-gray-500">
                    {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}