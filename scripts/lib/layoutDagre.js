/**
 * @module layoutDagre
 * @description A module to layout a view using Dagre
 */

const dagre = require('dagre');

/**
 * Layout a view using Dagre
 * @param {Object} view - The view to layout
 * @param {Object} [options] - Dagre layout options
 * @param {string} [options.rankdir='TB'] - Layout direction. 'TB' for top to bottom, 'LR' for left to right
 * @param {number} [options.nodesep=50] - Pixels between nodes
 * @param {number} [options.ranksep=50] - Pixels between ranks (rows)
 * @param {number} [options.edgesep=10] - Pixels between edges
 * @param {number} [options.marginx=20] - Pixels of empty space around the left and right of the graph
 * @param {number} [options.marginy=20] - Pixels of empty space around the top and bottom of the graph
 */
function layoutDagre(view, options = {}) {
    if (!view || view.type !== "archimate-diagram-model") {
        console.log("Invalid view. Please provide a valid ArchiMate diagram view.");
        return;
    }

    // Create a new graph
    const g = new dagre.graphlib.Graph();

    // Set layout options
    g.setGraph({
        rankdir: options.rankdir || 'TB',
        nodesep: options.nodesep || 50,
        ranksep: options.ranksep || 50,
        edgesep: options.edgesep || 10,
        marginx: options.marginx || 20,
        marginy: options.marginy || 20
    });

    // Set up defaults
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes and edges to the graph
    $(view).children().each((child) => {
        if (child.type.includes("relationship") || child.type === "diagram-model-connection") {
            g.setEdge(child.source.id, child.target.id);
        } else {
            g.setNode(child.id, { 
                width: child.bounds.width, 
                height: child.bounds.height,
                label: child.name
            });
        }
    });

    // Run the layout algorithm
    dagre.layout(g);

    // Apply the new layout
    g.nodes().forEach((v) => {
        const node = g.node(v);
        const element = $(view).children().filter((child) => child.id === v).first();
        if (element) {
            const newX = Math.round(node.x - node.width / 2);
            const newY = Math.round(node.y - node.height / 2);
            element.bounds = {x: newX, y: newY, width: element.bounds.width, height: element.bounds.height};
        }
    });

    // Update relationship (connection) routes
    $(view).children().filter((child) => child.type.includes("relationship")).each((relationship) => {
        const edge = g.edge(relationship.source.id, relationship.target.id);
        if (edge && edge.points) {
            relationship.bendpoints = edge.points.map(point => ({
                x: Math.round(point.x),
                y: Math.round(point.y)
            }));
        }
    });
}

// Example usage:
// const selectedView = $(selection).filter("archimate-diagram-model").first();
// if (selectedView) {
//     layoutDagre(selectedView, {
//         rankdir: 'LR',
//         nodesep: 60,
//         ranksep: 70
//     });
// } else {
//     console.log("No view selected. Please select a view and run the script again.");
// }

module.exports = layoutDagre;