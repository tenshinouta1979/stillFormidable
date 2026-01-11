// Sample data for the bulletin board
const data = {
    opportunities: [
        {
            id: 1,
            title: "Senior Software Architecture Mentor",
            type: "mentorship",
            description: "Seeking an experienced software architect to mentor junior developers in system design and scalable architecture patterns.",
            organization: "TechBridge Initiative",
            duration: "6 months",
            commitment: "4 hours/week",
            skills: ["Software Architecture", "System Design", "Mentorship"]
        },
        {
            id: 2,
            title: "Healthcare Policy Consultant",
            type: "consulting",
            description: "Need expert guidance on healthcare policy reform with focus on community health equity and access.",
            organization: "Community Health Alliance",
            duration: "3 months",
            commitment: "10 hours/week",
            skills: ["Healthcare Policy", "Community Health", "Advocacy"]
        },
        {
            id: 3,
            title: "Educational Curriculum Advisor",
            type: "advisory",
            description: "Advisory role for developing inclusive STEM curriculum for underserved communities.",
            organization: "STEM Futures Foundation",
            duration: "Ongoing",
            commitment: "5 hours/month",
            skills: ["Education", "Curriculum Development", "STEM"]
        },
        {
            id: 4,
            title: "Keynote Speaker - Leadership Conference",
            type: "speaking",
            description: "Seeking inspiring speaker to share experiences on leadership, resilience, and career transitions.",
            organization: "POC Leadership Summit",
            duration: "1 day",
            commitment: "1 day + prep",
            skills: ["Public Speaking", "Leadership", "Mentorship"]
        },
        {
            id: 5,
            title: "Legal Aid Mentor",
            type: "mentorship",
            description: "Mentor law students and early-career attorneys in civil rights and social justice law.",
            organization: "Justice Now Legal Collective",
            duration: "1 year",
            commitment: "3 hours/week",
            skills: ["Legal", "Civil Rights", "Mentorship"]
        },
        {
            id: 6,
            title: "Business Strategy Consultant",
            type: "consulting",
            description: "Help minority-owned small businesses develop growth strategies and navigate challenges.",
            organization: "Small Business Empowerment Network",
            duration: "4 months",
            commitment: "8 hours/week",
            skills: ["Business Strategy", "Entrepreneurship", "Finance"]
        }
    ],
    
    professionals: [
        {
            id: 1,
            name: "Dr. Amara Johnson",
            expertise: "Healthcare",
            title: "Former Chief Medical Officer",
            yearsExperience: 35,
            bio: "Dedicated to improving healthcare access in underserved communities. Specialized in public health policy and community medicine.",
            skills: ["Public Health", "Healthcare Policy", "Community Medicine", "Leadership"],
            availability: "Mentorship & Consulting",
            community: "POC"
        },
        {
            id: 2,
            name: "Marcus Chen",
            expertise: "Technology",
            title: "Retired VP of Engineering",
            yearsExperience: 30,
            bio: "Built and led engineering teams at major tech companies. Passionate about diversity in tech and mentoring underrepresented engineers.",
            skills: ["Software Architecture", "Team Leadership", "Agile", "DevOps"],
            availability: "Mentorship & Advisory",
            community: "POC"
        },
        {
            id: 3,
            name: "Professor Keisha Williams",
            expertise: "Education",
            title: "Emeritus Professor of Education",
            yearsExperience: 40,
            bio: "Pioneer in culturally responsive teaching and inclusive education. Author of multiple books on educational equity.",
            skills: ["Curriculum Development", "Teacher Training", "Educational Equity", "Research"],
            availability: "Consulting & Speaking",
            community: "POC"
        },
        {
            id: 4,
            name: "Raj Patel",
            expertise: "Business",
            title: "Former Fortune 500 CEO",
            yearsExperience: 32,
            bio: "Led successful turnarounds and growth initiatives. Now focused on supporting minority entrepreneurs and startups.",
            skills: ["Executive Leadership", "Strategic Planning", "Finance", "Operations"],
            availability: "Advisory & Consulting",
            community: "POC"
        },
        {
            id: 5,
            name: "Attorney Maria Rodriguez",
            expertise: "Legal",
            title: "Retired Civil Rights Attorney",
            yearsExperience: 38,
            bio: "Fought landmark cases for civil rights and social justice. Committed to training the next generation of advocates.",
            skills: ["Civil Rights Law", "Litigation", "Policy Advocacy", "Community Organizing"],
            availability: "Mentorship & Pro Bono",
            community: "POC"
        },
        {
            id: 6,
            name: "Dr. James Washington",
            expertise: "Engineering",
            title: "Former Lead Aerospace Engineer",
            yearsExperience: 42,
            bio: "Contributed to major aerospace projects. Advocate for increasing diversity in STEM fields.",
            skills: ["Aerospace Engineering", "Project Management", "Systems Engineering", "Innovation"],
            availability: "Mentorship & Advisory",
            community: "POC"
        }
    ],
    
    quests: [
        {
            id: 1,
            title: "Community Tech Literacy Program",
            description: "Initiative to provide technology training and digital literacy to seniors and underserved communities.",
            goal: "Train 500 community members",
            progress: 65,
            participants: 12,
            skills: ["Technology", "Education", "Community Outreach"],
            status: "active"
        },
        {
            id: 2,
            title: "Healthcare Access Documentation Project",
            description: "Document and share best practices for improving healthcare access in marginalized communities.",
            goal: "Create comprehensive guide",
            progress: 40,
            participants: 8,
            skills: ["Healthcare", "Research", "Writing"],
            status: "active"
        },
        {
            id: 3,
            title: "Mentorship Network Expansion",
            description: "Build a nationwide network connecting POC professionals with students and early-career professionals.",
            goal: "Connect 1000 mentor-mentee pairs",
            progress: 30,
            participants: 25,
            skills: ["Networking", "Mentorship", "Program Management"],
            status: "active"
        },
        {
            id: 4,
            title: "Small Business Resource Hub",
            description: "Create an online hub with resources, templates, and guidance for minority-owned small businesses.",
            goal: "Launch comprehensive platform",
            progress: 55,
            participants: 15,
            skills: ["Business", "Web Development", "Content Creation"],
            status: "active"
        }
    ]
};

