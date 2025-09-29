// Dashboard Logic and Interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (localStorage.getItem('sagoAppLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Initialize dashboard
    initializeDashboard();
    loadMockData();
    setupEventListeners();
});

// Mock data for sago plants
let mockPlants = [
    {
        id: 1,
        type: 'mature',
        lat: 45,
        lng: 35,
        image: 'https://images.unsplash.com/photo-1694552617360-c6ed680b23b8',
        uploadDate: '2024-01-15',
        confidence: 92
    },
    {
        id: 2,
        type: 'immature',
        lat: 25,
        lng: 60,
        image: 'https://images.unsplash.com/photo-1603086096508-c0ddb67371b4',
        uploadDate: '2024-01-14',
        confidence: 88
    },
    {
        id: 3,
        type: 'immature',
        lat: 65,
        lng: 40,
        image: 'https://images.pexels.com/photos/6455059/pexels-photo-6455059.jpeg',
        uploadDate: '2024-01-13',
        confidence: 85
    },
    {
        id: 4,
        type: 'immature',
        lat: 80,
        lng: 70,
        image: 'https://images.pexels.com/photos/9951266/pexels-photo-9951266.jpeg',
        uploadDate: '2024-01-12',
        confidence: 90
    }
];

let currentMode = 'detection';
let selectedFile = null;
let clickCoordinates = null;

function initializeDashboard() {
    // Update user welcome message
    const userData = JSON.parse(localStorage.getItem('sagoAppUser'));
    if (userData) {
        document.querySelector('.user-welcome').textContent = `Welcome, ${userData.name}`;
    }
    
    // Update statistics
    updateStatistics();
    
    // Render map pins
    renderMapPins();
    
    // Load recent uploads
    loadRecentUploads();
}

function updateStatistics() {
    const matureCount = mockPlants.filter(plant => plant.type === 'mature').length;
    const immatureCount = mockPlants.filter(plant => plant.type === 'immature').length;
    const totalCount = mockPlants.length;
    
    document.getElementById('matureCount').textContent = matureCount;
    document.getElementById('immatureCount').textContent = immatureCount;
    document.getElementById('totalCount').textContent = totalCount;
}

function renderMapPins() {
    const mapOverlay = document.getElementById('mapOverlay');
    mapOverlay.innerHTML = '';
    
    if (currentMode === 'detection') {
        mockPlants.forEach(plant => {
            const pin = document.createElement('div');
            pin.className = `map-pin ${plant.type}`;
            pin.style.left = `${plant.lng}%`;
            pin.style.top = `${plant.lat}%`;
            pin.textContent = plant.type.charAt(0).toUpperCase();
            pin.onclick = () => showPlantDetails(plant);
            mapOverlay.appendChild(pin);
        });
    }
}

function loadRecentUploads() {
    const uploadList = document.getElementById('uploadList');
    uploadList.innerHTML = '';
    
    // Sort by upload date (newest first)
    const sortedPlants = [...mockPlants].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    
    sortedPlants.slice(0, 5).forEach(plant => {
        const uploadItem = document.createElement('div');
        uploadItem.className = 'upload-item';
        uploadItem.onclick = () => showPlantDetails(plant);
        
        uploadItem.innerHTML = `
            <img src="${plant.image}" alt="Plant" class="upload-thumbnail">
            <div class="upload-details">
                <h4>Plant #${plant.id}</h4>
                <p>${formatDate(plant.uploadDate)}</p>
            </div>
            <div class="upload-status ${plant.type}">${plant.type}</div>
        `;
        
        uploadList.appendChild(uploadItem);
    });
}

function setupEventListeners() {
    // Map click handler for upload mode
    const mapContainer = document.getElementById('mapContainer');
    mapContainer.addEventListener('click', handleMapClick);
    
    // File input handler
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', handleFileSelection);
    
    // Drag and drop handlers
    const uploadArea = document.querySelector('.upload-area');
    setupDragAndDrop(uploadArea);
}

function handleMapClick(event) {
    if (currentMode !== 'upload') return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    
    clickCoordinates = { lat: percentY, lng: percentX };
    
    // Show upload instructions
    showToast('Location selected! Now upload a plant image.', 'success');
    
    // Highlight the upload section
    const uploadSection = document.getElementById('uploadSection');
    uploadSection.style.border = '2px solid #3498db';
    uploadSection.style.animation = 'pulse 1s ease-in-out 3';
    
    setTimeout(() => {
        uploadSection.style.border = '';
        uploadSection.style.animation = '';
    }, 3000);
}

function toggleView(mode) {
    currentMode = mode;
    
    // Update button states
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const activeButton = Array.from(buttons).find(btn => 
        btn.textContent.toLowerCase().includes(mode)
    );
    if (activeButton) activeButton.classList.add('active');
    
    // Show/hide upload section
    const uploadSection = document.getElementById('uploadSection');
    uploadSection.style.display = mode === 'upload' ? 'block' : 'none';
    
    // Update map cursor and pins
    const mapImage = document.getElementById('mapImage');
    if (mode === 'upload') {
        mapImage.style.cursor = 'crosshair';
        showToast('Click on the map to select a location for uploading plant images.', 'info');
    } else {
        mapImage.style.cursor = 'default';
    }
    
    renderMapPins();
}

