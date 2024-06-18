import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  Container,
  Pagination,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/system';
import './EventList.css';

const HoverTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

const StyledTableCell = styled(TableCell)({
  position: 'sticky',
  top: 0,
  backgroundColor: '#54C1DF',
  fontWeight: 'bold',
  padding: '10px',
  zIndex: 1,
});

const EventList = ({ filters, page, setPage, pageSize, onRowClick }) => {
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const params = new URLSearchParams({ ...filters, page, pageSize });
      try {
        const response = await fetch(`http://localhost:8080/api/eventlist/events?${params.toString()}`);
        const data = await response.json();
        setEvents(data.results || []);  // Ensure events is an array
        setTotalPages(data.totalPages || 1);  // Ensure totalPages is a number
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [filters, page, pageSize]);

  useEffect(() => {
    setPage(1); // Reset page to 1 when filters change
  }, [filters, setPage]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container>
      <Box p={2} className="container">
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Paper>
              <TableContainer component={Paper} className="table-container" sx={{ maxHeight: '70vh', maxWidth: '70vw', minWidth: '600px', overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead className="sticky-header">
                    <TableRow>
                      <StyledTableCell>Event Name</StyledTableCell>
                      <StyledTableCell>Description</StyledTableCell>
                      <StyledTableCell>Event Type</StyledTableCell>
                      <StyledTableCell>Sponsor</StyledTableCell>
                      <StyledTableCell>Start Date</StyledTableCell>
                      <StyledTableCell>End Date</StyledTableCell>
                      <StyledTableCell>Location</StyledTableCell>
                      <StyledTableCell>Validation Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map((event, index) => (
                      <HoverTableRow key={index} onClick={() => onRowClick(event)} className='table-row'>
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
                      </HoverTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '.Mui-selected': {
                    backgroundColor: '#F5901C !important',
                  },
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default EventList;
