import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'http://localhost:5000/api/traffic';
const socket = io('http://localhost:5000');

export interface Intersection {
  id: string;
  name: string;
  status: 'optimal' | 'congested' | 'critical';
  vehicles: number;
  avgSpeed: number;
  signalPhase: 'horizontal' | 'vertical';
  cycleLength: number;
  controlMode: 'adaptive' | 'manual';
}

export interface TrafficMetrics {
  totalVehicles: number;
  avgWaitTime: number;
  signalEfficiency: number;
  emissionReduction: number;
}

export const trafficService = {
  // Real-time updates
  subscribeToUpdates: (callback: (data: { intersections: Intersection[]; metrics: TrafficMetrics }) => void) => {
    socket.on('trafficUpdate', callback);
    return () => {
      socket.off('trafficUpdate', callback);
    };
  },

  // Fetch all intersections
  getIntersections: async (): Promise<Intersection[]> => {
    const response = await axios.get(`${API_URL}/intersections`);
    return response.data;
  },

  // Update intersection control mode
  updateControlMode: async (
    intersectionId: string,
    mode: 'adaptive' | 'manual',
    signalPhase?: 'horizontal' | 'vertical'
  ) => {
    const response = await axios.put(`${API_URL}/intersections/${intersectionId}/mode`, {
      mode,
      signalPhase
    });
    return response.data;
  },

  // Get latest traffic metrics
  getMetrics: async (): Promise<TrafficMetrics> => {
    const response = await axios.get(`${API_URL}/metrics`);
    return response.data;
  },

  // Set emergency mode
  setEmergencyMode: async (active: boolean) => {
    const response = await axios.post(`${API_URL}/emergency`, { active });
    return response.data;
  },

  // Disconnect WebSocket
  disconnect: () => {
    socket.disconnect();
  }
};
