const fs = require('fs');
const https = require('https');
const path = require('path');

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Juste120';
const OUTPUT_FILE = path.join(__dirname, '../src/assets/data/github-repos.json');

function fetchGitHubRepos() {
    console.log(`🚀 Fetching GitHub repos for ${GITHUB_USERNAME}...`);

    const options = {
        hostname: 'api.github.com',
        path: `/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
        headers: {
            'User-Agent': 'Node.js-Fetcher-Juste-Portfolio'
        }
    };

    https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const repos = JSON.parse(data);
                if (Array.isArray(repos)) {
                    const mapped = repos.map(repo => ({
                        id: `gh-${repo.id}`,
                        name: repo.name,
                        description: repo.description,
                        repoUrl: repo.html_url,
                        homepage: repo.homepage,
                        stars: repo.stargazers_count,
                        forks: repo.forks_count,
                        language: repo.language,
                        topics: repo.topics,
                        updatedAt: repo.updated_at,
                        source: 'github'
                    }));
                    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapped, null, 2));
                    console.log(`✅ ${mapped.length} GitHub repos saved to ${OUTPUT_FILE}`);
                } else {
                    console.error('❌ GitHub API returned non-array:', repos);
                }
            } catch (e) {
                console.error('❌ Error parsing GitHub data:', e);
            }
        });
    }).on('error', (err) => {
        console.error('❌ Connection error to GitHub API:', err);
    });
}

fetchGitHubRepos();
