/**
 * @module layoutAlgorithms
 * @description A collection of layout algorithms for arranging elements in ArchiMate views
 * @version 1.0
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-15
 */

const modelManipulation = require("./modelManipulation");

const layoutAlgorithms = {
    applyLayout: function (view, algorithm = "fruchtermanReingold", options = {}) {
        const viewJson = modelManipulation.createViewJSON(view);

        if (typeof this[algorithm] !== "function") {
            throw new Error(`Algorithm '${algorithm}' is not implemented.`);
        }

        const layoutedJson = this[algorithm](viewJson, options);
        return layoutedJson;
    },

    /**
     * @typedef {Object} LayoutOptions
     * @property {number} [width=2000] - The width of the layout area
     * @property {number} [height=2000] - The height of the layout area
     * @property {number} [iterations=50] - The number of iterations for force-directed algorithms
     * @property {number} [k=300] - The optimal distance between nodes
     * @property {number} [gravity=0.1] - The strength of the gravitational force towards the center.
     *                                    Higher values (e.g., 0.5) pull nodes more strongly to the center,
     *                                    while lower values (e.g., 0.01) allow nodes to spread out more.
     *                                    Values typically range from 0 to 1.
     * @property {number} [cooling=0.95] - The cooling factor for simulated annealing.
     *                                     It determines how quickly the algorithm "cools down" and settles into a final layout.
     *                                     Values closer to 1 (e.g., 0.99) result in slower cooling and potentially better layouts,
     *                                     but take longer to compute. Values further from 1 (e.g., 0.8) cool faster but may
     *                                     result in less optimal layouts. Typical values range from 0.8 to 0.99.
     */
    fruchtermanReingold: function (graph, options = {}) {
        const { width = 2000, height = 2000, iterations = 50, k = 300, gravity = 0.1, cooling = 0.95 } = options;
        const nodes = graph.nodes;
        const edges = graph.relationships;

        // Calculate total area occupied by nodes
        const totalNodeArea = nodes.reduce((sum, node) => sum + node.width * node.height, 0);
        const areaMultiplier = Math.sqrt((width * height) / totalNodeArea) * 0.5;

        // Initialize node positions
        nodes.forEach((node) => {
            node.x = Math.random() * width;
            node.y = Math.random() * height;
            node.dx = 0;
            node.dy = 0;
            // Adjust node size based on area multiplier
            node.scaledWidth = Math.sqrt(node.width * areaMultiplier);
            node.scaledHeight = Math.sqrt(node.height * areaMultiplier);
        });

        let temp = Math.sqrt(width * height) / 10;
        for (let i = 0; i < iterations; i++) {
            // Calculate repulsive forces
            for (let v = 0; v < nodes.length; v++) {
                for (let u = v + 1; u < nodes.length; u++) {
                    let dx = nodes[v].x - nodes[u].x;
                    let dy = nodes[v].y - nodes[u].y;
                    let dist = Math.sqrt(dx * dx + dy * dy) - (nodes[v].scaledWidth + nodes[u].scaledWidth) / 2;
                    if (dist <= 0) dist = 0.01;
                    let force = (k * k) / dist;
                    nodes[v].dx += (dx / dist) * force;
                    nodes[v].dy += (dy / dist) * force;
                    nodes[u].dx -= (dx / dist) * force;
                    nodes[u].dy -= (dy / dist) * force;
                }
            }

            // Calculate attractive forces
            edges.forEach((edge) => {
                let source = nodes.find((n) => n.id === edge.source);
                let target = nodes.find((n) => n.id === edge.target);
                let dx = source.x - target.x;
                let dy = source.y - target.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist === 0) dist = 0.01;
                let force = (dist * dist) / k;
                source.dx -= (dx / dist) * force;
                source.dy -= (dy / dist) * force;
                target.dx += (dx / dist) * force;
                target.dy += (dy / dist) * force;
            });

            // Apply forces
            nodes.forEach((node) => {
                let dx = Math.min(Math.max(node.dx, -temp), temp);
                let dy = Math.min(Math.max(node.dy, -temp), temp);
                node.x += dx;
                node.y += dy;

                // Apply gravity towards the center
                let centerX = width / 2;
                let centerY = height / 2;
                node.x += gravity * (centerX - node.x);
                node.y += gravity * (centerY - node.y);

                // Keep nodes within bounds
                node.x = Math.max(node.scaledWidth / 2, Math.min(width - node.scaledWidth / 2, node.x));
                node.y = Math.max(node.scaledHeight / 2, Math.min(height - node.scaledHeight / 2, node.y));

                // Reset displacement for next iteration
                node.dx = 0;
                node.dy = 0;
            });

            temp *= cooling;
        }

        // Scale back to original coordinates
        const minX = Math.min(...nodes.map((n) => n.x - n.scaledWidth / 2));
        const minY = Math.min(...nodes.map((n) => n.y - n.scaledHeight / 2));
        const maxX = Math.max(...nodes.map((n) => n.x + n.scaledWidth / 2));
        const maxY = Math.max(...nodes.map((n) => n.y + n.scaledHeight / 2));

        const scaleX = width / (maxX - minX);
        const scaleY = height / (maxY - minY);
        const scale = Math.min(scaleX, scaleY) * 0.9; // 0.9 to leave some margin

        nodes.forEach((node) => {
            node.x = (node.x - minX) * scale;
            node.y = (node.y - minY) * scale;
            node.width = node.width; // Preserve original width
            node.height = node.height; // Preserve original height
            delete node.scaledWidth;
            delete node.scaledHeight;
        });

        return graph;
    },

    // Additional algorithms can be added here in the future
};

module.exports = layoutAlgorithms;
