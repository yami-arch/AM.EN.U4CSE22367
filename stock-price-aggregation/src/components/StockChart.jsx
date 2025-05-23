import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { CircularProgress, Box, Typography } from '@mui/material';

const StockChart = ({ data, loading, stock }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography variant="h6">No data available</Typography>
      </Box>
    );
  }

 
  const average = data.reduce((sum, item) => sum + item.price, 0) / data.length;

 
  const chartData = data.map(item => ({
    ...item,
    time: new Date(item.lastUpdatedAt).toLocaleTimeString(),
    price: Number(item.price.toFixed(2))
  }));

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography variant="h6" gutterBottom>
        {stock} Price History
      </Typography>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#8884d8" 
            dot={false}
            activeDot={{ r: 8 }}
          />
          <ReferenceLine 
            y={average} 
            stroke="red" 
            label={{ 
              value: `Avg: ${average.toFixed(2)}`,
              position: 'right'
            }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StockChart; 