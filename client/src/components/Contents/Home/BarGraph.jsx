import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography } from '@mui/material';
import Chart from 'chart.js/auto';

const BarGraph = () => {
  const [topPublicationTopics, setTopPublicationTopics] = useState([]);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchTopPublicationTopics = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/publications/topPublicationTopics');
      if (!response.ok) {
        throw new Error('Failed to fetch top publication topics');
      }
      const data = await response.json();
      setTopPublicationTopics(data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching top publication topics:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchTopPublicationTopics();
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (topPublicationTopics.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: topPublicationTopics.map(topic => topic.topic),
          datasets: [{
            label: 'Count',
            data: topPublicationTopics.map(topic => topic.count),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [topPublicationTopics]);

  useEffect(() => {
    return () => {
      // Cleanup chart instance on component unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <Paper style={{ padding: 16 , height: '50vh', width: '40vw'}}>
      <Typography variant="h6" gutterBottom>
        Top Publication Topics
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <div style={{ position: 'relative', height: '40vh', width: '40vw' }}>
          <canvas ref={chartRef} id="barGraph"></canvas>
        </div>
      )}
    </Paper>
  );
};

export default BarGraph;
