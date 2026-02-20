import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import CampusFeed from './CampusFeed';
import MyHistory from './MyHistory';
import Profile from './Profile';
import WriteSecret from './WriteSecret';

function Dashboard({ user, setUser }) {
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [refreshFeed, setRefreshFeed] = useState(false);

  const handleNewPost = () => {
    setRefreshFeed(!refreshFeed);
  };

  return (
    <div className="dashboard-container">
      <Sidebar onWriteClick={() => setShowWriteModal(true)} />
      
      <div className="main-content">
        <Navbar user={user} setUser={setUser} />
        
        <div className="content-area">
          <Routes>
            <Route path="/feed" element={<CampusFeed key={refreshFeed} user={user} />} />
            <Route path="/history" element={<MyHistory user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
          </Routes>
        </div>
      </div>

      <RightSidebar />






      {showWriteModal && (
        <WriteSecret 
          user={user}
          onClose={() => setShowWriteModal(false)}
          onSuccess={handleNewPost}
        />
      )}
    </div>
  );
}

export default Dashboard;