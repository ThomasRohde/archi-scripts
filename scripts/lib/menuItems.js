/**
 * @module menuItems
 * @description Defines the structure of the JArchi Scripts menu.
 */

/**
 * Array of menu item objects representing JArchi scripts.
 * @type {Array<Object>}
 */

const menuItems = [
    {
        name: "Where Used",
        description: `
        <h2>Where Used</h2>
        <p>This script helps you find where selected elements are used within your Archimate model.</p>
        <h3>Features:</h3>
        <ul>
            <li>Searches for selected elements across all views and relationships</li>
            <li>Displays results in a convenient dialog box</li>
            <li>Shows element name, where it's referenced, and the type of reference</li>
            <li>Copies the name of the selected reference to the clipboard for easy navigation</li>
        </ul>
        <h3>Usage:</h3>
        <ol>
            <li>Select one or more elements in your Archimate model</li>
            <li>Run the "Where Used" script</li>
            <li>Review the results in the dialog box</li>
            <li>Select a result to copy its name to the clipboard</li>
        </ol>
        <p>This script is particularly useful for understanding the impact of changes and for navigating complex models.</p>
    `,
        script: "Where used.ajs",
        category: "Analysis",
        tutorial: "Where used",
    },
    {
        name: "Dagre Layout",
        description: `
        <h2>Dagre Layout</h2>
        <p>This script applies the Dagre graph layout algorithm to organize your Archi views automatically.</p>
        <h3>Features:</h3>
        <ul>
            <li>Automatically arranges elements in your Archi view</li>
            <li>Provides a dialog for customizing layout settings</li>
            <li>Allows real-time preview of layout changes</li>
            <li>Supports various layout directions and algorithms</li>
        </ul>
        <h3>Usage:</h3>
        <ol>
            <li>Select a view in your Archi model</li>
            <li>Run the "Dagre Layout" script</li>
            <li>Adjust settings in the dialog as needed</li>
            <li>Click "Layout" to apply changes</li>
            <li>Repeat steps 3-4 until satisfied</li>
            <li>Click "Cancel" to close the dialog</li>
        </ol>
        <p>This script is excellent for quickly organizing complex views and ensuring consistent layouts across your Archi models.</p>
    `,
        script: "Layout using Dagre.ajs",
        category: "Layout",
        tutorial: "Layout using Dagre",
    },
    {
        name: "Smart Style Sync",
        description: `
        <h2>Smart Style Sync</h2>
        <p>This script allows you to change the appearance of elements in an ArchiMate view based on their property values.</p>
        <h3>Features:</h3>
        <ul>
            <li>Select a property to base element styling on</li>
            <li>Set custom border and fill colors for each unique property value</li>
            <li>Apply consistent styling across all elements with the same property value</li>
            <li>Visual color picker for easy color selection</li>
        </ul>
        <h3>Usage:</h3>
        <ol>
            <li>Select an ArchiMate view in Archi</li>
            <li>Run the "Smart Style Sync" script</li>
            <li>Choose a property from the dropdown menu</li>
            <li>Set border and fill colors for each property value</li>
            <li>Click OK to apply the changes</li>
        </ol>
        <h3>Important Note:</h3>
        <p>Archi has a setting that derives line (border) color from fill colors. If this setting is enabled:</p>
        <ul>
            <li>Changes to line color in this script will not have an effect</li>
            <li>To use custom line colors, either:
                <ol>
                    <li>Uncheck the "Derive element line colors from fill colors" option in Archi Preferences (Edit > Preferences > Appearance > Colours), or</li>
                    <li>Select the elements in your view, go to Properties > Appearance, and uncheck the "Derive from fill colour" option</li>
                </ol>
            </li>
        </ul>
        <p>This script is excellent for creating visually consistent and meaningful views based on element properties.</p>
    `,
        script: "Smart Style Sync.ajs",
        category: "Appearance",
        tutorial: "Smart Style Sync",
    },
    {
        name: "Model Health Check",
        description: `
        <h2>Model Health Check</h2>
        <p>This script performs a comprehensive health check on your ArchiMate model, providing insights and recommendations for improvement.</p>
        <h3>Features:</h3>
        <ul>
            <li>Analyzes model structure and content</li>
            <li>Identifies unused elements and missing documentation</li>
            <li>Assesses view complexity</li>
            <li>Provides a summary of element types</li>
            <li>Offers recommendations for model improvement</li>
        </ul>
        <h3>Usage:</h3>
        <ol>
            <li>Open your ArchiMate model in Archi</li>
            <li>Run the "Model Health Check" script</li>
            <li>Review the results in the dialog box</li>
            <li>Navigate through different tabs for detailed information</li>
            <li>Consider the recommendations for improving your model</li>
        </ol>
        <p>This script is invaluable for maintaining high-quality, well-structured ArchiMate models and identifying areas for improvement.</p>
    `,
        script: "Model Health Check.ajs",
        category: "Analysis",
        tutorial: "Model Health Check",
    },
];