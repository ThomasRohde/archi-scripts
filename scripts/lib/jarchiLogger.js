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

    getApiUrl: function() {
        return this.preferenceStore.getString('loggerApiUrl');
    },

    getLogLevelFromPreferences: function() {
        const levelString = this.preferenceStore.getString('loggerLogLevel');
        return LOG_LEVELS[levelString] || LOG_LEVELS.INFO;
    },

    log: function(level, message, script, additionalData = {}) {
        const logLevel = LOG_LEVELS[level] || this.defaultLogLevel;
        
        if (logLevel < this.defaultLogLevel) {
            return;
        }

        const logData = {
            level: level,
            script: script,
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
        const color = LOG_COLORS[logData.level] || [0, 0, 0];
        
        console.setTextColor(color[0], color[1], color[2]);
        console.log(logMessage);
        console.setDefaultTextColor();
    
        const additionalData = {...logData};
        delete additionalData.timestamp;
        delete additionalData.level;
        delete additionalData.script;
        delete additionalData.message;
    
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

    createLogger: function(scriptName) {
        return {
            debug: (message, additionalData) => this.log('DEBUG', message, scriptName, additionalData),
            info: (message, additionalData) => this.log('INFO', message, scriptName, additionalData),
            warn: (message, additionalData) => this.log('WARN', message, scriptName, additionalData),
            error: (message, additionalData) => this.log('ERROR', message, scriptName, additionalData)
        };
    }
};

jarchiLogger.initialize();

module.exports = jarchiLogger;