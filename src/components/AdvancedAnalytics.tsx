import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData
} from 'chart.js';
import { trafficService, Intersection } from '../services/trafficService';
import { TrafficPredictionService } from '../services/trafficPredictionService';

// Register Chart.js components
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

interface WaitTimeData {
  intersectionId: string;
  name: string;
  waitTime: number;
}

interface IntersectionData {
  data: number[];
  name: string;
}

interface IntersectionWaitTimes {
  [key: string]: IntersectionData;
}

interface AnalyticsData {
  timeLabels: string[];
  vehicleCounts: number[];
  avgWaitTimes: WaitTimeData[];
  efficiencyScores: number[];
  predictions: Array<'optimal' | 'congested' | 'critical'>;
  intersectionWaitTimes: IntersectionWaitTimes;
}

export function AdvancedAnalytics() {
  const trafficChartRef = useRef<HTMLCanvasElement>(null);
  const waitTimeChartRef = useRef<HTMLCanvasElement>(null);
  const predictionChartRef = useRef<HTMLCanvasElement>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    timeLabels: [],
    vehicleCounts: [],
    avgWaitTimes: [],
    efficiencyScores: [],
    predictions: [],
    intersectionWaitTimes: {}
  });

  // Helper function to calculate wait time based on intersection status and vehicles
  const calculateWaitTime = (intersection: Intersection) => {
    const baseWaitTime = intersection.status === 'optimal' ? 15 :
                        intersection.status === 'congested' ? 30 : 45;
    return baseWaitTime * (intersection.vehicles / 20); // Scale by vehicle count
  };

  // Helper function to get consistent colors for intersections
  const getIntersectionColor = (id: string) => {
    const colors = [
      '#10b981', // emerald
      '#3b82f6', // blue
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899'  // pink
    ];
    return colors[parseInt(id) % colors.length];
  };

  useEffect(() => {
    let trafficChart: ChartJS | null = null;
    let waitTimeChart: ChartJS | null = null;
    let predictionChart: ChartJS | null = null;

    const initializeCharts = () => {
      if (trafficChartRef.current && waitTimeChartRef.current && predictionChartRef.current) {
        // Traffic Flow Chart
        trafficChart = new ChartJS(trafficChartRef.current, {
          type: 'line',
          data: {
            labels: analyticsData.timeLabels,
            datasets: [
              {
                label: 'Vehicle Count',
                data: analyticsData.vehicleCounts,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y'
              },
              {
                label: 'Efficiency Score',
                data: analyticsData.efficiencyScores,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y1'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index'
            },
            plugins: {
              title: {
                display: true,
                text: 'Real-time Traffic Flow Analysis',
                color: '#fff',
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: 20
              },
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: '#fff',
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#374151',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                  label: function(context: any) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += context.dataset.label === 'Vehicle Count' 
                        ? Math.round(context.parsed.y)
                        : Math.round(context.parsed.y) + '%';
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              x: {
                border: {
                  display: true,
                  color: '#4b5563'
                },
                grid: {
                  color: 'rgba(75, 85, 99, 0.2)',
                  display: true
                },
                ticks: {
                  color: '#9ca3af',
                  maxRotation: 45,
                  minRotation: 45,
                  font: {
                    size: 11
                  }
                }
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                border: {
                  display: true,
                  color: '#4b5563'
                },
                grid: {
                  color: 'rgba(75, 85, 99, 0.2)',
                  display: true
                },
                ticks: {
                  color: '#9ca3af',
                  callback: function(value) {
                    return value.toLocaleString();
                  },
                  font: {
                    size: 11
                  }
                },
                title: {
                  display: true,
                  text: 'Vehicle Count',
                  color: '#9ca3af'
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                border: {
                  display: true,
                  color: '#4b5563'
                },
                grid: {
                  color: 'rgba(75, 85, 99, 0.2)',
                  display: false
                },
                ticks: {
                  color: '#9ca3af',
                  callback: function(value) {
                    return value.toLocaleString() + '%';
                  },
                  font: {
                    size: 11
                  }
                },
                title: {
                  display: true,
                  text: 'Efficiency Score',
                  color: '#9ca3af'
                }
              }
            },
            animations: {
              y: {
                duration: 1000,
                easing: 'easeInOutCubic'
              }
            }
          }
        });

        // Traffic Prediction Chart
        predictionChart = new ChartJS(predictionChartRef.current, {
          type: 'line',
          data: {
            labels: analyticsData.timeLabels,
            datasets: [
              {
                label: 'Current Traffic',
                data: analyticsData.vehicleCounts,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
              },
              {
                label: 'Predicted Traffic',
                data: analyticsData.predictions.map(p => {
                  switch(p) {
                    case 'optimal': return analyticsData.vehicleCounts[analyticsData.vehicleCounts.length - 1] * 0.8;
                    case 'congested': return analyticsData.vehicleCounts[analyticsData.vehicleCounts.length - 1] * 1.2;
                    case 'critical': return analyticsData.vehicleCounts[analyticsData.vehicleCounts.length - 1] * 1.5;
                    default: return analyticsData.vehicleCounts[analyticsData.vehicleCounts.length - 1];
                  }
                }),
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 3,
                pointHoverRadius: 5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index'
            },
            plugins: {
              title: {
                display: true,
                text: 'Traffic Level Predictions',
                color: '#fff',
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: 20
              },
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: '#fff',
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#374151',
                borderWidth: 1,
                padding: 12,
                displayColors: true
              }
            },
            scales: {
              x: {
                border: {
                  display: true,
                  color: '#4b5563'
                },
                grid: {
                  color: 'rgba(75, 85, 99, 0.2)',
                  display: true
                },
                ticks: {
                  color: '#9ca3af',
                  font: {
                    size: 11
                  }
                }
              },
              y: {
                border: {
                  display: true,
                  color: '#4b5563'
                },
                grid: {
                  color: 'rgba(75, 85, 99, 0.2)',
                  display: true
                },
                ticks: {
                  color: '#9ca3af',
                  callback: function(value) {
                    return value.toLocaleString();
                  },
                  font: {
                    size: 11
                  }
                },
                title: {
                  display: true,
                  text: 'Vehicle Count',
                  color: '#9ca3af'
                }
              }
            },
            animations: {
              y: {
                duration: 1000,
                easing: 'easeInOutCubic'
              }
            }
          }
        });

        // Wait Time Analysis Chart
        waitTimeChart = new ChartJS(waitTimeChartRef.current, {
          type: 'line',
          data: {
            labels: analyticsData.timeLabels,
            datasets: Object.entries(analyticsData.intersectionWaitTimes).map(([id, data]) => ({
              label: data.name,
              data: data.data,
              borderColor: getIntersectionColor(id),
              backgroundColor: getIntersectionColor(id),
              tension: 0.4,
              fill: false
            }))
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Intersection Wait Time Analysis',
                color: '#fff'
              },
              legend: {
                labels: {
                  color: '#fff'
                }
              }
            },
            scales: {
              y: {
                grid: {
                  color: '#374151'
                },
                ticks: {
                  color: '#9ca3af'
                },
                title: {
                  display: true,
                  text: 'Wait Time (seconds)',
                  color: '#9ca3af'
                }
              },
              x: {
                grid: {
                  color: '#374151'
                },
                ticks: {
                  color: '#9ca3af'
                }
              }
            }
          }
        });
      }
    };

    // Real-time data updates with more frequent updates
    const updateInterval = setInterval(async () => {
      // Add randomization to make the visualization more dynamic
      const randomFactor = Math.random() * 0.2 + 0.9; // Random factor between 0.9 and 1.1
      try {
        const metrics = await trafficService.getMetrics();
        const intersections = await trafficService.getIntersections();
        
        // Store current time values
        const currentHour = new Date().getHours();
        const currentDay = new Date().getDay();

        // Generate sample historical data for each intersection
        const historicalData = Array.from({ length: 24 }, (_, i) => ({
          vehicles: 0,
          avgSpeed: 0,
          timeOfDay: (currentHour - 23 + i + 24) % 24, // Last 24 hours
          dayOfWeek: i < currentHour ? currentDay : (currentDay - 1 + 7) % 7
        }));

        // Update historical data with current values
        historicalData[23] = {
          vehicles: (metrics.totalVehicles / intersections.length) * randomFactor, // Average vehicles per intersection with variation
          avgSpeed: (intersections.reduce((sum, int) => sum + int.avgSpeed, 0) / intersections.length) * randomFactor,
          timeOfDay: currentHour,
          dayOfWeek: currentDay
        };

        // Get traffic predictions
        const predictions = await Promise.all(
          intersections.map(async (intersection) => {
            // Create intersection-specific historical data
            const intersectionHistory = historicalData.map((base, i) => ({
              vehicles: i === 23 ? intersection.vehicles : base.vehicles,
              avgSpeed: i === 23 ? intersection.avgSpeed : base.avgSpeed,
              timeOfDay: base.timeOfDay,
              dayOfWeek: base.dayOfWeek
            }));

            return TrafficPredictionService.predictTrafficStatus(intersectionHistory);
          })
        );

        const currentTime = new Date().toLocaleTimeString();
        
        setAnalyticsData(prev => {
          // Update wait times for each intersection
          const newIntersectionWaitTimes = { ...prev.intersectionWaitTimes };
          
          // Process each intersection's wait time
          intersections.forEach(intersection => {
            const waitTime = calculateWaitTime(intersection);
            if (!newIntersectionWaitTimes[intersection.id]) {
              newIntersectionWaitTimes[intersection.id] = {
                data: [],
                name: intersection.name
              };
            }
            newIntersectionWaitTimes[intersection.id].data = [
              ...newIntersectionWaitTimes[intersection.id].data,
              waitTime
            ].slice(-10);
          });

          return {
            timeLabels: [...prev.timeLabels, currentTime].slice(-10),
            vehicleCounts: [...prev.vehicleCounts, metrics.totalVehicles].slice(-10),
            avgWaitTimes: intersections.map(intersection => ({
              intersectionId: intersection.id,
              name: intersection.name,
              waitTime: calculateWaitTime(intersection)
            })),
            efficiencyScores: [...prev.efficiencyScores, metrics.signalEfficiency].slice(-10),
            predictions: [...prev.predictions, ...predictions].slice(-10),
            intersectionWaitTimes: newIntersectionWaitTimes
          };
        });

        // Update charts
        if (trafficChart && waitTimeChart && predictionChart) {
          trafficChart.update();
          waitTimeChart.update();
          predictionChart.update();
        }
      } catch (error) {
        console.error('Error updating analytics:', error);
      }
    }, 2000); // Update every 2 seconds for smoother visualization

    initializeCharts();

    return () => {
      clearInterval(updateInterval);
      trafficChart?.destroy();
      waitTimeChart?.destroy();
      predictionChart?.destroy();
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Traffic Prediction Chart */}
        <div className="bg-gray-900 rounded-lg p-4">
          <canvas ref={predictionChartRef} />
        </div>
        
        {/* Traffic Flow and Wait Time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real-time Traffic Flow Analysis */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-white">Real-time Traffic Flow Analysis</h3>
              <p className="text-sm text-gray-400">Vehicle count and efficiency metrics updated in real-time</p>
            </div>
            <div className="relative h-[300px]">
              <canvas ref={trafficChartRef} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded p-3">
                <div className="text-sm text-gray-400">Current Vehicle Count</div>
                <div className="text-xl font-semibold text-emerald-400">
                  {analyticsData.vehicleCounts[analyticsData.vehicleCounts.length - 1] || 0}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded p-3">
                <div className="text-sm text-gray-400">Efficiency Score</div>
                <div className="text-xl font-semibold text-blue-400">
                  {analyticsData.efficiencyScores[analyticsData.efficiencyScores.length - 1] || 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Intersection Wait Time Analysis */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-white">Intersection Wait Time Analysis</h3>
              <p className="text-sm text-gray-400">Real-time wait times across all intersections</p>
            </div>
            <div className="relative h-[300px]">
              <canvas ref={waitTimeChartRef} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {analyticsData.avgWaitTimes.slice(0, 2).map((data) => (
                <div key={data.intersectionId} className="bg-gray-800/50 rounded p-3">
                  <div className="text-sm text-gray-400 truncate">{data.name}</div>
                  <div style={{ color: getIntersectionColor(data.intersectionId) }} className="text-xl font-semibold">
                    {Math.round(data.waitTime)}s
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Predictions Panel */}
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Traffic Predictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.predictions.map((prediction, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                prediction === 'optimal'
                  ? 'bg-emerald-900/50'
                  : prediction === 'congested'
                  ? 'bg-amber-900/50'
                  : 'bg-red-900/50'
              }`}
            >
              <div className="text-sm text-gray-300">
                Intersection {index + 1}
              </div>
              <div className="text-lg font-semibold text-white capitalize">
                {prediction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
