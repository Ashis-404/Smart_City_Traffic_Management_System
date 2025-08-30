import { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TrafficGrid } from './components/TrafficGrid';
import { EnvironmentalMonitoring } from './components/EnvironmentalMonitoring';
import { EmergencyControl } from './components/EmergencyControl';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [emergencyMode, setEmergencyMode] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard emergencyMode={emergencyMode} />;
      case 'traffic':
        return <TrafficGrid emergencyMode={emergencyMode} />;
      case 'environment':
        return <EnvironmentalMonitoring />;
      case 'emergency':
        return <EmergencyControl onEmergencyToggle={setEmergencyMode} />;
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
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;