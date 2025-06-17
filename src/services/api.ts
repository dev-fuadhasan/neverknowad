import axios from 'axios';

const API_BASE_URL = 'https://devfuad.com/weblocker';

export interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalWebsites: number;
  activeWebsites: number;
}

export const fetchDashboardStats = async (): Promise<Stats> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const fetchRecentActivity = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data.json`);
    return response.data.activities || [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

export const fetchSystemStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data.json`);
    return response.data.systemStatus || {
      server: 'Online',
      database: 'Connected',
      api: 'Operational'
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

export const getUserData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user.php`);
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