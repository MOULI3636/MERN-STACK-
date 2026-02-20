import React, { useState } from 'react';
import axios from 'axios';

function WriteSecret({ user, onClose, onSuccess }) {
  const [form, setForm] = useState({
    subject: '',
    text: '',
    category: 'Other',
    secretCode: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.secretCode.length < 4) {
      alert('Secret code must be at least 4 characters');
      return;
    }

    try {
      const response = await axios.post('/confessions', {
        ...form,
        userId: user._id
      });
      
      if (response.data) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      alert('Error posting confession');
      console.error(error);
    }
  };

  const handleSaveDraft = () => {
    if (!form.subject && !form.text) {
      alert('Write something to save draft');
      return;
    }
    
    const drafts = JSON.parse(localStorage.getItem('drafts') || '[]');
    
    const newDraft = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    drafts.push(newDraft);
    localStorage.setItem('drafts', JSON.stringify(drafts));
    
    alert('Draft saved!');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Write a Secret</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              className="form-input"
              value={form.subject}
              onChange={(e) => setForm({...form, subject: e.target.value})}
              placeholder="What's this about?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={form.category}
              onChange={(e) => setForm({...form, category: e.target.value})}
            >
              <option value="Academic">Academic</option>
              <option value="Stress">Stress</option>
              <option value="Love">Love</option>
              <option value="Funny">Funny</option>
              <option value="Secret">Secret</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Your Secret</label>
            <textarea
              className="form-textarea"
              value={form.text}
              onChange={(e) => setForm({...form, text: e.target.value})}
              placeholder="Share anonymously..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Secret Code (4+ characters)</label>
            <input
              className="form-input"
              type="password"
              value={form.secretCode}
              onChange={(e) => setForm({...form, secretCode: e.target.value})}
              required
              minLength="4"
              placeholder="For editing/deleting"
            />
            <small className="form-hint">Remember this code to edit later</small>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleSaveDraft} className="draft-btn">
              Save as Draft
            </button>
            <button type="button" onClick={onClose} className="cancel-modal-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Post Anonymously
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WriteSecret;