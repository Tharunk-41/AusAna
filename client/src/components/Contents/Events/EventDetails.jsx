import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const EventDetails = ({ event, setSelectedEvent }) => {
  const [selectedEvent, setSelectedEventState] = useState(event);

  useEffect(() => {
    const storedEvent = localStorage.getItem('selectedEvent');
    if (storedEvent) {
      setSelectedEventState(JSON.parse(storedEvent));
    }
  }, []);

  if (!selectedEvent) {
    return null;
  }

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        {selectedEvent.Event_Name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Description:</strong> {selectedEvent.Description}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Event Type:</strong> {selectedEvent.Event_Type}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Sponsor:</strong> {selectedEvent.Sponsor_Name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Start Date:</strong> {selectedEvent.Event_Start_Date}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>End Date:</strong> {selectedEvent.Event_End_Date}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Location:</strong> {selectedEvent.Location}
      </Typography>
      {selectedEvent['validation action'] !== "NULL" && (
        <Typography variant="body1" gutterBottom>
          <strong>Validation Action:</strong> {selectedEvent['validation action']}
        </Typography>
      )}
    </Box>
  );
};

export default EventDetails;
