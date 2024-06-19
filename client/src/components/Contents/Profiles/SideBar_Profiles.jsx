import React, { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete, Chip ,Paper} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the back arrow icon
import axios from 'axios';
import './SideBar_Profiles.css';

const SideBarProfiles = ({ onKeywordChange, onNameChange, onFilterChange }) => {
    const [filters, setFilters] = useState({});
    const [options, setOptions] = useState({});

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/filters`);
                setOptions(response.data);
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchOptions();
    }, []);

    const handleFilterChange = (column, value) => {
        setFilters((prevFilters) => {
            const newFilters = { ...prevFilters, [column]: value };
            onFilterChange(newFilters); // Call the onFilterChange prop
            return newFilters;
        });
    };

    const handleClearAll = () => {
        setFilters({});
        onFilterChange({}); // Call the onFilterChange prop with an empty object
    };
    
    const handleBackHome = () => {
        localStorage.removeItem('selectedTab');
        window.location.reload(); // Reload the page to navigate to the home screen
    };
    
    return (
        <Paper className="sidebar" elevation={3}>
            <Button onClick={handleBackHome} className="back-home" startIcon={<ArrowBackIcon />} style={{ color: '#54C1DF' }}>
                Back Home
            </Button>
            <h2 className="sidebar-heading">Filters</h2>
            <TextField
                label="Search by Keyword"
                variant="outlined"
                fullWidth
                onChange={(e) => onKeywordChange(e.target.value)}
                className="sidebar-input"
            />
            <TextField
                label="Search by Name"
                variant="outlined"
                fullWidth
                onChange={(e) => onNameChange(e.target.value)}
                className="sidebar-input"
            />
            <div className="refine-by">
                <h2 className="sidebar-heading">
                    Refine By
                    <Button onClick={handleClearAll} className="clear-all">Clear All</Button>
                </h2>
                <div className="refine-by-container">
                    {Object.keys(options).map((column) => (
                        <Autocomplete
                            key={column}
                            multiple
                            options={options[column] || []}
                            value={filters[column] || []}
                            onChange={(event, value) => handleFilterChange(column, value)}
                            renderTags={(value, getTagProps) => (
                                <div className="chip-scroll-container">
                                    {value.map((option, index) => (
                                        <Chip 
                                            variant="outlined" 
                                            label={option} 
                                            {...getTagProps({ index })} 
                                            className="chip-item"
                                        />
                                    ))}
                                </div>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label={column}
                                    placeholder={filters[column]?.length ? '' : column}
                                    className="sidebar-input"
                                />
                            )}
                            
                            className="sidebar-input"
                        />
                    ))}
                </div>
            </div>
        </Paper>
    );
};

export default SideBarProfiles;
