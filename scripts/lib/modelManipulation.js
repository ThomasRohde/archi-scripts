/**
 * @module modelManipulation
 * @description A module for manipulating ArchiMate models in Archi, including creating and updating elements and relationships.
 * @version 1.2
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-13
 */

const jarchiLogger = require("./jarchiLogger");
const log = jarchiLogger.createLogger("ModelManipulation", __DIR__);
const modelTraversal = require("./modelTraversal");

const modelManipulation = {
    /**
     * Gets an existing element or creates a new one if it doesn't exist.
     * @param {Object} newElement - The element description from the JSON model.
     * @returns {Object} The Archi element object.
     */
    getOrCreateElement: function (newElement) {
        let element = $("*")
            .filter(function (o) {
                return o.name.toLowerCase() === newElement.name.toLowerCase();
            })
            .first();

        if (!element) {
            log.debug(`Creating element: ${newElement.name}`);
            element = model.createElement(newElement.type, newElement.name);
        } else {
            log.debug(`Existing element: ${element.name}`);
        }
        element.documentation = newElement.description;
        return element;
    },

    /**
     * Gets an existing relationship or creates a new one if it doesn't exist.
     * Falls back to creating an association-relationship if the original type is invalid.
     * @param {Object} newRelationship - The relationship description from the JSON model.
     * @param {Object} source - The source element.
     * @param {Object} target - The target element.
     * @returns {Object} The Archi relationship object or null if creation fails.
     */
    getOrCreateRelationship: function (newRelationship, source, target) {
        let relationship = $("relationship")
            .filter(function (r) {
                return r.source.id === source.id && r.target.id === target.id;
            })
            .first();

        if (!relationship) {
            log.debug(
                `Attempting to create relationship: ${newRelationship.type} from ${source.name} to ${target.name}`
            );
            try {
                relationship = model.createRelationship(newRelationship.type, newRelationship.name, source, target);
            } catch (error) {
                log.warn(
                    `Failed to create ${newRelationship.type} relationship. Falling back to association-relationship.`,
                    { error: error.toString() }
                );
                try {
                    relationship = model.createRelationship(
                        "association-relationship",
                        newRelationship.name,
                        source,
                        target
                    );
                    log.info(`Created fallback association-relationship from ${source.name} to ${target.name}`);
                } catch (fallbackError) {
                    log.error(`Failed to create fallback association-relationship`, {
                        error: fallbackError.toString(),
                    });
                    return null; // Return null instead of throwing an error
                }
            }
        } else {
            log.debug(`Existing relationship found from ${source.name} to ${target.name}`);
        }

        if (relationship) {
            relationship.name = newRelationship.name || relationship.name;
            // Only attempt to change the type if it's different and not a fallback association
            if (
                newRelationship.type &&
                newRelationship.type !== relationship.type &&
                relationship.type !== "association-relationship"
            ) {
                try {
                    relationship.type = newRelationship.type;
                } catch (typeChangeError) {
                    log.warn(
                        `Failed to change relationship type to ${newRelationship.type}. Keeping existing type ${relationship.type}.`,
                        { error: typeChangeError.toString() }
                    );
                }
            }
        }

        return relationship;
    },

    /**
     * Updates or creates elements and relationships in an ArchiMate view based on a JSON model description.
     * @param {Object} view - The ArchiMate view to update.
     * @param {Object} modelJson - The JSON object describing the model structure.
     */
    updateView: function (view, modelJson) {
        const elementMap = new Map();
        const addedRelationships = new Set();

        /**
         * Finds an element in a specific view.
         * @param {Object} v - The view to search in.
         * @param {Object} e - The element to find.
         * @returns {Object|null} The found element or null if not found.
         */
        function findInView(v, e) {
            return $(v)
                .find("element")
                .filter(function (o) {
                    return o.concept.id == e.id;
                })
                .first();
        }

        /**
         * Predicts the size of an element based on its content and children.
         * @param {Object} newElement - The element to predict size for.
         * @returns {Object} An object with width and height properties.
         */
        function predictSize(newElement) {
            let width = 120;
            let height = 55;

            if (newElement.children && newElement.children.length > 0) {
                let childrenWidth = 0;
                let childrenHeight = 0;
                newElement.children.forEach((child) => {
                    const childSize = predictSize(child);
                    childrenWidth += childSize.width;
                    childrenHeight = Math.max(childrenHeight, childSize.height);
                });
                width = Math.max(width, childrenWidth + 70);
                height += childrenHeight + 20;
            }

            return { width, height };
        }

        /**
         * Creates an element hierarchy in the view.
         * @param {Object} newElement - The element to create.
         * @param {Object} parentRef - The parent element reference.
         * @param {number} x - The x-coordinate for positioning.
         * @param {number} y - The y-coordinate for positioning.
         * @returns {Object} The created element reference.
         */
        const createElementHierarchy = (newElement, parentRef, x = 0, y = 0) => {
            const element = this.getOrCreateElement(newElement);
            elementMap.set(newElement.id, element.id);
            let elementRef;

            const predictedSize = predictSize(newElement);

            if (parentRef) {
                elementRef = parentRef.add(element, x, y, predictedSize.width, predictedSize.height);
            } else {
                const existingRef = findInView(view, element);
                if (!existingRef) {
                    elementRef = view.add(element, x, y, predictedSize.width, predictedSize.height);
                    elementRef.textPosition = 1;
                } else {
                    log.debug(`Found existing element in view: ${existingRef.name}`);
                    elementRef = existingRef;
                    elementRef.bounds = {
                        x: x,
                        y: y,
                        width: predictedSize.width,
                        height: predictedSize.height,
                    };
                }
            }

            if (newElement.children && Array.isArray(newElement.children)) {
                elementRef.textPosition = 0;
                let childX = x + 10;
                let childY = y + 55;
                newElement.children.forEach((child) => {
                    const childRef = createElementHierarchy(child, elementRef, childX, childY);
                    childX += childRef.bounds.width + 10;
                });
            }

            return elementRef;
        };

        modelJson.nodes.forEach((newElement) => createElementHierarchy(newElement));

        modelJson.relationships.forEach((rel) => {
            const sourceId = elementMap.get(rel.source) || rel.source;
            const targetId = elementMap.get(rel.target) || rel.target;

            const source = $("#" + sourceId).first();
            const target = $("#" + targetId).first();

            if (source && target) {
                const relationship = this.getOrCreateRelationship(rel, source, target);
                if (relationship) {
                    const sourceInView = findInView(view, source);
                    const targetInView = findInView(view, target);
                    if (sourceInView && targetInView) {
                        const relationshipKey = `${sourceId}-${targetId}`;
                        if (!addedRelationships.has(relationshipKey)) {
                            // Check if the relationship already exists in the view
                            const existingRelInView = $(view)
                                .find("relationship")
                                .filter(function (r) {
                                    return r.source.concept.id === sourceId && r.target.concept.id === targetId;
                                })
                                .first();

                            if (!existingRelInView) {
                                log.debug(
                                    `Attempting to add relationship ${relationship.type} to view: ${source.name} -> ${target.name}`
                                );
                                view.add(relationship, sourceInView, targetInView);
                                addedRelationships.add(relationshipKey);
                                log.debug(`Added relationship to view: ${source.name} -> ${target.name}`);
                            } else {
                                log.debug(`Relationship already exists in view: ${source.name} -> ${target.name}`);
                            }
                        } else {
                            log.debug(`Relationship already processed: ${source.name} -> ${target.name}`);
                        }
                    } else {
                        log.debug(
                            `Source or target not found in view for relationship: ${source.name} -> ${target.name}`
                        );
                    }
                } else {
                    log.warn(`Failed to create or retrieve relationship: ${rel.source} -> ${rel.target}`);
                }
            } else {
                log.warn(`Source or target not found for relationship: ${rel.source} -> ${rel.target}`);
            }
        });
    },

    /**
     * Updates or creates elements and relationships in the ArchiMate model based on a JSON model description,
     * without adding elements to any view.
     * @param {Object} modelJson - The JSON object describing the model structure.
     * @returns {Object} An object containing maps of created elements and relationships.
     */
    updateModel: function (modelJson) {
        const elementMap = new Map();
        const relationshipMap = new Map();

        const createElementHierarchy = (newElement) => {
            const element = this.getOrCreateElement(newElement);
            elementMap.set(newElement.id, element.id);

            if (newElement.children && Array.isArray(newElement.children)) {
                newElement.children.forEach((child) => {
                    const childElement = createElementHierarchy(child);
                    // Create composition relationship between parent and child
                    const compositionRel = this.getOrCreateRelationship(
                        { type: "composition-relationship", name: "" },
                        element,
                        childElement
                    );
                    relationshipMap.set(`${element.id}-${childElement.id}`, compositionRel.id);
                });
            }

            return element;
        };

        modelJson.nodes.forEach((newElement) => createElementHierarchy(newElement));

        modelJson.relationships.forEach((rel) => {
            const sourceId = elementMap.get(rel.source) || rel.source;
            const targetId = elementMap.get(rel.target) || rel.target;

            const source = $("#" + sourceId).first();
            const target = $("#" + targetId).first();

            if (source && target) {
                const relationship = this.getOrCreateRelationship(rel, source, target);
                if (relationship) {
                    relationshipMap.set(`${sourceId}-${targetId}`, relationship.id);
                }
            } else {
                log.warn(`Source or target not found for relationship: ${rel.source} -> ${rel.target}`);
            }
        });

        return { elements: elementMap, relationships: relationshipMap };
    },

    /**
     * Creates a JSON representation of the current ArchiMate model.
     * @returns {Object} A JSON object representing the model structure.
     */
    createModelJson: function () {
        const modelJson = {
            nodes: [],
            relationships: [],
        };

        modelTraversal.traverse({
            elementHandler: (element) => {
                modelJson.nodes.push({
                    id: element.id,
                    type: element.type,
                    name: element.name,
                    description: element.documentation,
                });
            },
            relationshipHandler: (relationship) => {
                modelJson.relationships.push({
                    id: relationship.id,
                    type: relationship.type,
                    name: relationship.name,
                    source: relationship.source.id,
                    target: relationship.target.id,
                });
            },
        });

        return modelJson;
    },

    /**
     * Creates a JSON representation of the given view.
     * @param {Object} view - The ArchiMate view to process.
     * @returns {Object} A JSON object representing the view structure.
     */
    createViewJSON: function (view) {
        const viewJson = {
            nodes: [],
            relationships: []
        };

        if (!view || view.type !== "archimate-diagram-model") {
            log.warn("Invalid view provided. Please provide a valid ArchiMate view.");
            return viewJson;
        }

        function processElement(element, parentX = 0, parentY = 0) {
            const bounds = element.bounds;
            const nodeData = {
                id: element.id,
                type: element.type,
                name: element.name,
                x: parentX + bounds.x,
                y: parentY + bounds.y,
                width: bounds.width,
                height: bounds.height,
                children: []
            };

            $(element).children("element").each((childElement) => {
                const childData = processElement(childElement, nodeData.x, nodeData.y);
                nodeData.children.push(childData);
            });

            viewJson.nodes.push(nodeData);
            return nodeData;
        }

        $(view).children().not("relationship").not("diagram-model-connection").each((element) => {
            processElement(element);
        });

        $(view).children("relationship").add($(view).children("diagram-model-connection")).each((relationship) => {
            viewJson.relationships.push({
                id: relationship.id,
                type: relationship.type,
                name: relationship.name,
                source: relationship.source.id,
                target: relationship.target.id
            });
        });

        return viewJson;
    },

    /**
     * Updates the view elements based on the provided JSON.
     * @param {Object} view - The ArchiMate view to update.
     * @param {Object} viewJson - The JSON object containing updated element data.
     */
    updateViewFromJSON: function (view, viewJson) {
        if (!view || view.type !== "archimate-diagram-model") {
            log.warn("Invalid view provided. Please provide a valid ArchiMate view.");
            return;
        }

        function updateElement(element, data, parentX = 0, parentY = 0) {
            if (element && element.bounds) {
                element.bounds = {
                    x: data.x - parentX,
                    y: data.y - parentY,
                    width: data.width,
                    height: data.height
                };
                log.debug(`Updated element: ${element.name} (${element.id})`);

                if (data.children && data.children.length > 0) {
                    data.children.forEach(childData => {
                        const childElement = $(element).children(`#${childData.id}`).first();
                        if (childElement) {
                            updateElement(childElement, childData, data.x, data.y);
                        }
                    });
                }
            } else {
                log.warn(`Element not found or invalid: ${data.id}`);
            }
        }

        viewJson.nodes.forEach(nodeData => {
            const element = $(view).find(`#${nodeData.id}`).first();
            updateElement(element, nodeData);
        });

        log.info(`Updated ${viewJson.nodes.length} elements in the view`);
    }
};

module.exports = modelManipulation;
