import React, { useState, useEffect, useCallback } from 'react';
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
import './sidebar.css';

const Sidebar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    name: '',
    eventType: [],
    participant: [],
    sponsor: [],
  });

  const [options, setOptions] = useState({
    eventTypes: [],
    participants: [],
    sponsors: [],
  });

  const [page, setPage] = useState({
    eventTypes: 1,
    participants: 1,
    sponsors: 1,
  });

  const [loading, setLoading] = useState({
    eventTypes: false,
    participants: false,
    sponsors: false,
  });

  const [hasMore, setHasMore] = useState({
    eventTypes: true,
    participants: true,
    sponsors: true,
  });

  useEffect(() => {
    const fetchInitialOptions = async () => {
      setLoading({ eventTypes: true, participants: true, sponsors: true });

      const [eventTypes, participants, sponsors] = await Promise.all([
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/eventlist/options/eventTypes`).then(res => res.json()),
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/eventlist/options/participants`).then(res => res.json()),
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/eventlist/options/sponsors`).then(res => res.json()),
      ]);

      setOptions({ eventTypes, participants, sponsors });

      setLoading({ eventTypes: false, participants: false, sponsors: false });
    };

    fetchInitialOptions();
  }, []);

  const fetchMoreOptions = useCallback(async (filter) => {
    if (!hasMore[filter] || loading[filter]) return;

    setLoading(prevLoading => ({ ...prevLoading, [filter]: true }));

    const newOptions = await fetch(`http://localhost:8080/api/eventlist/options/${filter}?page=${page[filter]}&pageSize=20`)
      .then(res => res.json());

    setOptions(prevOptions => ({
      ...prevOptions,
      [filter]: [...new Set([...prevOptions[filter], ...newOptions])],
    }));

    if (newOptions.length < 20) {
      setHasMore(prevHasMore => ({ ...prevHasMore, [filter]: false }));
    }

    setLoading(prevLoading => ({ ...prevLoading, [filter]: false }));
    setPage(prevPage => ({ ...prevPage, [filter]: prevPage[filter] + 1 }));
  }, [page, hasMore, loading]);

  const handleScroll = (filter, event) => {
    const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
    if (bottom) {
      fetchMoreOptions(filter);
    }
  };

  const handleChange = (filter, value) => {
    setFilters({ ...filters, [filter]: value });
    onFilterChange({ ...filters, [filter]: value });
  };

  const handleBackHome = () => {
    localStorage.removeItem('selectedTab');
    window.location.reload(); // Reload the page to navigate to the home screen
  };

  return (
    <Paper className="sidebare" elevation={3}>
      <Button onClick={handleBackHome} className="back-homee" startIcon={<ArrowBackIcon />} style={{ color: '#54C1DF' }}>
        Back Home
      </Button>
      <Typography variant="h5" className="header" sx={{ fontWeight: "bold" }}>
        Filters
      </Typography>
      <TextField
        label="Search by keyword"
        name="keyword"
        value={filters.keyword}
        onChange={(e) => handleChange('keyword', e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />
      <TextField
        label="Search by name"
        name="name"
        value={filters.name}
        onChange={(e) => handleChange('name', e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />
      <Box className="filters">
        <Typography variant="h6" className="sectionTitle" sx={{ fontWeight: "bold" }}>
          Refine By
        </Typography>
        <FormControl fullWidth className="formControl" sx={{ marginTop: '16px' }}>
          <Autocomplete
            multiple
            options={options.eventTypes}
            value={filters.eventType}
            onChange={(event, value) => handleChange('eventType', value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Event Type"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading.eventTypes ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            ListboxProps={{
              onScroll: (event) => handleScroll('eventTypes', event),
              className: 'scrollableList',
            }}
          />
        </FormControl>

        <FormControl fullWidth className="formControl" sx={{ marginTop: '16px' }}>
          <Autocomplete
            multiple
            options={options.participants}
            value={filters.participant}
            onChange={(event, value) => handleChange('participant', value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Participant"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading.participants ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            ListboxProps={{
              onScroll: (event) => handleScroll('participants', event),
              className: 'scrollableList',
            }}
          />
        </FormControl>

        <FormControl fullWidth className="formControl" sx={{ marginTop: '16px' }}>
          <Autocomplete
            multiple
            options={options.sponsors}
            value={filters.sponsor}
            onChange={(event, value) => handleChange('sponsor', value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sponsor"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading.sponsors ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            ListboxProps={{
              onScroll: (event) => handleScroll('sponsors', event),
              className: 'scrollableList',
            }}
          />
        </FormControl>
      </Box>
    </Paper>
  );
};

export default Sidebar;