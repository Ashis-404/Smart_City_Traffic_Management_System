import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // ✅ install needed
import { trafficService } from "../services/trafficService"; // ✅ named import

// ✅ Define a proper type for analytics data
interface AnalyticsData {
  vehicleCounts: number[];
  avgWaitTimes: number[];
  timeLabels: string[];
}

const AdvancedAnalytics = () => {
  // ✅ Fix "never[]" issue by giving state a proper type
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    vehicleCounts: [],
    avgWaitTimes: [],
    timeLabels: []
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await trafficService.getAnalytics(); // assumes your service returns same shape
        setAnalyticsData({
          vehicleCounts: data.vehicleCounts,
          avgWaitTimes: data.avgWaitTimes,
          timeLabels: data.timeLabels
        });
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <motion.div
      className="p-6 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold mb-4">Advanced Traffic Analytics</h2>

      {analyticsData.timeLabels.length === 0 ? (
        <p className="text-gray-500">Loading analytics...</p>
      ) : (
        <div>
          <h3 className="font-semibold mb-2">Vehicle Counts</h3>
          <ul className="mb-4">
            {analyticsData.vehicleCounts.map((count, i) => (
              <li key={i}>
                {analyticsData.timeLabels[i]} : {count}
              </li>
            ))}
          </ul>

          <h3 className="font-semibold mb-2">Average Wait Times</h3>
          <ul>
            {analyticsData.avgWaitTimes.map((time, i) => (
              <li key={i}>
                {analyticsData.timeLabels[i]} : {time} sec
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default AdvancedAnalytics;
