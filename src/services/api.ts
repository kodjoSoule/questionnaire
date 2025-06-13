const API_BASE_URL = 'https://api-rogeap.onrender.com/api/v1';
const AUTH_TOKEN = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJocGRAbWlyYWh0ZWMuY29tIiwiaWF0IjoxNzQ4OTQ1MTIxLCJleHAiOjE3NDk3NjE1MjF9.YsB9NhS6zGmuS0zfsEjWS_Pkv20DmLheiaPRPQd8yzYkZE_G1M3Cy4yOxuZ35ECx';

export const apiService = {
  async fetchQuestions() {
    try {
      const response = await fetch(`${API_BASE_URL}/prediagnostic-questions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  async submitResponse(data: FormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/prediagnostic-questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting response:', error);
      throw error;
    }
  },

  async fetchUserResponses(userId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/prediagnostic-questions/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user responses:', error);
      throw error;
    }
  }
};