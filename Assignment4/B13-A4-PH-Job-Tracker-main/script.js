// Mock job data
const jobsData = [
    {
        id: 1,
        companyName: "Mobile First Corp",
        position: "React Native Developer",
        location: "Remote",
        type: "Full-time",
        salary: "$130,000 - $175,000",
        description: "We are looking for an experienced React Native Developer to join our mobile-first team. You will work on cutting-edge mobile applications for iOS and Android platforms.",
        status: "all"
    },
    {
        id: 2,
        companyName: "WebFlow Agency",
        position: "Web Designer & Developer",
        location: "Los Angeles, CA",
        type: "Part-time",
        salary: "$80,000 - $120,000",
        description: "Join our creative team to design and develop beautiful websites. Strong skills in modern web design and development required.",
        status: "all"
    },
    {
        id: 3,
        companyName: "Tech Solutions Inc.",
        position: "Frontend Developer",
        location: "Dhaka, Bangladesh",
        type: "Full-time",
        salary: "$60,000 - $80,000",
        description: "We are looking for a skilled Frontend Developer with experience in React, JavaScript, and modern CSS. You will work on cutting-edge web applications.",
        status: "all"
    },
    {
        id: 4,
        companyName: "Digital Agency Pro",
        position: "UI/UX Designer",
        location: "Remote",
        type: "Contract",
        salary: "$50,000 - $70,000",
        description: "Join our creative team to design beautiful and functional user interfaces. Experience with Figma and design systems required.",
        status: "all"
    },
    {
        id: 5,
        companyName: "StartupHub",
        position: "Full Stack Developer",
        location: "Chittagong, Bangladesh",
        type: "Full-time",
        salary: "$70,000 - $90,000",
        description: "Exciting opportunity to work on innovative projects. Must have experience with Node.js, React, and database design.",
        status: "all"
    },
    {
        id: 6,
        companyName: "E-commerce Giants",
        position: "React Developer",
        location: "Sylhet, Bangladesh",
        type: "Full-time",
        salary: "$65,000 - $85,000",
        description: "Build scalable e-commerce solutions using React and modern web technologies. Strong problem-solving skills required.",
        status: "all"
    },
    {
        id: 7,
        companyName: "FinTech Solutions",
        position: "JavaScript Developer",
        location: "Rajshahi, Bangladesh",
        type: "Part-time",
        salary: "$40,000 - $55,000",
        description: "Develop secure and efficient financial applications. Experience with security best practices is a plus.",
        status: "all"
    },
    {
        id: 8,
        companyName: "Cloud Systems Ltd",
        position: "Web Developer",
        location: "Khulna, Bangladesh",
        type: "Full-time",
        salary: "$55,000 - $75,000",
        description: "Create responsive web applications for cloud-based platforms. Experience with AWS is preferred.",
        status: "all"
    }
];

// Application state
let currentTab = 'all';
let jobs = [...jobsData];

// DOM elements
const totalJobsEl = document.getElementById('total-jobs');
const interviewCountEl = document.getElementById('interview-count');
const rejectedCountEl = document.getElementById('rejected-count');
const jobsCountEl = document.getElementById('jobs-count');
const jobsContainerEl = document.getElementById('jobs-container');
const noJobsMessageEl = document.getElementById('no-jobs-message');
const tabBtns = document.querySelectorAll('.tab-btn');

// Initialize the application
function init() {
    renderJobs();
    updateDashboard();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
}

// Switch between tabs
function switchTab(tab) {
    currentTab = tab;
    
    // Update active tab button
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    renderJobs();
    updateJobsCount();
}

// Render job cards based on current tab
function renderJobs() {
    const filteredJobs = jobs.filter(job => {
        if (currentTab === 'all') return job.status !== 'deleted';
        return job.status === currentTab;
    });
    
    if (filteredJobs.length === 0) {
        jobsContainerEl.style.display = 'none';
        noJobsMessageEl.style.display = 'block';
    } else {
        jobsContainerEl.style.display = 'grid';
        noJobsMessageEl.style.display = 'none';
        jobsContainerEl.innerHTML = filteredJobs.map(job => createJobCard(job)).join('');
        
        // Add event listeners to job cards
        addJobCardEventListeners();
    }
    
    updateJobsCount();
}

// Create job card HTML
function createJobCard(job) {
    const cardClass = job.status === 'interview' ? 'interview' : 
                     job.status === 'rejected' ? 'rejected' : '';
    
    const interviewBtnClass = job.status === 'interview' ? 'active' : '';
    const rejectedBtnClass = job.status === 'rejected' ? 'active' : '';
    
    const statusText = job.status === 'interview' ? 'INTERVIEW' : 
                      job.status === 'rejected' ? 'REJECTED' : 'NOT APPLIED';
    
    return `
        <div class="job-card ${cardClass}" data-job-id="${job.id}">
            <div class="job-header">
                <h3 class="company-name">${job.companyName}</h3>
                <p class="position">${job.position}</p>
            </div>
            <div class="job-meta">
                <span>📍 ${job.location}</span>
                <span>💼 ${job.type}</span>
                <span>💰 ${job.salary}</span>
            </div>
            <p class="job-description">${job.description}</p>
            <div class="job-status">${statusText}</div>
            <div class="job-actions">
                <button class="action-btn interview-btn ${interviewBtnClass}" 
                        data-job-id="${job.id}" 
                        data-action="interview">
                    Interview
                </button>
                <button class="action-btn rejected-btn ${rejectedBtnClass}" 
                        data-job-id="${job.id}" 
                        data-action="rejected">
                    Rejected
                </button>
                <button class="action-btn delete-btn" 
                        data-job-id="${job.id}" 
                        data-action="delete">
                    <img src="assets/delete.png" alt="Delete" class="delete-icon">
                </button>
            </div>
        </div>
    `;
}

// Add event listeners to job cards
function addJobCardEventListeners() {
    const actionBtns = document.querySelectorAll('.action-btn');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const jobId = parseInt(btn.dataset.jobId);
            const action = btn.dataset.action;
            
            if (action === 'delete') {
                deleteJob(jobId);
            } else {
                updateJobStatus(jobId, action);
            }
        });
    });
}

// Update job status
function updateJobStatus(jobId, newStatus) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    // If clicking the same status, remove it (go back to 'all')
    if (job.status === newStatus) {
        job.status = 'all';
    } else {
        job.status = newStatus;
    }
    
    renderJobs();
    updateDashboard();
}

// Delete job
function deleteJob(jobId) {
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) return;
    
    // Mark as deleted instead of removing from array
    jobs[jobIndex].status = 'deleted';
    
    renderJobs();
    updateDashboard();
}

// Update dashboard counts
function updateDashboard() {
    const totalJobs = jobs.filter(job => job.status !== 'deleted').length;
    const interviewJobs = jobs.filter(job => job.status === 'interview').length;
    const rejectedJobs = jobs.filter(job => job.status === 'rejected').length;
    
    totalJobsEl.textContent = totalJobs;
    interviewCountEl.textContent = interviewJobs;
    rejectedCountEl.textContent = rejectedJobs;
}

// Update jobs count in section header
function updateJobsCount() {
    const filteredJobs = jobs.filter(job => {
        if (currentTab === 'all') return job.status !== 'deleted';
        return job.status === currentTab;
    });
    
    const countText = filteredJobs.length === 1 ? 'Job' : 'Jobs';
    jobsCountEl.textContent = `${filteredJobs.length} ${countText}`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
