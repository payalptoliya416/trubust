import axios from "axios";

const BASE_URL = 'https://api.truebust.com/api/'

let authToken = localStorage.getItem('authToken') || '';

export const getAuthToken = () => authToken;

const saveAuthTokenToLocalStorage = (token) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const removeAuthTokenFromLocalStorage = () => {
  authToken = '';
  localStorage.removeItem('authToken');
};

export const  fetchLogin = async (data) => {
  try {
    const response = await axios.post(
     `${BASE_URL}admin/login`,
      data,
      { headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      const { token } = response.data;
      saveAuthTokenToLocalStorage(token);
      authToken = token;
      return { success: true, data: response, token };
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Error submitting data:', error);
    throw error;
  }
};