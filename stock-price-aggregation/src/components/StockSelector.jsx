import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, Box, Typography } from '@mui/material';
import { getStocks, getStockPriceHistory } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fallbackStocks = {
  "Advanced Micro Devices, Inc.": "AMD",
  "Alphabet Inc. Class A": "GOOGL",
  "Alphabet Inc. Class C": "GOOG",
  "Amazon.com, Inc.": "AMZN",
  "Amgen Inc.": "AMGN",
  "Apple Inc.": "AAPL",
  "Berkshire Hathaway Inc.": "BRKB",
  "Booking Holdings Inc.": "BKNG",
  "Broadcom Inc.": "AVGO",
  "CSX Corporation": "CSX",
  "Eli Lilly and Company": "LLY",
  "Marriott International, Inc.": "MAR",
  "Marvell Technology, Inc.": "MRVL",
  "Meta Platforms, Inc.": "META",
  "Microsoft Corporation": "MSFT",
  "PayPal Holdings, Inc.": "PYPL",
  "TSMC": "2330TW",
  "Tesla, Inc.": "TSLA",
  "Visa Inc.": "V"
};

const StockSelector = ({ value, onChange }) => {
  const [stockOptions, setStockOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getStocks();
        console.log('Stocks API Response:', response);
        if (response && response.stocks) {
          setStockOptions(response.stocks);
          if (!value && Object.values(response.stocks).length > 0) {
            onChange(Object.values(response.stocks)[0]);
          }
        } else {
          console.log('Using fallback stocks');
          setStockOptions(fallbackStocks);
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
        setStockOptions(fallbackStocks);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      if (!value) {
        console.log('No stock selected, skipping price history fetch');
        return;
      }
      
      try {
        setLoadingHistory(true);
        setError(null);
        console.log('Fetching price history for:', value);
        const history = await getStockPriceHistory(value);
        console.log('Raw price history response:', history);
        
        // Handle different possible response formats
        let processedHistory = [];
        if (Array.isArray(history)) {
          processedHistory = history;
        } else if (history && typeof history === 'object') {
          if (Array.isArray(history.data)) {
            processedHistory = history.data;
          } else if (Array.isArray(history.prices)) {
            processedHistory = history.prices;
          } else {
            console.error('Unexpected history format:', history);
            setError('Invalid price history data format');
            return;
          }
        }

        console.log('Processed price history:', processedHistory);
        
        if (processedHistory.length === 0) {
          setError('No price history data available');
        } else {
          setPriceHistory(processedHistory);
        }
      } catch (error) {
        console.error('Error fetching price history:', error);
        setError(`Failed to load price history: ${error.message}`);
        setPriceHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchPriceHistory();
  }, [value]);

  if (loading) {
    return (
      <FormControl variant="outlined" sx={{ minWidth: 300 }}>
        <InputLabel id="stock-selector-label">Loading stocks...</InputLabel>
        <Select
          labelId="stock-selector-label"
          id="stock-selector"
          value=""
          label="Loading stocks..."
          disabled
        >
          <MenuItem value="">
            <CircularProgress size={20} />
          </MenuItem>
        </Select>
      </FormControl>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl variant="outlined" sx={{ minWidth: 300, mb: 3 }}>
        <InputLabel id="stock-selector-label">Select Stock</InputLabel>
        <Select
          labelId="stock-selector-label"
          id="stock-selector"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          label="Select Stock"
        >
          {Object.entries(stockOptions).map(([name, ticker]) => (
            <MenuItem key={ticker} value={ticker}>
              {name} ({ticker})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loadingHistory ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : priceHistory && priceHistory.length > 0 ? (
        <Box sx={{ width: '100%', height: 400, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Price History for {value}
          </Typography>
          <ResponsiveContainer>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="lastUpdatedAt" 
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip 
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#8884d8" 
                dot={true}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : (
        <Typography sx={{ mt: 2 }}>
          No price history data available
        </Typography>
      )}
    </Box>
  );
};

export default StockSelector; 