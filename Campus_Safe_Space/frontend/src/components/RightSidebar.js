import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RightSidebar() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/confessions/stats/categories');
      setStats(res.data);
    } catch (error) {
      console.log('Error fetching stats');
    }
  };

  const rules = [
    'Be kind and supportive',
    'No personal attacks',
    'Keep it confidential',
    'Respect everyone',
    'Report concerns'
  ];

  return (
    <div className="right-sidebar">
      <h3 className="sidebar-title">Community Guidelines</h3>
      <ul className="rules-list">
        {rules.map((rule, i) => (
          <li key={i} className="rule-item">
            <i className="fas fa-check-circle rule-check"></i>
            {rule}
          </li>
        ))}
      </ul>







      <h3 className="sidebar-title" style={{ marginTop: '30px' }}>Trending Topics</h3>
      <div className="stats-container">
        {stats.map(stat => (
          <div key={stat._id} className="stat-item">
            <div className="stat-label">
              <span>{stat._id}</span>
              <span>{stat.count}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(stat.count * 10, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RightSidebar;