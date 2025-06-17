import axios from 'axios';

// Define environment type
interface ImportMetaEnv {
  PROD: boolean;
  VITE_API_URL?: string;
}

// Define the base URL based on environment
const BASE_URL = (import.meta as { env: ImportMetaEnv }).env.PROD 
  ? 'https://devfuadc.com/weblocker'  // Production URL
  : 'http://localhost/weblocker';     // Development URL

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

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

// Function to make API calls
async function makeApiCall<T>(endpoint: string, data?: any): Promise<T> {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
}

export const fetchDashboardStats = async (): Promise<Stats> => {
  try {
    const data = await makeApiCall<{ success: boolean; stats: Stats }>('stats.php');
    if (data.success) {
      return data.stats;
    }
    throw new Error('Failed to fetch dashboard stats');
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalWebsites: 0,
      activeWebsites: 0,
      recentActivity: []
    };
  }
};

export const fetchRecentActivity = async (): Promise<ActivityEntry[]> => {
  try {
    const data = await makeApiCall<{ success: boolean; activity: ActivityEntry[] }>('activity.php');
    if (data.success) {
      return data.activity;
    }
    throw new Error('Failed to fetch recent activity');
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
};

export const fetchSystemStatus = async () => {
  try {
    const data = await makeApiCall<{ success: boolean; status: { server: string; database: string; api: string } }>('status.php');
    if (data.success) {
      return data.status;
    }
    throw new Error('Failed to fetch system status');
  } catch (error) {
    console.warn('Failed to fetch system status, using default values');
    return {
      server: 'Online',
      database: 'Connected',
      api: 'Operational'
    };
  }
};

export const getUserData = async (username: string): Promise<UserData | null> => {
  try {
    const data = await makeApiCall<{ success: boolean; user: UserData }>('user.php', { username });
    if (data.success) {
      return data.user;
    }
    throw new Error('Failed to fetch user data');
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const data = await makeApiCall<{ success: boolean; message?: string }>('login.php', { username, password });
    if (data.success) {
      return true;
    }
    throw new Error(data.message || 'Login failed');
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}; 