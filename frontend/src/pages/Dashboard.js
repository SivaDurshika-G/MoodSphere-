import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../services/api'; // axios instance with token interceptor
import MoodChart from '../components/MoodChart'; // Your line
import MoodPieChart from '../components/MoodPieChart';
import MotivationalQuote from '../components/MotivationalQuote';
import RecentNotesCarousel from '../components/RecentNotesCarousel';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);

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

        // Filter and sort notes to get the 5 most recent
        const notes = moodRes.data
          .filter((entry) => entry.note && entry.note.trim() !== '')
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setRecentNotes(notes);

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
      <MotivationalQuote />

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

      {moodData.length > 0 && (
        <>
          <MoodChart entries={moodData} />
          <h3>Mood Distribution:</h3>
          <MoodPieChart data={moodData} />
        </>
      )}

      {recentNotes.length > 0 && (
        <>
          <h3 style={{ marginTop: '20px' }}>Top 5 Recent Notes</h3>
          <RecentNotesCarousel notes={recentNotes} />
        </>
      )}
    </div>
  );
}
