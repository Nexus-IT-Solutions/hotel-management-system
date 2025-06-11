import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Bed,
  DollarSignIcon,
  CalendarMinus2,
 } from 'lucide-react';

// Icon map for dynamic rendering
const iconMap: Record<string, React.ComponentType<any>> = {
  CalendarDays,
  Bed,
  DollarSignIcon,
  CalendarMinus2,
};

interface StatItem {
  title: string;
  value: string;
  change: string;
  changeColor: string;
  description: string;
  borderColor: string;
  iconBg: string;
  iconName: string; // name of the icon to match the iconMap key
}

export default function DashboardStat() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with your actual backend API URL
    fetch('./dashboardstat.json')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center">Loading dashboard...</p>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.iconName] || CalendarDays; // fallback
        return (
          <div
            key={index}
            className={`bg-white shadow-md rounded-xl px-6 py-3 flex items-center gap-5 border-b-4 ${stat.borderColor}`}
          >
            <div className='flex-2'>
              <p className='text-[14px]'>{stat.title}</p>
              <p className='text-3xl font-bold py-2'>{stat.value}</p>
              <p className={`text-sm ${stat.changeColor}`}>{stat.change}</p>
              <p className='text-sm text-gray-600 mt-1'>{stat.description}</p>
            </div>
            <div>
              <p className={`${stat.iconBg} w-12 h-12 rounded-md flex items-center justify-center`}>
                <IconComponent className='w-8 h-8 text-white' />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
