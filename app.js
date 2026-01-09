// ============================================
// SIMULATED DATA PERSISTENCE (In-Memory Storage)
// Note: Uses JavaScript objects instead of localStorage
// due to sandboxed environment restrictions
// ============================================

const DB = {
  students: [],
  companies: [],
  posts: [],
  jobs: [],
  applications: [],
  currentUser: null,
  userType: null
};

// ============================================
// INITIALIZATION - Pre-populate with sample data
// ============================================

function initializeDatabase() {
  // Initial Students
  DB.students = [
    {
      id: 'S001',
      name: 'Arjun Patel',
      email: 'arjun@djsanghvi.edu',
      password: 'student123',
      profileImage: null,
      semester: 7,
      cgpa: 8.7,
      skills: ['Python', 'JavaScript', 'React', 'Machine Learning'],
      connections: 247,
      postsCount: 12,
      profileViews: 534
    },
    {
      id: 'S002',
      name: 'Priya Sharma',
      email: 'priya@djsanghvi.edu',
      password: 'student123',
      profileImage: null,
      semester: 6,
      cgpa: 9.1,
      skills: ['Java', 'Spring Boot', 'SQL', 'AWS'],
      connections: 189,
      postsCount: 8,
      profileViews: 421
    }
  ];

  // Initial Companies
  DB.companies = [
    {
      id: 'C001',
      name: 'TechCorp Solutions',
      email: 'techcorp@djsanghvi.edu',
      password: 'company123',
      industry: 'Software Development',
      size: '500-1000',
      about: 'Leading software development company specializing in cloud solutions and AI',
      logo: null
    },
    {
      id: 'C002',
      name: 'DataInsight Analytics',
      email: 'datainsight@djsanghvi.edu',
      password: 'company123',
      industry: 'Data Science',
      size: '100-500',
      about: 'Building the future of business intelligence and predictive analytics',
      logo: null
    }
  ];

  // Initial Posts
  DB.posts = [
    {
      id: 'P001',
      studentId: 'S001',
      studentName: 'Arjun Patel',
      profileImage: null,
      content: 'Just completed my internship at Amazon as a Software Development Engineer! Excited to apply what I\'ve learned.',
      image: null,
      timestamp: new Date('2025-11-05T09:00:00'),
      likes: 42,
      comments: 8
    },
    {
      id: 'P002',
      studentId: 'S002',
      studentName: 'Priya Sharma',
      profileImage: null,
      content: 'Proud to announce that I\'ve been selected for the Google Summer of Code 2025! 🎉',
      image: null,
      timestamp: new Date('2025-11-05T06:00:00'),
      likes: 67,
      comments: 15
    },
    {
      id: 'P003',
      studentId: 'S001',
      studentName: 'Arjun Patel',
      profileImage: null,
      content: 'Published my research paper on Machine Learning at IEEE International Conference. Link in bio!',
      image: null,
      timestamp: new Date('2025-11-04T15:30:00'),
      likes: 35,
      comments: 12
    }
  ];

  // Initial Jobs
  DB.jobs = [
    {
      id: 'J001',
      companyId: 'C001',
      companyName: 'TechCorp Solutions',
      title: 'Senior Software Engineer',
      description: 'Looking for experienced software engineer with strong backend development skills',
      location: 'Bangalore',
      salary: '12-18 LPA',
      type: 'Full-time',
      skills: ['Python', 'Java', 'AWS'],
      postedDate: new Date('2025-11-04'),
      applications: 3
    },
    {
      id: 'J002',
      companyId: 'C002',
      companyName: 'DataInsight Analytics',
      title: 'Data Science Intern',
      description: 'Exciting opportunity for data science enthusiasts to work on real-world analytics projects',
      location: 'Mumbai',
      salary: '8-12 LPA',
      type: 'Internship',
      skills: ['Python', 'Machine Learning', 'SQL'],
      postedDate: new Date('2025-11-03'),
      applications: 5
    },
    {
      id: 'J003',
      companyId: 'C001',
      companyName: 'TechCorp Solutions',
      title: 'Full Stack Developer',
      description: 'Build scalable web applications using modern tech stack. ReactJS and Node.js experience required',
      location: 'Bangalore',
      salary: '10-16 LPA',
      type: 'Full-time',
      skills: ['JavaScript', 'React', 'Node.js'],
      postedDate: new Date('2025-11-02'),
      applications: 7
    }
  ];

  // Initial Applications
  DB.applications = [];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId(prefix) {
  return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }
  return 'Just now';
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function calculateMatchScore(studentSkills, jobSkills) {
  const matchingSkills = studentSkills.filter(skill => 
    jobSkills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
  );
  const baseScore = (matchingSkills.length / jobSkills.length) * 100;
  return Math.min(95, Math.max(85, Math.floor(baseScore)));
}

function compressImage(file, maxWidth = 800) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ============================================
// UI NAVIGATION FUNCTIONS
// ============================================

function showLoginSelection() {
  hideAllScreens();
  document.getElementById('login-selection').classList.remove('hidden');
}

function showStudentLogin() {
  hideAllScreens();
  document.getElementById('student-login').classList.remove('hidden');
}

function showStudentSignup() {
  hideAllScreens();
  document.getElementById('student-signup').classList.remove('hidden');
}

function showCompanyLogin() {
  hideAllScreens();
  document.getElementById('company-login').classList.remove('hidden');
}

function showCompanySignup() {
  hideAllScreens();
  document.getElementById('company-signup').classList.remove('hidden');
}

function hideAllScreens() {
  document.querySelectorAll('.login-screen').forEach(screen => {
    screen.classList.add('hidden');
  });
}

function showApp() {
  hideAllScreens();
  document.getElementById('app-header').classList.remove('hidden');
  document.getElementById('app-nav').classList.remove('hidden');
  document.getElementById('app-main').classList.remove('hidden');
}

function logout() {
  DB.currentUser = null;
  DB.userType = null;
  document.getElementById('app-header').classList.add('hidden');
  document.getElementById('app-nav').classList.add('hidden');
  document.getElementById('app-main').classList.add('hidden');
  showLoginSelection();
}

// ============================================
// AUTHENTICATION
// ============================================

function handleStudentLogin(e) {
  e.preventDefault();
  const email = document.getElementById('student-email').value;
  const password = document.getElementById('student-password').value;

  const student = DB.students.find(s => s.email === email && s.password === password);
  
  if (student) {
    DB.currentUser = student;
    DB.userType = 'student';
    initStudentDashboard();
  } else {
    alert('Invalid credentials. Try demo: arjun@djsanghvi.edu / student123');
  }
}

function handleStudentSignup(e) {
  e.preventDefault();
  
  const newStudent = {
    id: generateId('S'),
    name: document.getElementById('signup-student-name').value,
    email: document.getElementById('signup-student-email').value,
    password: document.getElementById('signup-student-password').value,
    semester: parseInt(document.getElementById('signup-student-semester').value),
    cgpa: parseFloat(document.getElementById('signup-student-cgpa').value),
    skills: document.getElementById('signup-student-skills').value.split(',').map(s => s.trim()),
    profileImage: null,
    connections: 0,
    postsCount: 0,
    profileViews: 0
  };

  DB.students.push(newStudent);
  DB.currentUser = newStudent;
  DB.userType = 'student';
  initStudentDashboard();
}

function handleCompanyLogin(e) {
  e.preventDefault();
  const email = document.getElementById('company-email').value;
  const password = document.getElementById('company-password').value;

  const company = DB.companies.find(c => c.email === email && c.password === password);
  
  if (company) {
    DB.currentUser = company;
    DB.userType = 'company';
    initCompanyDashboard();
  } else {
    alert('Invalid credentials. Try demo: techcorp@djsanghvi.edu / company123');
  }
}

function handleCompanySignup(e) {
  e.preventDefault();
  
  const newCompany = {
    id: generateId('C'),
    name: document.getElementById('signup-company-name').value,
    email: document.getElementById('signup-company-email').value,
    password: document.getElementById('signup-company-password').value,
    industry: document.getElementById('signup-company-industry').value,
    size: document.getElementById('signup-company-size').value,
    about: document.getElementById('signup-company-about').value,
    logo: null
  };

  DB.companies.push(newCompany);
  DB.currentUser = newCompany;
  DB.userType = 'company';
  initCompanyDashboard();
}

// ============================================
// DASHBOARD INITIALIZATION
// ============================================

function initStudentDashboard() {
  showApp();
  
  // Update user info
  const userInfo = document.getElementById('user-info');
  const initials = getInitials(DB.currentUser.name);
  const imgTag = DB.currentUser.profileImage 
    ? `<img src="${DB.currentUser.profileImage}" alt="Profile">` 
    : initials;
  
  userInfo.innerHTML = `
    <div class="user-avatar-small">${imgTag}</div>
    <span><strong>${DB.currentUser.name}</strong></span>
  `;

  // Setup navigation
  const navContainer = document.getElementById('nav-container');
  navContainer.innerHTML = `
    <button class="tab-btn active" data-tab="home" onclick="switchTab('home')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      </svg>
      Home Feed
    </button>
    <button class="tab-btn" data-tab="jobs" onclick="switchTab('jobs')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      </svg>
      Job Recommendations
    </button>
    <button class="tab-btn" data-tab="profile" onclick="switchTab('profile')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      My Profile
    </button>
    <button class="tab-btn" data-tab="companies" onclick="switchTab('companies')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      </svg>
      Companies
    </button>
  `;

  switchTab('home');
}

function initCompanyDashboard() {
  showApp();
  
  // Update user info
  const userInfo = document.getElementById('user-info');
  const initials = getInitials(DB.currentUser.name);
  const imgTag = DB.currentUser.logo 
    ? `<img src="${DB.currentUser.logo}" alt="Logo">` 
    : initials;
  
  userInfo.innerHTML = `
    <div class="user-avatar-small">${imgTag}</div>
    <span><strong>${DB.currentUser.name}</strong></span>
  `;

  // Setup navigation
  const navContainer = document.getElementById('nav-container');
  navContainer.innerHTML = `
    <button class="tab-btn active" data-tab="company-jobs" onclick="switchTab('company-jobs')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      </svg>
      Posted Jobs
    </button>
    <button class="tab-btn" data-tab="company-candidates" onclick="switchTab('company-candidates')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      Candidates
    </button>
    <button class="tab-btn" data-tab="company-profile" onclick="switchTab('company-profile')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      Company Profile
    </button>
    <button class="tab-btn" data-tab="company-applications" onclick="switchTab('company-applications')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
      Applications
    </button>
  `;

  switchTab('company-jobs');
}

// ============================================
// TAB SWITCHING
// ============================================

function switchTab(tabName) {
  // Update active tab button
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    }
  });

  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  // Show loading
  showLoading();

  // Simulate API call delay
  setTimeout(() => {
    hideLoading();
    loadTabData(tabName);
    
    // Show selected tab content
    const contentId = tabName + '-content';
    const content = document.getElementById(contentId);
    if (content) {
      content.classList.add('active');
    }
  }, 500);
}

