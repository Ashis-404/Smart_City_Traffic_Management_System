import { Shield, Activity, Leaf, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  emergencyMode: boolean;
}

export function Header({ activeTab, setActiveTab, emergencyMode }: HeaderProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'traffic', label: 'Traffic Control', icon: Shield },
    { id: 'environment', label: 'Environment', icon: Leaf },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
  ];

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-cyan-400" />
              <h1 className="text-xl font-bold text-white">SmartTraffic Control</h1>
            </div>
            {emergencyMode && (
              <div className="animate-pulse bg-red-600 px-3 py-1 rounded-full text-sm font-medium">
                EMERGENCY MODE ACTIVE
              </div>
            )}
          </div>
          
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-cyan-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}