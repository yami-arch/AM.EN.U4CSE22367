import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';
import TimeIntervalSelector from '../components/TimeIntervalSelector';
import StockSelector from '../components/StockSelector';
import StockChart from '../components/StockChart';
import { getStockPriceHistory } from '../services/api';

const StockPage = () => {
  // Set initial stock to AAPL (Apple Inc.)
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [interval, setInterval] = useState(30);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedStock) return;
    
    const fetchPriceHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStockPriceHistory(selectedStock, interval);
        setPriceHistory(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError('Failed to fetch price history. Please try again later.');
        console.error('Error fetching price history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPriceHistory();
  }, [selectedStock, interval]);

  const handleStockChange = (newStock) => {
    console.log('Selected stock:', newStock); // Debug log
    setSelectedStock(newStock);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stock Price Chart
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
        <TimeIntervalSelector value={interval} onChange={setInterval} />
        <StockSelector
          value={selectedStock}
          onChange={handleStockChange}
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <StockChart
          data={priceHistory}
          loading={loading}
          stock={selectedStock}
        />
      </Paper>
    </Box>
  );
};

export default StockPage; 