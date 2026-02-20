const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/assets/data');
const PINNED_FILE = path.join(DATA_DIR, 'pinned-projects.json');
const GITHUB_FILE = path.join(DATA_DIR, 'github-repos.json');
const GITLAB_FILE = path.join(DATA_DIR, 'gitlab-projects.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'all-projects.json');

function loadJson(file) {
    if (!fs.existsSync(file)) return [];
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        console.error(`❌ Error reading ${file}:`, e);
        return [];
    }
}

function mergeProjects() {
    console.log('🔄 Merging all projects...');

    const pinned = loadJson(PINNED_FILE);
    const github = loadJson(GITHUB_FILE);
    const gitlab = loadJson(GITLAB_FILE);

    // Create a map to de-duplicate and merge
    const projectsMap = new Map();

    // 1. Start with pinned (they take priority)
    pinned.forEach(p => {
        const id = p.name.toLowerCase().replace(/\s+/g, '-');
        projectsMap.set(id, {
            ...p,
            id,
            source: 'manual',
            hasDemo: !!p.demoUrl,
            stars: 0,
            forks: 0
        });
    });

    // 2. Add GitHub
    github.forEach(p => {
        const id = p.name.toLowerCase().replace(/\s+/g, '-');
        if (projectsMap.has(id)) {
            const existing = projectsMap.get(id);
            projectsMap.set(id, {
                ...existing,
                githubUrl: p.repoUrl,
                stars: Math.max(existing.stars || 0, p.stars || 0),
                forks: Math.max(existing.forks || 0, p.forks || 0),
                source: existing.source === 'manual' ? 'manual' : 'both'
            });
        } else {
            projectsMap.set(id, {
                ...p,
                id,
                hasDemo: !!p.homepage,
                demoUrl: p.homepage || null
            });
        }
    });

    // 3. Add GitLab
    gitlab.forEach(p => {
        const id = p.name.toLowerCase().replace(/\s+/g, '-');
        if (projectsMap.has(id)) {
            const existing = projectsMap.get(id);
            projectsMap.set(id, {
                ...existing,
                gitlabUrl: p.repoUrl,
                stars: Math.max(existing.stars || 0, p.stars || 0),
                forks: Math.max(existing.forks || 0, p.forks || 0),
                source: (existing.source === 'github' || existing.source === 'both') ? 'both' : existing.source
            });
        } else {
            projectsMap.set(id, {
                ...p,
                id,
                hasDemo: false,
                demoUrl: null
            });
        }
    });

    const allProjects = Array.from(projectsMap.values());
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProjects, null, 2));
    console.log(`✅ Merged ${allProjects.length} projects into ${OUTPUT_FILE}`);
}

mergeProjects();
