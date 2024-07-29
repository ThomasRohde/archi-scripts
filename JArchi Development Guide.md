# JArchi Development Guide (Updated)

This guide outlines conventions, best practices, and learnings for developing scripts using JArchi, with a focus on Eclipse development in Archi/JArchi using Java interoperability.

## Script Structure and Conventions

### Console Clearing
For top-level scripts (not in lib), always begin by clearing the console:

```javascript
console.clear();
console.show();
```

### Load External Dependencies
Use the `load()` function to include external JavaScript files:

```javascript
load(__DIR__ + "lib/commonStyles.js");
```

## Java Interoperability

### Importing Java Types
Use `Java.type()` to import Java classes:

```javascript
const SWT = Java.type('org.eclipse.swt.SWT');
const GridDataFactory = Java.type('org.eclipse.jface.layout.GridDataFactory');
```

### Extending Java Classes
Use `Java.extend()` to create JavaScript objects that extend Java classes or implement Java interfaces:

```javascript
const Dialog = Java.extend(Java.type('org.eclipse.jface.dialogs.TitleAreaDialog'));
```

### Creating Dialog Subclasses
When creating dialog subclasses, use the following pattern:

```javascript
const myDialog = {
    dialog: new (Java.extend(TitleAreaDialog))(shell, {
        configureShell: function(newShell) {
            Java.super(myDialog.dialog).configureShell(newShell);
            newShell.setText("My Dialog Title");
            newShell.setSize(800, 600);
        },
        createDialogArea: function(parent) {
            const area = Java.super(myDialog.dialog).createDialogArea(parent);
            // Add custom widgets and set up the dialog area
            return area;
        }
    }),
    
    open: function() {
        return this.dialog.open() === 0; // OK = 0, Cancel = 1
    }
};
```

### Calling Superclass Methods
When calling superclass methods, use `Java.super(objectName).methodName()`:

```javascript
Java.super(myDialog.dialog).createDialogArea(parent);
```

Note: Do not use `Java.super(this).methodName()`, as it doesn't work as expected in GraalVM JavaScript.

## UI Development

### SWT and JFace Usage
- Use SWT for low-level UI components and JFace for higher-level constructs.
- Utilize `GridDataFactory` and `GridLayoutFactory` for efficient layout management.

### Widget Lifecycle
Always dispose of resources when they're no longer needed:

```javascript
color.dispose();
```

### Event Listeners
Add event listeners to widgets for interactivity:

```javascript
widget.addListener(SWT.Selection, e => {
    // Handle selection
});
```

## Working with the Archi Model

### Accessing the Current Model
Use `$.model` to access the current model:

```javascript
const currentModel = $.model;
```

### Selecting Elements
Use the `$()` function to select elements from the model:

```javascript
const selectedView = $(selection).filter("archimate-diagram-model").first();
const allBusinessObjects = $("business-object");
```

### Traversing the Model
Use methods like `find()`, `children()`, `parent()`, etc., to traverse the model:

```javascript
const childElements = $(selectedView).children();
const allDescendants = $(selectedFolder).find();
```

### Modifying Elements
Update properties of elements using direct property assignment:

```javascript
element.name = "New Name";
element.documentation = "Updated documentation";
```

## Error Handling and Logging

### Console Logging
Use `console.log()` for general logging and `console.error()` for error messages:

```javascript
console.log("Operation completed successfully");
console.error("An error occurred: " + errorMessage);
```

Never have more than 1 argument for console.error(). 

### Try-Catch Blocks
Wrap code that may throw errors in try-catch blocks:

```javascript
try {
    // Code that may throw an error
} catch (error) {
    console.error("An error occurred: " + error.toString());
}
```

## Best Practices

1. **Progress Reporting**: For long-running scripts, use progress dialogs to keep the user informed:

```javascript
window.showProgressDialog("Processing", function(progressBar) {
    // Long-running operation
    progressBar.setProgress(50); // Update progress
});
```

2. **Script Metadata**: Include metadata in your scripts for better organization and discoverability:

