import axios from 'axios';

const BASE_URL = '/evaluation-service';

const credentials = {
  email: "nikhil.mishra6575@gmail.com",
  name: "nikhil kumar mishra",
  rollNo: "am.en.u4cse22367",
  accessCode: "SwuuKE",
  clientID: "2e9c2716-5b64-4532-8974-c5ac51f769bc",
  clientSecret: "JGgPcuQDbEKnPkcA"
};

let accessToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
  try {
    // Check if we have a valid token
    if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
      return accessToken;
    }

    console.log('Requesting new access token...');
    const response = await axios.post(`${BASE_URL}/auth`, credentials, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Auth response:', response.data);
    
    if (!response.data || !response.data.access_token) {
      throw new Error('Invalid auth response: No access token received');
    }

    // Store the token and set expiry to 1 hour from now
    accessToken = response.data.access_token;
    tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    return accessToken;
  } catch (error) {
    console.error('Auth Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 10000, // 10 second timeout
  });
};

export const getStocks = async () => {
  try {
    const token = await getAccessToken();
    const axiosInstance = createAxiosInstance(token);
    console.log('Making API call to get stocks...');
    const res = await axiosInstance.get('/stocks');
    console.log('API Response:', res.data);
    return res.data;
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw error;
  }
};

export const getStockPriceHistory = async (ticker, minutes = 30) => {
  try {
    const token = await getAccessToken();
    const axiosInstance = createAxiosInstance(token);
    console.log(`Fetching price history for ${ticker}...`);
    const res = await axiosInstance.get(`/stocks/${ticker}?minutes=${minutes}`);
    console.log('Price History Response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Price History Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      ticker,
      minutes
    });
    throw error;
  }
};