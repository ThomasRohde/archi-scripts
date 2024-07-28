// File: ./lib/chartjsUtility.js

/**
 * @module chartjsUtility
 * @description A utility module for creating Chart.js charts in Eclipse SWT Browser widgets, with OS-specific browser selection
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
        // For any other OS, use the default
        return SWT.NONE;
    },

    /**
     * Creates a Browser widget with a Chart.js chart
     * @param {Composite} parent - The parent composite for the Browser widget
     * @param {Object} chartConfig - The Chart.js configuration object
     * @returns {Browser} The Browser widget containing the chart
     */
    createChartWidget: function (parent, chartConfig) {
        const browserStyle = this.getBrowserStyle();
        const browser = new Browser(parent, browserStyle);

        const htmlContent = this.generateChartHtml(chartConfig);
        const tempFile = this.createTempHtmlFile(htmlContent);

        browser.setUrl(tempFile.toURI().toString());

        return browser;
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
                chartConfig.options = chartConfig.options || {};
                chartConfig.options.responsive = true;
                chartConfig.options.maintainAspectRatio = false;
                let myChart = new Chart(ctx, chartConfig);

                // Resize chart when window is resized
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
        tempFile.deleteOnExit();
        const writer = new BufferedWriter(new FileWriter(tempFile));
        writer.write(htmlContent);
        writer.close();
        return tempFile;
    },
};

// Export the module
module.exports = chartjsUtility;
