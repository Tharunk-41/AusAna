import React, { useState } from 'react';
import EventList from './EventList';
import EventDetails from './EventDetails';
import Sidebar from './sidebar';
import { Button, Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Events = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedEvent, setSelectedEvent] = useState(
    JSON.parse(localStorage.getItem('selectedEvent')) || null
  );

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    localStorage.setItem('selectedEvent', JSON.stringify(event));
  };

  const handleBackClick = () => {
    setSelectedEvent(null);
    localStorage.removeItem('selectedEvent');
  };

  return (
    <div className="Events">
      <div style={{ display: "flex",overflow:"auto" }}>
        {selectedEvent ? (
          <Box display="flex"  alignItems="flex-start" >
            <Box display="flex" alignItems="center" mb={2}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackClick}
                sx={{ textTransform: 'none' }}
              >
                <Typography variant="body1">Back</Typography>
              </Button>
            </Box>
            <EventDetails event={selectedEvent} />
          </Box>
        ) : (
          <>
            <Sidebar onFilterChange={setFilters} />
            <EventList
              filters={filters}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              onRowClick={handleRowClick}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Events;
