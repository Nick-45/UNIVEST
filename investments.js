import { auth, db } from './firebase.js';

// DOM Elements
const investmentsBody = document.getElementById('investments-body');
const newInvestmentBtn = document.getElementById('new-investment');
const filterBtns = document.querySelectorAll('.filter-btn');

// Current filter state
let currentFilter = 'all';

// Check auth state
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    // Load investments
    loadInvestments(user.uid);
});

// Load investments from Firestore
function loadInvestments(userId) {
    let query = db.collection('investments')
        .where('userId', '==', userId)
        .orderBy('startDate', 'desc');

    // Apply filter if not 'all'
    if (currentFilter === 'active') {
        query = query.where('status', '==', 'active');
    } else if (currentFilter === 'completed') {
        query = query.where('status', '==', 'completed');
    } else if (currentFilter === 'group') {
        query = query.where('type', '==', 'group');
    } else if (currentFilter === 'individual') {
        query = query.where('type', '==', 'individual');
    }

    query.get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                investmentsBody.innerHTML = `
                    <tr>
                        <td colspan="6">
                            <div class="empty-state">
                                <i class="fas fa-chart-pie"></i>
                                <h3>No Investments Found</h3>
                                <p>You don't have any investments matching your criteria</p>
                                <button class="btn-primary" id="create-investment">
                                    <i class="fas fa-plus"></i> Create Investment
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }

            investmentsBody.innerHTML = '';
            
            querySnapshot.forEach(doc => {
                const investment = doc.data();
                const startDate = investment.startDate?.toDate();
                const endDate = investment.endDate?.toDate();
                
                investmentsBody.innerHTML += `
                    <tr>
                        <td>
                            <div class="investment-name">
                                <div class="investment-icon">
                                    <i class="fas ${getInvestmentIcon(investment.type)}"></i>
                                </div>
                                <div>
                                    <strong>${investment.name}</strong><br>
                                    <small>${investment.type === 'group' ? 'Group' : 'Individual'} Investment</small>
                                </div>
                            </div>
                        </td>
                        <td>KES ${investment.amount?.toLocaleString() || '0'}</td>
                        <td>${investment.expectedROI || '0'}%</td>
                        <td>${investment.duration || '0'} weeks</td>
                        <td>
                            <span class="status-badge ${investment.status === 'active' ? 'status-active' : 'status-completed'}">
                                ${investment.status === 'active' ? 'Active' : 'Completed'}
                            </span>
                        </td>
                        <td>
                            <button class="action-btn" title="View Details" onclick="viewInvestment('${doc.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${investment.status === 'active' ? `
                            <button class="action-btn" title="Add Funds" onclick="addFunds('${doc.id}')">
                                <i class="fas fa-plus-circle"></i>
                            </button>
                            ` : ''}
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => {
            console.error("Error loading investments:", error);
            investmentsBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h3>Error Loading Investments</h3>
                            <p>${error.message}</p>
                            <button class="btn-primary" onclick="window.location.reload()">
                                <i class="fas fa-sync-alt"></i> Try Again
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
}

// Get appropriate icon for investment type
function getInvestmentIcon(type) {
    switch(type) {
        case 'agriculture': return 'fa-seedling';
        case 'real-estate': return 'fa-home';
        case 'stocks': return 'fa-chart-line';
        case 'group': return 'fa-users';
        default: return 'fa-piggy-bank';
    }
}

// Filter button click handler
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        
        const user = auth.currentUser;
        if (user) {
            loadInvestments(user.uid);
        }
    });
});

// New investment button
newInvestmentBtn.addEventListener('click', () => {
    window.location.href = 'new-investment.html';
});

// Global functions for table actions
window.viewInvestment = function(id) {
    window.location.href = `investment-details.html?id=${id}`;
};

window.addFunds = function(id) {
    // In a real app, this would open a modal or new page
    alert(`Functionality to add funds to investment ${id} would go here`);
};
