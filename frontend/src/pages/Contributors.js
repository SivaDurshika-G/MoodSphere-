import React, { useEffect, useState } from 'react';
import { API } from '../services/api';
import '../assets/styles/Contributors.css';

export default function Contributors() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContributors() {
      try {
        const res = await API.get('/github/contributors');
        setContributors(res.data);
      } catch (err) {
        console.error('Failed to fetch contributors:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContributors();
  }, []);

  return (
    <div className="contributors-page">
      <h2>Project Contributors</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="contributors-grid">
          {contributors.map(contributor => (
            <a
              key={contributor.id}
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="contributor-card"
            >
              <img src={contributor.avatar_url} alt={contributor.login} />
              <p>{contributor.login}</p>
              <span>Contributions: {contributor.contributions}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
