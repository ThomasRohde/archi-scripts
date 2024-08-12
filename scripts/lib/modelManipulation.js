/**
 * @module modelManipulation
 * @description A module for manipulating ArchiMate models in Archi, including creating and updating elements and relationships.
 * @version 1.0
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-12
 */

const jarchiLogger = require('./jarchiLogger');
const log = jarchiLogger.createLogger('ModelManipulation');

const modelManipulation = {
    /**
     * Updates or creates elements and relationships in an ArchiMate view based on a JSON model description.
     * @param {Object} view - The ArchiMate view to update.
     * @param {Object} modelJson - The JSON object describing the model structure.
     */
    updateView: function(view, modelJson) {
        const elementMap = new Map();

        /**
         * Gets an existing element or creates a new one if it doesn't exist.
         * @param {Object} newElement - The element description from the JSON model.
         * @returns {Object} The Archi element object.
         */
        function getOrCreateElement(newElement) {
            let element = $("*").filter(function(o) {
                return o.name.toLowerCase() === newElement.name.toLowerCase();
            }).first();

            if (!element) {
                log.debug(`Creating element: ${newElement.name}`);
                element = model.createElement(newElement.type, newElement.name);
            } else {
                log.debug(`Existing element: ${element.name}`);
            }
            element.documentation = newElement.description;
            elementMap.set(newElement.id, element.id);
            return element;
        }

        /**
         * Finds an element in a specific view.
         * @param {Object} v - The view to search in.
         * @param {Object} e - The element to find.
         * @returns {Object|null} The found element or null if not found.
         */
        function findInView(v, e) {
            return $(v).find("element").filter(function(o) {
                return o.concept.id == e.id;
            }).first();
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
                newElement.children.forEach(child => {
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
        function createElementHierarchy(newElement, parentRef, x = 0, y = 0) {
            const element = getOrCreateElement(newElement);
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
                        height: predictedSize.height
                    };
                }
            }

            if (newElement.children && Array.isArray(newElement.children)) {
                elementRef.textPosition = 0;
                let childX = x + 10;
                let childY = y + 55;
                newElement.children.forEach(child => {
                    const childRef = createElementHierarchy(child, elementRef, childX, childY);
                    childX += childRef.bounds.width + 10;
                });
            }

            return elementRef;
        }

        modelJson.nodes.forEach(newElement => createElementHierarchy(newElement));

        modelJson.relationships.forEach(rel => {
            const sourceId = elementMap.get(rel.source) || rel.source;
            const targetId = elementMap.get(rel.target) || rel.target;
            
            const source = $("#" + sourceId).first();
            const target = $("#" + targetId).first();
            
            if (source && target) {
                try {
                    const relationship = model.createRelationship(rel.type, rel.name, source, target);
                    const sourceInView = findInView(view, source);
                    const targetInView = findInView(view, target);
                    if (sourceInView && targetInView) {
                        view.add(relationship, sourceInView, targetInView);
                    } else {
                        log.debug(`Relationship created but not added to view: ${source.name} -> ${target.name}`);
                    }
                } catch (error) {
                    log.error('Error in relationship creation. Trying basic relation: ', { error: error.toString() });
                    try {
                        const relationship = model.createRelationship("association-relationship", rel.name, source, target);
                        const sourceInView = findInView(view, source);
                        const targetInView = findInView(view, target);
                        if (sourceInView && targetInView) {
                            view.add(relationship, sourceInView, targetInView);
                        } else {
                            log.debug(`Basic relationship created but not added to view: ${source.name} -> ${target.name}`);
                        }
                    } catch (error) {
                        log.error('Error in basic relationship creation', { error: error.toString() });
                    }
                }
            } else {
                log.warn(`Source or target not found for relationship: ${rel.source} -> ${rel.target}`);
            }
        });
    },

    /**
     * Creates a JSON representation of the current ArchiMate model.
     * @returns {Object} A JSON object representing the model structure.
     */
    createModelJson: function() {
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
    }
};

module.exports = modelManipulation;