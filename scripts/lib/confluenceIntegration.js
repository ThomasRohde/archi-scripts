/**
 * @module confluenceIntegration
 * @description A module for integrating jArchi scripts with Atlassian Confluence Cloud
 * @version 2.0
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-07-29
 */

const HttpURLConnection = Java.type("java.net.HttpURLConnection");
const BufferedReader = Java.type("java.io.BufferedReader");
const InputStreamReader = Java.type("java.io.InputStreamReader");
const DataOutputStream = Java.type("java.io.DataOutputStream");
const URL = Java.type("java.net.URL");
const Base64 = Java.type("java.util.Base64");

function readResponseToString(streamData) {
    const reader = new BufferedReader(new InputStreamReader(streamData));
    let line;
    let result = "";
    while ((line = reader.readLine()) != null) {
        result += line;
    }
    reader.close();
    return result;
}

function encodeCredentials(username, apiToken) {
    const authString = `${username}:${apiToken}`;
    return Base64.getEncoder().encodeToString(authString.getBytes("UTF-8"));
}

function setAuthHeaders(connection, confluenceSettings) {
    const encodedCredentials = encodeCredentials(confluenceSettings.username, confluenceSettings.apiToken);
    connection.setRequestProperty("Authorization", `Basic ${encodedCredentials}`);
    connection.setRequestProperty("X-Atlassian-Token", "no-check");
    connection.setRequestProperty("Content-Type", "application/json");
}

function getPageInfo(confluenceSettings, pageTitle, opts = {}) {
    const urlPath = "/wiki/rest/api/content";
    const url = new URL(
        `${confluenceSettings.baseUrl}${urlPath}?title=${encodeURIComponent(pageTitle)}&spaceKey=${encodeURIComponent(confluenceSettings.spaceKey)}&expand=version`
    );
    
    const connection = url.openConnection();
    connection.setRequestMethod("GET");
    setAuthHeaders(connection, confluenceSettings);

    if (opts.debug) {
        console.log("Request URL:", url.toString());
        console.log("Request Method:", connection.getRequestMethod());
    }

    const statusCode = connection.getResponseCode();

    if (opts.debug) {
        console.log("Response Status Code:", statusCode);
    }

    if (statusCode === 404) {
        return null; // Page not found
    }

    if (statusCode < 200 || statusCode >= 300) {
        const errorMessage = readResponseToString(connection.getErrorStream());
        throw new Error(`HTTP Error ${statusCode}: ${errorMessage}`);
    }

    const response = JSON.parse(readResponseToString(connection.getInputStream()));

    if (response.results.length === 0) {
        return null; // No results found
    }

    const pageInfo = response.results[0];
    return {
        pageId: pageInfo.id,
        pageVersion: parseInt(pageInfo.version.number)
    };
}

function updateConfluencePage(confluenceSettings, pageId, parentId, pageTitle, pageVersion, pageContents, opts = {}) {
    const isNewPage = !pageId;
    const method = isNewPage ? "POST" : "PUT";
    const urlPath = "/wiki/rest/api/content" + (isNewPage ? "" : `/${pageId}`);
    const url = new URL(confluenceSettings.baseUrl + urlPath);
    
    const connection = url.openConnection();
    connection.setRequestMethod(method);
    setAuthHeaders(connection, confluenceSettings);
    connection.setDoOutput(true);

    const requestData = {
        type: "page",
        title: pageTitle,
        space: { key: confluenceSettings.spaceKey },
        body: {
            storage: {
                value: pageContents,
                representation: "storage"
            }
        }
    };

    if (!isNewPage) {
        requestData.version = { number: pageVersion };
        if (parentId) {
            requestData.ancestors = [{ id: parentId }];
        }
    }

    const outputStream = new DataOutputStream(connection.getOutputStream());
    outputStream.writeBytes(JSON.stringify(requestData));
    outputStream.flush();
    outputStream.close();

    const statusCode = connection.getResponseCode();

    if (statusCode < 200 || statusCode >= 300) {
        const errorMessage = readResponseToString(connection.getErrorStream());
        throw new Error(`HTTP Error ${statusCode}: ${errorMessage}`);
    }

    const response = JSON.parse(readResponseToString(connection.getInputStream()));

    return {
        pageId: response.id,
        pageVersion: response.version ? response.version.number : 1
    };
}

