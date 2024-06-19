import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './ProfileDetails.css';

const ProfileDetails = ({ onBack }) => {
    const [profile, setProfile] = useState(null);

    const handleImageError = (event) => {
        event.target.src = '/blank_profile.png';  // Path to the image in the public directory
    };

    useEffect(() => {
        const selectedProfileId = localStorage.getItem('selectedProfileId');
        if (selectedProfileId) {
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/profile/${selectedProfileId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setProfile(data);
                })
                .catch(error => {
                    console.error('Error fetching profile details:', error);
                    // Optionally set an error state or handle the error in UI
                });
        }
    }, []);
    
    
    

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-details-container">
            <div className="sidebar2">
                <Button onClick={onBack} className="back-home" startIcon={<ArrowBackIcon />} style={{ color: '#54C1DF' }}>
                    Back to Profiles
                </Button>
                <h2 className="sidebar-heading2">Profile</h2>
                <div className="sidebar-menu">
                    {['Dashboard', 'Personal Info', 'Biography', 'Publications', 'Clinical Activities', 'Events', 'Competitive Intelligence', 'Nominations', 'Interactions', 'Plans', 'Documents', 'Payments', 'Segmentation', 'Commercial Claims'].map((section, index) => (
                        <Button key={index} className="sidebar-item">
                            {section}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="content">
                <div className="profile-box">
                <div className="profile-image-container">
                        <img src={profile.imageLink} alt={profile['KOL Name']} onError={handleImageError} className="profile-image1" />
                    </div>
                    <div className="profile-text">
                        <h2>{profile['KOL Name']}</h2>
                        <p>{profile.Bio_Summary}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetails;
