import { auth, db } from './firebase.js';

// DOM Elements
const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const fullNameInput = document.getElementById('full-name');
const phoneInput = document.getElementById('phone');
const universitySelect = document.getElementById('university');
const profileForm = document.getElementById('profile-form');
const changePasswordBtn = document.getElementById('change-password');
const deleteAccountBtn = document.getElementById('delete-account');

// Check auth state
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    // Load user data
    loadUserData(user);
});

// Load user data from Firestore
function loadUserData(user) {
    const displayName = user.displayName || user.email.split('@')[0];
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    profileAvatar.textContent = initials;
    profileName.textContent = displayName;
    profileEmail.textContent = user.email;

    // Load additional user data from Firestore
    db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                
                if (userData.name) {
                    fullNameInput.value = userData.name;
                    profileName.textContent = userData.name;
                    const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
                    profileAvatar.textContent = initials;
                }
                
                if (userData.phone) {
                    phoneInput.value = userData.phone;
                }
                
                if (userData.university) {
                    universitySelect.value = userData.university;
                }
            }
        })
        .catch(error => {
            console.error("Error loading user data:", error);
            alert("Error loading profile data: " + error.message);
        });
}

// Update profile
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;

    try {
        // Update in Firestore
        await db.collection('users').doc(user.uid).update({
            name: fullNameInput.value.trim(),
            phone: phoneInput.value.trim(),
            university: universitySelect.value,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Update UI
        profileName.textContent = fullNameInput.value.trim();
        const initials = fullNameInput.value.trim().split(' ').map(n => n[0]).join('').toUpperCase();
        profileAvatar.textContent = initials;
        
        alert("Profile updated successfully!");
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile: " + error.message);
    }
});

// Change password
changePasswordBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if (!user || !user.email) return;

    const newPassword = prompt("Enter your new password (at least 6 characters):");
    if (!newPassword || newPassword.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    user.updatePassword(newPassword)
        .then(() => {
            alert("Password changed successfully!");
        })
        .catch(error => {
            console.error("Error changing password:", error);
            alert("Error changing password: " + error.message);
        });
});

// Delete account
deleteAccountBtn.addEventListener('click', () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        return;
    }

    const user = auth.currentUser;
    if (!user) return;

    // First delete user data from Firestore
    db.collection('users').doc(user.uid).delete()
        .then(() => {
            // Then delete the auth account
            return user.delete();
        })
        .then(() => {
            alert("Account deleted successfully. You will be redirected to the home page.");
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error("Error deleting account:", error);
            alert("Error deleting account: " + error.message);
        });
});
