import axios from 'axios';

const API_BASE_URL = 'https://devfuad.com/weblocker';

export interface Website {
  locked: boolean;
  unlock_timestamp?: number;
}

export interface ActivityEntry {
  id: number;
  timestamp: string;
  action: string;
  details: string;
  status: 'info' | 'success' | 'error' | 'warning';
}

export interface UserData {
  username: string;
  websites: Record<string, Website>;
  activityLog: ActivityEntry[];
}

export interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalWebsites: number;
  activeWebsites: number;
  recentActivity: ActivityEntry[];
}

export const fetchDashboardStats = async (): Promise<Stats> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data.json`);
    const data = response.data;
    
    // Calculate stats from the data
    const websites = data.websites || {};
    const activeWebsites = Object.values(websites).filter((w: any) => !(w as Website).locked).length;
    
    const stats: Stats = {
      totalUsers: data.totalUsers || 0,
      activeUsers: data.activeUsers || 0,
      totalWebsites: Object.keys(websites).length,
      activeWebsites,
      recentActivity: data.activityLog || []
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const fetchRecentActivity = async (): Promise<ActivityEntry[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data.json`);
    return response.data.activityLog || [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

export const fetchSystemStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data.json`);
    return {
      server: response.data.serverStatus || 'Online',
      database: response.data.databaseStatus || 'Connected',
      api: response.data.apiStatus || 'Operational'
    };
  } catch (error) {
    console.error('Error fetching system status:', error);
    throw error;
  }
};

// Authentication functions
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login.php`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const getUserData = async (username: string): Promise<UserData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user.php`, {
      params: { username }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth.php`);
    return response.data;
  } catch (error) {
    console.error('Error checking authentication:', error);
    throw error;
  }
}; 