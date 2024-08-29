import React, { useEffect, useState } from 'react';

const LiveStandings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('LiveStandings component mounted');  // Log for component mount
    const fetchStandings = async () => {
      try {
        setLoading(true);
        console.log('Fetching standings...');
        const response = await fetch('/api/live-standings');
        console.log('Full response:', response);
        if (!response.ok) {
          throw new Error('Failed to fetch live standings');
        }
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE html>')) {
          throw new Error('Unexpected HTML response, expected JSON.');
        }
        const data = JSON.parse(text);
        setStandings(data);
        console.log('Fetched standings:', data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch live standings: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStandings();
    const intervalId = setInterval(fetchStandings, 5 * 60 * 1000);
  
    return () => clearInterval(intervalId);
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Live Event Standings</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Points</th>
            {/* Add more columns as needed based on JSON structure */}
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => (
            <tr key={index}>
              <td>{standing.placing}</td>
              <td>{standing.name}</td>
              <td>{standing.record.wins}</td>
              {/* Adjust field names according to actual JSON structure */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveStandings;
