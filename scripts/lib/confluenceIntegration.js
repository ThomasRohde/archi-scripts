/**
 * @module confluenceIntegration
 * @description A module for integrating jArchi scripts with Atlassian Confluence Cloud using apiClient
 * @version 3.1
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-08
 */

const apiClient = require("./apiClient");
const jarchiLogger = require("./jarchiLogger");
const log = jarchiLogger.createLogger("confluenceIntegration");

function readConfluenceSettings() {
    const preferenceStore = workbench.getPreferenceStore();
    return {
        username: preferenceStore.getString("confluenceUsername"),
        apiToken: preferenceStore.getString("confluencePassword"),
        spaceKey: preferenceStore.getString("confluenceDefaultSpaceKey"),
        baseUrl: preferenceStore.getString("confluenceBaseUrl"),
    };
}

const confluenceApi = apiClient.create({
    auth: {
        username: readConfluenceSettings().username,
        password: readConfluenceSettings().apiToken,
    },
    baseURL: readConfluenceSettings().baseUrl,
    headers: {
        "X-Atlassian-Token": "no-check",
    },
    debug: true,
});

async function getPageInfo(pageTitle, opts = {}) {
    try {
        const response = await confluenceApi.get("/wiki/api/v2/pages", {
            params: {
                title: pageTitle,
                spaceKey: readConfluenceSettings().spaceKey,
                status: "current",
                expand: "version",
            },
            ...opts,
        });

        if (response.data.results && response.data.results.length > 0) {
            const pageInfo = response.data.results[0];
            return {
                pageId: pageInfo.id,
                pageVersion: pageInfo.version.number,
            };
        }
        return null;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        log.error("Error getting page info", { error: error.toString(), pageTitle });
        throw error;
    }
}

async function getSpaceId(spaceKey) {
    try {
        const response = await confluenceApi.get("/wiki/api/v2/spaces", {
            params: {
                keys: spaceKey,
            },
        });
        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0].id;
        }
        throw new Error(`Space with key ${spaceKey} not found`);
    } catch (error) {
        log.error("Error fetching space ID", { error: error.toString(), spaceKey });
        throw error;
    }
}

async function updateConfluencePage(pageId, parentId, pageTitle, pageVersion, pageContents, opts = {}) {
    const isNewPage = !pageId;
    const method = isNewPage ? "post" : "put";
    const url = isNewPage ? "/wiki/api/v2/pages" : `/wiki/api/v2/pages/${pageId}`;

    const spaceKey = readConfluenceSettings().spaceKey;
    const spaceId = await getSpaceId(spaceKey);

    const requestData = {
        spaceId: spaceId,
        status: "current",
        title: pageTitle,
        body: {
            representation: "storage",
            value: pageContents,
        },
    };

    if (!isNewPage) {
        requestData.version = { number: pageVersion };
        requestData.id = pageId;
    }

    if (parentId) {
        requestData.parentId = parentId;
    }

    try {
        const response = await confluenceApi.request({
            method: method,
            url: url,
            data: requestData,
            headers: {
                "Content-Type": "application/json",
            },
            ...opts,
        });

        log.info("Confluence page updated successfully", {
            pageId: response.data.id,
            pageVersion: response.data.version.number,
        });
        return {
            pageId: response.data.id,
            pageVersion: response.data.version.number,
        };
    } catch (error) {
        log.error("Error updating Confluence page", { error: error.toString(), pageTitle });
        throw error;
    }
}

async function getAttachmentInfo(pageId, fileName, opts = {}) {
    try {
        const response = await confluenceApi.get(`/wiki/api/v2/pages/${pageId}/attachments`, {
            params: {
                filename: fileName,
                expand: "version",
            },
            ...opts,
        });

        if (response.data.results && response.data.results.length > 0) {
            const attachment = response.data.results.find((a) => a.title === fileName);
            if (attachment) {
                return {
                    id: attachment.id,
                    title: attachment.title,
                    version: attachment.version.number,
                };
            }
        }
        return null;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        log.error("Error getting attachment info", { error: error.toString(), pageId, fileName });
        throw error;
    }
}

async function attachFile(pageId, fileName, fileContent, fileType, comment, opts = {}) {
    try {
        const existingAttachment = await getAttachmentInfo(pageId, fileName);

        let url;
        let method;

        if (existingAttachment) {
            url = `/wiki/rest/api/content/${pageId}/child/attachment/${existingAttachment.id}/data`;
            method = "POST";
            log.info("Updating existing attachment", { fileName });
        } else {
            url = `/wiki/rest/api/content/${pageId}/child/attachment`;
            method = "POST";
            log.info("Creating new attachment", { fileName });
        }

        const response = await confluenceApi.uploadFile(
            url,
            {
                name: fileName,
                content: fileContent,
                type: fileType,
                comment: comment,
                contentType: fileType === "image" ? "image/png" : "text/plain",
            },
            {
                method: method,
                headers: {
                    "X-Atlassian-Token": "no-check",
                },
                ...opts,
            }
        );
        if (existingAttachment) {
            log.info("File updated successfully", {
                id: response.data.id,
                title: response.data.title,
                version: response.data.version.by.number,
            });

            return {
                id: response.data.id,
                title: response.data.title,
                version: response.data.version.by.number,
            };
        }
        else {
            log.info("File attached successfully", {
                id: response.data.results[0].id,
                title: response.data.results[0].title,
                version: response.data.results[0].version.number,
            });

            return {
                id: response.data.results[0].id,
                title: response.data.results[0].title,
                version: response.data.results[0].version.number,
            };
        }
    } catch (error) {
        log.error("Error attaching file", { error: error.toString(), pageId, fileName });
        throw error;
    }
}

module.exports = {
    getPageInfo,
    updateConfluencePage,
    attachFile,
    readConfluenceSettings,
    getAttachmentInfo,
};
