import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './styles.css';

const DataList = ({ specialization }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/data?table=bio&specialization=${specialization}&limit=10&page=${page}`);
      const result = await response.json();
      setData(prevData => [...prevData, ...result]);
      setHasMore(result.length > 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }, [specialization, page]);

  useEffect(() => {
    setData([]); // Clear previous data
    setPage(1); // Reset page
    setHasMore(true); // Reset hasMore
  }, [specialization]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const lastDataElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  if (loading && page === 1) {
    return <CircularProgress />;
  }

  if (!data.length && !loading) {
    return <Typography>No data found</Typography>;
  }

  return (
    <Box className="data-list-container">
      {data.map((item, index) => (
        <Card key={index} className="data-card">
          <CardContent className="data-card-content">
            <img
              src={item.image_link}
              alt={item['KOL Name']}
              className="data-avatar"
              onError={(e) => { e.target.onerror = null; e.target.src = 'placeholder-image-url'; }} // Replace 'placeholder-image-url' with the actual URL of a placeholder image
            />
            <Box className="data-details">
              <Typography variant="h5" className="kol-name">{item['KOL Name']}</Typography>
              <Typography variant="body2">{item.Profession}</Typography>
              <Typography variant="body2">{item.Specialty}</Typography>
            </Box>
            <Typography variant="h4" className="data-score">{item['Career Status']}</Typography>
          </CardContent>
        </Card>
      ))}
      <div ref={lastDataElementRef}></div>
      {loading && <CircularProgress />}
      {!loading && !hasMore && <Typography>No more data</Typography>}
    </Box>
  );
};

function ListComp() {
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/specializations');
        const result = await response.json();
        setSpecializations(result);
        setSelectedSpecialization(result[0]); // Set the first option as default
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };

    fetchSpecializations();
  }, []);

  return (
    <Card className="App">
      <header className="App-header">
        <h1>Top Segmentation Results</h1>
        <FormControl variant="filled" sx={{ minWidth: 240 }}>
          <InputLabel id="specialization-label">Select Specialization</InputLabel>
          <Select
            labelId="specialization-label"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            {specializations.map((specialization, index) => (
              <MenuItem key={index} value={specialization}>
                {specialization}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DataList specialization={selectedSpecialization} />
      </header>
    </Card>
  );
}

export default ListComp;
