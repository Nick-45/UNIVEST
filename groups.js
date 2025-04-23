import { auth, db } from './firebase.js';

// DOM Elements
const groupsContainer = document.getElementById('groups-container');
const createGroupBtn = document.getElementById('create-group');

// Check auth state
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    // Load groups
    loadGroups(user.uid);
});

// Load groups from Firestore
function loadGroups(userId) {
    db.collection('groups')
        .where('members', 'array-contains', userId)
        .orderBy('createdAt', 'desc')
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                groupsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>No Groups Found</h3>
                        <p>You're not a member of any investment groups yet</p>
                        <button class="btn-primary" id="create-group-btn">
                            <i class="fas fa-plus"></i> Create Your First Group
                        </button>
                    </div>
                `;
                document.getElementById('create-group-btn').addEventListener('click', () => {
                    window.location.href = 'create-group.html';
                });
                return;
            }

            groupsContainer.innerHTML = '';
            
            querySnapshot.forEach(doc => {
                const group = doc.data();
                const memberCount = group.members?.length || 0;
                
                groupsContainer.innerHTML += `
                    <div class="group-card">
                        <div class="group-image" style="background-image: url('${group.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'}')">
                            <span class="group-members">
                                <i class="fas fa-user"></i> ${memberCount}
                            </span>
                        </div>
                        <div class="group-details">
                            <h3 class="group-title">${group.name}</h3>
                            <p class="group-description">${group.description || 'No description available'}</p>
                            
                            <div class="group-stats">
                                <div class="group-stat">
                                    <div class="group-stat-value">${group.investmentCount || 0}</div>
                                    <div class="group-stat-label">Investments</div>
                                </div>
                                <div class="group-stat">
                                    <div class="group-stat-value">${group.totalValue ? 'KES ' + group.totalValue.toLocaleString() : 'KES 0'}</div>
                                    <div class="group-stat-label">Total Value</div>
                                </div>
                                <div class="group-stat">
                                    <div class="group-stat-value">${group.avgROI || 0}%</div>
                                    <div class="group-stat-label">Avg. ROI</div>
                                </div>
                            </div>
                            
                            <div class="group-actions">
                                <button class="btn btn-outline" onclick="viewGroup('${doc.id}')">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                <button class="btn btn-primary" onclick="investWithGroup('${doc.id}')">
                                    <i class="fas fa-plus"></i> Invest
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Error loading groups:", error);
            groupsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Groups</h3>
                    <p>${error.message}</p>
                    <button class="btn-primary" onclick="window.location.reload()">
                        <i class="fas fa-sync-alt"></i> Try Again
                    </button>
                </div>
            `;
        });
}

// Create group button
createGroupBtn.addEventListener('click', () => {
    window.location.href = 'create-group.html';
});

// Global functions for group actions
window.viewGroup = function(groupId) {
    window.location.href = `group-details.html?id=${groupId}`;
};

window.investWithGroup = function(groupId) {
    // In a real app, this would open an investment modal/page
    alert(`Functionality to invest with group ${groupId} would go here`);
};
