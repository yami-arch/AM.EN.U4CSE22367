import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service';

const credentials = {
  email: "nikhil.mishra6575@gmail.com",
  name: "nikhil kumar mishra",
  rollNo: "am.en.u4cse22367",
  accessCode: "SwuuKE",
  clientID: "2e9c2716-5b64-4532-8974-c5ac51f769bc",
  clientSecret: "JGgPcuQDbEKnPkcA"
};

const getAccessToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth`, credentials);
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw error;
  }
};

const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
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