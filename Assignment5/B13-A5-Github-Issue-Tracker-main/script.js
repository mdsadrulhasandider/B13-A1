// API Endpoints
const API_BASE_URL = 'https://phi-lab-server.vercel.app/api/v1/lab';
const ALL_ISSUES_URL = `${API_BASE_URL}/issues`;
const SINGLE_ISSUE_URL = `${API_BASE_URL}/issue`;
const SEARCH_ISSUES_URL = `${API_BASE_URL}/issues/search`;

// Demo Credentials
const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Global Variables
let allIssues = [];
let currentFilter = 'all';
let currentUser = null;

// DOM Elements
const loginPage = document.getElementById('loginPage');
const mainPage = document.getElementById('mainPage');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const issuesGrid = document.getElementById('issuesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const issueCount = document.getElementById('issueCount');
const searchInput = document.getElementById('searchInput');
const newIssueBtn = document.getElementById('newIssueBtn');
const issueModal = document.getElementById('issueModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModalBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkAuth();
});

// Setup Event Listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    searchInput.addEventListener('input', handleSearch);
    newIssueBtn.addEventListener('click', handleNewIssue);
    closeModalBtn.addEventListener('click', closeIssueModal);
    
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => handleTabChange(btn.dataset.tab));
    });
    
    // Close modal on outside click
    issueModal.addEventListener('click', (e) => {
        if (e.target === issueModal) closeIssueModal();
    });
}

// Check Authentication
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        showMainPage();
    } else {
        showLoginPage();
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        currentUser = { username };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainPage();
    } else {
        alert('Invalid credentials! Please use demo credentials.');
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showLoginPage();
}

