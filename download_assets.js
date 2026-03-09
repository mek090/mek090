const https = require('https');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

// Reliable Giphy/Alternative GIF URLs
const filesToDownload = [
    { url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXB0NHRydG1vMHJjbmxlZXJ3dWs4c2NpeXE5MjQyaWFkb3Via3lwYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/xIZlYFnTOINrWxYuxB/giphy.gif', filename: 'anya_heh.gif'},
    { url: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjQ3dWhjZGdtOGQwMDlsM3c2cmRpcWx6eWNzMmlrNmJiaDJkNGd1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/HmgnQQjEQbBqEMbij4/giphy.gif', filename: 'anya_excited.gif'},
    { url: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWF4cjVldDZ4YnZieGpramt6MDB0MnZkY3BwZjRjMWN0b3JicWFkbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/she46kBqwkBkbvjGkE/giphy.gif', filename: 'anya_peanuts.gif'},
    { url: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHZheWIyZmZiZmR4am1jcWxwcHI0Y2Q3MzYxYWwwOTJ6bDdzbWRmZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/lM2x9CpQJnHPVKNGdj/giphy.gif', filename: 'anya_smile.gif'}
];

console.log('Starting downloads...');

filesToDownload.forEach(file => {
    const filePath = path.join(assetsDir, file.filename);
    const downloadFile = (url) => {
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                downloadFile(res.headers.location);
            } else if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filePath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Downloaded: ${file.filename}`);
                });
            } else {
                console.error(`Failed to download ${file.filename}: ${res.statusCode}`);
            }
        }).on('error', (err) => {
            console.error(`Error downloading ${file.filename}:`, err.message);
        });
    }
    
    downloadFile(file.url);
});

// Also copy the generated banner 
const srcBanner = path.join('C:', 'Users', 'ritti', '.gemini', 'antigravity', 'brain', '6ef5f1e2-94b4-4fb6-b5ba-a1fd97f8722b', 'anya_banner_new_1773049192009.png');
const destBanner = path.join(assetsDir, 'anya_banner.png');

try {
    if (fs.existsSync(srcBanner)) {
        fs.copyFileSync(srcBanner, destBanner);
        console.log('Copied generated banner to assets/anya_banner.png');
    }
} catch(e) {
    console.error('Failed to copy generated banner', e);
}
