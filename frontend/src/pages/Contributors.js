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

  // Function to determine bubble size based on contributions
  const getBubbleSize = (contributions) => {
    if (contributions >= 100) return 'large';
    if (contributions >= 50) return 'medium';
    return 'small';
  };

  // Function to check if contributor is top contributor (top 3 by contributions)
  const isTopContributor = (contributor, allContributors) => {
    const sortedContributors = [...allContributors]
      .sort((a, b) => b.contributions - a.contributions);
    return sortedContributors.slice(0, 3).includes(contributor);
  };

  // Enhanced floating particles component
  const FloatingParticles = () => {
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const type = Math.floor(Math.random() * 3) + 1;
      const style = {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${Math.random() * 15 + 15}s`
      };
      
      particles.push(
        <div 
          key={`particle-${i}`} 
          className={`floating-particle type-${type}`}
          style={style}
        />
      );
    }

    return particles;
  };

  // Enhanced shooting stars component
  const ShootingStars = () => {
    const stars = [];
    const starCount = 8; // Increased count
    
    for (let i = 0; i < starCount; i++) {
      const starStyle = {
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${Math.random() * 4 + 3}s` // Faster duration
      };
      
      stars.push(
        <div 
          key={`star-${i}`} 
          className="shooting-star"
          style={starStyle}
        />
      );
    }

    return stars;
  };

  // Meteor shower component
  const MeteorShower = () => {
    const meteors = [];
    const meteorCount = 6; // Increased count
    
    for (let i = 0; i < meteorCount; i++) {
      const meteorStyle = {
        top: `${Math.random() * 60}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10 + 2}s`,
        animationDuration: `${Math.random() * 6 + 4}s` // Faster meteors
      };
      
      meteors.push(
        <div 
          key={`meteor-${i}`} 
          className="meteor"
          style={meteorStyle}
        />
      );
    }

    return meteors;
  };

  return (
    <div className="contributors-page">
      {/* Background effects */}
      <div className="particle-container">
        <FloatingParticles />
        <ShootingStars />
        <MeteorShower />
      </div>

      <div className="contributors-content">
        <h2 className="contributors-title">Contributors Galaxy</h2>
        
        {loading ? (
          <div className="loading-container">
            <p className="loading-text">
              Loading contributors from the cosmos...
            </p>
            <div className="loading-stars">✨ ⭐ 🌟 ✨</div>
          </div>
        ) : (
          <>
            {/* Stats panel */}
            <div className="stats-panel">
              <div className="stat-item">
                <span className="stat-icon">🌟</span>
                <span className="stat-value">{contributors.length}</span>
                <span className="stat-label">Contributors</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <span className="stat-value">{contributors.reduce((sum, c) => sum + c.contributions, 0)}</span>
                <span className="stat-label">Total Contributions</span>
              </div>
            </div>

            <div className="contributors-space">
              {contributors.map((contributor, index) => {
                const bubbleSize = getBubbleSize(contributor.contributions);
                const isTop = isTopContributor(contributor, contributors);
                
                // Create a grid-based layout with no overlaps
                const generateNonOverlappingPosition = (index, total) => {
                  // Calculate grid dimensions based on total contributors
                  const cols = Math.ceil(Math.sqrt(total * 1.5)); // Wider grid
                  const rows = Math.ceil(total / cols);
                  
                  // Current bubble's grid position
                  const row = Math.floor(index / cols);
                  const col = index % cols;
                  
                  // Calculate base position with padding
                  const cellWidth = 80 / cols; // Use 80% of width for grid
                  const cellHeight = 70 / rows; // Use 70% of height for grid
                  
                  let x = 10 + (col * cellWidth) + (cellWidth / 2); // Start 10% from left
                  let y = 15 + (row * cellHeight) + (cellHeight / 2); // Start 15% from top
                  
                  // Add controlled randomness within each cell (max ±25% of cell size)
                  const randomOffsetX = (Math.random() - 0.5) * cellWidth * 0.4;
                  const randomOffsetY = (Math.random() - 0.5) * cellHeight * 0.4;
                  
                  x += randomOffsetX;
                  y += randomOffsetY;
                  
                  // Ensure boundaries (leave space for bubble size)
                  x = Math.max(8, Math.min(88, x));
                  y = Math.max(8, Math.min(80, y));
                  
                  return {
                    left: `${x}%`,
                    top: `${y}%`
                  };
                };
                
                const position = generateNonOverlappingPosition(index, contributors.length);
                
                return (
                  <a
                    key={contributor.id}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`contributor-bubble ${bubbleSize} ${isTop ? 'top-contributor' : ''}`}
                    title={`${contributor.login} - ${contributor.contributions} contributions`}
                    style={position}
                  >
                    <div className="contributor-image-wrapper">
                      <img 
                        src={contributor.avatar_url} 
                        alt={`${contributor.login}'s avatar`}
                        loading="lazy"
                        onError={(e) => {
                          const colors = ['8b5cf6', '06b6d4', '10b981', 'f59e0b', 'ef4444', 'ec4899', '3b82f6'];
                          const selectedColor = colors[index % colors.length];
                          e.target.src = `https://via.placeholder.com/200x200/${selectedColor}/ffffff?text=${contributor.login.charAt(0).toUpperCase()}`;
                        }}
                      />
                      <div className="contribution-badge">
                        {contributor.contributions > 999 ? '999+' : contributor.contributions}
                      </div>
                    </div>
                    <div className="contributor-info">
                      <span className="contributor-name">
                        {contributor.login}
                        {isTop && <span className="crown-icon">👑</span>}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </>
        )}
        
        {/* Footer message */}
        {!loading && contributors.length > 0 && (
          <div className="footer-message">
            Thank you to all our stellar contributors! 🚀✨
          </div>
        )}
      </div>
    </div>
  );
}