function showLoading() {
  document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}

function loadTabData(tabName) {
  switch(tabName) {
    case 'home':
      renderStudentFeed();
      break;
    case 'jobs':
      renderJobRecommendations();
      break;
    case 'profile':
      renderStudentProfile();
      break;
    case 'companies':
      renderCompanies();
      break;
    case 'company-jobs':
      renderCompanyJobs();
      break;
    case 'company-candidates':
      renderCandidates();
      break;
    case 'company-profile':
      renderCompanyProfile();
      break;
    case 'company-applications':
      renderApplications();
      break;
  }
}

// Old data structure for compatibility
const appData = {
  _deprecated: true,
  studentsPosts: [
    {
      id: 1,
      name: "Arjun Patel",
      achievement: "Just completed my internship at Amazon as a Software Development Engineer! Excited to apply what I've learned.",
      timestamp: "2 hours ago",
      likes: 42,
      comments: 8
    },
    {
      id: 2,
      name: "Priya Sharma",
      achievement: "Proud to announce that I've been selected for the Google Summer of Code 2025! 🎉",
      timestamp: "5 hours ago",
      likes: 67,
      comments: 15
    },
    {
      id: 3,
      name: "Rahul Verma",
      achievement: "Published my research paper on Machine Learning at IEEE International Conference. Link in bio!",
      timestamp: "1 day ago",
      likes: 35,
      comments: 12
    },
    {
      id: 4,
      name: "Neha Gupta",
      achievement: "Won first place in the National Hackathon 2025 with my AI-powered healthcare solution.",
      timestamp: "3 days ago",
      likes: 89,
      comments: 24
    }
  ],
  companies: [
    {
      id: 1,
      name: "TechCorp Solutions",
      sector: "Software Development",
      description: "Leading software development company specializing in cloud solutions and AI",
      active_jobs: 8,
      industry: "Technology"
    },
    {
      id: 2,
      name: "DataInsight Analytics",
      sector: "Data Science",
      description: "Building the future of business intelligence and predictive analytics",
      active_jobs: 5,
      industry: "Analytics"
    },
    {
      id: 3,
      name: "WebForce Digital",
      sector: "Web Development",
      description: "Premium digital solutions and web development services for global brands",
      active_jobs: 6,
      industry: "Digital Marketing"
    },
    {
      id: 4,
      name: "CloudNine Infrastructure",
      sector: "Cloud Computing",
      description: "Enterprise cloud infrastructure and DevOps solutions provider",
      active_jobs: 4,
      industry: "Cloud Services"
    }
  ],
  jobRecommendations: [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp Solutions",
      match_score: 94,
      description: "Looking for experienced software engineer with strong backend development skills",
      location: "Bangalore",
      salary_range: "12-18 LPA"
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataInsight Analytics",
      match_score: 87,
      description: "Exciting opportunity for data science enthusiasts to work on real-world analytics projects",
      location: "Mumbai",
      salary_range: "8-12 LPA"
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "WebForce Digital",
      match_score: 91,
      description: "Build scalable web applications using modern tech stack. ReactJS and Node.js experience required",
      location: "Bangalore",
      salary_range: "10-16 LPA"
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "CloudNine Infrastructure",
      match_score: 85,
      description: "Manage cloud infrastructure and implement CI/CD pipelines for enterprise clients",
      location: "Pune",
      salary_range: "11-15 LPA"
    },
    {
      id: 5,
      title: "Machine Learning Engineer",
      company: "TechCorp Solutions",
      match_score: 92,
      description: "Develop and deploy machine learning models for computer vision applications",
      location: "Bangalore",
      salary_range: "13-19 LPA"
    }
  ],
  userProfile: {
    name: "You",
    email: "student@djsanghvi.edu",
    enrollment_number: "2K21CS123",
    semester: "7th Semester",
    cgpa: "8.7",
    skills: ["Python", "JavaScript", "React", "Machine Learning", "Data Analysis", "SQL"],
    connections_count: 247,
    posts_created: 12,
    profile_views: 534,
    recent_connections: ["Arjun Patel", "Priya Sharma", "Rahul Verma"]
  }
};

