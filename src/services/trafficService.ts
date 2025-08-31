// src/services/trafficService.ts

export interface Intersection {
  id: string;
  name: string;
  vehicles: number;
  status: "optimal" | "congested" | "critical";
  avgSpeed: number;
}

export interface Metrics {
  totalVehicles: number;
  signalEfficiency: number;
}

export const trafficService = {
  // Return current metrics
  getMetrics: async (): Promise<Metrics> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Mocked metrics data
    return {
      totalVehicles: Math.floor(Math.random() * 100) + 20,
      signalEfficiency: Math.floor(Math.random() * 100)
    };
  },

  // Return list of intersections
  getIntersections: async (): Promise<Intersection[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const statuses: Intersection["status"][] = ["optimal", "congested", "critical"];
    const intersections: Intersection[] = Array.from({ length: 6 }, (_, i) => ({
      id: i.toString(),
      name: `Intersection ${i + 1}`,
      vehicles: Math.floor(Math.random() * 50) + 5,
      avgSpeed: Math.floor(Math.random() * 60) + 20,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));

    return intersections;
  },

  // Optional: Return analytics for chart initialization
  getAnalytics: async (): Promise<{
    timeLabels: string[];
    vehicleCounts: number[];
    avgWaitTimes: number[];
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const timeLabels = Array.from({ length: 10 }, (_, i) => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - (10 - i) * 2); // last 20 minutes
      return d.toLocaleTimeString();
    });

    const vehicleCounts = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 20);
    const avgWaitTimes = Array.from({ length: 10 }, () => Math.floor(Math.random() * 60) + 10);

    return { timeLabels, vehicleCounts, avgWaitTimes };
  }
};
