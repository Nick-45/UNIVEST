import { db } from './firebase.js';

// DOM Elements
const resourcesContainer = document.getElementById('resources-container');
const categoryBtns = document.querySelectorAll('.category-btn');
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-bar button');

// Current filter state
let currentCategory = 'all';
let currentSearch = '';

// Load resources from Firestore
function loadResources() {
    let query = db.collection('resources')
        .orderBy('createdAt', 'desc')
        .limit(12);

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
                        <p>We couldn't find any resources matching your criteria</p>
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
                                <span><i class="fas fa-clock"></i> ${duration}</span>
                                <span><i class="fas fa-calendar-alt"></i> ${resource.createdAt?.toDate().toLocaleDateString() || ''}</span>
                            </div>
                            
                            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="viewResource('${doc.id}')">
                                <i class="fas fa-${getResourceIcon(resource.type)}"></i> View ${resource.type || 'Resource'}
                            </button>
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
                    <button class="btn-primary" onclick="window.location.reload()">
                        <i class="fas fa-sync-alt"></i> Try Again
                    </button>
                </div>
            `;
        });
}

// Get appropriate icon for resource type
function getResourceIcon(type) {
    switch((type || '').toLowerCase()) {
        case 'video': return 'fa-play';
        case 'article': return 'fa-newspaper';
        case 'course': return 'fa-graduation-cap';
        case 'podcast': return 'fa-podcast';
        default: return 'fa-book-open';
    }
}

// Category button click handler
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.textContent.toLowerCase();
        loadResources();
    });
});

// Search button click handler
searchBtn.addEventListener('click', () => {
    currentSearch = searchInput.value.trim();
    loadResources();
});

// Search on Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentSearch = searchInput.value.trim();
        loadResources();
    }
});

// Global function to view resource
window.viewResource = function(resourceId) {
    window.location.href = `resource.html?id=${resourceId}`;
};

// Initial load
loadResources();