// Tab Management
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const loadingState = document.getElementById('loading');

// Initialize app
function initApp() {
  // Load home tab by default
  loadTabData('home');
  
  // Add event listeners to tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
}

// Switch between tabs
function switchTab(tabName) {
  // Update active tab button
  tabs.forEach(tab => {
    tab.classList.remove('active');
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    }
  });
  
  // Hide all tab contents
  tabContents.forEach(content => {
    content.classList.remove('active');
  });
  
  // Show loading state
  showLoading();
  
  // Load tab data with simulated delay
  setTimeout(() => {
    loadTabData(tabName);
    hideLoading();
    
    // Show the selected tab content
    const selectedContent = document.getElementById(`${tabName}-content`);
    if (selectedContent) {
      selectedContent.classList.add('active');
    }
  }, 500);
}

// Show loading state
function showLoading() {
  loadingState.classList.remove('hidden');
}

// Hide loading state
function hideLoading() {
  loadingState.classList.add('hidden');
}

// Load data for specific tab
function loadTabData(tabName) {
  switch(tabName) {
    case 'home':
      renderPosts();
      break;
    case 'companies':
      renderCompanies();
      break;
    case 'jobs':
      renderJobs();
      break;
    case 'profile':
      renderProfile();
      break;
  }
}

// Render student posts
function renderPosts() {
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = '';
  
  appData.studentsPosts.forEach(post => {
    const initials = post.name.split(' ').map(n => n[0]).join('');
    
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.innerHTML = `
      <div class="post-header">
        <div class="post-avatar">${initials}</div>
        <div class="post-info">
          <h3>${post.name}</h3>
          <span class="post-time">${post.timestamp}</span>
        </div>
      </div>
      <div class="post-content">
        ${post.achievement}
      </div>
      <div class="post-actions">
        <button class="post-action-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          ${post.likes} Likes
        </button>
        <button class="post-action-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          ${post.comments} Comments
        </button>
      </div>
    `;
    postsContainer.appendChild(postCard);
  });
}