// Show Login Page
function showLoginPage() {
    loginPage.classList.remove('hidden');
    mainPage.classList.add('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
}

// Show Main Page
function showMainPage() {
    loginPage.classList.add('hidden');
    mainPage.classList.remove('hidden');
    loadAllIssues();
}

// Load All Issues
async function loadAllIssues() {
    try {
        showLoading(true);
        const response = await fetch(ALL_ISSUES_URL);
        if (!response.ok) throw new Error('Failed to fetch issues');
        
        const responseData = await response.json();
        allIssues = responseData.data || responseData; // Handle both response formats
        displayIssues();
        updateIssueCount();
    } catch (error) {
        console.error('Error loading issues:', error);
        showError('Failed to load issues. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Search Issues
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (query === '') {
        displayIssues();
        updateIssueCount();
        return;
    }
    
    try {
        showLoading(true);
        const response = await fetch(`${SEARCH_ISSUES_URL}?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to search issues');
        
        const responseData = await response.json();
        const searchResults = responseData.data || responseData;
        displayIssues(searchResults);
        updateIssueCount(searchResults.length);
    } catch (error) {
        console.error('Error searching issues:', error);
        showError('Failed to search issues. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Handle Tab Change
function handleTabChange(tab) {
    currentFilter = tab;
    
    // Update tab styles
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    // Add active styles to selected tab
    const activeTab = document.querySelector(`[data-tab="${tab}"]`);
    if (activeTab) {
        activeTab.classList.remove('bg-gray-200', 'text-gray-700');
        activeTab.classList.add('bg-blue-600', 'text-white');
    }
    
    // Display filtered issues and update count
    displayIssues();
    updateIssueCount();
}

// Display Issues
function displayIssues(issues = null) {
    const issuesToDisplay = issues || getFilteredIssues();
    
    if (issuesToDisplay.length === 0) {
        issuesGrid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No issues found</div>';
        return;
    }
    
    issuesGrid.innerHTML = issuesToDisplay.map(issue => createIssueCard(issue)).join('');
    
    // Add click listeners to issue cards
    document.querySelectorAll('.issue-card').forEach(card => {
        card.addEventListener('click', () => {
            const issueId = card.dataset.issueId;
            showIssueDetails(issueId);
        });
    });
}

// Get Filtered Issues
function getFilteredIssues() {
    if (currentFilter === 'all') return allIssues;
    
    return allIssues.filter(issue => {
        const status = issue.status ? issue.status.toLowerCase() : '';
        return status === currentFilter;
    });
}

// Create Issue Card
function createIssueCard(issue) {
    const status = issue.status || 'open';
    const priority = issue.priority || 'medium';
    const labels = issue.labels || [];
    const createdAt = new Date(issue.createdAt || issue.created_at).toLocaleDateString();
    
    const borderClass = status === 'open' ? 'border-t-4 border-green-500' : 'border-t-4 border-purple-500';
    
    const priorityColors = {
        high: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md transform hover:scale-105 transition-all',
        medium: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transform hover:scale-105 transition-all', 
        low: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md transform hover:scale-105 transition-all'
    };
    
    const labelColors = {
        bug: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200 hover:from-red-100 hover:to-red-200 transition-all',
        'help wanted': 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all',
        enhancement: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200 hover:from-green-100 hover:to-green-200 transition-all'
    };
    
    const statusIcon = status === 'open' ? 
        '<div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-500 shadow-md hover:shadow-lg transition-all"><img src="assets/Open-Status.png" alt="Open" class="w-4 h-4 sm:w-5 sm:h-5"></div>' : 
        '<div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-500 shadow-md hover:shadow-lg transition-all"><img src="assets/Closed- Status .png" alt="Closed" class="w-4 h-4 sm:w-5 sm:h-5"></div>';
    
    return `
        <div class="issue-card bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md border border-gray-200 p-3 sm:p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.03] hover:border-blue-300 ${borderClass}" data-issue-id="${issue.id}">
            <div class="flex items-start space-x-3">
                ${statusIcon}
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between mb-2">
                        <h3 class="font-bold text-gray-900 text-sm sm:text-base leading-tight flex-1 mr-2 hover:text-blue-600 transition-colors duration-200">${issue.title}</h3>
                        <span class="px-2 py-1 text-xs font-bold rounded-lg flex-shrink-0 ${priorityColors[priority.toLowerCase()]}">
                            ${priority.toUpperCase()}
                        </span>
                    </div>
                    
                    <p class="text-gray-700 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">${issue.description || 'No description available'}</p>
                    
                    <div class="flex flex-wrap gap-1 mb-3">
                        ${labels.map(label => `
                            <span class="px-2 py-0.5 text-xs font-semibold rounded-full ${labelColors[label.toLowerCase()] || 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200'}">
                                ${label}
                            </span>
                        `).join('')}
                    </div>
                    
                    <div class="flex flex-col text-xs sm:text-sm text-gray-600 font-medium">
                        <span>#${issue.id} by ${issue.author || issue.user?.login || 'Unknown'}</span>
                        <span>${createdAt}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show Issue Details
async function showIssueDetails(issueId) {
    try {
        showLoading(true);
        const response = await fetch(`${SINGLE_ISSUE_URL}/${issueId}`);
        if (!response.ok) throw new Error('Failed to fetch issue details');
        
        const responseData = await response.json();
        const issue = responseData.data || responseData; // Handle both response formats
        displayIssueModal(issue);
    } catch (error) {
        console.error('Error fetching issue details:', error);
        showError('Failed to load issue details. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Display Issue Modal
function displayIssueModal(issue) {
    modalTitle.textContent = issue.title;
    
    const status = issue.status || 'open';
    const priority = issue.priority || 'medium';
    const labels = issue.labels || [];
    const createdAt = new Date(issue.createdAt || issue.created_at).toLocaleDateString();
    
    const statusIcon = status === 'open' ? 
        '<div class="w-4 h-4 bg-green-500 rounded flex items-center justify-center"><img src="assets/Open-Status.png" alt="Open" class="w-3 h-3"></div>' : 
        '<div class="w-4 h-4 bg-purple-500 rounded flex items-center justify-center"><img src="assets/Closed- Status .png" alt="Closed" class="w-3 h-3"></div>';
    
    const statusColors = {
        open: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
        closed: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'
    };
    
    const priorityColors = {
        high: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md',
        medium: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md', 
        low: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
    };
    
    const labelColors = {
        bug: 'bg-red-100 text-red-800 border border-red-200',
        'help wanted': 'bg-blue-100 text-blue-800 border border-blue-200',
        enhancement: 'bg-green-100 text-green-800 border border-green-200'
    };
    
    modalContent.innerHTML = `
        <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-4 space-y-2 sm:space-y-0">
                <div class="flex items-center space-x-2">
                    ${statusIcon}
                    <span class="px-3 py-1 text-sm font-semibold rounded-full border ${statusColors[status]}">
                        ${status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                    <span>Opened by ${issue.author || issue.user?.login || 'Unknown'}</span>
                    <span class="hidden sm:inline">•</span>
                    <span>${createdAt}</span>
                </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-4">
                ${labels.map(label => `
                    <span class="px-3 py-1 text-sm font-semibold rounded-full border ${labelColors[label.toLowerCase()] || 'bg-gray-100 text-gray-800 border border-gray-300'}">
                        ${label}
                    </span>
                `).join('')}
            </div>
            
            <div class="border-t pt-4">
                <h3 class="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Description</h3>
                <p class="text-gray-600 text-sm sm:text-base">${issue.description || 'No description available'}</p>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                <div>
                    <h4 class="font-medium text-gray-700 text-sm sm:text-base">Assignee</h4>
                    <p class="text-gray-600 text-sm sm:text-base">${issue.assignee || issue.assignee?.login || 'Not assigned'}</p>
                </div>
                <div>
                    <h4 class="font-medium text-gray-700 text-sm sm:text-base">Priority</h4>
                    <span class="inline-block px-3 py-1 text-sm font-bold rounded-lg ${priorityColors[priority.toLowerCase()]} mt-1">
                        ${priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </span>
                </div>
            </div>
        </div>
    `;
    
    issueModal.classList.remove('hidden');
}

// Handle New Issue
function handleNewIssue() {
    modalTitle.textContent = 'Create New Issue';
    
    modalContent.innerHTML = `
        <div class="bg-white rounded-lg p-4 sm:p-6">
            <form id="newIssueForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" id="newIssueTitle" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" placeholder="Enter issue title">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="newIssueDescription" rows="4" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" placeholder="Enter issue description"></textarea>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select id="newIssuePriority" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Labels (comma separated)</label>
                        <input type="text" id="newIssueLabels" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" placeholder="bug, enhancement, help wanted">
                    </div>
                </div>
                
                <div class="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 pt-4 space-y-2 sm:space-y-0">
                    <button type="button" onclick="closeIssueModal()" class="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200 text-sm sm:text-base">
                        Cancel
                    </button>
                    <button type="submit" class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm sm:text-base">
                        Create Issue
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Add form submit listener
    setTimeout(() => {
        const form = document.getElementById('newIssueForm');
        if (form) {
            form.addEventListener('submit', handleCreateIssue);
        }
    }, 100);
    
    issueModal.classList.remove('hidden');
}

// Handle Create Issue
function handleCreateIssue(e) {
    e.preventDefault();
    
    const title = document.getElementById('newIssueTitle').value.trim();
    const description = document.getElementById('newIssueDescription').value.trim();
    const priority = document.getElementById('newIssuePriority').value;
    const labelsInput = document.getElementById('newIssueLabels').value.trim();
    const labels = labelsInput ? labelsInput.split(',').map(label => label.trim()).filter(label => label) : [];
    
    if (!title || !description) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newIssue = {
        id: allIssues.length + 1,
        title,
        description,
        priority,
        labels,
        status: 'open',
        author: currentUser?.username || 'Unknown',
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString()
    };
    
    allIssues.unshift(newIssue);
    displayIssues();
    updateIssueCount();
    closeIssueModal();
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
    successDiv.textContent = 'Issue created successfully!';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Close Issue Modal
function closeIssueModal() {
    issueModal.classList.add('hidden');
}

// Update Issue Count
function updateIssueCount(count = null) {
    const total = count !== null ? count : getFilteredIssues().length;
    issueCount.textContent = `${total} issue${total !== 1 ? 's' : ''}`;
}

// Show/Hide Loading
function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
    issuesGrid.style.display = show ? 'none' : 'grid';
}

// Show Error Message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}
