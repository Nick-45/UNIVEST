import { auth, db } from './firebase.js';

// DOM Elements
const balanceAmount = document.getElementById('balance-amount');
const depositBtn = document.getElementById('deposit-btn');
const withdrawBtn = document.getElementById('withdraw-btn');
const transferBtn = document.getElementById('transfer-btn');
const transactionsList = document.getElementById('transactions-list');

// Check auth state
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    // Load wallet data
    loadWalletData(user.uid);
    loadTransactions(user.uid);
});

// Load wallet balance
function loadWalletData(userId) {
    db.collection('wallets').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const walletData = doc.data();
                balanceAmount.textContent = `KES ${walletData.balance?.toLocaleString() || '0'}`;
            } else {
                // Create wallet if it doesn't exist
                db.collection('wallets').doc(userId).set({
                    balance: 0,
                    currency: 'KES',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        })
        .catch(error => {
            console.error("Error loading wallet:", error);
            balanceAmount.textContent = "Error loading balance";
        });
}

// Load recent transactions
function loadTransactions(userId) {
    db.collection('transactions')
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .limit(10)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                transactionsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-history"></i>
                        <h3>No Transactions Yet</h3>
                        <p>Your transaction history will appear here</p>
                    </div>
                `;
                return;
            }

            transactionsList.innerHTML = '';
            
            querySnapshot.forEach(doc => {
                const transaction = doc.data();
                const date = transaction.date?.toDate();
                
                transactionsList.innerHTML += `
                    <div class="transaction-item">
                        <div class="transaction-details">
                            <div class="transaction-icon">
                                <i class="fas ${getTransactionIcon(transaction.type)}"></i>
                            </div>
                            <div class="transaction-info">
                                <h4>${transaction.description || 'Transaction'}</h4>
                                <p>${date?.toLocaleDateString() || ''} • ${transaction.status || 'Completed'}</p>
                            </div>
                        </div>
                        <div class="transaction-amount ${transaction.amount > 0 ? 'credit' : 'debit'}">
                            ${transaction.amount > 0 ? '+' : ''}KES ${Math.abs(transaction.amount).toLocaleString()}
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Error loading transactions:", error);
            transactionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Transactions</h3>
                    <p>${error.message}</p>
                </div>
            `;
        });
}

// Get appropriate icon for transaction type
function getTransactionIcon(type) {
    switch(type) {
        case 'deposit': return 'fa-plus-circle';
        case 'withdrawal': return 'fa-minus-circle';
        case 'transfer': return 'fa-exchange-alt';
        case 'investment': return 'fa-chart-line';
        case 'dividend': return 'fa-coins';
        default: return 'fa-money-bill-wave';
    }
}

// Button event listeners
depositBtn.addEventListener('click', () => {
    window.location.href = 'deposit.html';
});

withdrawBtn.addEventListener('click', () => {
    window.location.href = 'withdraw.html';
});

transferBtn.addEventListener('click', () => {
    window.location.href = 'transfer.html';
});
