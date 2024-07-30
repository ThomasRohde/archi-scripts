// File: modelTraversal.js

/**
 * @module modelTraversal
 * @description A flexible library for traversing Archi models and views, with integrated tests
 * @version 1.1
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-07-30
 */

const modelTraversal = {
    /**
     * Traverse the entire model or a specific view
     * @param {Object} handlers - Object containing handler functions for different element types
     * @param {Object} [startingPoint] - The view or model to traverse. If undefined, the entire model will be traversed
     */
    traverse: function (handlers, startingPoint) {
        if (startingPoint === undefined || $(startingPoint).is("model")) {
            this.traverseModel(handlers);
        } else if ($(startingPoint).is("view")) {
            this.handleElement(startingPoint, handlers.viewHandler);
            this.traverseView(startingPoint, handlers);
        } else {
            console.error("Invalid starting point. Must be a model, view, or undefined.");
        }
    },

    /**
     * Traverse the entire model
     * @param {Object} handlers - Object containing handler functions for different element types
     */
    traverseModel: function (handlers) {
        this.traverseHierarchy($("folder"), handlers.folderHandler);
        this.traverseHierarchy($("element"), handlers.elementHandler);
        this.traverseHierarchy($("relationship"), handlers.relationshipHandler);
        this.traverseHierarchy($("view"), (view) => this.traverseView(view, handlers));
    },

    /**
     * Traverse a hierarchy of elements
     * @param {Object} elements - The elements to traverse
     * @param {Function} handler - The handler function to use
     */
    traverseHierarchy: function (elements, handler) {
        elements.each((element) => {
            this.handleElement(element, handler);
        });
    },

    /**
     * Traverse a specific view
     * @param {Object} node - The view to traverse
     * @param {Object} handlers - Object containing handler functions for different element types
     */
    traverseView: function (node, handlers) {
        $(node).children().each((child) => {
            if ($(child).is("element")) {
                this.handleElement(child, handlers.viewElementHandler);
                // Recursively traverse nested elements
                this.traverseView(child, handlers);
            } else if ($(child).is("relationship")) {
                this.handleElement(child, handlers.viewRelationshipHandler);
            } else if ($(child).is("diagram-model-group") || $(child).is("diagram-model-note")) {
                this.handleElement(child, handlers.diagramObjectHandler);
                // Recursively traverse nested diagram objects
                this.traverseView(child, handlers);
            }
        });
    },

    /**
     * Handle an individual element using the appropriate handler function
     * @param {Object} element - The element to handle
     * @param {Function} handler - The handler function to use
     */
    handleElement: function (element, handler) {
        if (typeof handler === "function") {
            handler(element);
        }
    },

    /**
     * Run tests for the modelTraversal library
     */
    runTests: function () {
        console.clear();
        console.show();
        console.log("Running modelTraversal tests...");

        const testHandlers = {
            folderHandler: (folder) => {
                console.log(`Folder: ${folder.name}`);
            },
            elementHandler: (element) => {
                console.log(`Element: ${element.name} (${element.type})`);
            },
            relationshipHandler: (relationship) => {
                console.log(`Relationship: ${relationship.name} (${relationship.type})`);
            },
            viewHandler: (view) => {
                console.log(`View: ${view.name}`);
            },
            viewElementHandler: (element) => {
                console.log(`View Element: ${element.name} (${element.type}) - Bounds: ${JSON.stringify(element.bounds)}`);
            },
            viewRelationshipHandler: (relationship) => {
                console.log(`View Relationship: ${relationship.name} - ${relationship.source.name} -> ${relationship.target.name}`);
            },
            diagramObjectHandler: (object) => {
                console.log(`Diagram Object: ${object.name} (${object.type})`);
            }
        };

        // Test 1: Traverse entire model
        console.log("\nTest 1: Traversing entire model");
        this.traverse(testHandlers);

        // Test 2: Traverse a specific view
        console.log("\nTest 2: Traversing a specific view");
        const testView = $(selection).filter("archimate-diagram-model").first();
        if (testView) {
            this.traverse(testHandlers, testView);
        } else {
            console.log("No views found in the model for testing.");
        }

        // Test 3: Error handling
        console.log("\nTest 3: Error handling (invalid starting point)");
        this.traverse(testHandlers, "invalid input");

        console.log("\nTests completed.");
    }
};

module.exports = modelTraversal;

// Uncomment the following line to run tests when the script is executed
// modelTraversal.runTests();