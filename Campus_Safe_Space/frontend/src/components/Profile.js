import React from 'react';

function Profile({ user }) {
  return (
    <div>
      <div className="profile-header-large">
        <div className="avatar-large">
          <i className="fas fa-user-circle avatar-large-icon"></i>
        </div>
        <div className="profile-info-large">
          <h1 className="profile-name-large">{user?.name || 'User'}</h1>
          <p className="profile-email">{user?.email || 'No email'}</p>
          <p className="profile-id-large">ID: {user?.anonymousId || 'Not set'}</p>
          <p className="profile-profession-large">{user?.profession || 'Student'}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <i className="fas fa-clock stat-icon"></i>
          <h3 className="stat-label">Active Hours</h3>
          <p className="stat-number">24</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-smile stat-icon"></i>
          <h3 className="stat-label">Weekly Mood</h3>
          <p className="stat-number">😊</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-pen stat-icon"></i>
          <h3 className="stat-label">Total Confessions</h3>
          <p className="stat-number">{user?.totalConfessions || 0}</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-heart stat-icon"></i>
          <h3 className="stat-label">Support Given</h3>
          <p className="stat-number">15</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;