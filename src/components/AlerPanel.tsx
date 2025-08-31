import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, X, BellRing, Activity } from 'lucide-react';
import './AlertPanel.css';

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
  priority: number; // 1 (highest) to 3 (lowest)
  category: 'traffic' | 'system' | 'emergency' | 'maintenance';
}

export function AlertPanel({ emergencyMode }: AlertPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);

  // Initialize with some alerts
  useEffect(() => {
    const initialAlerts: Alert[] = [
      {
        id: '1',
        type: 'critical',
        message: 'Heavy congestion detected',
        location: 'Market St & Union Ave',
        timestamp: new Date(Date.now() - 5 * 60000),
        resolved: false,
        priority: 1,
        category: 'traffic'
      },
      {
        id: '2',
        type: 'warning',
        message: 'Sensor maintenance required',
        location: 'Park Blvd & Oak St',
        timestamp: new Date(Date.now() - 15 * 60000),
        resolved: false,
        priority: 2,
        category: 'maintenance'
      },
      {
        id: '3',
        type: 'info',
        message: 'Emergency vehicle cleared',
        location: 'Central Ave & 5th St',
        timestamp: new Date(Date.now() - 8 * 60000),
        resolved: true,
        priority: 3,
        category: 'emergency'
      }
    ];
    setAlerts(initialAlerts);
  }, []);

  // Auto-generate alerts based on emergencyMode
  useEffect(() => {
    if (emergencyMode) {
      const emergencyAlert: Alert = {
        id: Date.now().toString(),
        type: 'critical',
        message: 'Emergency vehicle route activated',
        location: 'All intersections',
        timestamp: new Date(),
        resolved: false,
        priority: 1,
        category: 'emergency'
      };
      setAlerts(prev => [emergencyAlert, ...prev]);
    }
  }, [emergencyMode]);

  // Simulate random alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAlert: Alert = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'warning' : 'info',
        message: getRandomMessage(),
        location: getRandomLocation(),
        timestamp: new Date(),
        resolved: false,
        priority: Math.ceil(Math.random() * 3),
        category: getRandomCategory()
      };

      if (Math.random() > 0.7) { // 30% chance to add new alert
        setAlerts(prev => [randomAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRandomMessage = () => {
    const messages = [
      'Traffic congestion detected',
      'Signal malfunction',
      'Sensor data anomaly',
      'Maintenance check required',
      'Weather alert: reduced visibility',
      'Road work ahead',
      'System update required',
      'Battery backup activated',
      'Network latency detected'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRandomLocation = () => {
    const locations = [
      'Main St & Broadway',
      'Central Ave & 5th St',
      'Park Blvd & Oak St',
      'Market St & Union Ave',
      'River Rd & Pine St',
      'Downtown Hub'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getRandomCategory = (): Alert['category'] => {
    const categories: Alert['category'][] = ['traffic', 'system', 'emergency', 'maintenance'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getCategoryIcon = (category: Alert['category']) => {
    switch (category) {
      case 'traffic': return <AlertTriangle className="h-4 w-4 text-cyan-400" />;
      case 'system': return <Activity className="h-4 w-4 text-purple-400" />;
      case 'emergency': return <BellRing className="h-4 w-4 text-red-400" />;
      case 'maintenance': return <Clock className="h-4 w-4 text-amber-400" />;
    }
  };

  const getAlertColor = (type: string, priority: number) => {
    const baseColors = {
      critical: 'border-red-600 bg-red-900/20',
      warning: 'border-amber-600 bg-amber-900/20',
      info: 'border-cyan-600 bg-cyan-900/20'
    };

    const priorityClasses = {
      1: 'ring-2 ring-red-500/50',
      2: 'ring-1 ring-amber-500/50',
      3: ''
    };

    return `${baseColors[type as keyof typeof baseColors]} ${priorityClasses[priority as keyof typeof priorityClasses]}`;
  };

  // Filter alerts based on current filter and showResolved state
  const filteredAlerts = alerts
    .filter(alert => filter === 'all' || alert.category === filter)
    .filter(alert => {
      if (showResolved) {
        return alert.resolved; // Show only resolved alerts when showResolved is true
      } else {
        return !alert.resolved; // Show only unresolved alerts when showResolved is false
      }
    })
    .sort((a, b) => {
      // Sort by priority first
      if (a.priority !== b.priority) return a.priority - b.priority;
      // Then by timestamp
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-400" />
          System Alerts
        </h2>
        <div className="flex items-center space-x-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-700 text-white border-none rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-cyan-500"
            aria-label="Filter alerts by category"
            title="Filter alerts by category"
          >
            <option value="all">All Categories</option>
            <option value="traffic">Traffic</option>
            <option value="system">System</option>
            <option value="emergency">Emergency</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button
            onClick={() => setShowResolved(!showResolved)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center space-x-1 ${
              showResolved ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={showResolved ? "Showing resolved alerts" : "Show resolved alerts"}
          >
            <CheckCircle className={`h-4 w-4 ${showResolved ? 'text-white' : 'text-emerald-400'}`} />
            <span>{showResolved ? 'Showing Resolved' : 'Show Resolved'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 flex-1 alerts-container custom-scrollbar">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <p>
              {showResolved 
                ? 'No resolved alerts to show' 
                : filter === 'all' 
                  ? 'No active alerts' 
                  : `No active ${filter} alerts`}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${getAlertColor(alert.type, alert.priority)} ${
                alert.resolved ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(alert.category)}
                    <span className="font-medium text-white">{alert.message}</span>
                    {alert.priority === 1 && (
                      <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{alert.location}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                      {alert.category}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 rounded-full hover:bg-emerald-400/10"
                      title="Mark as resolved"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-400/10"
                    title="Delete alert"
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