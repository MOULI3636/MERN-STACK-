import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ onWriteClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === `/dashboard${path}`;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">Campus Safe Space</h2>
      </div>
      
      <div className="sidebar-nav">
        <div 
          className={`nav-item ${isActive('/feed') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard/feed')}
        >
          <i className="fas fa-rss nav-icon"></i>
          <span>Campus Feed</span>
        </div>
        
        <div 
          className={`nav-item ${isActive('/history') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard/history')}
        >
          <i className="fas fa-history nav-icon"></i>
          <span>My History</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <button onClick={onWriteClick} className="write-btn">
          <i className="fas fa-pen nav-icon"></i>
          Write Secret
        </button>
      </div>
    </div>
  );
}

export default Sidebar;