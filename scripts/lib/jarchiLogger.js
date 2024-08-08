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
    scriptName: 'Unknown',

    init: function(scriptName) {
        this.preferenceStore = workbench.getPreferenceStore();
        this.defaultLogLevel = this.getLogLevelFromPreferences();
        this.scriptName = scriptName;
    },

    isEnabled: function() {
        return this.preferenceStore.getBoolean('loggerEnabled');
    },

    isConsoleLoggingEnabled: function() {
        return this.preferenceStore.getBoolean('loggerConsoleLogging');
    },

    getApiUrl: function() {
        return this.preferenceStore.getString('loggerApiUrl');
    },

    getLogLevelFromPreferences: function() {
        const levelString = this.preferenceStore.getString('loggerLogLevel');
        return LOG_LEVELS[levelString] || LOG_LEVELS.INFO;
    },

    log: function(level, message, additionalData = {}) {
        const logLevel = LOG_LEVELS[level] || this.defaultLogLevel;
        
        if (logLevel < this.defaultLogLevel) {
            return; // Skip logging if the message's level is lower than the default level
        }

        const logData = {
            level: level,
            script: this.scriptName,
            message: message,
            timestamp: new Date().toISOString(),
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
        const logMessage = `[${logData.timestamp}] ${logData.level} - ${logData.script} - ${logData.message}`;
        const color = LOG_COLORS[logData.level] || [0, 0, 0];  // Default to black if level not found
        
        console.setTextColor(color[0], color[1], color[2]);
        console.log(logMessage);
        console.setDefaultTextColor();

        if (Object.keys(logData).length > 4) { // If there's additional data
            console.log('Additional data:', JSON.stringify(logData, null, 2));
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

    debug: function(message, additionalData = {}) {
        this.log('DEBUG', message, additionalData);
    },

    info: function(message, additionalData = {}) {
        this.log('INFO', message, additionalData);
    },

    warn: function(message, additionalData = {}) {
        this.log('WARN', message, additionalData);
    },

    error: function(message, additionalData = {}) {
        this.log('ERROR', message, additionalData);
    }
};

module.exports = jarchiLogger;