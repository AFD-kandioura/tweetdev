import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const getSelfInfo = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching self info:", error);
    throw error;
  }
};

export const fetchSelfInfo = async (token: string) => {
  try {
    const userData = await getSelfInfo(token);
    return userData;
  } catch (error) {
    console.error("Error fetching self info:", error);
    throw error;
  }
};

export const updateUser = async (token: string, userInfo: any): Promise<any> => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/user/`,
      userInfo, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};