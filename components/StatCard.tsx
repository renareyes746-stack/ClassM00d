import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, colorClass = "bg-white" }) => {
  return (
    <div className={`p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${colorClass}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
        </div>
        <div className="p-3 bg-white/50 rounded-xl backdrop-blur-sm text-brand-600 shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;