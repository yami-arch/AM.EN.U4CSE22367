// Calculate mean of an array
const mean = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length;

// Calculate standard deviation
const stdDev = (arr) => {
  const avg = mean(arr);
  const squareDiffs = arr.map(value => {
    const diff = value - avg;
    return diff * diff;
  });
  return Math.sqrt(mean(squareDiffs));
};

// Calculate covariance between two arrays
const covariance = (arr1, arr2) => {
  const mean1 = mean(arr1);
  const mean2 = mean(arr2);
  const sum = arr1.reduce((acc, val, i) => {
    return acc + (val - mean1) * (arr2[i] - mean2);
  }, 0);
  return sum / (arr1.length - 1);
};

// Calculate Pearson's correlation coefficient
const pearsonCorrelation = (arr1, arr2) => {
  const cov = covariance(arr1, arr2);
  const std1 = stdDev(arr1);
  const std2 = stdDev(arr2);
  return cov / (std1 * std2);
};

// Time-align price data using nearest timestamp
const alignPriceData = (priceData) => {
  // Get all unique timestamps
  const allTimestamps = new Set();
  priceData.forEach(stock => {
    stock.prices.forEach(price => {
      allTimestamps.add(price.lastUpdatedAt);
    });
  });
  
  const sortedTimestamps = Array.from(allTimestamps).sort();
  
  // For each stock, create a map of aligned prices
  return priceData.map(stock => {
    const priceMap = new Map(stock.prices.map(p => [p.lastUpdatedAt, p.price]));
    const alignedPrices = sortedTimestamps.map(timestamp => {
      // Find the nearest timestamp with a price
      let nearestPrice = null;
      let minDiff = Infinity;
      
      for (const [t, price] of priceMap.entries()) {
        const diff = Math.abs(new Date(t) - new Date(timestamp));
        if (diff < minDiff) {
          minDiff = diff;
          nearestPrice = price;
        }
      }
      
      return {
        timestamp,
        price: nearestPrice
      };
    });
    
    return {
      ticker: stock.ticker,
      prices: alignedPrices
    };
  });
};

// Calculate correlation matrix
export const calculateCorrelationMatrix = (priceData) => {
  // First align the price data
  const alignedData = alignPriceData(priceData);
  
  // Extract just the price arrays
  const priceArrays = alignedData.map(stock => 
    stock.prices.map(p => p.price).filter(p => p !== null)
  );
  
  // Calculate correlation matrix
  const correlationMatrix = priceArrays.map((prices1, i) => 
    priceArrays.map((prices2, j) => {
      if (i === j) return 1; // Correlation with self is 1
      return pearsonCorrelation(prices1, prices2);
    })
  );
  
  // Calculate statistics for each stock
  const statistics = alignedData.map(stock => ({
    ticker: stock.ticker,
    mean: mean(stock.prices.map(p => p.price).filter(p => p !== null)),
    stdDev: stdDev(stock.prices.map(p => p.price).filter(p => p !== null))
  }));
  
  return {
    matrix: correlationMatrix,
    tickers: alignedData.map(stock => stock.ticker),
    statistics
  };
}; 