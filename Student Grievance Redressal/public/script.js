// API Base URL
const API_BASE = '/api'; // Changed from localhost for same-origin

// ==================== USER PORTAL ====================
if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
    console.log('Loading User Portal...');
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('User Portal DOM loaded');
        const complaintForm = document.querySelector('.complaint-form');
        const complaintsList = document.querySelector('.complaints-list');
        
        // Load user's previous complaints
        loadUserComplaints();
        
        // Handle form submission
        if (complaintForm) {
            complaintForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                console.log('Form submitted');
                
                const formData = {
                    name: this.querySelector('input[placeholder*="full name"]').value,
                    email: this.querySelector('input[type="email"]').value,
                    phone: this.querySelector('input[type="tel"]').value,
                    hostelType: this.querySelector('select').value,
                    hostelRoom: this.querySelector('input[placeholder*="Block A"]').value,
                    subject: this.querySelector('input[placeholder*="Brief subject"]').value,
                    description: this.querySelector('textarea').value
                };
                
                console.log('Submitting:', formData);
                
                try {
                    const response = await fetch(`${API_BASE}/complaints`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        const newComplaint = await response.json();
                        console.log('Complaint created:', newComplaint);
                        alert(`Complaint submitted successfully! Tracking ID: ${newComplaint.id}`);
                        complaintForm.reset();
                        loadUserComplaints();
                    } else {
                        const error = await response.json();
                        console.error('API Error:', error);
                        alert(`Error: ${error.error}`);
                    }
                } catch (error) {
                    console.error('Network Error:', error);
                    alert('Failed to submit complaint. Please try again.');
                }
            });
        }
        
        // Load user's complaints
        async function loadUserComplaints() {
            console.log('Loading user complaints...');
            try {
                const response = await fetch(`${API_BASE}/complaints`);
                if (response.ok) {
                    const allComplaints = await response.json();
                    console.log('Complaints loaded:', allComplaints.length);
                    displayUserComplaints(allComplaints);
                } else {
                    console.error('Failed to fetch complaints');
                }
            } catch (error) {
                console.error('Error loading complaints:', error);
            }
        }
        
        function displayUserComplaints(complaints) {
            if (!complaintsList) {
                console.error('Complaints list element not found');
                return;
            }
            
            console.log('Displaying complaints:', complaints.length);
            
            complaintsList.innerHTML = '';
            
            if (complaints.length === 0) {
                complaintsList.innerHTML = `
                    <div class="no-data">
                        <p>No complaints submitted yet. Submit your first complaint using the form above.</p>
                    </div>
                `;
                return;
            }
            
            // Sort by date (newest first)
            complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            complaints.forEach(complaint => {
                const statusClass = getStatusClass(complaint.status);
                const statusText = getStatusText(complaint.status);
                
                const complaintItem = document.createElement('div');
                complaintItem.className = 'complaint-item';
                complaintItem.innerHTML = `
                    <div class="complaint-subject">${complaint.subject}</div>
                    <div class="complaint-date">Submitted: ${complaint.date} | Tracking ID: ${complaint.id}</div>
                    <div class="complaint-desc">${complaint.description}</div>
                    <span class="status ${statusClass}">${statusText}</span>
                `;
                complaintsList.appendChild(complaintItem);
            });
        }
        
        function getStatusClass(status) {
            switch(status) {
                case 'pending': return 'status-pending';
                case 'open': return 'status-inprogress';
                case 'resolved': return 'status-resolved';
                case 'rejected': return 'status-pending'; // Show rejected as pending for user
                default: return 'status-pending';
            }
        }
        
        function getStatusText(status) {
            switch(status) {
                case 'pending': return 'Pending Review';
                case 'open': return 'In Progress';
                case 'resolved': return 'Resolved';
                case 'rejected': return 'Rejected';
                default: return 'Pending';
            }
        }
    });
}

