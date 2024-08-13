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
    {
        name: "Settings",
        description: `
            <h2>Settings</h2>
            <p>This script allows you to configure various settings for jArchi integrations and features.</p>
            <p>
            <b>NOTE!</b> If you don't have Ollama installed, please edit <code>Setting.ajs</code>:
            <p>
            <code>
            const OLLAMA_INSTALLED = true; // Set this to false if Ollama is not installed
            </code>
            </p)
            </p>
            <h3>Features:</h3>
            <ul>
                <li>Configure Confluence integration settings</li>
                <li>Set up Documentation Augmenter preferences</li>
                <li>Manage AI model selection and parameters</li>
                <li>Customize other jArchi integration options</li>
            </ul>
            <h3>Usage:</h3>
            <ol>
                <li>Run the "Settings" script from the JArchi Scripts Menu</li>
                <li>Navigate through the different tabs to configure various settings</li>
                <li>Fill in the required fields in each section</li>
                <li>Click "Save" to store the settings or "Cancel" to discard changes</li>
            </ol>
            <p>These settings will be used by various jArchi scripts and integrations to customize their behavior and connect to external services.</p>
        `,
        script: "Settings.ajs",
        category: "Configuration",
        tutorial: "Settings",
    },
    {
        name: "Publish View to Confluence",
        description: `
            <h2>Publish View to Confluence</h2>
            <p>This script allows you to publish the currently selected view to a Confluence page, including the view diagram and element properties.</p>
            <h3>Features:</h3>
            <ul>
                <li>Publishes the selected view as a high-quality PNG image</li>
                <li>Creates or updates a Confluence page with the view name as the title</li>
                <li>Includes view documentation if available</li>
                <li>Generates a table of all elements in the view with their properties</li>
                <li>Automatically handles page creation or updating</li>
            </ul>
            <h3>Usage:</h3>
            <ol>
                <li>Select a view in your Archi model</li>
                <li>Ensure Confluence settings are configured correctly</li>
                <li>Run the "Publish View to Confluence" script</li>
                <li>Wait for the script to complete the publishing process</li>
                <li>Check the console for confirmation and the Confluence page URL</li>
            </ol>
            <h3>Prerequisites:</h3>
            <ul>
                <li>Confluence settings must be configured using the "Confluence Settings" script</li>
                <li>Active internet connection to reach your Confluence instance</li>
            </ul>
            <p>This script streamlines the process of documenting your ArchiMate views in Confluence, making it easier to share and collaborate on architecture models.</p>
        `,
        script: "Publish View to Confluence.ajs",
        category: "Integration",
        tutorial: "Publish View to Confluence",
    },
    {
        name: "Documentation Augmenter",
        description: `
            <h2>Documentation Augmenter</h2>
            <p>This script uses AI to automatically generate and enhance documentation for your ArchiMate views and elements.</p>
            <h3>Features:</h3>
            <ul>
                <li>Generates comprehensive documentation for the selected view</li>
                <li>Creates or updates documentation for individual elements within the view</li>
                <li>Utilizes the Ollama AI model for intelligent content generation</li>
                <li>Preserves existing documentation structure and formatting</li>
            </ul>
            <h3>Usage:</h3>
            <ol>
                <li>Select an ArchiMate view in your model</li>
                <li>Run the "Documentation Augmenter" script</li>
                <li>Wait for the script to generate and apply documentation</li>
                <li>Review and refine the generated documentation as needed</li>
            </ol>
            <p>This script requires Ollama to be installed and running on your local machine. Please refer to the tutorial for detailed setup instructions and requirements.</p>
        `,
        script: "Documentation Augmenter.ajs",
        category: "Documentation",
        tutorial: "Documentation Augmenter",
    },
    {
        name: "Export View to Draw.io",
        description: `
        <h2>Export View to Draw.io</h2>
        <p>This script exports the currently selected ArchiMate view to a draw.io diagram file, preserving the hierarchical structure and visual properties of the elements.</p>
        <h3>Features:</h3>
        <ul>
            <li>Exports the selected view as a .drawio file</li>
            <li>Preserves element positions, sizes, and hierarchical relationships</li>
            <li>Maps ArchiMate element types to appropriate draw.io shapes</li>
            <li>Maintains element colors and relationship types</li>
            <li>Handles nested elements using draw.io's grouping functionality</li>
        </ul>
        <h3>Usage:</h3>
        <ol>
            <li>Select an ArchiMate view in your model</li>
            <li>Run the "Export View to Draw.io" script</li>
            <li>Choose a location to save the .drawio file</li>
            <li>Open the exported file in draw.io for further editing or integration</li>
        </ol>
        <p>This script is particularly useful for sharing ArchiMate diagrams with stakeholders who use draw.io or for further customization of your architecture diagrams in a more flexible diagramming tool.</p>
    `,
        script: "Export View to Draw.io.ajs",
        category: "Export",
        tutorial: "Export View to Draw.io",
    },
    {
        name: "Create L-shaped Relations",
        description: `
        <h2>Create L-shaped Relations</h2>
        <p>This script creates L-shaped relationships for selected elements in your ArchiMate view.</p>
        <h3>Features:</h3>
        <ul>
            <li>Transforms selected relationships into L-shapes</li>
            <li>Starts horizontally and then turns vertically</li>
            <li>Improves visual clarity of complex diagrams</li>
        </ul>
        <h3>Usage:</h3>
        <ol>
            <li>Select one or more relationships in your ArchiMate view</li>
            <li>Run the "Create L-shaped Relations" script</li>
            <li>The selected relationships will be reshaped into L-shapes</li>
        </ol>
        <p>This script is useful for organizing and standardizing the appearance of relationships in your diagrams.</p>
    `,
        script: "Create L-shaped relations.ajs",
        category: "Layout",
    },

    {
        name: "Create Orthogonal Relations",
        description: `
        <h2>Create Orthogonal Relations</h2>
        <p>This script transforms selected relationships into orthogonal (right-angled) paths.</p>
        <h3>Features:</h3>
        <ul>
            <li>Converts selected relationships to use only horizontal and vertical segments</li>
            <li>Particularly useful after moving objects in a view</li>
            <li>Enhances diagram readability</li>
        </ul>
        <h3>Usage:</h3>
        <ol>
            <li>Select one or more relationships in your ArchiMate view</li>
            <li>Run the "Create Orthogonal Relations" script</li>
            <li>The selected relationships will be reshaped with right angles</li>
        </ol>
        <p>This script helps maintain a clean and organized layout in your ArchiMate diagrams.</p>
    `,
        script: "Create orthogonal relations.ajs",
        category: "Layout",
    },

    {
        name: "Create S-shaped Relations",
        description: `
        <h2>Create S-shaped Relations</h2>
        <p>This script creates S-shaped relationships for selected elements in your ArchiMate view.</p>
        <h3>Features:</h3>
        <ul>
            <li>Transforms selected relationships into S-shapes</li>
            <li>Starts vertically and then turns horizontally</li>
            <li>Useful for creating visually appealing diagrams</li>
        </ul>
        <h3>Usage:</h3>
        <ol>
            <li>Select one or more relationships in your ArchiMate view</li>
            <li>Run the "Create S-shaped Relations" script</li>
            <li>The selected relationships will be reshaped into S-shapes</li>
        </ol>
        <p>This script provides an alternative way to organize relationships, especially useful in complex diagrams.</p>
    `,
        script: "Create S-shaped relations.ajs",
        category: "Layout",
    },
    {
        name: "Spread Relations Orthogonally",
        description: `
        <h2>Spread Relations Orthogonally</h2>
        <p>This script arranges and spreads relationships evenly along the edges of selected elements.</p>
        <h3>Features:</h3>
        <ul>
            <li>Distributes relationships equally around the selected elements</li>
            <li>Improves the visual organization of complex diagrams</li>
            <li>Helps prevent overlapping relationships</li>
        </ul>
        <h3>Usage:</h3>
        <ol>
            <li>Select one or more elements in your ArchiMate view</li>
            <li>Run the "Spread Relations Orthogonally" script</li>
            <li>The relationships connected to the selected elements will be evenly distributed</li>
        </ol>
        <p>This script is particularly useful for elements with many connections, helping to create cleaner and more readable diagrams.</p>
    `,
        script: "Spread relations orthogonally.ajs",
        category: "Layout",
    },
    {
        name: "Remove All Bend Points",
        description: `
        <h2>Remove All Bend Points</h2>
        <p>This script removes all bend points from selected relationships, creating straight connections.</p>
        <h3>Features:</h3>
        <ul>
            <li>Removes all bend points from selected relationships</li>
            <li>Creates direct, straight connections between elements</li>
            <li>Useful for simplifying complex diagrams</li>
        </ul>
        <h3>Usage:</h3>
        <ol>
            <li>Select one or more relationships in your ArchiMate view</li>
            <li>Run the "Remove All Bend Points" script</li>
            <li>All bend points will be removed from the selected relationships</li>
        </ol>
        <p>This script is helpful when you want to reset relationship paths or create a more minimalist diagram layout.</p>
    `,
        script: "Remove all bend points.ajs",
        category: "Layout",
    },
    {
        name: "Generate Model",
        description: `
            <h2>Generate ArchiMate Model</h2>
            <p>This script generates an ArchiMate model based on a user's description using the Anthropic API.</p>
            <h3>Features:</h3>
            <ul>
                <li>Creates a complete ArchiMate model from a text description</li>
                <li>Utilizes AI to interpret user requirements and generate appropriate elements and relationships</li>
                <li>Automatically creates a new view with the generated model</li>
                <li>Applies an automatic layout to the generated view for better readability</li>
            </ul>
            <h3>Usage:</h3>
            <ol>
                <li>Run the "Generate Model" script</li>
                <li>Enter a description of the system or organization you want to model</li>
                <li>Wait for the AI to generate the model</li>
                <li>Review and refine the generated model as needed</li>
            </ol>
            <p>This script requires a configured Anthropic API key and an active internet connection to function.</p>
        `,
        script: "Generate Model.ajs",
        category: "AI-Assisted Modeling",
        tutorial: "Generate Model"
    },
    {
        name: "Expand Model",
        description: `
            <h2>Expand ArchiMate Model</h2>
            <p>This script expands an existing ArchiMate model based on a selected element using the Anthropic API.</p>
            <h3>Features:</h3>
            <ul>
                <li>Expands the model around a selected element</li>
                <li>Uses AI to suggest new elements and relationships based on the existing model context</li>
                <li>Integrates new elements seamlessly into the current view</li>
                <li>Applies automatic layout to maintain diagram clarity</li>
            </ul>
            <h3>Usage:</h3>
            <ol>
                <li>Select an element in your ArchiMate view</li>
                <li>Run the "Expand Model" script</li>
                <li>Enter a description of how you want to expand the model around the selected element</li>
                <li>Review and adjust the AI-generated expansions as needed</li>
            </ol>
            <p>This script requires a configured Anthropic API key and an active internet connection. It works best when starting from an existing model or element to provide context for the expansion.</p>
        `,
        script: "Expand Model.ajs",
        category: "AI-Assisted Modeling",
        tutorial: "Expand Model"
    },
    {
        name: "Generate Capability Model",
        description: `
            <h2>Generate Capability Model</h2>
            <p>This script generates an ArchiMate capability model using AI, iteratively refining the model.</p>
            <h3>Features:</h3>
            <ul>
                <li>Creates a hierarchical capability model based on a user-provided description</li>
                <li>Uses AI to generate and refine the model over multiple iterations</li>
                <li>Applies a custom layout optimized for capability models</li>
                <li>Supports integration with different AI providers (Anthropic and Ollama)</li>
            </ul>
            <h3>Usage:</h3>
            <ol>
                <li>Run the "Generate Capability Model" script</li>
                <li>Enter a description of the organization when prompted</li>
                <li>Wait for the script to generate and refine the capability model</li>
                <li>Review the generated model in the selected or newly created view</li>
            </ol>
            <p>This script is particularly useful for quickly creating comprehensive capability models, which can serve as a foundation for further enterprise architecture analysis and planning.</p>
        `,
        script: "Generate Capability Model.ajs",
        category: "AI-Assisted Modeling",
        tutorial: "Generate Capability Model"
    }
];
