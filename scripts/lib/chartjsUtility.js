// File: ./lib/chartjsUtility.js

/**
 * @module chartjsUtility
 * @description A utility module for creating Chart.js charts in Eclipse SWT Browser widgets, with OS-specific browser selection and improved chart configurations
 * @version 1.2
 */

const SWT = Java.type("org.eclipse.swt.SWT");
const Browser = Java.type("org.eclipse.swt.browser.Browser");
const File = Java.type("java.io.File");
const FileWriter = Java.type("java.io.FileWriter");
const BufferedWriter = Java.type("java.io.BufferedWriter");
const System = Java.type("java.lang.System");

const chartjsUtility = {
    /**
     * Determines the appropriate SWT flag for Browser widget based on the OS
     * @returns {number} The SWT flag to use for Browser creation
     */
    getBrowserStyle: function () {
        const os = System.getProperty("os.name").toLowerCase();
        if (os.includes("win")) {
            return SWT.EDGE;
        } else if (os.includes("mac")) {
            return SWT.WEBKIT;
        }
        return SWT.NONE;
    },

    /**
     * Creates a Browser widget with a Chart.js chart
     * @param {Composite} parent - The parent composite for the Browser widget
     * @param {Object} chartConfig - The Chart.js configuration object
     * @returns {Browser} The Browser widget containing the chart
     */
    createChartWidget: function (parent, chartConfig) {
        const browser = new Browser(parent, this.getBrowserStyle());
        const htmlContent = this.generateChartHtml(this.enhanceChartConfig(chartConfig));
        const tempFile = this.createTempHtmlFile(htmlContent);
        browser.setUrl(tempFile.toURI().toString());
        return browser;
    },

    /**
     * Enhances the chart configuration with improved default options
     * @param {Object} chartConfig - The original Chart.js configuration object
     * @returns {Object} The enhanced Chart.js configuration object
     */
    enhanceChartConfig: function (chartConfig) {
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
            },
            onHover: null,
            hover: {
                mode: null,
            },
            animation: {
                duration: 0,
            },
        };

        // Add scales only for non-pie charts
        if (chartConfig.type !== 'pie' && chartConfig.type !== 'doughnut') {
            defaultOptions.scales = {
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 0,
                    },
                },
                y: {
                    beginAtZero: true,
                },
            };
        }

        // Deep merge the default options with the provided chart config
        const mergedConfig = JSON.parse(JSON.stringify(chartConfig)); // Deep clone
        this.deepMerge(mergedConfig.options, defaultOptions);

        return mergedConfig;
    },

    /**
     * Deep merges two objects
     * @param {Object} target - The target object
     * @param {Object} source - The source object
     */
    deepMerge: function (target, source) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] instanceof Object && !Array.isArray(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
    },

    /**
     * Generates the HTML content for the chart
     * @param {Object} chartConfig - The Chart.js configuration object
     * @returns {string} The generated HTML content
     */
    generateChartHtml: function (chartConfig) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Chart.js in JArchi</title>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <style>
                body, html {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                #chartContainer {
                    width: 100%;
                    height: 100%;
                }
            </style>
        </head>
        <body>
            <div id="chartContainer">
                <canvas id="myChart"></canvas>
            </div>
            <script>
                const ctx = document.getElementById('myChart').getContext('2d');
                const chartConfig = ${JSON.stringify(chartConfig)};
                let myChart = new Chart(ctx, chartConfig);

                window.addEventListener('resize', function() {
                    myChart.resize();
                });
            </script>
        </body>
        </html>
        `;
    },

    /**
     * Creates a temporary HTML file with the given content
     * @param {string} htmlContent - The HTML content to write to the file
     * @returns {File} The created temporary file
     */
    createTempHtmlFile: function (htmlContent) {
        const tempFile = File.createTempFile("chart_", ".html");
        console.log(tempFile)
        //tempFile.deleteOnExit();
        const writer = new BufferedWriter(new FileWriter(tempFile));
        writer.write(htmlContent);
        writer.close();
        return tempFile;
    },

    /**
     * Generates an array of distinct colors
     * @param {number} count - The number of colors to generate
     * @returns {string[]} An array of color strings
     */
    generateColors: function (count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 137.508) % 360;  // Use golden angle approximation
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
        return colors;
    }
};

// Export the module
module.exports = chartjsUtility;