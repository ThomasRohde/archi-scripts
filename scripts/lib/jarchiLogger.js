// File: ./scripts/lib/jarchiLogger.js

const HttpClient = Java.type("java.net.http.HttpClient");
const HttpRequest = Java.type("java.net.http.HttpRequest");
const HttpResponse = Java.type("java.net.http.HttpResponse");
const URI = Java.type("java.net.URI");
const BodyPublishers = Java.type("java.net.http.HttpRequest.BodyPublishers");
const BodyHandlers = Java.type("java.net.http.HttpResponse.BodyHandlers");
const Duration = Java.type("java.time.Duration");

const jarchiLogger = {
    logServerUrl: 'http://localhost:4000/log',
    httpClient: HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(1))
        .build(),

    log: function(application, module, message, additionalData = {}) {
        const logData = {
            application,
            module,
            message,
            ...(typeof additionalData === 'object' && additionalData !== null ? additionalData : { data: additionalData })
        };

        const requestBody = JSON.stringify(logData);

        const request = HttpRequest.newBuilder()
            .uri(URI.create(this.logServerUrl))
            .header("Content-Type", "application/json")
            .POST(BodyPublishers.ofString(requestBody))
            .timeout(Duration.ofSeconds(5))
            .build();

        try {
            this.httpClient.sendAsync(request, BodyHandlers.discarding());
        } catch (error) {
            // Silently handle any errors
            console.error("Error sending log: " + error.toString());
        }
    },

    slog: function(message, additionalData = {}) {
        this.log(this.application, this.module, message, additionalData)
    },

    setLogServerUrl: function(url) {
        this.logServerUrl = url;
    },

    setApplication: function(application, module = "") {
        this.application = application;
        this.module = module;
    }
};

module.exports = jarchiLogger;