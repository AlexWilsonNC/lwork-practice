import React, { useEffect, useState } from 'react';

const LiveStandings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/live-standings');
        if (!response.ok) {
          throw new Error('Failed to fetch live standings');
        }
        const data = await response.json();
        setStandings(data);
      } catch (err) {
        setError('Failed to fetch live standings');
      } finally {
        setLoading(false);
      }
    };

    fetchStandings(); // Fetch immediately on component mount
    const intervalId = setInterval(fetchStandings, 5 * 60 * 1000); // Fetch every 5 minutes

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
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
              <td>{standing.rank}</td>
              <td>{standing.playerName}</td>
              <td>{standing.points}</td>
              {/* Adjust field names according to actual JSON structure */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveStandings;
