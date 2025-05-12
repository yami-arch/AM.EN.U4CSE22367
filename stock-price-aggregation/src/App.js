import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import StockPage from './pages/StockPage';
import HeatmapPage from './pages/HeatmapPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Stock Price Aggregation
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Stock Chart
            </Button>
            <Button color="inherit" component={Link} to="/heatmap">
              Correlation Heatmap
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl">
          <Box sx={{ mt: 3 }}>
            <Routes>
              <Route path="/" element={<StockPage />} />
              <Route path="/heatmap" element={<HeatmapPage />} />
            </Routes>
          </Box>
        </Container>
      </div>
    </Router>
  );
}

export default App;