function getAttachmentInfo(confluenceSettings, pageId, fileName) {
    const urlPath = `/wiki/rest/api/content/${pageId}/child/attachment?filename=${encodeURIComponent(fileName)}&expand=version`;
    const url = new URL(confluenceSettings.baseUrl + urlPath);
    
    const connection = url.openConnection();
    connection.setRequestMethod("GET");
    setAuthHeaders(connection, confluenceSettings);

    const statusCode = connection.getResponseCode();

    if (statusCode === 404) {
        return null; // Attachment not found
    }

    if (statusCode < 200 || statusCode >= 300) {
        const errorMessage = readResponseToString(connection.getErrorStream());
        throw new Error(`HTTP Error ${statusCode}: ${errorMessage}`);
    }

    const response = JSON.parse(readResponseToString(connection.getInputStream()));

    if (response.results.length === 0) {
        return null; // No attachment found
    }

    const attachmentInfo = response.results[0];
    return {
        id: attachmentInfo.id,
        title: attachmentInfo.title,
        version: attachmentInfo.version.number
    };
}

function attachFile(confluenceSettings, pageId, fileName, fileContent, fileType, comment, existingAttachmentId = null) {
    const urlPath = existingAttachmentId
        ? `/wiki/rest/api/content/${pageId}/child/attachment/${existingAttachmentId}/data`
        : `/wiki/rest/api/content/${pageId}/child/attachment`;
    const url = new URL(confluenceSettings.baseUrl + urlPath);
    const connection = url.openConnection();
    const boundary = "*****" + Math.random().toString(36).substring(2);
    
    connection.setRequestMethod(existingAttachmentId ? "POST" : "PUT");
    setAuthHeaders(connection, confluenceSettings);
    connection.setRequestProperty("Content-Type", `multipart/form-data;boundary=${boundary}`);
    connection.setRequestProperty("X-Atlassian-Token", "no-check");
    connection.setDoOutput(true);

    const outputStream = new DataOutputStream(connection.getOutputStream());
    const crlf = "\r\n";
    const twoHyphens = "--";

    // Write comment part
    outputStream.writeBytes(twoHyphens + boundary + crlf);
    outputStream.writeBytes("Content-Disposition: form-data; name=\"comment\"" + crlf);
    outputStream.writeBytes(crlf);
    outputStream.writeBytes(comment + crlf);

    // Write file part
    outputStream.writeBytes(twoHyphens + boundary + crlf);
    outputStream.writeBytes(`Content-Disposition: form-data; name="file"; filename="${fileName}"${crlf}`);
    outputStream.writeBytes(`Content-Type: ${fileType === "image" ? "image/png" : "text/plain"}${crlf}`);
    outputStream.writeBytes(crlf);

    if (fileType === "image") {
        outputStream.write(Base64.getDecoder().decode(fileContent));
    } else {
        outputStream.writeBytes(fileContent);
    }

    outputStream.writeBytes(crlf);
    outputStream.writeBytes(twoHyphens + boundary + twoHyphens + crlf);
    outputStream.flush();
    outputStream.close();

    const statusCode = connection.getResponseCode();

    if (statusCode < 200 || statusCode >= 300) {
        const errorMessage = readResponseToString(connection.getErrorStream());
        throw new Error(`HTTP Error ${statusCode}: ${errorMessage}`);
    }

    const response = JSON.parse(readResponseToString(connection.getInputStream()));
    return {
        id: response.results[0].id,
        title: response.results[0].title,
        version: response.results[0].version.number
    };
}

function readConfluenceSettings() {
    const preferenceStore = workbench.getPreferenceStore();
    return {
        username: preferenceStore.getString('confluenceUsername'),
        apiToken: preferenceStore.getString('confluencePassword'),
        spaceKey: preferenceStore.getString('confluenceDefaultSpaceKey'),
        baseUrl: preferenceStore.getString('confluenceBaseUrl'),
    };
}

module.exports = {
    getPageInfo,
    updateConfluencePage,
    attachFile,
    readConfluenceSettings,
    getAttachmentInfo
};