const fs = require('fs');
const https = require('https');
const path = require('path');

const GITLAB_USERNAME = process.env.GITLAB_USERNAME || 'Juste120';
const GITLAB_TOKEN = process.env.GITLAB_TOKEN; // Optional, but better for API limits
const OUTPUT_FILE = path.join(__dirname, '../src/assets/data/gitlab-projects.json');

function fetchGitLabProjects() {
    console.log(`🚀 Fetching GitLab projects for ${GITLAB_USERNAME}...`);

    let pathUrl = `/api/v4/users/${GITLAB_USERNAME}/projects?simple=true&per_page=100`;
    const headers = {
        'User-Agent': 'Node.js-Fetcher-Juste-Portfolio'
    };
    if (GITLAB_TOKEN) {
        headers['PRIVATE-TOKEN'] = GITLAB_TOKEN;
    }

    const options = {
        hostname: 'gitlab.com',
        path: pathUrl,
        headers: headers
    };

    https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const projects = JSON.parse(data);
                if (Array.isArray(projects)) {
                    const mapped = projects.map(p => ({
                        id: `gl-${p.id}`,
                        name: p.name,
                        description: p.description,
                        repoUrl: p.web_url,
                        stars: p.star_count,
                        forks: p.forks_count,
                        updatedAt: p.last_activity_at,
                        source: 'gitlab'
                    }));
                    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapped, null, 2));
                    console.log(`✅ ${mapped.length} GitLab projects saved to ${OUTPUT_FILE}`);
                } else {
                    console.error('❌ GitLab API returned non-array:', projects);
                }
            } catch (e) {
                console.error('❌ Error parsing GitLab data:', e);
            }
        });
    }).on('error', (err) => {
        console.error('❌ Connection error to GitLab API:', err);
    });
}

fetchGitLabProjects();
