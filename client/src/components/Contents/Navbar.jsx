import React, { useState, Suspense } from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import './Navbar.css';

// Dynamic imports for the tab content
const Profiles = React.lazy(() => import('./Profiles/Profiles'));
const Home = React.lazy(() => import('./Home/Home'));

/*
const Organizations = React.lazy(() => import('./Organizations/Organizations'));
const Interactions = React.lazy(() => import('./Interactions/Interactions'));
const Events = React.lazy(() => import('./Events/Events'));
const Calendar = React.lazy(() => import('./Calendar/Calendar'));
const Plans = React.lazy(() => import('./Plans/Plans'));
const MarketAccess = React.lazy(() => import('./MarketAccess/MarketAccess'));
const Segmentation = React.lazy(() => import('./Segmentation/Segmentation'));
const Reports = React.lazy(() => import('./Reports/Reports'));
*/

function Navbar() {
    const [value, setValue] = useState(-1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <AppBar position="static" style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", backgroundColor: "#54C1DF" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="navbar tabs"
                    className="centered-tabs"
                    TabIndicatorProps={{
                        style: {
                            display: 'none' // Hides the default tab indicator
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
                    {/*
          {value === 1 && <Organizations />}
          {value === 2 && <Interactions />}
          {value === 3 && <Events />}
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
