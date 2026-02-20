import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    
    setLoggingOut(true);
    
    try {
      const response = await axios.get('/auth/logout');
      
      if (response.data.success) {
        setUser(null);
        localStorage.clear();
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      localStorage.clear();
      navigate('/');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="welcome-text">
        Welcome, <span className="user-name">{user?.name || 'User'}</span>
      </div>
      <div>
        <button 
          onClick={handleLogout} 
          className="logout-btn"
          disabled={loggingOut}
        >
          <i className="fas fa-sign-out-alt"></i>
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;