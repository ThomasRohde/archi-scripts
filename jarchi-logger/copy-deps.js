const fs = require('fs');
const path = require('path');

const dependencies = {
    'luxon': 'build/global/luxon.min.js',
    'json-formatter-js': 'dist/json-formatter.umd.js',
    'socket.io': 'client-dist/socket.io.min.js',
    'marked': 'marked.min.js'
};

const sourceDir = path.join(__dirname, 'node_modules');
const targetDir = path.join(__dirname, 'public', 'vendor');

// Create the target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

Object.entries(dependencies).forEach(([dep, file]) => {
    const source = path.join(sourceDir, dep, file);
    const target = path.join(targetDir, path.basename(file));

    if (fs.existsSync(source)) {
        fs.copyFileSync(source, target);
        console.log(`Copied ${source} to ${target}`);
    } else {
        console.error(`Error: ${source} does not exist`);
    }
});

console.log('Dependencies copied successfully!');