// Render companies
function renderCompanies() {
  const companiesContainer = document.getElementById('companies-container');
  companiesContainer.innerHTML = '';
  
  appData.companies.forEach(company => {
    const initials = company.name.split(' ').map(n => n[0]).join('');
    
    const companyCard = document.createElement('div');
    companyCard.className = 'company-card';
    companyCard.innerHTML = `
      <div class="company-logo">${initials}</div>
      <h3 class="company-name">${company.name}</h3>
      <span class="company-sector">${company.sector}</span>
      <p class="company-description">${company.description}</p>
      <div class="company-jobs">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <strong>${company.active_jobs}</strong> active job postings
      </div>
      <button class="btn btn--secondary btn--full-width">View Jobs</button>
    `;
    companiesContainer.appendChild(companyCard);
  });
}

// Render job recommendations
function renderJobs() {
  const jobsContainer = document.getElementById('jobs-container');
  jobsContainer.innerHTML = '';
  
  appData.jobRecommendations.forEach(job => {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    jobCard.innerHTML = `
      <div class="job-header">
        <div>
          <h3 class="job-title">${job.title}</h3>
          <p class="job-company">${job.company}</p>
        </div>
        <div class="match-badge">${job.match_score}% Match</div>
      </div>
      <p class="job-description">${job.description}</p>
      <div class="job-details">
        <div class="job-detail">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          ${job.location}
        </div>
        <div class="job-detail">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          ${job.salary_range}
        </div>
      </div>
      <a href="https://djsisaca.tech"><button class="btn btn--primary">Apply Now</button></a>
    `;
    jobsContainer.appendChild(jobCard);
  });
}

