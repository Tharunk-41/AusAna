import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const Organizations = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1); // State to manage pagination

  // Function to handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));

    // Reset page to 1 when filters change
    setPage(1);
  };
  // Function to reset page
  const handlePageReset = () => {
    setPage(1);
  };

  return (
    <Box display="flex" alignItems="flex-start" overflow={'auto'} >
      <Sidebar onFilterChange={handleFilterChange} onPageReset={handlePageReset} />
      <MainContent filters={filters} page={page} setPage={setPage} />
    </Box>
  );
};

export default Organizations;