function triggerFileUpload() {
    document.getElementById('fileInput').click();
}

function handleFileSelection(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file.', 'error');
        return;
    }
    
    selectedFile = file;
    
    // Show preview and classification options
    const reader = new FileReader();
    reader.onload = function(e) {
        const uploadArea = document.querySelector('.upload-area');
        uploadArea.innerHTML = `
            <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
            <p style="margin-top: 10px;">Image selected: ${file.name}</p>
        `;
        
        document.getElementById('classificationOptions').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function setupDragAndDrop(uploadArea) {
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = '#3498db';
        uploadArea.style.backgroundColor = '#ecf0f1';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = '#bdc3c7';
        uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = '#bdc3c7';
        uploadArea.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                selectedFile = file;
                handleFileSelection({ target: { files: [file] } });
            }
        }
    });
}

function classifyUpload(classification) {
    if (!selectedFile) {
        showToast('Please select an image first.', 'error');
        return;
    }
    
    if (!clickCoordinates) {
        showToast('Please select a location on the map first.', 'error');
        return;
    }
    
    // Create new plant entry
    const newPlant = {
        id: mockPlants.length + 1,
        type: classification,
        lat: clickCoordinates.lat,
        lng: clickCoordinates.lng,
        image: URL.createObjectURL(selectedFile),
        uploadDate: new Date().toISOString().split('T')[0],
        confidence: Math.floor(Math.random() * 20) + 80 // Random confidence 80-99%
    };
    
    // Add to mock data
    mockPlants.push(newPlant);
    
    // Update UI
    updateStatistics();
    loadRecentUploads();
    renderMapPins();
    
    // Reset upload form
    resetUploadForm();
    
    // Show success message
    showToast(`Plant classified as ${classification} and added to map!`, 'success');
    
    // Switch back to detection view
    toggleView('detection');
}

function resetUploadForm() {
    selectedFile = null;
    clickCoordinates = null;
    
    document.getElementById('fileInput').value = '';
    document.getElementById('classificationOptions').style.display = 'none';
    
    const uploadArea = document.querySelector('.upload-area');
    uploadArea.innerHTML = `
        <div class="upload-icon">📁</div>
        <p>Click to select image</p>
        <p class="upload-hint">or drag and drop here</p>
    `;
}

function showPlantDetails(plant) {
    const modal = document.getElementById('plantModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Plant #${plant.id} - ${plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}`;
    
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <img src="${plant.image}" alt="Plant Image" style="max-width: 100%; max-height: 300px; border-radius: 8px; margin-bottom: 15px;">
            <div style="text-align: left;">
                <p><strong>Classification:</strong> ${plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}</p>
                <p><strong>Upload Date:</strong> ${formatDate(plant.uploadDate)}</p>
                <p><strong>Confidence:</strong> ${plant.confidence}%</p>
                <p><strong>Location:</strong> ${plant.lat.toFixed(2)}, ${plant.lng.toFixed(2)}</p>
                <div style="margin-top: 15px;">
                    <div style="background: ${plant.type === 'mature' ? '#d5f4e6' : '#ffeaa7'}; padding: 10px; border-radius: 6px; display: inline-block;">
                        <strong>Status: </strong>
                        <span style="color: ${plant.type === 'mature' ? '#27ae60' : '#f39c12'};">
                            ${plant.type === 'mature' ? '🌴 Mature Sago' : '🌱 Immature Sago'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('plantModal').style.display = 'none';
}

function logout() {
    // Clear authentication data
    localStorage.removeItem('sagoAppLoggedIn');
    localStorage.removeItem('sagoAppUser');
    
    // Show logout message
    showToast('Logging out...', 'info');
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'info': '#3498db',
        'warning': '#f39c12'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    toast.textContent = message;
    
    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease-in';
            toast.addEventListener('animationend', () => toast.remove());
        }
    }, 3000);
}

// Load mock data function
function loadMockData() {
    // Generate some additional random plants for demonstration
    const additionalPlants = [];
    const plantImages = [
        'https://images.unsplash.com/photo-1694552617360-c6ed680b23b8',
        'https://images.unsplash.com/photo-1603086096508-c0ddb67371b4',
        'https://images.pexels.com/photos/6455059/pexels-photo-6455059.jpeg',
        'https://images.pexels.com/photos/9951266/pexels-photo-9951266.jpeg'
    ];
    
    // Add random plants to reach the displayed counts
    for (let i = 5; i <= 139; i++) {
        const isImmature = i <= 135; // First 135 are immature, rest are mature
        additionalPlants.push({
            id: i,
            type: isImmature ? 'immature' : 'mature',
            lat: Math.random() * 80 + 10,
            lng: Math.random() * 80 + 10,
            image: plantImages[Math.floor(Math.random() * plantImages.length)],
            uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            confidence: Math.floor(Math.random() * 20) + 80
        });
    }
    
    mockPlants = mockPlants.concat(additionalPlants);
}

// Global click handler for modal
window.onclick = function(event) {
    const modal = document.getElementById('plantModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
    
    if (event.key === 'u' || event.key === 'U') {
        toggleView('upload');
    }
    
    if (event.key === 'd' || event.key === 'D') {
        toggleView('detection');
    }
});