```javascript
/**
 * @name My Script
 * @category Analysis
 * @version 1.0
 * @description Performs a specific analysis on the model
 * @author Your Name
 */
```

3. **Performance Optimization**: For large models, consider using batch operations and avoiding unnecessary model traversals:

```javascript
const elements = $("element");
elements.each(function(element) {
    // Process each element
});
```

4. **Use jArchi Collections**: When working with elements, views, or relationships, wrap them in jArchi collections to use collection methods:

```javascript
$(element).viewRefs().size();
$(view).children('element').size();
```

## Code Conventions

### Naming Conventions
- Use camelCase for variable and function names.
- Use PascalCase for Java class names and constructors.
- Use UPPER_CASE for constants.

### Indentation and Formatting
- Use 4 spaces for indentation.
- Place opening braces on the same line as the statement.

### Comments
Use JSDoc comments for functions and modules:

```javascript
/**
 * @module ModuleName
 * @description Brief description of the module
 */

/**
 * Function description
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 */
```

## Avoid Immediately Invoked Function Expressions (IIFEs) in Top-Level Scripts

Unlike in browser-based JavaScript, where IIFEs are often used to avoid polluting the global scope, JArchi scripts do not require this pattern. Each script runs in its own context, so there's no need for additional encapsulation.

### Do:
```javascript
console.clear();
console.show();

// Your script code here
const myFunction = function() {
    // Function implementation
};

// Script execution
myFunction();
```

### Don't:
```javascript
(function() {
    console.clear();
    console.show();

    // Your script code here
    const myFunction = function() {
        // Function implementation
    };

    // Script execution
    myFunction();
})();
```

The exception to this rule is the `Menu.ajs` script, which does use an IIFE for specific reasons related to its functionality.

# Module Structure and Exports in JArchi

When creating modules for JArchi scripts, it's important to structure them correctly for compatibility and ease of use. JArchi uses a CommonJS-like module system, which means we use `module.exports` for exporting functionality and `require()` for importing.

## Exporting from a Module

When creating a module (e.g., in a `.js` file in the `lib` directory), use `module.exports` to expose functions or objects to other scripts. Here's the recommended pattern:

```javascript
// myModule.js

function someFunction() {
    // Function implementation
}

function anotherFunction() {
    // Function implementation
}

// Export an object containing all the functions you want to make available
module.exports = {
    someFunction: someFunction,
    anotherFunction: anotherFunction
};
```

For modules with a single export, you can also use this pattern:

```javascript
// singleExportModule.js

module.exports = function() {
    // Module implementation
};
```

## Importing and Using Modules

To use a module in another script, use the `require()` function:

```javascript
const myModule = require('./lib/myModule');

// Use the exported functions
myModule.someFunction();
myModule.anotherFunction();
```

For modules with a single export:

```javascript
const singleFunction = require('./lib/singleExportModule');

// Use the exported function
singleFunction();
```

## Important Notes

1. Do not use ES6 module syntax (`import`/`export`) as it's not supported in JArchi's JavaScript environment.

2. Avoid using the `export` keyword anywhere in your JArchi scripts or modules.

3. Always use relative paths with `require()`, starting with `./` for files in the same directory or `../` to move up directories.

4. When working with JArchi's built-in modules or Java interop, continue to use `Java.type()` as needed.

## Example: Restructuring a Complex Module

For a complex module with multiple functions, like our `confluenceIntegration.js`, structure it like this:

```javascript
// confluenceIntegration.js

// ... (all function implementations)

function updateConfluencePage() { /* ... */ }
function getPageInfo() { /* ... */ }
function attachFile() { /* ... */ }
function readConfluenceSettings() { /* ... */ }

// Export all functions at the end of the file
module.exports = {
    updateConfluencePage: updateConfluencePage,
    getPageInfo: getPageInfo,
    attachFile: attachFile,
    readConfluenceSettings: readConfluenceSettings
};
```

By following these guidelines, you'll ensure that your JArchi scripts and modules are structured correctly, making them easier to maintain and use across your project.

