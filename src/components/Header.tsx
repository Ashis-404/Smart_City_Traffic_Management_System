import { Shield, Activity, Leaf, AlertTriangle, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  emergencyMode: boolean;
}

export function Header({ activeTab, setActiveTab, emergencyMode }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'traffic', label: 'Traffic Control', icon: Shield },
    { id: 'environment', label: 'Environment', icon: Leaf },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
  ];

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when tab is selected
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-bold text-white">SmartTraffic</h1>
            {emergencyMode && (
              <div className="hidden sm:block animate-pulse bg-red-600 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                EMERGENCY
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden sm:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium ml-1.5">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                      activeTab === tab.id
                        ? 'bg-cyan-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
              {emergencyMode && (
                <div className="sm:hidden animate-pulse bg-red-600 px-3 py-2 rounded-md text-base font-medium text-white">
                  EMERGENCY MODE ACTIVE
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}