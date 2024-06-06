import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tooltip, Button, Box, Typography
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import './EventList.css';

const EventList = ({ filters, page, setPage, pageSize, onRowClick }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const params = new URLSearchParams({ ...filters, page, pageSize });
      const response = await fetch(`http://localhost:8080/api/eventlist/events?${params.toString()}`);
      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, [filters, page, pageSize]);

  useEffect(() => {
    setPage(1); // Reset page to 1 when filters change
  }, [filters, setPage]);

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const handleNextPage = () => {
    if (events.length === pageSize) {
      setPage(page + 1);
    }
  };

  const handleRowClick = (event) => {
    onRowClick(event);
    localStorage.setItem('selectedEvent', JSON.stringify(event));
  };

  return (
    <Box p={2} className="container">
      <Paper>
        <TableContainer className="table-container">
          <Table stickyHeader>
            <TableHead className="sticky-header">
              <TableRow>
                <TableCell>Event Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Sponsor</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Validation Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event, index) => (
                <TableRow key={index} onClick={() => handleRowClick(event)} className='table-row'>
                  <TableCell>{event.Event_Name}</TableCell>
                  <TableCell>{event.Description}</TableCell>
                  <TableCell>{event.Event_Type}</TableCell>
                  <TableCell>{event.Sponsor_Name}</TableCell>
                  <TableCell>{event.Event_Start_Date}</TableCell>
                  <TableCell>{event.Event_End_Date}</TableCell>
                  <TableCell>{event.Location}</TableCell>
                  <TableCell>
                    {event['validation action'] !== "NULL" ? (
                      <Tooltip title={event['validation action']}>
                        <IconButton>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box className="pagination-container">
        <Button
          variant="contained"
          color="primary"
          disabled={page === 1}
          onClick={handlePrevPage}
          sx={{ backgroundColor: '#F5901C', color: 'white', '&:hover': { backgroundColor: 'darkorange' } }}
        >
          Previous
        </Button>
        <Typography>Page {page}</Typography>
        <Button
          variant="contained"
          color="primary"
          disabled={events.length < pageSize}
          onClick={handleNextPage}
          sx={{ backgroundColor: '#F5901C', color: 'white', '&:hover': { backgroundColor: 'darkorange' } }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default EventList;
