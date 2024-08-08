const http = require('http');
const fs = require('fs');
const path = require('path');

const API_HOST = 'localhost';
const API_PORT = 4000;  // Adjust if your API port is different
const API_PATH = '/console';

// Sample markdown content
const markdownContent = `
# JArchi Logger Test

This is a test of the JArchi Logger console feature.

## Features

- Real-time updates
- Markdown support
- Easy integration

\`\`\`javascript
console.log('Hello, JArchi Logger!');
\`\`\`

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
| Data 3   | Data 4   |

`;

function sendMarkdownToConsole(markdown) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ markdown });

        const options = {
            hostname: API_HOST,
            port: API_PORT,
            path: API_PATH,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('Markdown sent successfully', res.statusCode);
                    resolve();
                } else {
                    console.error('Error sending markdown:', res.statusCode, data);
                    reject(new Error(`HTTP Error: ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error sending markdown:', error.message);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Function to read markdown from a file
function readMarkdownFromFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

// Main function
async function main() {
    try {
        // Send the sample markdown
        await sendMarkdownToConsole(markdownContent);

        // Check if a file path is provided as a command line argument
        const filePath = process.argv[2];
        if (filePath) {
            const fullPath = path.resolve(filePath);
            console.log(`Reading markdown from file: ${fullPath}`);
            const fileContent = readMarkdownFromFile(fullPath);
            await sendMarkdownToConsole(fileContent);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

main();