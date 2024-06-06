import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const getPosts = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/post/all`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const fetchPosts = async (token: string) => {
    try {
      const postsData = await getPosts(token);
      return postsData;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };