// Import reels from JSON file to Supabase
const fs = require('fs');

async function importReels() {
    const reels = JSON.parse(fs.readFileSync('apify_reels_import.json', 'utf8'));

    console.log(`Importing ${reels.length} reels...`);

    let successCount = 0;

    for (const reel of reels) {
        try {
            const response = await fetch('https://trendllly.com/api/admin/import-reels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'trendllly-import-2025',
                    niche: 'GENERAL',
                    reels: [reel]
                })
            });

            const data = await response.json();
            if (data.success) {
                successCount++;
                console.log(`✓ Imported: ${reel.ownerUsername} - ${reel.url.slice(-15)}`);
            } else {
                console.log(`✗ Failed: ${reel.url} - ${data.error}`);
            }
        } catch (err) {
            console.log(`✗ Error: ${err.message}`);
        }
    }

    console.log(`\nDone! Imported ${successCount}/${reels.length} reels.`);
}

importReels();
