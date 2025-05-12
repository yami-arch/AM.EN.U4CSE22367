import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TimeIntervalSelector = ({ value, onChange }) => {
  const handleChange = (event) => {
    onChange(Number(event.target.value));
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
      <InputLabel id="time-interval-label">Time Interval</InputLabel>
      <Select
        labelId="time-interval-label"
        id="time-interval"
        value={value}
        onChange={handleChange}
        label="Time Interval"
      >
        <MenuItem value={10}>10m</MenuItem>
        <MenuItem value={30}>30m</MenuItem>
        <MenuItem value={60}>60m</MenuItem>
      </Select>
    </FormControl>
  );
};

export default TimeIntervalSelector; 