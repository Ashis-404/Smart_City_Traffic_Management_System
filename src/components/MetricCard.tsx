import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'cyan' | 'amber' | 'emerald' | 'red';
  trend?: string;
}

export function MetricCard({ title, value, icon: Icon, color, trend }: MetricCardProps) {
  const colorClasses = {
    cyan: 'from-cyan-600 to-cyan-800 text-cyan-400',
    amber: 'from-amber-600 to-amber-800 text-amber-400',
    emerald: 'from-emerald-600 to-emerald-800 text-emerald-400',
    red: 'from-red-600 to-red-800 text-red-400'
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1 transition-all duration-500">{value}</p>
      </div>
    </div>
  );
}