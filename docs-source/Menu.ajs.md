The Menu.ajs script is a powerful tool for JArchi users, providing a graphical user interface to manage and execute JArchi scripts. This tutorial will guide you through setting up, using, and customizing the Menu script to enhance your Archi modeling experience.

## Features

- Categorized script organization
- Script descriptions with HTML formatting support
- Execute button for running selected scripts
- Resizable dialog with split-pane interface

## Prerequisites

Before using the Menu script, ensure you have:

1. Archi with the JArchi plugin installed
2. Basic familiarity with JArchi scripting

## Setup

1. Place the `Menu.ajs` file in your JArchi scripts directory.
2. Create a `menuItems.js` file in the same directory to define your script menu structure.

### menuItems.js Structure

The `menuItems.js` file should export an array of objects, each representing a script:

```javascript
menuItems = [
  {
    name: "Script Name",
    description: "HTML-formatted description of the script",
    script: "ScriptFileName.ajs",
    category: "Category Name"
  },
  // ... more script objects ...
];
```

Example entry:

```javascript
{
  name: "Export to Confluence",
  description: "<h2>Export to Confluence</h2><p>This script exports your Archimate model to Confluence.</p>",
  script: "ExportToConfluence.ajs",
  category: "Publishing & Exporting"
}
```

## Usage

1. Open Archi and ensure the JArchi plugin is active.
2. Navigate to the Scripts view in Archi.
3. Locate and run the `Menu.ajs` script.
4. The JArchi Script Menu dialog will appear, showing your categorized scripts.
5. Browse through the categories in the left panel.
6. Click on a specific script to view its description in the right panel.
7. Once you've selected a script, click 'Execute' to run it.

## Customization

### Adding New Scripts

To add a new script to the menu:

1. Place your new script file (e.g., `NewScript.ajs`) in the JArchi scripts directory.
2. Open `menuItems.js`.
3. Add a new object to the `menuItems` array:

```javascript
{
  name: "My New Script",
  description: "<h2>My New Script</h2><p>Description of what the script does.</p>",
  script: "NewScript.ajs",
  category: "My Category"
}
```

### Customizing Descriptions

You can use HTML in the description field to format your script descriptions. Some tips:

- Use `<h2>` for subheadings
- Use `<p>` for paragraphs
- Use `<ul>` and `<li>` for bullet points
- Use `<code>` for inline code snippets

### Organizing Categories

Group related scripts under the same category for better organization. Create new categories as needed by specifying them in the `category` field of your menu items.

## Advanced Features

### CSS Styling

The Menu script includes common CSS styles for the description area. You can customize these styles by modifying the `commonStyles` constant in the `Menu.ajs` file.

### Dialog Customization

Advanced users can modify the dialog behavior by editing the `menuDialog` object in `Menu.ajs`. This allows for customization of dialog size, layout, and behavior.

## Troubleshooting

- If scripts don't appear in the menu, ensure they are correctly defined in `menuItems.js`.
- If a script fails to execute, check the Archi console for error messages.
- For layout issues, try adjusting the monitor dimensions used for responsive sizing.

## Conclusion

The Menu.ajs script provides a user-friendly interface for managing and executing your JArchi scripts. By organizing your scripts into categories and providing detailed descriptions, you can create a more efficient workflow for your Archimate modeling tasks.

Remember to keep your `menuItems.js` file updated as you add or modify scripts. Happy modeling!