// Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const signOutBtn = document.getElementById('sign-out');
const investmentsContainer = document.getElementById('investments-container');
const portfolioValue = document.getElementById('portfolio-value');
const activeInvestments = document.getElementById('active-investments');
const groupCount = document.getElementById('group-count');
const portfolioChange = document.getElementById('portfolio-change');
const investmentsChange = document.getElementById('investments-change');
const groupsChange = document.getElementById('groups-change');

// Check auth state
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    // Load user data
    loadUserData(user);
    loadInvestments(user.uid);
    loadGroups(user.uid);
});

// Load user data
function loadUserData(user) {
    const displayName = user.displayName || user.email.split('@')[0];
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    userAvatar.textContent = initials;
    userName.textContent = displayName;

    // Load additional user data from Firestore
    db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                if (userData.name) {
                    userName.textContent = userData.name;
                    const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
                    userAvatar.textContent = initials;
                }
            }
        })
        .catch(error => {
            console.error("Error loading user data:", error);
        });
}

// Load investments data
function loadInvestments(userId) {
    db.collection('investments')
        .where('userId', '==', userId)
        .where('status', '==', 'active')
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                // Show empty state (already shown in HTML)
                activeInvestments.textContent = '0';
                return;
            }

            let totalValue = 0;
            let count = 0;
            investmentsContainer.innerHTML = '';

            querySnapshot.forEach(doc => {
                const investment = doc.data();
                totalValue += investment.amount || 0;
                count++;
                
                // Create investment card
                const card = document.createElement('div');
                card.className = 'investment-card';
                card.innerHTML = `
                    <div class="investment-image" style="background-image: url('${investment.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'}')"></div>
                    <div class="investment-details">
                        <h3 class="investment-title">${investment.name}</h3>
                        <div class="investment-meta">
                            <span><i class="fas fa-calendar-alt"></i> ${investment.duration} weeks</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${investment.location || 'Nairobi'}</span>
                        </div>
                        
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${calculateProgress(investment)}%"></div>
                            </div>
                            <div class="investment-stats">
                                <span class="investment-amount">KES ${investment.amount?.toLocaleString() || '0'}</span>
                                <span class="investment-roi">${investment.roi || '0'}% ROI</span>
                            </div>
                        </div>
                        
                        <div class="investment-actions">
                            <button class="btn btn-outline" onclick="trackInvestment('${doc.id}')">
                                <i class="fas fa-chart-line"></i> Track
                            </button>
                            <button class="btn btn-primary" onclick="addFunds('${doc.id}')">
                                <i class="fas fa-plus"></i> Add Funds
                            </button>
                        </div>
                    </div>
                `;
                
                investmentsContainer.appendChild(card);
            });

            // Update stats
            activeInvestments.textContent = count;
            portfolioValue.textContent = `KES ${totalValue.toLocaleString()}`;
            portfolioChange.innerHTML = '<i class="fas fa-arrow-up"></i> Calculating...';
            
            // In a real app, you would calculate actual changes from historical data
            setTimeout(() => {
                portfolioChange.innerHTML = '<i class="fas fa-arrow-up"></i> Calculating trends...';
                // This would be replaced with actual calculation from Firestore data
            }, 1500);
        })
        .catch(error => {
            console.error("Error loading investments:", error);
            investmentsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Investments</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        <i class="fas fa-sync-alt"></i> Try Again
                    </button>
                </div>
            `;
        });
}

// Load groups data
function loadGroups(userId) {
    db.collection('groups')
        .where('members', 'array-contains', userId)
        .get()
        .then(querySnapshot => {
            groupCount.textContent = querySnapshot.size;
            groupsChange.innerHTML = querySnapshot.size > 0 ? 
                '<i class="fas fa-users"></i> ' + querySnapshot.size + ' groups' : 
                '<i class="fas fa-info-circle"></i> No groups yet';
        })
        .catch(error => {
            console.error("Error loading groups:", error);
            groupsChange.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error loading';
        });
}

// Helper function to calculate investment progress
function calculateProgress(investment) {
    if (!investment.startDate || !investment.duration) return 0;
    
    const startDate = investment.startDate.toDate();
    const now = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (investment.duration * 7));
    
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const daysPassed = (now - startDate) / (1000 * 60 * 60 * 24);
    
    return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
}

// Sign out function
signOutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            window.location.href = 'auth.html';
        })
        .catch(error => {
            console.error("Sign out error:", error);
            alert("Error signing out: " + error.message);
        });
});

// Placeholder functions for buttons
function trackInvestment(investmentId) {
    window.location.href = `investments.html?investment=${investmentId}`;
}

function addFunds(investmentId) {
    // In a real app, this would open a modal or new page
    alert(`Functionality to add funds to investment ${investmentId} would go here`);
}
