import axios from 'axios';

const BASE_URL = '/evaluation-service';



let accessToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
  try {
   
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

   
    accessToken = "beTJjJ";
    tokenExpiry = new Date(Date.now() + 3600000); 
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

export const getAllStockPrices = async (minutes = 30) => {
  try {
    const token = await getAccessToken();
    const axiosInstance = createAxiosInstance(token);
    console.log('Fetching all stock prices...');
    
    // First get the list of stocks
    const stocksResponse = await axiosInstance.get('/stocks');
    const stocks = stocksResponse.data.stocks;
    
    // Then fetch price history for each stock
    const pricePromises = Object.values(stocks).map(ticker => 
      axiosInstance.get(`/stocks/${ticker}?minutes=${minutes}`)
        .then(response => ({
          ticker,
          prices: response.data
        }))
        .catch(error => {
          console.error(`Error fetching prices for ${ticker}:`, error);
          return {
            ticker,
            prices: []
          };
        })
    );

    const results = await Promise.all(pricePromises);
    return results;
  } catch (error) {
    console.error('Error fetching all stock prices:', error);
    throw error;
  }
};