const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const marked = require('marked');

// Paths
const scriptsDir = path.join(__dirname, 'scripts');
const docsSourceDir = path.join(__dirname, 'docs-source');
const tempJsDir = path.join(__dirname, 'temp_js');
const outputDir = path.join(__dirname, 'docs');
const tutorialsOutputDir = path.join(__dirname, 'scripts', 'docs');
const configPath = path.join(__dirname, 'jsdoc.conf.json');
const commonStylesPath = path.join(__dirname, 'scripts', 'lib', 'commonStyles.js');

// Ensure temp and output directories exist
fs.mkdirSync(tempJsDir, { recursive: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(tutorialsOutputDir, { recursive: true });

// Load common styles
const commonStyles = require(commonStylesPath);
// Function to process files
function processFiles(directory) {
    const processedFiles = [];
    fs.readdirSync(directory, { withFileTypes: true }).forEach(dirent => {
        if (dirent.isDirectory()) {
            // Recursively process subdirectories
            processFiles(path.join(directory, dirent.name)).forEach(file => processedFiles.push(file));
        } else if (dirent.isFile() && path.extname(dirent.name) === '.ajs') {
            const scriptPath = path.join(directory, dirent.name);
            const mdPath = path.join(docsSourceDir, `${dirent.name}.md`);
            const tempJsPath = path.join(tempJsDir, `${dirent.name}`);

            // Only process files that have corresponding .md files
            if (fs.existsSync(mdPath)) {
                let content = fs.readFileSync(scriptPath, 'utf8');
                let mdContent = fs.readFileSync(mdPath, 'utf8');

                // Extract JSDoc comments from .md file
                const jsdocComments = mdContent.match(/\/\*\*[\s\S]*?\*\//g) || [];

                // Prepend JSDoc comments to the script content
                content = jsdocComments.join('\n') + '\n' + content;

                // Write to temp .js file
                fs.writeFileSync(tempJsPath, content);
                processedFiles.push(tempJsPath);

                // Process tutorial
                processTutorial(mdPath, dirent.name);
            }
        }
    });
    return processedFiles;
}

// Function to process tutorial files
function processTutorial(mdPath, scriptName) {
    let content = fs.readFileSync(mdPath, 'utf8');
    
    // Remove any existing JSDoc comments
    content = content.replace(/\/\*\*[\s\S]*?\*\//g, '');

    // Remove file extension from the script name
    const nameWithoutExtension = path.basename(scriptName, path.extname(scriptName));

    // Convert markdown to HTML
    const htmlContent = marked.parse(content);

    // Create the final HTML content
    const finalContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tutorial: ${nameWithoutExtension}</title>
            ${commonStyles}
        </head>
        <body>
            <h1>Tutorial: ${nameWithoutExtension}</h1>
            ${htmlContent}
        </body>
        </html>
    `;
    
    // Write tutorial content
    fs.writeFileSync(path.join(tutorialsOutputDir, `tutorial-${nameWithoutExtension}.html`), finalContent);
}

// Process files
const processedFiles = processFiles(scriptsDir);

// Run JSDoc
if (processedFiles.length > 0) {
    try {
        const inputFiles = processedFiles.map(file => `"${file}"`).join(' ');
        execSync(`jsdoc -c "${configPath}" -d "${outputDir}" ${inputFiles}`, { stdio: 'inherit' });
        console.log('Documentation generated successfully.');
    } catch (error) {
        console.error('Error generating documentation:', error);
    }
} else {
    console.log('No files to process. Make sure you have .md files in the docs-source directory corresponding to your .ajs files.');
}

// Clean up temp directories
fs.rmSync(tempJsDir, { recursive: true, force: true });