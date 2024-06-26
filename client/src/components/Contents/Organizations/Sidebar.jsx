import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the back arrow icon
import {
  TextField,
  FormControl,
  CircularProgress,
  Autocomplete,
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import './Sidebar.css';

const Sidebar = ({ onFilterChange, onPageReset }) => {
  const [filters, setFilters] = useState({
    name: '',
    organizationType: [],
    region: [],
    location: '',
  });

  const [options, setOptions] = useState({
    organizationTypes: [],
    regions: [],
  });

  const [loading, setLoading] = useState({
    organizationTypes: false,
    regions: false,
  });

  useEffect(() => {
    const fetchInitialOptions = async () => {
      setLoading((prevLoading) => ({ ...prevLoading, organizationTypes: true }));

      try {
        const organizationTypesResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/organizationlist/eventlist/options/organizationTypes`);
        if (!organizationTypesResponse.ok) {
          throw new Error('Failed to fetch organization types');
        }
        const organizationTypesData = await organizationTypesResponse.json();

        setOptions((prevOptions) => ({
          ...prevOptions,
          organizationTypes: organizationTypesData,
        }));

        setLoading((prevLoading) => ({ ...prevLoading, organizationTypes: false }));

        const regionsResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/organizationlist/eventlist/options/region`);
        if (!regionsResponse.ok) {
          throw new Error('Failed to fetch regions');
        }
        const regionsData = await regionsResponse.json();

        setOptions((prevOptions) => ({
          ...prevOptions,
          regions: regionsData,
        }));

        setLoading((prevLoading) => ({ ...prevLoading, regions: false }));
      } catch (error) {
        console.error('Error fetching options:', error);
        setLoading((prevLoading) => ({ ...prevLoading, organizationTypes: false, regions: false }));
      }
    };

    fetchInitialOptions();
  }, []);

  const handleChange = (filter, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filter]: value }));
    onFilterChange({ ...filters, [filter]: value });
    onPageReset();
  };

  const handleBackHome = () => {
    localStorage.removeItem('selectedTab');
    window.location.reload(); // Reload the page to navigate to the home screen
  };

  return (
    <Paper className="sidebaro" elevation={3}>
      <Button onClick={handleBackHome} className="back-homeo" startIcon={<ArrowBackIcon />} style={{ color: '#54C1DF' }}>
        Back Home
      </Button>
      <Typography variant="h5" className="header" sx={{ fontWeight: 'bold' }}>
        Filters
      </Typography>
      <TextField
        label="Search by name"
        name="name"
        value={filters.name}
        onChange={(e) => handleChange('name', e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <TextField
        label="Search by location"
        name="location"
        value={filters.location}
        onChange={(e) => handleChange('location', e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <Box className="filters">
        <Typography variant="h6" className="sectionTitle" sx={{ fontWeight: 'bold' }}>
          Refine By
        </Typography>
        <FormControl fullWidth className="formControl" sx={{ marginTop: '16px' }}>
          <Autocomplete
            multiple
            options={options.organizationTypes}
            value={filters.organizationType}
            onChange={(event, value) => handleChange('organizationType', value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Organization Type"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading.organizationTypes && <CircularProgress color="inherit" size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            ListboxProps={{
              className: 'scrollableList',
            }}
          />
        </FormControl>

        <FormControl fullWidth className="formControl" sx={{ marginTop: '16px' }}>
          <Autocomplete
            multiple
            options={options.regions}
            value={filters.region}
            onChange={(event, value) => handleChange('region', value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading.regions && <CircularProgress color="inherit" size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            ListboxProps={{
              className: 'scrollableList',
            }}
          />
        </FormControl>
      </Box>
    </Paper>
  );
};

export default Sidebar;
