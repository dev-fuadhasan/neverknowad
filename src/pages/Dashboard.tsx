import { useState, useEffect } from 'react';
import { Users, Globe, Activity, AlertCircle } from 'lucide-react';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalWebsites: number;
  activeWebsites: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalWebsites: 0,
    activeWebsites: 0,
  });

  // Mock data - In a real app, this would come from an API
  useEffect(() => {
    setStats({
      totalUsers: 150,
      activeUsers: 120,
      totalWebsites: 25,
      activeWebsites: 20,
    });
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Activity,
      color: 'bg-green-500',
    },
    {
      title: 'Total Websites',
      value: stats.totalWebsites,
      icon: Globe,
      color: 'bg-purple-500',
    },
    {
      title: 'Active Websites',
      value: stats.activeWebsites,
      icon: AlertCircle,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow p-6 flex items-center"
            >
              <div
                className={`${stat.color} p-3 rounded-full text-white mr-4`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">Website status updated</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">User profile updated</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Server Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Database Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 