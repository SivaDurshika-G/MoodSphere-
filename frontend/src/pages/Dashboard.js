import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../services/api'; // axios instance with token interceptor
import MoodChart from '../components/MoodChart';
import MoodPieChart from '../components/MoodPieChart';
import MotivationalQuote from '../components/MotivationalQuote';
import RecentNotesCarousel from '../components/RecentNotesCarousel';
import '../assets/styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
    document.body.className = document.body.className.replace(/\bcosmic-dashboard-page\b/g, '').trim();
    document.body.classList.add('cosmic-dashboard-page');

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

    return () => {
      document.body.classList.remove('cosmic-dashboard-page');
    };
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/moods/${id}`);
      setMoodData((prev) => prev.filter((entry) => entry._id !== id));
      setRecentNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error('Error deleting mood:', err);
    }
  };

  if (loading) {
    return (
      <div className="cosmic-dashboard">
        <div className="cosmic-dashboard-card">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cosmic-dashboard">
      <div className="dashboard-quantum-field"></div>
      <div className="dashboard-energy-pulse"></div>
      <div className="dashboard-energy-pulse"></div>
      <div className="dashboard-energy-pulse"></div>
      <div className="dashboard-data-stream"></div>

      <div className="dashboard-particle-container">
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className={`dashboard-floating-particle type-${(i % 3) + 1}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 25}s`
            }}
          ></div>
        ))}
        {[...Array(3)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="dashboard-shooting-star"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 30}%`,
              animationDelay: `${i * 2}s`
            }}
          ></div>
        ))}
        {[...Array(2)].map((_, i) => (
          <div
            key={`meteor-${i}`}
            className="dashboard-meteor"
            style={{
              top: `${10 + Math.random() * 40}%`,
              left: `${20 + Math.random() * 40}%`,
              animationDelay: `${i * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="dashboard-floating-objects">
        <div className="dashboard-floating-cube"></div>
        <div className="dashboard-floating-cube"></div>
        <div className="dashboard-floating-cube"></div>
        <div className="dashboard-floating-cube"></div>
        <div className="dashboard-floating-cube"></div>
        <div className="dashboard-floating-cube"></div>

        <div className="dashboard-light-orb"></div>
        <div className="dashboard-light-orb"></div>
        <div className="dashboard-light-orb"></div>

        <div className="dashboard-circuit-trace"></div>
        <div className="dashboard-circuit-trace"></div>
        <div className="dashboard-circuit-trace"></div>

        <div className="dashboard-hex-float"></div>
        <div className="dashboard-hex-float"></div>
        <div className="dashboard-hex-float"></div>

        <div className="dashboard-plasma-blob"></div>
        <div className="dashboard-plasma-blob"></div>

        <div className="dashboard-ion-stream"></div>
        <div className="dashboard-ion-stream"></div>

        <div className="dashboard-crystal-shard"></div>
        <div className="dashboard-crystal-shard"></div>

        <div className="dashboard-orbital-sat"></div>
        <div className="dashboard-orbital-sat"></div>
        <div className="dashboard-orbital-sat"></div>
      </div>

      <div className="cosmic-dashboard-card">
        <MotivationalQuote />
      </div>

      <h2>Welcome, {profile.username}</h2>

      <div className="cosmic-dashboard-card">
        <h3>Your Mood History:</h3>
        {moodData.length === 0 ? (
          <p>No mood entries yet.</p>
        ) : (
          <div className="mood-history-container">
            <ul>
              {moodData.map((entry) => (
                <li key={entry._id} className="mood-item">
                  <div className="mood-content">
                    <span className="mood-emoji">😊</span>
                    <span className="mood-text">{entry.mood}</span>
                    <div className="mood-timestamp">{new Date(entry.date).toLocaleDateString()}</div>
                    {entry.note && (
                      <div
                        className="mood-note"
                        style={{
                          marginTop: '0.5rem',
                          fontSize: '0.9rem',
                          color: 'var(--dashboard-text-secondary)',
                          fontStyle: 'italic'
                        }}
                      >
                        "{entry.note}"
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="delete-btn"
                    style={{
                      marginLeft: '10px',
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {moodData.length > 0 && (
        <>
          <div className="cosmic-dashboard-card">
            <MoodChart entries={moodData} />
          </div>

          <div className="cosmic-dashboard-card">
            <h3>Mood Distribution:</h3>
            <MoodPieChart data={moodData} />
          </div>
        </>
      )}

      {recentNotes.length > 0 && (
        <div className="cosmic-dashboard-card">
          <h3 style={{ marginTop: '0' }}>Top 5 Recent Notes</h3>
          <RecentNotesCarousel notes={recentNotes} />
        </div>
      )}
    </div>
  );
}
