/**
 * @module apiClient
 * @description A robust HTTP client for making API requests in JArchi scripts, inspired by Axios with Confluence compatibility
 * @version 2.3
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-07-31
 */

const HttpURLConnection = Java.type("java.net.HttpURLConnection");
const BufferedReader = Java.type("java.io.BufferedReader");
const InputStreamReader = Java.type("java.io.InputStreamReader");
const OutputStreamWriter = Java.type("java.io.OutputStreamWriter");
const DataOutputStream = Java.type("java.io.DataOutputStream");
const URL = Java.type("java.net.URL");
const Base64 = Java.type("java.util.Base64");

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
        return instance;
    },

    request: function(config) {
        return new Promise((resolve, reject) => {
            try {
                config = { ...this.defaults, ...config };
                const fullUrl = this.buildUrl(config.baseURL, config.url, config.params);
                const url = new URL(fullUrl);
                const connection = url.openConnection();
                connection.setRequestMethod(config.method.toUpperCase());

                this.setRequestProperties(connection, config);

                if (config.timeout > 0) {
                    connection.setConnectTimeout(config.timeout);
                    connection.setReadTimeout(config.timeout);
                }

                if (config.debug) {
                    console.log("Request URL:", fullUrl);
                    console.log("Request Method:", connection.getRequestMethod());
                    console.log("Request Headers:", connection.getRequestProperties());
                }

                if (config.data) {
                    connection.setDoOutput(true);
                    connection.setRequestProperty("Content-Type", "application/json");
                    this.writeRequestBody(connection, config.data);
                }

                if (config.fileUpload) {
                    this.handleFileUpload(connection, config.fileUpload);
                }

                const statusCode = connection.getResponseCode();

                if (config.debug) {
                    console.log("Response Status Code:", statusCode);
                }

                const responseBody = this.readResponseBody(connection);
                const contentType = connection.getContentType();

                const response = {
                    status: statusCode,
                    statusText: connection.getResponseMessage(),
                    headers: this.parseHeaders(connection.getHeaderFields()),
                    data: this.parseResponseBody(responseBody, contentType),
                    config: config,
                    request: connection
                };

                if (config.validateStatus(statusCode)) {
                    resolve(response);
                } else {
                    const error = new Error(`Request failed with status code ${statusCode}`);
                    error.response = response;
                    reject(error);
                }
            } catch (error) {
                reject(error);
            }
        });
    },

    writeRequestBody: function(connection, data) {
        const writer = new OutputStreamWriter(connection.getOutputStream());
        const payload = typeof data === 'string' ? data : JSON.stringify(data);
        writer.write(payload);
        writer.flush();
        writer.close();
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

    setRequestProperties: function(connection, config) {
        for (const [key, value] of Object.entries(this.defaults.headers)) {
            connection.setRequestProperty(key, value);
        }

        if (config.headers) {
            for (const [key, value] of Object.entries(config.headers)) {
                connection.setRequestProperty(key, value);
            }
        }

        if (config.auth) {
            if (config.auth.username && config.auth.password) {
                const authString = `${config.auth.username}:${config.auth.password}`;
                const encodedAuth = Base64.getEncoder().encodeToString(authString.getBytes("UTF-8"));
                connection.setRequestProperty("Authorization", `Basic ${encodedAuth}`);
            } else if (config.auth.bearer) {
                connection.setRequestProperty("Authorization", `Bearer ${config.auth.bearer}`);
            }
        }
    },

    handleFileUpload: function(connection, fileUpload) {
        const boundary = "*****";
        const crlf = "\r\n";
        const twoHyphens = "--";

        connection.setRequestProperty("Content-Type", "multipart/form-data;boundary=" + boundary);
        connection.setDoOutput(true);

        const outputStream = new DataOutputStream(connection.getOutputStream());

        outputStream.writeBytes(twoHyphens + boundary + crlf);
        outputStream.writeBytes("Content-Disposition: form-data; name=\"comment\"" + crlf);
        outputStream.writeBytes(crlf);
        outputStream.writeBytes(fileUpload.comment + crlf);

        outputStream.writeBytes(twoHyphens + boundary + crlf);
        outputStream.writeBytes("Content-Disposition: form-data; name=\"file\"; filename=\"" + fileUpload.name + "\"" + crlf);
        outputStream.writeBytes("Content-Type: " + fileUpload.contentType + crlf);
        outputStream.writeBytes(crlf);

        if (fileUpload.type === "image") {
            outputStream.write(Base64.getDecoder().decode(fileUpload.content));
        } else {
            outputStream.write(fileUpload.content.getBytes());
        }

        outputStream.writeBytes(crlf);
        outputStream.writeBytes(twoHyphens + boundary + twoHyphens + crlf);

        outputStream.flush();
        outputStream.close();
    },

    readResponseBody: function(connection) {

        const stream = connection.getResponseCode() >= 400 ? connection.getErrorStream() : connection.getInputStream();
        if (stream === null) return "";

        const reader = new BufferedReader(new InputStreamReader(stream));
        const out = new java.lang.StringBuilder();
        let line;
        while ((line = reader.readLine()) !== null) {
            out.append(line);
        }
        reader.close();
        return out.toString();
    },

    parseHeaders: function(headerFields) {
        const headers = {};
        const entries = headerFields.entrySet().toArray();
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const key = entry.getKey();
            const value = entry.getValue();
            if (key !== null) {  // null key represents the status line
                headers[key.toLowerCase()] = value.get(0);
            }
        }
        return headers;
    },

    parseResponseBody: function(body, contentType) {
        if (contentType && contentType.includes("application/json")) {
            try {
                return JSON.parse(body);
            } catch (e) {
                console.warn("Failed to parse JSON response body:", e);
            }
        }
        return body;
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

    // New method for file uploads
    uploadFile: function(url, fileUpload, config = {}) {
        return this.request({ ...config, method: 'POST', url, fileUpload });
    }
};

module.exports = apiClient;