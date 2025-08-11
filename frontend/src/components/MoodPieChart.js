import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function MoodPieChart({ data = [] }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [tooltipData, setTooltipData] = useState(null);

  // Process mood data with memoization for performance
  const { chartData, totalEntries, moodStats } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: [],
        totalEntries: 0,
        moodStats: { mostCommon: 'N/A', variety: 0 }
      };
    }

    const moodCounts = data.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    const processedData = Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood,
      value: count,
      percentage: ((count / data.length) * 100).toFixed(1)
    }));

    // Sort by count for better visualization
    processedData.sort((a, b) => b.value - a.value);

    return {
      chartData: processedData,
      totalEntries: data.length,
      moodStats: {
        mostCommon: processedData[0]?.name || 'N/A',
        variety: processedData.length
      }
    };
  }, [data]);

  // Enhanced cosmic color palette matching dashboard theme
  const COSMIC_COLORS = [
    '#7c3aed', // Primary cosmic purple
    '#db2777', // Cosmic pink
    '#059669', // Cosmic green
    '#dc2626', // Cosmic red
    '#2563eb', // Cosmic blue
    '#7c2d12', // Cosmic brown
    '#0891b2', // Cosmic cyan
    '#be123c', // Cosmic rose
    '#6b21a8', // Deep purple
    '#166534'  // Deep green
  ];

  // Handle sector hover events with debouncing to prevent flickering
  const onPieEnter = (data, index) => {
    setActiveIndex(index);
    setTooltipData(data);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
    setTooltipData(null);
  };

  // Custom tooltip that we control
  const renderTooltip = () => {
    if (!tooltipData) return null;
    
    return (
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(15, 15, 15, 0.95)',
        border: '2px solid #7c3aed',
        borderRadius: '12px',
        padding: '0.8rem 1.2rem',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(124, 58, 237, 0.4)',
        zIndex: 1000,
        minWidth: '120px',
        pointerEvents: 'none' // Prevent tooltip from interfering with hover
      }}>
        <p style={{ margin: '0 0 0.3rem 0', color: '#bb86fc', fontWeight: '700', fontSize: '0.9rem' }}>
          {tooltipData.name}
        </p>
        <p style={{ margin: 0, color: '#ffffff', fontSize: '0.8rem' }}>
          Count: {tooltipData.value}
        </p>
        <p style={{ margin: '0.2rem 0 0 0', color: '#c4b5fd', fontSize: '0.75rem' }}>
          {tooltipData.percentage}%
        </p>
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div style={{
        position: 'relative',
        background: 'rgba(237, 226, 226, 0.88)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '20px',
        padding: '2rem',
        margin: '1.5rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '600px',
        minHeight: '400px',
        color: '#ffffff'
      }}>
        <h3 style={{
          color: '#bb86fc',
          fontSize: '1.3rem',
          fontWeight: '700',
          margin: '0 0 1rem 0',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif'
        }}>
          Mood Distribution
        </h3>
        <p style={{ color: '#c4b5fd', fontSize: '1rem' }}>No mood data available</p>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      background: 'transparent',
      backdropFilter: 'blur(20px)',
      border: '2px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '20px',
      padding: '2rem',
      margin: '1.5rem auto',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 32px rgba(221, 217, 230, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '600px'
    }}>
      {/* Chart Title */}
      <h3 style={{
        color: '#713ab3ff',
        fontSize: '1.3rem',
        fontWeight: '700',
        margin: '0 0 1.5rem 0',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif'
      }}>
        Mood Distribution
      </h3>

      {/* Floating particles for enhanced cosmic effect */}
      {[...Array(4)].map((_, i) => (
        <div 
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            background: '#7c3aed',
            borderRadius: '50%',
            pointerEvents: 'none',
            left: `${Math.random() * 100}%`,
            animation: `particleFloat${i} ${10 + i * 2}s infinite linear`,
            opacity: 0.6,
            zIndex: 1
          }}
        />
      ))}

      {/* Custom tooltip */}
      {renderTooltip()}

      {/* Stats overlay */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '8px',
        padding: '0.5rem 0.8rem',
        fontSize: '0.75rem',
        color: '#c4b5fd',
        backdropFilter: 'blur(10px)',
        zIndex: 5,
        pointerEvents: 'none' // Prevent interference with hover
      }}>
        <div style={{ fontWeight: '700', color: '#bb86fc' }}>
          Total: {totalEntries}
        </div>
        <div>Types: {moodStats.variety}</div>
      </div>

      {/* Fixed size pie chart container */}
      <div style={{
        width: '100%',
        height: '320px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: '1rem',
        zIndex: 10 // Ensure chart is above other elements
      }}>
        <PieChart width={350} height={320}>
          <Pie
            data={chartData}
            cx={175}
            cy={160}
            labelLine={false}
            outerRadius={90}
            innerRadius={35}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            animationBegin={0}
            animationDuration={1000}
            style={{ outline: 'none' }} // Remove focus outline that can cause flickering
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COSMIC_COLORS[index % COSMIC_COLORS.length]}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={activeIndex === index ? 3 : 1}
                style={{
                  filter: activeIndex === index ? 
                    `drop-shadow(0 0 15px ${COSMIC_COLORS[index % COSMIC_COLORS.length]})` : 
                    `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))`,
                  transition: 'all 0.2s ease-out', // Smooth but quick transition
                  transformOrigin: 'center',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Pie>
          
          {/* Use Recharts Tooltip but make it invisible - we handle our own */}
          <Tooltip content={() => null} />
        </PieChart>

        {/* Center info for donut chart */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 15 // Above the pie chart
        }}>
          <h4 style={{
            color: '#bb86fc',
            fontSize: '1rem',
            fontWeight: '700',
            margin: 0,
            textShadow: '1px 1px 6px rgba(139, 92, 246, 0.3)',
            fontFamily: 'Inter, sans-serif'
          }}>
            {totalEntries}
          </h4>
          <p style={{
            color: '#c4b5fd',
            fontSize: '0.7rem',
            fontWeight: '600',
            margin: '0.2rem 0 0 0',
            opacity: 0.8,
            fontFamily: 'Inter, sans-serif'
          }}>
          </p>
        </div>
      </div>

      {/* Legend with better spacing */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.8rem',
        margin: '1rem 0',
        padding: '0 1rem',
        zIndex: 5
      }}>
        {chartData.map((mood, index) => (
          <div 
            key={mood.name} 
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.35)',
              border: `1px solid ${COSMIC_COLORS[index % COSMIC_COLORS.length]}`,
              borderRadius: '20px',
              padding: '0.4rem 0.8rem',
              fontSize: '0.8rem',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)'
            }}
            onMouseEnter={() => {
              setActiveIndex(index);
              setTooltipData(mood);
            }}
            onMouseLeave={() => {
              setActiveIndex(-1);
              setTooltipData(null);
            }}
          >
            <div style={{
              width: '10px',
              height: '10px',
              backgroundColor: COSMIC_COLORS[index % COSMIC_COLORS.length],
              borderRadius: '50%',
              marginRight: '0.5rem',
              boxShadow: `0 0 6px ${COSMIC_COLORS[index % COSMIC_COLORS.length]}`
            }} />
            <span style={{
              color: '#c4b5fd',
              fontWeight: '600'
            }}>
              {mood.name} ({mood.percentage}%)
            </span>
          </div>
        ))}
      </div>

      {/* Top 3 moods with proper spacing */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.35)',
        borderRadius: '12px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        backdropFilter: 'blur(10px)',
        width: '100%'
      }}>
        <h4 style={{
          color: '#bb86fc',
          textAlign: 'center',
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: '600',
          fontFamily: 'Inter, sans-serif'
        }}>
          Top 3 Moods
        </h4>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          gap: '1rem'
        }}>
          {chartData.slice(0, 3).map((mood, index) => (
            <div key={mood.name} style={{
              flex: '1',
              textAlign: 'center',
              padding: '0.8rem 0.5rem',
              background: 'rgba(139, 92, 246, 0.05)',
              borderRadius: '10px',
              border: `2px solid ${COSMIC_COLORS[index]}`,
              transition: 'all 0.3s ease',
              minWidth: '0'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: COSMIC_COLORS[index],
                borderRadius: '50%',
                margin: '0 auto 0.5rem',
                boxShadow: `0 0 8px ${COSMIC_COLORS[index]}`
              }} />
              <div style={{
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: '700',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '0.3rem',
                wordBreak: 'break-word'
              }}>
                {mood.name}
              </div>
              <div style={{
                color: '#c4b5fd',
                fontSize: '0.7rem',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '0.2rem'
              }}>
                {mood.value} entries
              </div>
              <div style={{
                color: '#bb86fc',
                fontSize: '0.8rem',
                fontWeight: '600',
                fontFamily: 'Inter, sans-serif'
              }}>
                {mood.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes particleFloat0 {
          0% { transform: translateY(100px) translateX(0px) scale(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100px) translateX(30px) scale(1.5); opacity: 0; }
        }
        @keyframes particleFloat1 {
          0% { transform: translateY(100px) translateX(10px) scale(0); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-100px) translateX(-20px) scale(1.2); opacity: 0; }
        }
        @keyframes particleFloat2 {
          0% { transform: translateY(100px) translateX(-5px) scale(0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100px) translateX(40px) scale(1.8); opacity: 0; }
        }
        @keyframes particleFloat3 {
          0% { transform: translateY(100px) translateX(20px) scale(0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100px) translateX(-30px) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}