// State management
let state = {
    currentSection: 'opportunities',
    filters: {
        opportunities: { type: 'all', search: '' },
        professionals: { expertise: 'all', search: '' }
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeFilters();
    renderAllSections();
});

// Navigation
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(sectionName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionName) {
            btn.classList.add('active');
        }
    });
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');
    
    state.currentSection = sectionName;
}

// Filters
function initializeFilters() {
    // Opportunity filters
    const oppTypeFilter = document.getElementById('opportunity-filter');
    const oppSearchInput = document.getElementById('opportunity-search');
    
    oppTypeFilter.addEventListener('change', (e) => {
        state.filters.opportunities.type = e.target.value;
        renderOpportunities();
    });
    
    oppSearchInput.addEventListener('input', (e) => {
        state.filters.opportunities.search = e.target.value.toLowerCase();
        renderOpportunities();
    });
    
    // Professional filters
    const profExpertiseFilter = document.getElementById('professional-filter');
    const profSearchInput = document.getElementById('professional-search');
    
    profExpertiseFilter.addEventListener('change', (e) => {
        state.filters.professionals.expertise = e.target.value;
        renderProfessionals();
    });
    
    profSearchInput.addEventListener('input', (e) => {
        state.filters.professionals.search = e.target.value.toLowerCase();
        renderProfessionals();
    });
}

// Render functions
function renderAllSections() {
    renderOpportunities();
    renderProfessionals();
    renderQuests();
}

function renderOpportunities() {
    const container = document.getElementById('opportunities-list');
    const filtered = data.opportunities.filter(opp => {
        const typeMatch = state.filters.opportunities.type === 'all' || 
                         opp.type === state.filters.opportunities.type;
        const searchMatch = state.filters.opportunities.search === '' ||
                          opp.title.toLowerCase().includes(state.filters.opportunities.search) ||
                          opp.description.toLowerCase().includes(state.filters.opportunities.search) ||
                          opp.organization.toLowerCase().includes(state.filters.opportunities.search);
        return typeMatch && searchMatch;
    });
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No opportunities found</h3>
                <p>Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(opp => `
        <div class="card opportunity-card">
            <div class="card-header">
                <h3 class="card-title">${opp.title}</h3>
                <div class="card-subtitle">${opp.organization}</div>
            </div>
            <div class="card-content">
                <p>${opp.description}</p>
            </div>
            <div class="card-meta">
                <span class="tag primary">${opp.type}</span>
                <span class="tag">⏱️ ${opp.commitment}</span>
                <span class="tag">📅 ${opp.duration}</span>
            </div>
            <div class="card-meta">
                ${opp.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderProfessionals() {
    const container = document.getElementById('professionals-list');
    const filtered = data.professionals.filter(prof => {
        const expertiseMatch = state.filters.professionals.expertise === 'all' || 
                              prof.expertise.toLowerCase() === state.filters.professionals.expertise.toLowerCase();
        const searchMatch = state.filters.professionals.search === '' ||
                          prof.name.toLowerCase().includes(state.filters.professionals.search) ||
                          prof.title.toLowerCase().includes(state.filters.professionals.search) ||
                          prof.bio.toLowerCase().includes(state.filters.professionals.search);
        return expertiseMatch && searchMatch;
    });
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No professionals found</h3>
                <p>Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(prof => `
        <div class="card professional-card">
            <div class="card-header">
                <h3 class="card-title">${prof.name}</h3>
                <div class="card-subtitle">${prof.title}</div>
            </div>
            <div class="card-content">
                <p class="bio">${prof.bio}</p>
                <div class="years-experience">
                    ⭐ ${prof.yearsExperience} years of experience
                </div>
            </div>
            <div class="card-meta">
                <span class="tag accent">${prof.expertise}</span>
                <span class="tag success">Available: ${prof.availability}</span>
            </div>
            <div class="card-meta expertise-list">
                ${prof.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderQuests() {
    const container = document.getElementById('quests-list');
    
    container.innerHTML = data.quests.map(quest => `
        <div class="card quest-card">
            <div class="card-header">
                <h3 class="card-title">${quest.title}</h3>
                <div class="card-subtitle">Goal: ${quest.goal}</div>
            </div>
            <div class="card-content">
                <p>${quest.description}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${quest.progress}%"></div>
                </div>
                <div class="participants">
                    👥 ${quest.participants} professionals participating · ${quest.progress}% complete
                </div>
            </div>
            <div class="card-meta">
                <span class="tag success">${quest.status}</span>
                ${quest.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');
}
