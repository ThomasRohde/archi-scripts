# JArchi Scripts: Project Structure and Documentation Process

## Directory Structure

Our project follows this directory structure:

```
root/
│
├── scripts/
│   ├── lib/
│   │   └── menuItems.js
│   ├── docs/
│   │   └── ... (generated tutorial files)
│   ├── Menu.ajs
│   ├── ExportToConfluence.ajs
│   └── ... (other .ajs files)
│
├── docs/
│   └── ... (generated JSDoc documentation)
│
├── docs-source/
│   ├── Menu.ajs.md
│   ├── ExportToConfluence.ajs.md
│   └── ... (other .ajs.md files)
│
├── node_modules/
│   └── ... (project dependencies including marked)
│
├── README.md
├── package.json
├── jsdoc.conf.json
└── jsdoc-runner.js
```

## Key Components

1. **scripts/**: Contains all JArchi script files (.ajs), the lib/ subdirectory for supporting JavaScript files, and the docs/ subdirectory for generated tutorial files.

2. **docs-source/**: Houses the markdown documentation files for each script. Each .md file corresponds to an .ajs file in the scripts/ directory.

3. **docs/**: The output directory for generated JSDoc documentation.

4. **scripts/docs/**: The output directory for generated tutorial HTML files.

5. **README.md**: Project overview and main documentation file.

6. **jsdoc.conf.json**: Configuration file for JSDoc.

7. **jsdoc-runner.js**: Custom script to manage the documentation generation process.

8. **node_modules/**: Contains project dependencies, including the locally installed marked module.

## Documentation Process

1. **Script Files**: 
   - .ajs files in the scripts/ directory contain the actual JArchi scripts.
   - menuItems.js in scripts/lib/ defines the structure of the JArchi Scripts menu.

2. **Documentation Files**: 
   - Each .ajs file has a corresponding .md file in the docs-source/ directory.
   - These .md files contain detailed documentation for each script.

3. **README.md**:
   - Serves as the main page of the generated documentation.
   - Provides an overview of the JArchi Scripts project.

4. **Documentation Generation**:
   - Executed by running jsdoc-runner.js.
   - Creates temporary files combining script content and JSDoc comments.
   - Processes .md files as tutorials, generating HTML files in scripts/docs/.
   - Uses jsdoc.conf.json for configuration settings.
   - Outputs generated JSDoc documentation to the docs/ directory.

5. **Dependencies**:
   - The project uses a locally installed marked module for processing markdown.
   - Dependencies are managed through package.json and stored in node_modules/.

## Key Changes

1. The main JSDoc documentation is now generated in the root-level docs/ directory.
2. Tutorial HTML files are generated in scripts/docs/ directory.
3. The project now uses a locally installed marked module instead of a global installation.
4. The .gitignore file has been updated to exclude root-level node_modules while allowing potential node_modules in the scripts directory.
5. Tutorial links in menuItems.js now exclude the .ajs suffix.

## Best Practices

1. Always create a corresponding .md file in docs-source/ when adding a new .ajs script.
2. Keep the README.md up-to-date as it serves as the main page of the documentation.
3. Regularly run jsdoc-runner.js to keep the documentation current.
4. Review generated documentation in docs/ and tutorial files in scripts/docs/ to ensure accuracy and completeness.
5. Update menuItems.js when adding or removing scripts to maintain an organized menu structure.
6. When adding new dependencies, update package.json and commit the changes.

By following this structure and process, we maintain a clean, organized, and well-documented JArchi Scripts project, with documentation that is version controlled alongside the code.