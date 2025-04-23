import { auth, db } from './firebase.js';

// DOM Elements
const resourcesContainer = document.getElementById('resources-container');
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-bar button');
const categoryBtns = document.querySelectorAll('.category-btn');

// Current filter state
let currentCategory = 'all';
let currentSearch = '';

// Check auth state
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    // Load resources
    loadResources();
});

// Load resources from Firestore
function loadResources() {
    let query = db.collection('resources')
        .orderBy('createdAt', 'desc');

    // Apply category filter if not 'all'
    if (currentCategory !== 'all') {
        query = query.where('categories', 'array-contains', currentCategory);
    }

    // Apply search filter if exists
    if (currentSearch) {
        query = query.where('keywords', 'array-contains', currentSearch.toLowerCase());
    }

    query.get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                resourcesContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-book-open"></i>
                        <h3>No Resources Found</h3>
                        <p>Try a different search or category</p>
                    </div>
                `;
                return;
            }

            resourcesContainer.innerHTML = '';
            
            querySnapshot.forEach(doc => {
                const resource = doc.data();
                const duration = resource.duration ? `${resource.duration} min` : '';
                
                resourcesContainer.innerHTML += `
                    <div class="resource-card">
                        <div class="resource-image" style="background-image: url('${resource.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'}')"></div>
                        <div class="resource-details">
                            <span class="resource-type">${resource.type || 'Article'}</span>
                            <h3 class="resource-title">${resource.title}</h3>
                            <p class="resource-description">${resource.description || 'No description available'}</p>
                            <div class="resource-meta">
                                <span>${duration} • ${resource.level || 'Beginner'}</span>
                                <button class="btn btn-primary" onclick="viewResource('${doc.id}')">
                                    <i class="fas fa-${getResourceActionIcon(resource.type)}"></i> ${getResourceActionText(resource.type)}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Error loading resources:", error);
            resourcesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Resources</h3>
                    <p>${error.message}</p>
                </div>
            `;
        });
}

// Get appropriate action text for resource type
function getResourceActionText(type) {
    switch(type) {
        case 'video': return 'Watch';
        case 'article': return 'Read';
        case 'course': return 'Start';
        case 'podcast': return 'Listen';
        default: return 'View';
    }
}

// Get appropriate action icon for resource type
function getResourceActionIcon(type) {
    switch(type) {
        case 'video': return 'play';
        case 'article': return 'book-open';
        case 'course': return 'graduation-cap';
        case 'podcast': return 'headphones';
        default: return 'arrow-right';
    }
}

// Search functionality
searchBtn.addEventListener('click', () => {
    currentSearch = searchInput.value.trim();
    loadResources();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentSearch = searchInput.value.trim();
        loadResources();
    }
});

// Category filter buttons
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.textContent.toLowerCase();
        loadResources();
    });
});

// Global function for viewing resources
window.viewResource = function(resourceId) {
    window.location.href = `resource.html?id=${resourceId}`;
};
