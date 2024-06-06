import React, { useState, useEffect, Suspense } from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import './Navbar.css';

const Profiles = React.lazy(() => import('./Profiles/Profiles'));
const Home = React.lazy(() => import('./Home/Home'));
const Events = React.lazy(() => import('./Events/Events'));

/*
const Organizations = React.lazy(() => import('./Organizations/Organizations'));
const Interactions = React.lazy(() => import('./Interactions/Interactions'));
const Calendar = React.lazy(() => import('./Calendar/Calendar'));
const Plans = React.lazy(() => import('./Plans/Plans'));
const MarketAccess = React.lazy(() => import('./MarketAccess/MarketAccess'));
const Segmentation = React.lazy(() => import('./Segmentation/Segmentation'));
const Reports = React.lazy(() => import('./Reports/Reports'));
*/

function Navbar() {
    const [value, setValue] = useState(() => {
        const savedValue = localStorage.getItem('selectedTab');
        return savedValue !== null ? parseInt(savedValue, 10) : -1;
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
        localStorage.setItem('selectedTab', newValue);
    };

    useEffect(() => {
        const savedValue = localStorage.getItem('selectedTab');
        if (savedValue !== null) {
            setValue(parseInt(savedValue, 10));
        }
    }, []);

    return (
        <div>
            <AppBar position="static" className="elevated-appbar">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="navbar tabs"
                    className="centered-tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    TabIndicatorProps={{
                        style: {
                            display: 'none' 
                        }
                    }}
                >
                    <Tab label="Profiles" />
                    <Tab label="Organizations" />
                    <Tab label="Interactions" />
                    <Tab label="Events" />
                    <Tab label="Calendar" />
                    <Tab label="Plans" />
                    <Tab label="Market Access" />
                    <Tab label="Segmentation" />
                    <Tab label="Reports" />
                </Tabs>
            </AppBar>
            <Box p={3}>
                <Suspense fallback={<div>Loading...</div>}>
                    {value === -1 && <Home />}
                    {value === 0 && <Profiles />}
                    {value === 3 && <Events />}
                    {/*
          {value === 1 && <Organizations />}
          {value === 2 && <Interactions />}
          {value === 4 && <Calendar />}
          {value === 5 && <Plans />}
          {value === 6 && <MarketAccess />}
          {value === 7 && <Segmentation />}
          {value === 8 && <Reports />}
          */}
                </Suspense>
            </Box>
        </div>
    );
}

export default Navbar;
