// Portfolio Projects Manager
class ProjectsManager {
    constructor() {
        this.projects = [];
        this.currentFilter = 'All';
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.setupEventListeners();
        this.displayProjects();
    }

    async loadProjects() {
        try {
            const response = await fetch('projects.json');
            const data = await response.json();
            this.projects = data.projects;
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.category;
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.displayProjects();
            });
        });

        // Close modal
        const modal = document.getElementById('projectModal');
        const closeBtn = document.querySelector('.modal-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Click outside modal to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    displayProjects() {
        const grid = document.getElementById('projectsGrid');
        
        // Filter projects
        const filteredProjects = this.currentFilter === 'All' 
            ? this.projects 
            : this.projects.filter(p => p.category === this.currentFilter);

        grid.innerHTML = filteredProjects.map(project => `
            <div class="project-card" onclick="projectsManager.openProject('${project.id}')">
                <div class="project-thumbnail">
                    <img src="../${project.thumbnail}" alt="${project.title}" 
                         onerror="this.onerror=null; this.src='../images/portfolio/placeholder.jpg'">
                    <div class="project-overlay">
                        <span class="view-project">View Project</span>
                    </div>
                </div>
                <div class="project-info">
                    <span class="project-category">${project.category}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                </div>
            </div>
        `).join('');
    }

    openProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('projectModal');
        const content = document.getElementById('projectModalContent');

        const instagramLink = project.instagramUrl 
            ? `<a href="${project.instagramUrl}" target="_blank" class="btn btn-secondary">View on Instagram</a>` 
            : '';

        const youtubeLink = project.youtubeUrl 
            ? `<a href="${project.youtubeUrl}" target="_blank" class="btn btn-secondary">Watch on YouTube</a>` 
            : '';

        content.innerHTML = `
            <div class="project-modal-header">
                <span class="project-category">${project.category}</span>
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                <div class="project-links">
                    ${instagramLink}
                    ${youtubeLink}
                </div>
            </div>
            <div class="project-gallery">
                ${project.images.map(img => `
                    <img src="${img}" alt="${project.title}" loading="lazy">
                `).join('')}
            </div>
        `;

        modal.classList.add('active');
    }
}

// Initialize when DOM is ready
let projectsManager;
document.addEventListener('DOMContentLoaded', () => {
    projectsManager = new ProjectsManager();
});
