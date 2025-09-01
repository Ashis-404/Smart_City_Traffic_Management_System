import { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TrafficGrid } from './components/TrafficGrid';
import { EnvironmentalMonitoring } from './components/EnvironmentalMonitoring';
import { EmergencyControl } from './components/EmergencyControl';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [emergencyRoute, setEmergencyRoute] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard emergencyMode={emergencyMode} />;
      case 'traffic':
        return <TrafficGrid emergencyMode={emergencyMode} emergencyRoute={emergencyRoute} />;
      case 'environment':
        return <EnvironmentalMonitoring />;
      case 'emergency':
        return <EmergencyControl onEmergencyToggle={(active, route) => {
          setEmergencyMode(active);
          setEmergencyRoute(route || '');
        }} />;
      default:
        return <Dashboard emergencyMode={emergencyMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        emergencyMode={emergencyMode}
      />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-full lg:max-w-7xl">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;