import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBarProfiles from './SideBar_Profiles';
import ProfileList from './ProfileList';
import ProfileDetails from './ProfileDetails';
import './Profiles.css';

const Profiles = () => {
    const [keyword, setKeyword] = useState('');
    const [name, setName] = useState('');
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);  // State for pagination
    const [profiles, setProfiles] = useState([]);  // State for profiles

    // Effect to fetch profiles when keyword, name, or filters change
    useEffect(() => {
        // Function to fetch profiles
        const fetchProfiles = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/profiles', {
                    params: {
                        keyword,
                        name,
                        filters: JSON.stringify(filters) // Send filters as a JSON string
                    }
                });
                setProfiles(response.data);
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };

        // Call fetchProfiles immediately and when keyword, name, or filters change
        fetchProfiles();

        // Reset to first page when keyword, name, or filters change
        setPage(1);

    }, [keyword, name, filters, setPage]); // Include fetchProfiles and other dependencies

    const handleKeywordChange = (newKeyword) => {
        setKeyword(newKeyword);
        setPage(1);  // Reset to first page when a new search is performed
    };

    const handleNameChange = (newName) => {
        setName(newName);
        setPage(1);  // Reset to first page when a new search is performed
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);  // Reset to first page when a new search is performed
    };

    const handleBack = () => {
        localStorage.removeItem('selectedProfileId');
        window.location.reload();
    };

    const selectedProfileId = localStorage.getItem('selectedProfileId');

    return (
        <div className="profiles-container">
            {selectedProfileId ? (
                <ProfileDetails onBack={handleBack} />
            ) : (
                <>
                    <SideBarProfiles
                        onKeywordChange={handleKeywordChange}
                        onNameChange={handleNameChange}
                        onFilterChange={handleFilterChange}
                    />
                    <ProfileList profiles={profiles} page={page} setPage={setPage} />
                </>
            )}
        </div>
    );
};

export default Profiles;
