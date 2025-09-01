import React, { useState } from 'react';
import { Shield, Activity, Leaf, AlertTriangle, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  emergencyMode: boolean;
}

export function Header({ activeTab, setActiveTab, emergencyMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'traffic', label: 'Traffic Control', icon: Shield },
    { id: 'environment', label: 'Environment', icon: Leaf },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
    
  ];

  return (
    <header className="bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Emergency Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Shield className="h-8 w-8 text-cyan-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                SmartTraffic Control
              </h1>
            </div>
            
            {emergencyMode && (
              <div className="relative overflow-hidden hidden sm:block">
                <div className="animate-pulse bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <span>EMERGENCY MODE ACTIVE</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-red-600/30 rounded-full blur-sm animate-pulse"></div>
              </div>
            )}
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50 backdrop-blur-sm'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className={`h-4 w-4 transition-all duration-300 ${
                    activeTab === tab.id ? 'animate-pulse' : 'group-hover:scale-110'
                  }`} />
                  <span className="text-xs lg:text-sm font-medium hidden lg:inline">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-cyan-600/20 rounded-xl blur-md"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <nav className="py-4 space-y-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)'
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Emergency Mode Mobile Indicator */}
      {emergencyMode && (
        <div className="sm:hidden bg-red-600 px-4 py-2 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="text-sm font-bold">EMERGENCY MODE ACTIVE</span>
          </div>
        </div>
      )}
    </header>
  );
}