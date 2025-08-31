// src/components/AdvancedAnalytics.tsx
import { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import type { Chart as ChartType, ChartOptions } from "chart.js";
import { trafficService } from "../services/trafficService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface IntersectionWaitTimes {
  [key: string]: { data: number[]; name: string };
}

interface AnalyticsData {
  timeLabels: string[];
  vehicleCounts: number[];
  avgWaitTimes: number[];
  efficiencyScores: number[];
  predictions: Array<"optimal" | "congested" | "critical">;
  intersectionWaitTimes: IntersectionWaitTimes;
}

const AdvancedAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    timeLabels: [],
    vehicleCounts: [],
    avgWaitTimes: [],
    efficiencyScores: [],
    predictions: [],
    intersectionWaitTimes: {}
  });
  const trafficFlowRef = useRef<ChartType<"line", any, any> | null>(null);
  const waitTimeRef = useRef<ChartType<"line", any, any> | null>(null);
  const predictionRef = useRef<ChartType<"line", any, any> | null>(null);

  const getIntersectionColor = (id: string) => {
    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
    return colors[parseInt(id) % colors.length];
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const metrics = await trafficService.getMetrics();
        const intersections = await trafficService.getIntersections();
        const currentTime = new Date().toLocaleTimeString();

        const newIntersectionWaitTimes: IntersectionWaitTimes = { ...analyticsData.intersectionWaitTimes };
        intersections.forEach((intersection) => {
          const waitTime =
            (intersection.vehicles / 20) *
            (intersection.status === "optimal" ? 15 : intersection.status === "congested" ? 30 : 45);
          if (!newIntersectionWaitTimes[intersection.id]) {
            newIntersectionWaitTimes[intersection.id] = { data: [], name: intersection.name };
          }
          newIntersectionWaitTimes[intersection.id].data = [
            ...newIntersectionWaitTimes[intersection.id].data,
            waitTime
          ].slice(-10);
        });

        const predictions = intersections.map((i) => i.status as "optimal" | "congested" | "critical");

        setAnalyticsData((prev) => ({
          timeLabels: [...prev.timeLabels, currentTime].slice(-10),
          vehicleCounts: [...prev.vehicleCounts, metrics.totalVehicles].slice(-10),
          avgWaitTimes: intersections.map((i) => (i.vehicles / 20) * 15),
          efficiencyScores: [...prev.efficiencyScores, metrics.signalEfficiency].slice(-10),
          predictions: [...predictions].slice(-10),
          intersectionWaitTimes: newIntersectionWaitTimes
        }));
      } catch (error) {
        console.error("Failed to update analytics:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [analyticsData]);

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: "easeInOutCubic" as const }, // smooth animation
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: {
      x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } },
      y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } }
    }
  };

  // Chart datasets
  const trafficFlowData = {
    labels: analyticsData.timeLabels,
    datasets: [
      {
        label: "Vehicle Count",
        data: analyticsData.vehicleCounts,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Efficiency Score",
        data: analyticsData.efficiencyScores,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const waitTimeData = {
    labels: analyticsData.timeLabels,
    datasets: Object.entries(analyticsData.intersectionWaitTimes).map(([id, data]) => ({
      label: data.name,
      data: data.data,
      borderColor: getIntersectionColor(id),
      backgroundColor: getIntersectionColor(id),
      tension: 0.4,
      fill: false
    }))
  };

  const predictionData = {
    labels: analyticsData.timeLabels,
    datasets: [
      {
        label: "Predicted Traffic",
        data: analyticsData.vehicleCounts.map((v, i) => {
          const p = analyticsData.predictions[i];
          if (p === "optimal") return v * 0.8;
          if (p === "congested") return v * 1.2;
          return v * 1.5;
        }),
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl space-y-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Advanced Traffic Analytics</h2>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Flow */}
        <div className="bg-gray-900 p-4 rounded-lg h-80">
          <h3 className="mb-2 font-semibold">Real-time Traffic Flow</h3>
          <Line ref={trafficFlowRef} data={trafficFlowData} options={chartOptions} />
        </div>

        {/* Wait Times */}
        <div className="bg-gray-900 p-4 rounded-lg h-80">
          <h3 className="mb-2 font-semibold">Intersection Wait Times</h3>
          <Line ref={waitTimeRef} data={waitTimeData} options={chartOptions} />
        </div>
      </div>

      {/* Prediction Chart */}
      <div className="bg-gray-900 p-4 rounded-lg h-96">
        <h3 className="mb-2 font-semibold">Traffic Predictions</h3>
        <Line ref={predictionRef} data={predictionData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
