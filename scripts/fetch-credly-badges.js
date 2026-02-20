const fs = require('fs');
const https = require('https');
const path = require('path');

const CREDLY_USER_ID = process.env.CREDLY_USER_ID || 'b9db7bea-e2e8-4ccb-ade7-a7a4d2379c90';
const OUTPUT_FILE = path.join(__dirname, '../src/assets/data/credly-badges.json');

function fetchCredlyBadges() {
    console.log(`🚀 Fetching Credly badges for user ${CREDLY_USER_ID}...`);

    // Using Credly's public profile API
    const options = {
        hostname: 'www.credly.com',
        path: `/users/${CREDLY_USER_ID}/badges.json`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json'
        }
    };

    https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (response && response.data && Array.isArray(response.data)) {
                    const mapped = response.data.map(item => ({
                        id: item.id,
                        name: item.badge_template.name,
                        description: item.badge_template.description,
                        issuer: item.issuer.entities[0].entity.name,
                        imageUrl: item.badge_template.image_url,
                        badgeUrl: `https://www.credly.com/badges/${item.id}/public_url`,
                        verifyUrl: `https://www.credly.com/badges/${item.id}/public_url`,
                        issuedAt: item.issued_at,
                        expiresAt: item.expires_at,
                        isActive: item.state === 'active',
                        category: item.badge_template.issuer_id === 'adept' ? 'Cloud' : 'Tech'
                    }));
                    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapped, null, 2));
                    console.log(`✅ ${mapped.length} Credly badges saved to ${OUTPUT_FILE}`);
                } else {
                    console.warn('⚠️ Credly response empty or invalid format. Check if profile is public.');
                    // Don't overwrite with empty if it failed
                }
            } catch (e) {
                console.error('❌ Error parsing Credly data:', e);
            }
        });
    }).on('error', (err) => {
        console.error('❌ Connection error to Credly API:', err);
    });
}

fetchCredlyBadges();
