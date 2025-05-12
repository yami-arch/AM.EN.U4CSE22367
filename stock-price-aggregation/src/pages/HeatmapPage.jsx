import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Tooltip } from '@mui/material';
import { getAllStockPrices } from '../services/api';
import { calculateCorrelationMatrix } from '../utils/correlation';

const HeatmapPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const priceData = await getAllStockPrices(30); // 30 minutes of data
        const correlationMatrix = calculateCorrelationMatrix(priceData);
        setCorrelationData(correlationMatrix);
      } catch (err) {
        setError('Failed to fetch correlation data. Please try again later.');
        console.error('Error fetching correlation data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getColor = (correlation) => {
    // Convert correlation (-1 to 1) to a color between red and green
    const normalizedCorrelation = (correlation + 1) / 2; // Convert to 0-1 range
    const hue = normalizedCorrelation * 120; // 0 is red, 120 is green
    return `hsl(${hue}, 70%, 50%)`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!correlationData) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stock Correlation Heatmap
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Color Legend: Red (-1) → White (0) → Green (+1)
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${correlationData.tickers.length + 1}, 1fr)`,
          gap: 1,
          mt: 2
        }}>
          {/* Header row */}
          <Box sx={{ p: 1, fontWeight: 'bold' }}></Box>
          {correlationData.tickers.map(ticker => (
            <Box key={ticker} sx={{ p: 1, fontWeight: 'bold', textAlign: 'center' }}>
              {ticker}
            </Box>
          ))}

          {/* Matrix cells */}
          {correlationData.matrix.map((row, i) => (
            <React.Fragment key={correlationData.tickers[i]}>
              <Box sx={{ p: 1, fontWeight: 'bold' }}>
                {correlationData.tickers[i]}
              </Box>
              {row.map((correlation, j) => {
                const stats = correlationData.statistics[j];
                return (
                  <Tooltip
                    key={`${i}-${j}`}
                    title={
                      <Box>
                        <Typography variant="subtitle2">
                          {correlationData.tickers[i]} vs {correlationData.tickers[j]}
                        </Typography>
                        <Typography variant="body2">
                          Correlation: {correlation.toFixed(3)}
                        </Typography>
                        <Typography variant="body2">
                          {correlationData.tickers[j]} Stats:
                        </Typography>
                        <Typography variant="body2">
                          Mean: ${stats.mean.toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          Std Dev: ${stats.stdDev.toFixed(2)}
                        </Typography>
                      </Box>
                    }
                  >
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: getColor(correlation),
                        color: Math.abs(correlation) > 0.5 ? 'white' : 'black',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          zIndex: 1
                        }
                      }}
                    >
                      {correlation.toFixed(2)}
                    </Box>
                  </Tooltip>
                );
              })}
            </React.Fragment>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default HeatmapPage; 