import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Pagination } from '@mui/material';
import './ProfileList.css';

const ProfileList = ({ profiles, page, setPage }) => {
    const itemsPerPage = 10;
    const containerRef = useRef(null);

    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo(0, 0);
        }
    }, [page, profiles]);  // Scroll to top when page or profiles change

    const startIndex = (page - 1) * itemsPerPage;
    const displayedProfiles = profiles.slice(startIndex, startIndex + itemsPerPage);

    const handleImageError = (event) => {
        event.target.src = '/blank_profile.png';  // Path to the image in the public directory
    };

    const handleProfileClick = (profile) => {
        localStorage.setItem('selectedProfileId', profile['KOL ID']);
        window.location.reload(); // This will trigger the switch to ProfileDetails
    };

    return (
        <div className="profile-list-container">
            <div className="profiles-cards" ref={containerRef}>
                {displayedProfiles.map((profile) => (
                    <Card className="profile-card" key={profile['KOL Name']} onClick={() => handleProfileClick(profile)}>
                        <Grid container className="profile-cardo">
                            <Grid item xs={3}>
                                <CardMedia
                                    component="img"
                                    alt={profile['KOL Name']}
                                    image={profile.imageLink}
                                    onError={handleImageError}
                                    className="profile-image"
                                />
                            </Grid>
                            <Grid item xs={9}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" fontWeight='bold'>
                                        {profile['KOL Name']}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Gender: {profile.Gender}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Profession: {profile.Profession}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Specialty: {profile.Specialty}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Career Status: {profile['Career Status']}
                                    </Typography>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </Card>
                ))}
            </div>
            <Pagination
                count={Math.ceil(profiles.length / itemsPerPage)}
                page={page}
                onChange={handleChange}
                color="primary"
                className="pagination"
                sx={{
                    '.Mui-selected': {
                        backgroundColor: '#F5901C !important',
                    },
                }}
            />
        </div>
    );
};

export default ProfileList;