// Render user profile
function renderProfile() {
  const profileContainer = document.getElementById('profile-container');
  const profile = appData.userProfile;
  
  profileContainer.innerHTML = `
    <div class="profile-sidebar">
      <div class="profile-avatar">Y</div>
      <h2 class="profile-name">${profile.name}</h2>
      <p class="profile-email">${profile.email}</p>
      <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-8);">${profile.enrollment_number}</p>
      <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-16);">${profile.semester}</p>
      <button class="btn btn--primary btn--full-width">Edit Profile</button>
      <div class="profile-stats">
        <div class="profile-stat">
          <span class="profile-stat-label">CGPA</span>
          <span class="profile-stat-value">${profile.cgpa}</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-label">Connections</span>
          <span class="profile-stat-value">${profile.connections_count}</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-label">Posts Created</span>
          <span class="profile-stat-value">${profile.posts_created}</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-label">Profile Views</span>
          <span class="profile-stat-value">${profile.profile_views}</span>
        </div>
      </div>
    </div>
    <div class="profile-main">
      <div class="profile-section">
        <h3>Skills</h3>
        <div class="skills-grid">
          ${profile.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
      <div class="profile-section">
        <h3>
          Recent Connections
          <span style="font-size: var(--font-size-sm); font-weight: var(--font-weight-normal); color: var(--color-text-secondary);">${profile.connections_count} total</span>
        </h3>
        <div class="connections-list">
          ${profile.recent_connections.map((connection, index) => {
            const initials = connection.split(' ').map(n => n[0]).join('');
            return `
              <div class="connection-item">
                <div class="connection-avatar">${initials}</div>
                <span class="connection-name">${connection}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// ============================================
// RENDER FUNCTIONS - STUDENT VIEWS
// ============================================

function renderStudentFeed() {
  const container = document.getElementById('posts-container');
  const sortedPosts = [...DB.posts].sort((a, b) => b.timestamp - a.timestamp);
  
  container.innerHTML = sortedPosts.map(post => {
    const initials = getInitials(post.studentName);
    const imgTag = post.profileImage 
      ? `<img src="${post.profileImage}" alt="${post.studentName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` 
      : initials;
    
    const postImageHtml = post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : '';
    
    const deleteBtn = post.studentId === DB.currentUser.id 
      ? `<button class="post-action-btn" onclick="deletePost('${post.id}')">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <polyline points="3 6 5 6 21 6"></polyline>
             <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
           </svg>
           Delete
         </button>` 
      : '';
    
    return `
      <div class="post-card">
        <div class="post-header">
          <div class="post-avatar">${imgTag}</div>
          <div class="post-info">
            <h3>${post.studentName}</h3>
            <span class="post-time">${getTimeAgo(post.timestamp)}</span>
          </div>
        </div>
        <div class="post-content">${post.content}</div>
        ${postImageHtml}
        <div class="post-actions">
          <button class="post-action-btn" onclick="likePost('${post.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            ${post.likes} Likes
          </button>
          <button class="post-action-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            ${post.comments} Comments
          </button>
          ${deleteBtn}
        </div>
      </div>
    `;
  }).join('');
}

function renderJobRecommendations() {
  const container = document.getElementById('jobs-container');
  const studentSkills = DB.currentUser.skills;
  
  const jobsWithScores = DB.jobs.map(job => ({
    ...job,
    matchScore: calculateMatchScore(studentSkills, job.skills)
  })).sort((a, b) => b.matchScore - a.matchScore);
  
  container.innerHTML = jobsWithScores.map(job => {
    const alreadyApplied = DB.applications.some(
      app => app.studentId === DB.currentUser.id && app.jobId === job.id
    );
    
    return `
      <div class="job-card">
        <div class="job-header">
          <div>
            <h3 class="job-title">${job.title}</h3>
            <p class="job-company">${job.companyName}</p>
          </div>
          <div class="match-badge">${job.matchScore}% Match</div>
        </div>
        <p class="job-description">${job.description}</p>
        <div class="job-details">
          <div class="job-detail">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${job.location}
          </div>
          <div class="job-detail">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            ${job.salary}
          </div>
          <div class="job-detail">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            </svg>
            ${job.type}
          </div>
        </div>
        <button class="btn ${alreadyApplied ? 'btn--secondary' : 'btn--primary'}" 
                onclick="applyForJob('${job.id}')" 
                ${alreadyApplied ? 'disabled' : ''}>
          ${alreadyApplied ? 'Already Applied' : 'Apply Now'}
        </button>
      </div>
    `;
  }).join('');
}

function renderStudentProfile() {
  const container = document.getElementById('profile-container');
  const profile = DB.currentUser;
  const initials = getInitials(profile.name);
  const imgTag = profile.profileImage 
    ? `<img src="${profile.profileImage}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` 
    : initials;
  
  container.innerHTML = `
    <div class="profile-sidebar">
      <div class="profile-avatar">${imgTag}</div>
      <label class="btn btn--secondary btn--full-width" style="cursor: pointer; margin-bottom: var(--space-16);">
        Upload Photo
        <input type="file" accept="image/*" onchange="uploadProfileImage(event)" style="display: none;">
      </label>
      <h2 class="profile-name">${profile.name}</h2>
      <p class="profile-email">${profile.email}</p>
      <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-16);">${profile.semester}th Semester</p>
      <div class="profile-stats">
        <div class="profile-stat">
          <span class="profile-stat-label">CGPA</span>
          <span class="profile-stat-value">${profile.cgpa}</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-label">Connections</span>
          <span class="profile-stat-value">${profile.connections}</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-label">Posts Created</span>
          <span class="profile-stat-value">${profile.postsCount}</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-label">Profile Views</span>
          <span class="profile-stat-value">${profile.profileViews}</span>
        </div>
      </div>
    </div>
    <div class="profile-main">
      <div class="profile-section">
        <h3>Skills</h3>
        <div class="skills-grid">
          ${profile.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
      <div class="profile-section">
        <h3>Your Applications</h3>
        <div>${renderStudentApplications()}</div>
      </div>
    </div>
  `;
}

function renderStudentApplications() {
  const myApplications = DB.applications.filter(app => app.studentId === DB.currentUser.id);
  
  if (myApplications.length === 0) {
    return '<p style="color: var(--color-text-secondary);">No applications yet</p>';
  }
  
  return myApplications.map(app => {
    const job = DB.jobs.find(j => j.id === app.jobId);
    return `
      <div class="connection-item" style="justify-content: space-between;">
        <div>
          <div class="connection-name">${job.title}</div>
          <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${job.companyName}</div>
        </div>
        <span class="application-status ${app.status}">${app.status}</span>
      </div>
    `;
  }).join('');
}

function renderCompanies() {
  const container = document.getElementById('companies-container');
  
  container.innerHTML = DB.companies.map(company => {
    const initials = getInitials(company.name);
    const jobCount = DB.jobs.filter(j => j.companyId === company.id).length;
    
    return `
      <div class="company-card">
        <div class="company-logo">${initials}</div>
        <h3 class="company-name">${company.name}</h3>
        <span class="company-sector">${company.industry}</span>
        <p class="company-description">${company.about}</p>
        <div class="company-jobs">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          </svg>
          <strong>${jobCount}</strong> active job postings
        </div>
        <button class="btn btn--secondary" style="width: 100%;" onclick="viewCompanyJobs('${company.id}')">View Jobs</button>
      </div>
    `;
  }).join('');
}

// ============================================
// RENDER FUNCTIONS - COMPANY VIEWS
// ============================================

function renderCompanyJobs() {
  const container = document.getElementById('company-jobs-container');
  const companyJobs = DB.jobs.filter(j => j.companyId === DB.currentUser.id);
  
  if (companyJobs.length === 0) {
    container.innerHTML = '<p style="color: var(--color-text-secondary);">No jobs posted yet. Click "Post New Job" to create one.</p>';
    return;
  }
  
  container.innerHTML = companyJobs.map(job => `
    <div class="company-job-card">
      <h3>${job.title}</h3>
      <div class="job-meta">
        <span>${job.applications} applications</span>
        <span>Posted ${getTimeAgo(job.postedDate)}</span>
        <span>${job.type}</span>
      </div>
      <p style="color: var(--color-text-secondary); margin-bottom: var(--space-16);">${job.description}</p>
      <div class="job-actions">
        <button class="btn btn--secondary btn--sm" onclick="deleteJob('${job.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderCandidates() {
  const container = document.getElementById('candidates-container');
  const companyApplications = DB.applications.filter(app => {
    const job = DB.jobs.find(j => j.id === app.jobId);
    return job && job.companyId === DB.currentUser.id;
  });
  
  if (companyApplications.length === 0) {
    container.innerHTML = '<p style="color: var(--color-text-secondary);">No candidates have applied yet.</p>';
    return;
  }
  
  const uniqueStudents = [...new Set(companyApplications.map(app => app.studentId))];
  
  container.innerHTML = uniqueStudents.map(studentId => {
    const student = DB.students.find(s => s.id === studentId);
    const initials = getInitials(student.name);
    const studentApps = companyApplications.filter(app => app.studentId === studentId);
    
    return `
      <div class="candidate-card">
        <div class="candidate-avatar">${initials}</div>
        <div class="candidate-info">
          <h3>${student.name}</h3>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-8);">CGPA: ${student.cgpa} | Semester: ${student.semester}</p>
          <div class="candidate-skills">
            ${student.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Applied for: ${studentApps.length} position(s)</p>
        </div>
      </div>
    `;
  }).join('');
}

function renderCompanyProfile() {
  const container = document.getElementById('company-profile-container');
  const company = DB.currentUser;
  const initials = getInitials(company.name);
  const imgTag = company.logo 
    ? `<img src="${company.logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);">` 
    : initials;
  
  container.innerHTML = `
    <div class="profile-sidebar">
      <div class="company-logo" style="width: 120px; height: 120px; margin: 0 auto var(--space-20);">${imgTag}</div>
      <label class="btn btn--secondary btn--full-width" style="cursor: pointer; margin-bottom: var(--space-16);">
        Upload Logo
        <input type="file" accept="image/*" onchange="uploadCompanyLogo(event)" style="display: none;">
      </label>
      <h2 class="profile-name">${company.name}</h2>
      <p class="profile-email">${company.email}</p>
    </div>
    <div class="profile-main">
      <div class="profile-section">
        <h3>Company Information</h3>
        <div class="profile-stat" style="margin-bottom: var(--space-12);">
          <span class="profile-stat-label">Industry</span>
          <span class="profile-stat-value">${company.industry}</span>
        </div>
        <div class="profile-stat" style="margin-bottom: var(--space-12);">
          <span class="profile-stat-label">Company Size</span>
          <span class="profile-stat-value">${company.size}</span>
        </div>
        <div style="margin-top: var(--space-16);">
          <h4 style="font-size: var(--font-size-base); margin-bottom: var(--space-8);">About</h4>
          <p style="color: var(--color-text-secondary);">${company.about}</p>
        </div>
      </div>
    </div>
  `;
}

function renderApplications(filter = 'all') {
  const container = document.getElementById('applications-container');
  const companyJobs = DB.jobs.filter(j => j.companyId === DB.currentUser.id);
  const jobIds = companyJobs.map(j => j.id);
  
  let applications = DB.applications.filter(app => jobIds.includes(app.jobId));
  
  if (filter !== 'all') {
    applications = applications.filter(app => app.status === filter);
  }
  
  if (applications.length === 0) {
    container.innerHTML = '<p style="color: var(--color-text-secondary);">No applications found.</p>';
    return;
  }
  
  container.innerHTML = applications.map(app => {
    const student = DB.students.find(s => s.id === app.studentId);
    const job = DB.jobs.find(j => j.id === app.jobId);
    const initials = getInitials(student.name);
    
    return `
      <div class="application-card">
        <div class="application-header">
          <div>
            <h3 style="font-size: var(--font-size-lg); margin-bottom: var(--space-8);">${student.name}</h3>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Applied for: ${job.title}</p>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">CGPA: ${student.cgpa} | Semester: ${student.semester}</p>
          </div>
          <span class="application-status ${app.status}">${app.status}</span>
        </div>
        <div class="candidate-skills">
          ${student.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
        ${app.status === 'pending' ? `
          <div class="candidate-actions">
            <button class="btn btn--primary btn--sm" onclick="updateApplicationStatus('${app.id}', 'accepted')">Accept</button>
            <button class="btn btn--secondary btn--sm" onclick="updateApplicationStatus('${app.id}', 'rejected')">Reject</button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// ============================================
// ACTION HANDLERS
// ============================================

function handleCreatePost(e) {
  e.preventDefault();
  
  const content = document.getElementById('post-content').value;
  const imageInput = document.getElementById('post-image');
  const imagePreview = document.getElementById('image-preview');
  
  const newPost = {
    id: generateId('P'),
    studentId: DB.currentUser.id,
    studentName: DB.currentUser.name,
    profileImage: DB.currentUser.profileImage,
    content: content,
    image: imagePreview.dataset.imageData || null,
    timestamp: new Date(),
    likes: 0,
    comments: 0
  };
  
  DB.posts.unshift(newPost);
  DB.currentUser.postsCount++;
  
  // Reset form
  document.getElementById('post-content').value = '';
  imageInput.value = '';
  imagePreview.innerHTML = '';
  imagePreview.classList.add('hidden');
  delete imagePreview.dataset.imageData;
  
  renderStudentFeed();
}

function handlePostImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (file.size > 5 * 1024 * 1024) {
    alert('Image too large. Maximum size is 5MB.');
    return;
  }
  
  compressImage(file).then(base64 => {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = `
      <img src="${base64}" alt="Preview">
      <button class="image-preview-remove" onclick="removePostImage()" type="button">&times;</button>
    `;
    preview.classList.remove('hidden');
    preview.dataset.imageData = base64;
  });
}

function removePostImage() {
  const preview = document.getElementById('image-preview');
  preview.innerHTML = '';
  preview.classList.add('hidden');
  delete preview.dataset.imageData;
  document.getElementById('post-image').value = '';
}

function likePost(postId) {
  const post = DB.posts.find(p => p.id === postId);
  if (post) {
    post.likes++;
    renderStudentFeed();
  }
}

function deletePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    DB.posts = DB.posts.filter(p => p.id !== postId);
    DB.currentUser.postsCount--;
    renderStudentFeed();
  }
}

function applyForJob(jobId) {
  const newApplication = {
    id: generateId('A'),
    studentId: DB.currentUser.id,
    jobId: jobId,
    companyId: DB.jobs.find(j => j.id === jobId).companyId,
    status: 'pending',
    appliedDate: new Date()
  };
  
  DB.applications.push(newApplication);
  
  const job = DB.jobs.find(j => j.id === jobId);
  job.applications++;
  
  alert('Application submitted successfully!');
  renderJobRecommendations();
}

function uploadProfileImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  compressImage(file).then(base64 => {
    DB.currentUser.profileImage = base64;
    renderStudentProfile();
    initStudentDashboard(); // Refresh header
  });
}

function uploadCompanyLogo(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  compressImage(file).then(base64 => {
    DB.currentUser.logo = base64;
    renderCompanyProfile();
    initCompanyDashboard(); // Refresh header
  });
}

function viewCompanyJobs(companyId) {
  // Could filter jobs by company - for now just switch to jobs tab
  switchTab('jobs');
}

function showCreateJobModal() {
  document.getElementById('create-job-modal').classList.remove('hidden');
}

function closeCreateJobModal() {
  document.getElementById('create-job-modal').classList.add('hidden');
}

function handleCreateJob(e) {
  e.preventDefault();
  
  const newJob = {
    id: generateId('J'),
    companyId: DB.currentUser.id,
    companyName: DB.currentUser.name,
    title: document.getElementById('job-title').value,
    description: document.getElementById('job-description').value,
    location: document.getElementById('job-location').value,
    salary: document.getElementById('job-salary').value,
    type: document.getElementById('job-type').value,
    skills: document.getElementById('job-skills').value.split(',').map(s => s.trim()),
    postedDate: new Date(),
    applications: 0
  };
  
  DB.jobs.push(newJob);
  
  // Reset form
  e.target.reset();
  closeCreateJobModal();
  
  alert('Job posted successfully!');
  renderCompanyJobs();
}

function deleteJob(jobId) {
  if (confirm('Are you sure you want to delete this job?')) {
    DB.jobs = DB.jobs.filter(j => j.id !== jobId);
    renderCompanyJobs();
  }
}

function updateApplicationStatus(appId, status) {
  const app = DB.applications.find(a => a.id === appId);
  if (app) {
    app.status = status;
    renderApplications();
    alert(`Application ${status}!`);
  }
}

function filterApplications(status) {
  renderApplications(status);
}

// ============================================
// INITIALIZATION
// ============================================

function initApp() {
  initializeDatabase();
  showLoginSelection();
  
  // Setup form handlers
  document.getElementById('student-login-form').addEventListener('submit', handleStudentLogin);
  document.getElementById('student-signup-form').addEventListener('submit', handleStudentSignup);
  document.getElementById('company-login-form').addEventListener('submit', handleCompanyLogin);
  document.getElementById('company-signup-form').addEventListener('submit', handleCompanySignup);
  document.getElementById('create-post-form').addEventListener('submit', handleCreatePost);
  document.getElementById('post-image').addEventListener('change', handlePostImageUpload);
  document.getElementById('create-job-form').addEventListener('submit', handleCreateJob);
}

// Start the app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
