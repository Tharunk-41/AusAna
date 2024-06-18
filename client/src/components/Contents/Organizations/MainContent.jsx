import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  CircularProgress,
  Pagination,
} from '@mui/material';
import { styled } from '@mui/system';

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

const MainContent = ({ filters }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);

    const queryString = Object.keys(filters)
      .map((key) => `${key}=${filters[key]}`)
      .join('&');

    const response = await fetch(`http://localhost:8080/api/organizationlist/professional_activities?page=${page}&limit=${itemsPerPage}&${queryString}`);
    const result = await response.json();

    setData(result.results);
    setTotalPages(result.totalPages);
    setIsLoading(false);
  }, [filters, page]);

  useEffect(() => {
    // Reset page to 1 when filters change
    setPage(1);
  }, [filters, setPage]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container>
      <Box sx={{ padding: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ maxHeight: '70vh',maxWidth:"70vw",minWidth:"600px", overflow: 'auto'}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Organization Name</StyledTableCell>
                    <StyledTableCell sx={{ minWidth: '150px' }}>Organization Type</StyledTableCell>
                    <StyledTableCell>Location</StyledTableCell>
                    <StyledTableCell sx={{ minWidth: '100px' }}>Profile Count</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <HoverTableRow key={index}>
                      <TableCell>{row.Organization_Name}</TableCell>
                      <TableCell sx={{ minWidth: '150px' }}>{row.Organization_Type}</TableCell>
                      <TableCell>
                        {`${row.City !== "NULL" ? row.City + ',' : ''} ${row.State !== "NULL" ? row.State + ',' : ''} ${row.Country !== "NULL" ? row.Country : ''}`}
                      </TableCell>
                      <TableCell>{row.Profile_Count}</TableCell>
                    </HoverTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                className="pagination"
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

export default MainContent;