// ==================== ADMIN PORTAL ====================
if (window.location.pathname.includes('admin.html')) {
    console.log('Loading Admin Portal...');
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Admin Portal DOM loaded');
        let authToken = null;
        let allComplaints = [];
        
        // DOM Elements
        const authInput = document.querySelector('.auth-section input');
        const authButton = document.querySelector('.btn-auth');
        const searchInput = document.querySelector('.search-box input');
        const searchButton = document.querySelector('.btn-search');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const complaintsTable = document.querySelector('table tbody');
        const statTotal = document.querySelector('.stat-card.total p');
        const statOpen = document.querySelector('.stat-card.open p');
        const statPending = document.querySelector('.stat-card.pending p');
        const statResolved = document.querySelector('.stat-card.resolved p');
        const statRejected = document.querySelector('.stat-card.rejected p');
        
        console.log('DOM elements found:', {
            authInput: !!authInput,
            authButton: !!authButton,
            searchInput: !!searchInput,
            searchButton: !!searchButton,
            complaintsTable: !!complaintsTable
        });
        
        // Set authorization token
        if (authButton) {
            authButton.addEventListener('click', function() {
                authToken = authInput.value.trim();
                if (authToken) {
                    alert('Authorization token set. Admin actions enabled.');
                    loadAllComplaints();
                }
            });
        }
        
        // Search functionality
        if (searchButton) {
            searchButton.addEventListener('click', filterComplaints);
        }
        if (searchInput) {
            searchInput.addEventListener('input', filterComplaints);
        }
        
        // Filter buttons
        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    filterComplaints();
                });
            });
        }
        
        // Load all complaints
        async function loadAllComplaints() {
            console.log('Loading all complaints...');
            try {
                const response = await fetch(`${API_BASE}/complaints`);
                if (response.ok) {
                    allComplaints = await response.json();
                    console.log('Complaints loaded:', allComplaints.length);
                    updateStatistics();
                    displayComplaints(allComplaints);
                } else {
                    console.error('Failed to fetch complaints');
                }
            } catch (error) {
                console.error('Error loading complaints:', error);
            }
        }
        
        // Update statistics
        function updateStatistics() {
            const total = allComplaints.length;
            const open = allComplaints.filter(c => c.status === 'open').length;
            const pending = allComplaints.filter(c => c.status === 'pending').length;
            const resolved = allComplaints.filter(c => c.status === 'resolved').length;
            const rejected = allComplaints.filter(c => c.status === 'rejected').length;
            
            if (statTotal) statTotal.textContent = total;
            if (statOpen) statOpen.textContent = open;
            if (statPending) statPending.textContent =+ pending;
            if (statResolved) statResolved.textContent = resolved;
            if (statRejected) statRejected.textContent = rejected;
            
            console.log('Statistics updated:', { total, open, pending, resolved, rejected });
        }
        
        // Display complaints in table
        function displayComplaints(complaints) {
            if (!complaintsTable) {
                console.error('Complaints table element not found');
                return;
            }
            
            console.log('Displaying', complaints.length, 'complaints in table');
            
            complaintsTable.innerHTML = '';
            
            if (complaints.length === 0) {
                complaintsTable.innerHTML = `
                    <tr>
                        <td colspan="9" class="no-data">No complaints found</td>
                    </tr>
                `;
                return;
            }
            
            // Sort by date (newest first)
            complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            complaints.forEach(complaint => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${complaint.id}</td>
                    <td>${complaint.name}</td>
                    <td>${complaint.email}</td>
                    <td>${complaint.phone}</td>
                    <td>${complaint.hostelType || ''} ${complaint.hostelRoom || ''}</td>
                    <td>${complaint.subject}</td>
                    <td><span class="status-badge ${getStatusBadgeClass(complaint.status)}">${getStatusText(complaint.status)}</span></td>
                    <td>${complaint.date}</td>
                    <td class="action-buttons">
                        ${getActionButtons(complaint.status, complaint.id)}
                    </td>
                `;
                
                complaintsTable.appendChild(row);
            });
            
            // Add event listeners to action buttons
            document.querySelectorAll('.btn-resolve').forEach(button => {
                button.addEventListener('click', function() {
                    updateComplaintStatus(this.dataset.id, 'resolved');
                });
            });
            
            document.querySelectorAll('.btn-reject').forEach(button => {
                button.addEventListener('click', function() {
                    updateComplaintStatus(this.dataset.id, 'rejected');
                });
            });
            
            document.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const status = prompt('Enter new status (pending/open/resolved/rejected):');
                    if (status && ['pending', 'open', 'resolved', 'rejected'].includes(status)) {
                        updateComplaintStatus(id, status);
                    }
                });
            });
        }
        
        // Filter complaints
        function filterComplaints() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const activeFilterButton = document.querySelector('.filter-btn.active');
            const activeFilter = activeFilterButton ? activeFilterButton.textContent.toLowerCase() : 'all';
            
            let filtered = allComplaints;
            
            // Apply search filter
            if (searchTerm) {
                filtered = filtered.filter(complaint => 
                    complaint.id.toLowerCase().includes(searchTerm) ||
                    complaint.name.toLowerCase().includes(searchTerm) ||
                    complaint.subject.toLowerCase().includes(searchTerm) ||
                    complaint.email.toLowerCase().includes(searchTerm)
                );
            }
            
            // Apply status filter
            if (activeFilter !== 'all') {
                filtered = filtered.filter(complaint => 
                    complaint.status === activeFilter
                );
            }
            
            displayComplaints(filtered);
        }
        
        // Update complaint status
        async function updateComplaintStatus(id, status) {
            if (!authToken) {
                alert('Please set authorization token first');
                return;
            }
            
            console.log('Updating complaint', id, 'to', status);
            
            try {
                const response = await fetch(`${API_BASE}/complaints/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status })
                });
                
                if (response.ok) {
                    const updated = await response.json();
                    console.log('Complaint updated:', updated);
                    alert(`Complaint ${id} status updated to ${status}`);
                    loadAllComplaints();
                } else {
                    const error = await response.json();
                    console.error('API Error:', error);
                    alert(`Error: ${error.error}`);
                }
            } catch (error) {
                console.error('Network Error:', error);
                alert('Failed to update complaint status');
            }
        }
        
        // Helper functions
        function getStatusBadgeClass(status) {
            switch(status) {
                case 'pending': return 'status-pending';
                case 'open': return 'status-open';
                case 'resolved': return 'status-resolved';
                case 'rejected': return 'status-rejected';
                default: return 'status-pending';
            }
        }
        
        function getStatusText(status) {
            return status.charAt(0).toUpperCase() + status.slice(1);
        }
        
        function getActionButtons(status, id) {
            let buttons = `<button class="btn-action btn-edit" data-id="${id}">Edit Status</button>`;
            
            if (status === 'pending' || status === 'open') {
                buttons += `<button class="btn-action btn-resolve" data-id="${id}">Resolve</button>`;
                buttons += `<button class="btn-action btn-reject" data-id="${id}">Reject</button>`;
            }
            
            return buttons;
        }
        
        // Load initial data
        console.log('Loading initial complaints...');
        loadAllComplaints();
    });
}
