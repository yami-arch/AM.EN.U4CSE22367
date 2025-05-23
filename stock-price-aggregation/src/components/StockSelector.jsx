import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, Box } from '@mui/material';
import { getStocks } from '../services/api';



const StockSelector = ({ value, onChange }) => {
  const [stockOptions, setStockOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getStocks();
        if (response && response.stocks) {
          setStockOptions(response.stocks);
          if (!value && Object.values(response.stocks).length > 0) {
            onChange(Object.values(response.stocks)[0]);
          }
        } else {
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
    <FormControl variant="outlined" sx={{ minWidth: 300 }}>
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
  );
};

export default StockSelector; 