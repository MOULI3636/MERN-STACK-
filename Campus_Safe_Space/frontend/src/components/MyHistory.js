import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyHistory({ user }) {
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [tab, setTab] = useState('posts');
  const [deleteCode, setDeleteCode] = useState({});
  const [showDeleteInput, setShowDeleteInput] = useState({});

  useEffect(() => {
    if (user) {
      fetchMyPosts();
      loadDrafts();
    }
  }, [user]);

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get('/confessions');
      const myPosts = res.data.filter(c => c.userId?._id === user?._id);
      setPosts(myPosts);
    } catch (error) {
      console.log('Error fetching posts');
    }
  };

  const loadDrafts = () => {
    const savedDrafts = JSON.parse(localStorage.getItem('drafts') || '[]');
    setDrafts(savedDrafts);
  };

  const handleDelete = async (id) => {
    const code = deleteCode[id];
    if (!code) {
      alert('Please enter secret code');
      return;
    }
    
    try {
      await axios.delete(`/confessions/${id}`, {
        data: { secretCode: code }
      });
      
      setPosts(posts.filter(p => p._id !== id));
      setShowDeleteInput({});
      setDeleteCode({});
      alert('Confession deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Wrong secret code');
    }
  };

  const deleteDraft = (id) => {
    const updatedDrafts = drafts.filter(d => d.id !== id);
    localStorage.setItem('drafts', JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
  };

  const publishDraft = async (draft) => {
    if (!draft.secretCode || draft.secretCode.length < 4) {
      alert('Draft needs a valid secret code (min 4 characters)');
      return;
    }

    try {
      await axios.post('/confessions', {
        ...draft,
        userId: user._id
      });
      
      deleteDraft(draft.id);
      fetchMyPosts();
      alert('Draft published successfully!');
    } catch (error) {
      alert('Error publishing draft');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div>
      <div className="profile-header">
        <div className="avatar-placeholder">
          <i className="fas fa-user-circle avatar-icon"></i>
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{user?.name || 'User'}</h2>
          <p className="profile-id">ID: {user?.anonymousId || 'Not set'}</p>
          <p className="profile-profession">{user?.profession || 'Student'}</p>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${tab === 'posts' ? 'active' : ''}`}
          onClick={() => setTab('posts')}
        >
          <i className="fas fa-file-alt"></i> My Posts ({posts.length})
        </button>
        <button 
          className={`tab-btn ${tab === 'drafts' ? 'active' : ''}`}
          onClick={() => setTab('drafts')}
        >
          <i className="fas fa-pen"></i> Drafts ({drafts.length})
        </button>
      </div>

      {tab === 'posts' && (
        <div>
          {posts.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-file-alt empty-icon"></i>
              <p>No posts yet. Share your first secret!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <span className="category-badge">{post.category}</span>
                  <span className="post-date">{formatDate(post.createdAt)}</span>
                </div>
                <h4 className="post-subject">{post.subject}</h4>
                <p className="post-text">{post.text}</p>
                <div className="post-stats">
                  <span><i className="far fa-thumbs-up"></i> {post.reactions.like}</span>
                  <span><i className="far fa-heart"></i> {post.reactions.love}</span>
                  <span><i className="far fa-laugh"></i> {post.reactions.laugh}</span>
                </div>
                
                {showDeleteInput[post._id] ? (
                  <div className="delete-section">
                    <input
                      type="password"
                      className="code-input"
                      placeholder="Enter secret code"
                      value={deleteCode[post._id] || ''}
                      onChange={(e) => setDeleteCode({...deleteCode, [post._id]: e.target.value})}
                      autoFocus
                    />
                    <div className="delete-actions">
                      <button 
                        className="confirm-delete-btn"
                        onClick={() => handleDelete(post._id)}
                      >
                        Confirm Delete
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={() => {
                          setShowDeleteInput({});
                          setDeleteCode({});
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="delete-btn"
                    onClick={() => setShowDeleteInput({[post._id]: true})}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'drafts' && (
        <div>
          {drafts.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-pen empty-icon"></i>
              <p>No drafts saved. Click "Save as Draft" while writing to save here.</p>
            </div>
          ) : (
            drafts.map(draft => (
              <div key={draft.id} className="draft-card">
                <div className="draft-header">
                  <span className="category-badge">{draft.category}</span>
                  <span className="post-date">{formatDate(draft.createdAt)}</span>
                </div>
                <h4 className="draft-subject">{draft.subject || '(No subject)'}</h4>
                <p className="draft-text">{draft.text || '(No content)'}</p>
                
                {!draft.secretCode && (
                  <p className="warning-text">⚠️ Secret code required before publishing</p>
                )}
                
                <div className="draft-actions">
                  <button 
                    className="publish-btn"
                    onClick={() => publishDraft(draft)}
                    disabled={!draft.secretCode || draft.secretCode.length < 4}
                  >
                    <i className="fas fa-upload"></i> Publish
                  </button>
                  <button 
                    className="delete-draft-btn"
                    onClick={() => deleteDraft(draft.id)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MyHistory;