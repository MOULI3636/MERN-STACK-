import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CampusFeed({ user }) {
  const [confessions, setConfessions] = useState([]);

  useEffect(() => {
    fetchConfessions();
  }, []);

  const fetchConfessions = async () => {
    try {
      const res = await axios.get('/confessions');
      setConfessions(res.data);
    } catch (error) {
      console.log('Error fetching confessions');
    }
  };

  const handleReaction = async (id, type) => {
    try {
      await axios.post(`/confessions/${id}/react`, { reactionType: type });
      fetchConfessions();
    } catch (error) {
      console.log('Error adding reaction');
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMins = Math.floor((now - postDate) / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins/60)}h ago`;
    if (diffMins < 10080) return `${Math.floor(diffMins/1440)}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <div>
      <h2 className="page-title">Campus Feed</h2>
      
      {confessions.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-file-alt empty-icon"></i>
          <p>No confessions yet. Be the first to share!</p>
        </div>
      ) : (
        confessions.map(c => (
          <div key={c._id} className="confession-card">
            <div className="card-header">
              <div className="anonymous-info">
                <i className="fas fa-user-secret anonymous-icon"></i>
                <span className="anonymous-id">{c.anonymousId}</span>
              </div>
              <span className="category-badge">{c.category}</span>
              <span className="time-stamp">{formatTime(c.createdAt)}</span>
            </div>

            <h4 className="confession-subject">{c.subject}</h4>
            <p className="confession-text">{c.text}</p>
            
            <div className="reactions">
              <button className="reaction-btn" onClick={() => handleReaction(c._id, 'like')}>
                <i className="far fa-thumbs-up"></i> {c.reactions.like}
              </button>
              <button className="reaction-btn" onClick={() => handleReaction(c._id, 'love')}>
                <i className="far fa-heart"></i> {c.reactions.love}
              </button>
              <button className="reaction-btn" onClick={() => handleReaction(c._id, 'laugh')}>
                <i className="far fa-laugh"></i> {c.reactions.laugh}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CampusFeed;