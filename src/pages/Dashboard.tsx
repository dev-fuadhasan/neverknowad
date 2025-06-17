import { useEffect, useState } from 'react';
import { fetchDashboardStats, fetchSystemStatus, fetchRecentActivity, ActivityEntry } from '../services/api';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalWebsites: number;
  activeWebsites: number;
  recentActivity: ActivityEntry[];
}

interface SystemStatus {
  server: string;
  database: string;
  api: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalWebsites: 0,
    activeWebsites: 0,
    recentActivity: []
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    server: 'Checking...',
    database: 'Checking...',
    api: 'Checking...'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, statusData, activityData] = await Promise.all([
          fetchDashboardStats(),
          fetchSystemStatus(),
          fetchRecentActivity()
        ]);
        
        setStats({
          ...statsData,
          recentActivity: activityData
        });
        setSystemStatus(statusData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Users</h3>
          <p className="text-2xl font-bold">{stats.activeUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Websites</h3>
          <p className="text-2xl font-bold">{stats.totalWebsites}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Websites</h3>
          <p className="text-2xl font-bold">{stats.activeWebsites}</p>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-gray-500 text-sm">Server</h3>
            <p className={`font-bold ${systemStatus.server === 'Online' ? 'text-green-500' : 'text-red-500'}`}>
              {systemStatus.server}
            </p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Database</h3>
            <p className={`font-bold ${systemStatus.database === 'Connected' ? 'text-green-500' : 'text-red-500'}`}>
              {systemStatus.database}
            </p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">API</h3>
            <p className={`font-bold ${systemStatus.api === 'Operational' ? 'text-green-500' : 'text-red-500'}`}>
              {systemStatus.api}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats.recentActivity.map((activity) => (
            <div key={activity.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.details}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  activity.status === 'success' ? 'bg-green-100 text-green-800' :
                  activity.status === 'error' ? 'bg-red-100 text-red-800' :
                  activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {activity.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 