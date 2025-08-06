import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../services/api'; // axios instance with token interceptor
import MoodChart from '../components/MoodChart'; // adjust path if needed


export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, moodRes] = await Promise.all([
          API.get('/users/me'),
          API.get('/moods'),
        ]);
        setProfile(profileRes.data);
        setMoodData(moodRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard">
      <h2>Welcome, {profile.username}</h2>

      <h3>Your Mood History:</h3>
      {moodData.length === 0 ? (
        <p>No mood entries yet.</p>
      ) : (
        <ul>
          {moodData.map((entry) => (
            <li key={entry._id}>
              {entry.date} - {entry.mood}
            </li>
          ))}
        </ul>
      )}
      {moodData.length > 0 && <MoodChart entries={moodData} />}

    </div>
    
  );
}
