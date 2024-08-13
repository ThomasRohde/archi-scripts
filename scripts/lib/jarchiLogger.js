// File: jarchiLogger.js

const HttpClient = Java.type('java.net.http.HttpClient');
const HttpRequest = Java.type('java.net.http.HttpRequest');
const HttpResponse = Java.type('java.net.http.HttpResponse');
const URI = Java.type('java.net.URI');
const BodyPublishers = Java.type('java.net.http.HttpRequest.BodyPublishers');

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

const LOG_COLORS = {
    DEBUG: [100, 100, 100],  // Dark gray
    INFO: [0, 100, 0],       // Green
    WARN: [255, 165, 0],     // Orange
    ERROR: [255, 0, 0]       // Red
};

const jarchiLogger = {
    httpClient: HttpClient.newBuilder().build(),
    preferenceStore: null,
    defaultLogLevel: LOG_LEVELS.INFO,

    initialize: function() {
        this.preferenceStore = workbench.getPreferenceStore();
        this.defaultLogLevel = this.getLogLevelFromPreferences();
    },

    isEnabled: function() {
        return this.preferenceStore.getBoolean('loggerEnabled');
    },

    isConsoleLoggingEnabled: function() {
        return this.preferenceStore.getBoolean('loggerConsoleLogging');
    },

    isConsoleMarkdownLoggingEnabled: function() {
        return this.preferenceStore.getBoolean('loggerMarkdownLogging');
    },

    getApiUrl: function() {
        return this.preferenceStore.getString('loggerApiUrl');
    },

    getLogLevelFromPreferences: function() {
        const levelString = this.preferenceStore.getString('loggerLogLevel');
        return LOG_LEVELS[levelString] || LOG_LEVELS.INFO;
    },

    getStackInfo: function() {
        const stack = new Error().stack;
        const stackLines = stack.split('\n');
        const callerLine = stackLines[4]; // Index 4 should be the caller of the log function
        const match = callerLine.match(/at .+ \((.+):(\d+)\)/);
        if (match) {
            return {
                fileName: match[1],
                lineNo: parseInt(match[2]),
            };
        }
        return null;
    },

    log: function(level, message, script, additionalData = {}, basePath = '') {
        const logLevel = LOG_LEVELS[level] || this.defaultLogLevel;
        
        if (logLevel < this.defaultLogLevel) {
            return;
        }

        const stackInfo = this.getStackInfo();
        const logData = {
            level: level,
            script: script,
            message: message,
            timestamp: new Date().toISOString(),
            fileName: stackInfo ? (basePath + stackInfo.fileName) : 'unknown',
            lineNo: stackInfo ? stackInfo.lineNo : 0,
            columnNo: stackInfo ? stackInfo.columnNo : 0,
            ...additionalData
        };

        if (this.isConsoleLoggingEnabled()) {
            this.logToConsole(logData);
        }

        if (this.isEnabled()) {
            this.sendLogToServer(logData);
        }
    },

    logToConsole: function(logData) {
        const logMessage = `[${logData.timestamp}] ${logData.level} - ${logData.script} - ${logData.message} (${logData.fileName}:${logData.lineNo}:${logData.columnNo})`;
        const color = LOG_COLORS[logData.level] || [0, 0, 0];
        
        console.setTextColor(color[0], color[1], color[2]);
        console.log(logMessage);
        console.setDefaultTextColor();
    
        const additionalData = {...logData};
        delete additionalData.timestamp;
        delete additionalData.level;
        delete additionalData.script;
        delete additionalData.message;
        delete additionalData.fileName;
        delete additionalData.lineNo;
        delete additionalData.columnNo;
    
        if (Object.keys(additionalData).length > 0) {
            console.log('Additional data:', JSON.stringify(additionalData, null, 2));
        }
    },

    sendLogToServer: function(logData) {
        const apiUrl = this.getApiUrl();
        const request = HttpRequest.newBuilder()
            .uri(URI.create(apiUrl + '/log'))
            .header('Content-Type', 'application/json')
            .POST(BodyPublishers.ofString(JSON.stringify(logData)))
            .build();

        this.httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
            .thenApply(response => {
                if (response.statusCode() !== 200) {
                    console.error('Failed to send log to server. Status code:', response.statusCode());
                }
            })
            .exceptionally(e => {
                console.error('Error sending log to server:', e.getMessage());
            });
    },

    sendMarkdownToConsole: function(markdown) {
        if (!this.isConsoleMarkdownLoggingEnabled()) {
            return;
        }

        const apiUrl = this.getApiUrl();
        const request = HttpRequest.newBuilder()
            .uri(URI.create(apiUrl + '/console'))
            .header('Content-Type', 'application/json')
            .POST(BodyPublishers.ofString(JSON.stringify({ markdown })))
            .build();

        this.httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
            .thenApply(response => {
                if (response.statusCode() !== 200) {
                    console.error('Failed to send markdown to console. Status code:', response.statusCode());
                }
            })
            .exceptionally(e => {
                console.error('Error sending markdown to console:', e.getMessage());
            });
    },

    sendCodeToConsole: function(obj, scriptName) {
        const formattedCode = JSON.stringify(obj, null, 2);
        const markdown = `\`\`\`json\n${formattedCode}\n\`\`\``;
        this.sendMarkdownToConsole(`${scriptName} - Code Output:\n${markdown}`);
    },

    createLogger: function(scriptName, basePath = '') {
        return {
            debug: (message, additionalData) => this.log('DEBUG', message, scriptName, additionalData, basePath),
            info: (message, additionalData) => this.log('INFO', message, scriptName, additionalData, basePath),
            warn: (message, additionalData) => this.log('WARN', message, scriptName, additionalData, basePath),
            error: (message, additionalData) => this.log('ERROR', message, scriptName, additionalData, basePath),
            markdown: (content) => this.sendMarkdownToConsole(content),
            code: (obj) => this.sendCodeToConsole(obj, scriptName)
        };
    }
};

jarchiLogger.initialize();

module.exports = jarchiLogger;