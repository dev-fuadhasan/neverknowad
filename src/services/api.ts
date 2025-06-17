import axios from 'axios';

// Define environment type
interface ImportMetaEnv {
  PROD: boolean;
  VITE_API_URL?: string;
}

// Define the base URL based on environment
const BASE_URL = (import.meta as any).env.PROD 
  ? 'https://devfuadc.com/weblocker'  // Production URL
  : 'http://localhost/weblocker';     // Development URL

// Dummy data for fallback
const dummyData = {
  users: {
    "user1": {
      username: "user1",
      websites: {
        "example.com": { locked: false },
        "test.com": { locked: true, unlock_timestamp: "2024-02-20T12:00:00Z" }
      },
      activityLog: [
        {
          id: 1,
          timestamp: "2024-02-19T10:00:00Z",
          action: "Website Locked",
          details: "example.com was locked",
          status: "success" as const
        }
      ]
    }
  },
  activityLog: [
    {
      id: 1,
      timestamp: "2024-02-19T10:00:00Z",
      action: "Website Locked",
      details: "example.com was locked by user1",
      status: "success" as const
    }
  ]
};

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
  unlock_timestamp?: string;
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

interface DummyData {
  users: Record<string, UserData>;
  activityLog: ActivityEntry[];
}

// Function to fetch data with fallback
async function fetchWithFallback<T>(endpoint: string, fallbackData: T): Promise<T> {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch ${endpoint}, using fallback data`);
    return fallbackData;
  }
}

export const fetchDashboardStats = async (): Promise<Stats> => {
  try {
    const data = await fetchWithFallback<DummyData>('/data.json', dummyData);
    const websites = data.users ? Object.values(data.users).reduce((acc: Record<string, Website>, user: UserData) => {
      return { ...acc, ...user.websites };
    }, {}) : {};

    return {
      totalUsers: Object.keys(data.users || {}).length,
      activeUsers: Object.keys(data.users || {}).length,
      totalWebsites: Object.keys(websites).length,
      activeWebsites: Object.values(websites).filter((site: Website) => !site.locked).length,
      recentActivity: data.activityLog || []
    };
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
    const data = await fetchWithFallback<DummyData>('/data.json', dummyData);
    return data.activityLog || [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
};

export const fetchSystemStatus = async () => {
  try {
    const response = await api.get('/status.php');
    return response.data;
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
    const data = await fetchWithFallback<DummyData>('/data.json', dummyData);
    return data.users[username] || null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await api.post('/login.php', { username, password });
    return response.data.success;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get('/auth.php');
    return response.data;
  } catch (error) {
    console.error('Error checking authentication:', error);
    throw error;
  }
}; 