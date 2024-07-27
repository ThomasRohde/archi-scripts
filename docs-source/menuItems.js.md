# Menu Items Configuration

## Overview

The `menuItems.js` file is a crucial component of the JArchi Script Menu system. It defines the structure and content of the menu, allowing for easy organization and access to various JArchi scripts.

## File Location

```
root/
└── scripts/
    └── lib/
        └── menuItems.js
```

## Structure

The `menuItems.js` file exports an array of objects, where each object represents a script in the menu. The structure of each object is as follows:

```javascript
{
  name: "Script Name",
  description: "HTML-formatted description of the script",
  script: "ScriptFileName.ajs",
  category: "Category Name"
}
```

### Properties

- `name` (string): The display name of the script in the menu.
- `description` (string): An HTML-formatted description of the script. This will be displayed in the description pane when the script is selected.
- `script` (string): The filename of the script to be executed. This should match the actual filename in the `scripts/` directory.
- `category` (string): The category under which the script should be grouped in the menu.

## Example

Here's an example of how the `menuItems` array might be structured:

```javascript
const menuItems = [
  {
    name: "Export to Confluence",
    description: "<h2>Export to Confluence</h2><p>This script exports your Archimate model to Confluence, maintaining the structure and relationships of your elements.</p><h3>Usage</h3><ol><li>Select the view or element you want to export</li><li>Run the script</li><li>Follow the prompts to specify Confluence details</li></ol>",
    script: "ExportToConfluence.ajs",
    category: "Publishing & Exporting"
  },
  {
    name: "Generate Documentation",
    description: "<h2>Generate Documentation</h2><p>Creates a comprehensive documentation of your Archimate model, including all views, elements, and relationships.</p><h3>Features</h3><ul><li>Customizable templates</li><li>Export to PDF or HTML</li><li>Includes diagrams and descriptions</li></ul>",
    script: "GenerateDocumentation.ajs",
    category: "Documentation"
  },
  {
    name: "Batch Rename",
    description: "<h2>Batch Rename</h2><p>Allows you to rename multiple elements at once using patterns and regular expressions.</p><h3>How it works</h3><ol><li>Select the elements you want to rename</li><li>Specify a naming pattern</li><li>Preview changes</li><li>Apply the rename operation</li></ol>",
    script: "BatchRename.ajs",
    category: "Utilities"
  }
];

// Don't forget to export the menuItems array
module.exports = menuItems;
```

## Usage in the Menu System

The `Menu.ajs` script reads this `menuItems` array to populate the JArchi Script Menu. It uses the information to:

1. Create the categorized tree structure in the left pane of the menu.
2. Display the script descriptions in the right pane when a script is selected.
3. Execute the correct script file when the "Execute" button is pressed.

## Maintaining menuItems.js

When adding new scripts to your JArchi environment:

1. Create the script file in the appropriate location within the `scripts/` directory.
2. Add a new object to the `menuItems` array in `menuItems.js`.
3. Ensure the `script` property correctly references the new script file.
4. Provide a clear, informative name and description for the script.
5. Categorize the script appropriately to maintain an organized menu structure.

By keeping the `menuItems.js` file up-to-date, you ensure that all your scripts are easily accessible through the JArchi Script Menu, improving the usability and efficiency of your Archi modeling workflow.
