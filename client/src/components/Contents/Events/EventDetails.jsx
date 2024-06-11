import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const EventDetails = ({ event }) => {
  if (!event) {
    return <Typography variant="h6">No Event Details Available</Typography>;
  }

  const renderList = (items) => (
    <List>
      {items.map((item, index) => (
        <ListItem key={index}>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );

  const renderSection = (title, content) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body1">
          {content || "Not Available to Display"}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );

  const renderSessionDetails = (sessions) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Session Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {sessions && sessions.length > 0 ? (
          <List>
            {sessions.map((session, index) => (
              <Box key={index} mb={2}>
                <ListItem>
                  <ListItemText
                    primary={
                      <>
                        <strong>Participant Name:</strong> {session.participantName}
                      </>
                    }
                    secondary={
                      <>
                        <div><strong>Session Title:</strong> {session.title}</div>
                        <div><strong>Session Topic:</strong> {session.topic}</div>
                        <div><strong>Session Role:</strong> {session.role}</div>
                        <div><strong>Session Sponsor:</strong> {session.sponsor}</div>
                      </>
                    }
                  />
                </ListItem>
                {index < sessions.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        ) : (
          <Typography variant="body1">Not Available to Display</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {event.Event_Name}
      </Typography>
      
      {renderSection("Event Details", event.details)}
      {renderSection("Location", event.Location)}
      {renderSection("Participants", event.participants && event.participants.length > 0 ? renderList(event.participants) : null)}
      {renderSection("Plans", event.plans)}
      {renderSection("Topics", event.topics && event.topics.length > 0 ? renderList(event.topics) : null)}
      {renderSection("Payments", event.payments)}
      {renderSection("Comments", event.comments)}
      {renderSection("Documents", event.documents)}
      {renderSection("Organizations", event.organizations)}
      {renderSessionDetails(event.sessions)}
    </Container>
  );
};

export default EventDetails;
