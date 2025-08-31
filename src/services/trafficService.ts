// src/services/trafficService.ts

// Define the response structure for analytics
interface AnalyticsResponse {
  vehicleCounts: number[];
  avgWaitTimes: number[];
  timeLabels: string[];
}

// Example service object with named export
export const trafficService = {
  async getAnalytics(): Promise<AnalyticsResponse> {
    try {
      // 👉 Replace with your real API call if available
      // Example using fetch:
      // const res = await fetch("/api/analytics");
      // const data = await res.json();
      // return data;

      // Mock Data (for testing without backend)
      return {
        vehicleCounts: [120, 150, 180, 200],
        avgWaitTimes: [30, 25, 28, 22],
        timeLabels: ["8 AM", "9 AM", "10 AM", "11 AM"]
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return {
        vehicleCounts: [],
        avgWaitTimes: [],
        timeLabels: []
      };
    }
  }
};
