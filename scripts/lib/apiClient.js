/**
 * @module apiClient
 * @description A robust HTTP client for making API requests in JArchi scripts, using JDK 17's HttpClient
 * @version 4.2
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-02
 */

const HttpClient = Java.type("java.net.http.HttpClient");
const HttpRequest = Java.type("java.net.http.HttpRequest");
const HttpResponse = Java.type("java.net.http.HttpResponse");
const URI = Java.type("java.net.URI");
const BodyPublishers = Java.type("java.net.http.HttpRequest.BodyPublishers");
const BodyHandlers = Java.type("java.net.http.HttpResponse.BodyHandlers");
const Duration = Java.type("java.time.Duration");
const Base64 = Java.type("java.util.Base64");
const ByteArrayOutputStream = Java.type("java.io.ByteArrayOutputStream");
const DataOutputStream = Java.type("java.io.DataOutputStream");

const jarchiLogger = require('./jarchiLogger');
const log = jarchiLogger.createLogger('API Client', __DIR__);

const apiClient = {
    create: function(defaultConfig = {}) {
        const instance = Object.create(this);
        instance.defaults = {
            baseURL: '',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 0,
            validateStatus: function(status) {
                return status >= 200 && status < 300;
            },
            ...defaultConfig
        };
        instance.httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .build();
        return instance;
    },

    request: function(config) {
        return new Promise((resolve, reject) => {
            try {
                config = { ...this.defaults, ...config };
                const fullUrl = this.buildUrl(config.baseURL, config.url, config.params);
                
                let requestBody;
                let contentType;
    
                if (config.fileUpload) {
                    const fileUploadData = this.handleFileUpload(config.fileUpload);
                    requestBody = fileUploadData.body;
                    contentType = fileUploadData.contentType;
                } else {
                    requestBody = this.createRequestBody(config);
                    contentType = config.headers['Content-Type'] || 'application/json';
                }
    
                // Log the payload here
                if (config.debug) {
                    log.debug('API Request Payload', {
                        payload: config.data
                    });
                }
    
                let requestBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(fullUrl))
                    .method(config.method.toUpperCase(), requestBody);


                this.setRequestProperties(requestBuilder, config);
                requestBuilder.header("Content-Type", contentType);

                if (config.timeout > 0) {
                    requestBuilder.timeout(Duration.ofMillis(config.timeout));
                }

                if (config.debug) {
                    log.debug('API Request', {
                        url: fullUrl,
                        method: config.method.toUpperCase(),
                        headers: this.parseHeaders(requestBuilder.build().headers()),
                    });
                }

                const response = this.httpClient.send(requestBuilder.build(), BodyHandlers.ofString());

                const parsedResponse = {
                    status: response.statusCode(),
                    statusText: this.getStatusText(response.statusCode()),
                    headers: this.parseHeaders(response.headers()),
                    data: this.parseResponseBody(response.body(), response.headers().firstValue("Content-Type").orElse(null)),
                    config: config,
                    request: requestBuilder.build()
                };

                if (config.debug) {
                    log.debug('API Response', {
                        status: parsedResponse.status,
                        headers: parsedResponse.headers,
                        data: parsedResponse.data
                    });
                }

                if (config.validateStatus(parsedResponse.status)) {
                    resolve(parsedResponse);
                } else {
                    const error = new Error(`Request failed with status code ${parsedResponse.status}`);
                    error.response = parsedResponse;
                    reject(error);
                }
            } catch (error) {
                log.error('API Request Error', { error: error.toString(), stack: error.stack });
                reject(error);
            }
        });
    },

    createRequestBody: function(config) {
        if (config.data) {
            const payload = typeof config.data === 'string' ? config.data : JSON.stringify(config.data);
            
            // Log the payload here
            if (config.debug) {
                log.debug('Request Body', { payload: payload });
            }
            
            return BodyPublishers.ofString(payload);
        }
        return BodyPublishers.noBody();
    },

    handleFileUpload: function(fileUpload) {
        const boundary = "*****" + Math.random().toString(36).substring(2);
        const CRLF = "\r\n";
        const outputStream = new ByteArrayOutputStream();
        const writer = new DataOutputStream(outputStream);

        writer.writeBytes("--" + boundary + CRLF);
        writer.writeBytes("Content-Disposition: form-data; name=\"comment\"" + CRLF + CRLF);
        writer.writeBytes(fileUpload.comment + CRLF);

        writer.writeBytes("--" + boundary + CRLF);
        writer.writeBytes("Content-Disposition: form-data; name=\"file\"; filename=\"" + fileUpload.name + "\"" + CRLF);
        writer.writeBytes("Content-Type: " + fileUpload.contentType + CRLF + CRLF);

        if (fileUpload.type === "image") {
            writer.write(Base64.getDecoder().decode(fileUpload.content));
        } else {
            writer.write(fileUpload.content.getBytes());
        }

        writer.writeBytes(CRLF);
        writer.writeBytes("--" + boundary + "--" + CRLF);

        writer.flush();
        writer.close();

        return {
            body: BodyPublishers.ofByteArray(outputStream.toByteArray()),
            contentType: "multipart/form-data; boundary=" + boundary
        };
    },

    buildUrl: function(baseURL, url, params) {
        let fullUrl = baseURL ? (baseURL + url) : url;
        if (params) {
            const queryString = Object.entries(params)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
        }
        return fullUrl;
    },

    setRequestProperties: function(requestBuilder, config) {
/*         for (const [key, value] of Object.entries(this.defaults.headers)) {
            if (key.toLowerCase() !== 'content-type') {
                requestBuilder.header(key, value);
            }
        } */
        if (config.headers) {
            for (const [key, value] of Object.entries(config.headers)) {
                if (key.toLowerCase() !== 'content-type') {
                    requestBuilder.header(key, value);
                }
            }
        }
        if (config.auth) {
            if (config.auth.username && config.auth.password) {
                const authString = `${config.auth.username}:${config.auth.password}`;
                const encodedAuth = Base64.getEncoder().encodeToString(authString.getBytes("UTF-8"));
                requestBuilder.header("Authorization", `Basic ${encodedAuth}`);
            } else if (config.auth.bearer) {
                requestBuilder.header("Authorization", `Bearer ${config.auth.bearer}`);
            }
        }
    },

    parseHeaders: function(headers) {
        const parsedHeaders = {};
        headers.map().forEach((key, values) => {
            const valueArray = Java.from(values);
            parsedHeaders[key.toLowerCase()] = valueArray.length > 1 ? valueArray : valueArray[0];
        });
        return parsedHeaders;
    },

    parseResponseBody: function(body, contentType) {
        if (contentType && contentType.includes("application/json")) {
            try {
                return JSON.parse(body);
            } catch (e) {
                log.warn('Failed to parse JSON response body', { error: e.toString() });
            }
        }
        return body;
    },

    getStatusText: function(statusCode) {
        const statusTexts = {
            200: "OK",
            201: "Created",
            204: "No Content",
            400: "Bad Request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not Found",
            500: "Internal Server Error"
        };
        return statusTexts[statusCode] || "Unknown Status";
    },

    get: function(url, config = {}) {
        return this.request({ ...config, method: 'GET', url });
    },

    post: function(url, data, config = {}) {
        return this.request({ ...config, method: 'POST', url, data });
    },

    put: function(url, data, config = {}) {
        return this.request({ ...config, method: 'PUT', url, data });
    },

    delete: function(url, config = {}) {
        return this.request({ ...config, method: 'DELETE', url });
    },

    patch: function(url, data, config = {}) {
        return this.request({ ...config, method: 'PATCH', url, data });
    },

    uploadFile: function(url, fileUpload, config = {}) {
        return this.request({ ...config, method: 'POST', url, fileUpload });
    }
};

module.exports = apiClient;