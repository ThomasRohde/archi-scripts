/**
 * @module confluenceIntegration
 * @description A module for integrating jArchi scripts with Atlassian Confluence Cloud using apiClient
 * @version 3.0
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-02
 */

const apiClient = require('./apiClient');

function readConfluenceSettings() {
    const preferenceStore = workbench.getPreferenceStore();
    return {
        username: preferenceStore.getString('confluenceUsername'),
        apiToken: preferenceStore.getString('confluencePassword'),
        spaceKey: preferenceStore.getString('confluenceDefaultSpaceKey'),
        baseUrl: preferenceStore.getString('confluenceBaseUrl'),
    };
}

const confluenceApi = apiClient.create({
    auth: {
        username: readConfluenceSettings().username,
        password: readConfluenceSettings().apiToken
    },
    baseURL: readConfluenceSettings().baseUrl,
    headers: {
        'X-Atlassian-Token': 'no-check'
    },
});

async function getPageInfo(pageTitle, opts = {}) {
    try {
        const response = await confluenceApi.get('/wiki/api/v2/pages', {
            params: {
                title: pageTitle,
                spaceKey: readConfluenceSettings().spaceKey,
                status: 'current',
                expand: 'version'
            },
            ...opts
        });

        if (response.data.results && response.data.results.length > 0) {
            const pageInfo = response.data.results[0];
            return {
                pageId: pageInfo.id,
                pageVersion: pageInfo.version.number
            };
        }
        return null;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
}

async function updateConfluencePage(pageId, parentId, pageTitle, pageVersion, pageContents, opts = {}) {
    const isNewPage = !pageId;
    const method = isNewPage ? 'post' : 'put';
    const url = isNewPage 
        ? '/wiki/rest/api/content'
        : `/wiki/rest/api/content/${pageId}`;

    const requestData = {
        type: "page",
        title: pageTitle,
        space: { key: readConfluenceSettings().spaceKey },
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

    try {
        const response = await confluenceApi.request({
            method: method,
            url: url,
            data: requestData,
            headers: {
                'Content-Type': 'application/json'
            },
            ...opts
        });

        return {
            pageId: response.data.id,
            pageVersion: response.data.version ? response.data.version.number : 1
        };
    } catch (error) {
        throw error;
    }
}

async function getAttachmentInfo(pageId, fileName, opts = {}) {
    try {
        const response = await confluenceApi.get(`/wiki/api/v2/pages/${pageId}/attachments`, {
            params: {
                filename: fileName,
                expand: 'version'
            },
            ...opts
        });

        if (response.data.results && response.data.results.length > 0) {
            const attachment = response.data.results.find(a => a.title === fileName);
            if (attachment) {
                return {
                    id: attachment.id,
                    title: attachment.title,
                    version: attachment.version.number
                };
            }
        }
        return null;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
}

async function attachFile(pageId, fileName, fileContent, fileType, comment, opts = {}) {
    try {
        // First, check if the attachment already exists
        const existingAttachment = await getAttachmentInfo(pageId, fileName);
        
        let url;
        let method;
        
        if (existingAttachment) {
            // If the attachment exists, update it
            url = `/wiki/rest/api/content/${pageId}/child/attachment/${existingAttachment.id}/data`;
            method = 'POST';
            console.log(`Updating existing attachment: ${fileName}`);
        } else {
            // If the attachment doesn't exist, create a new one
            url = `/wiki/rest/api/content/${pageId}/child/attachment`;
            method = 'POST';
            console.log(`Creating new attachment: ${fileName}`);
        }

        const response = await confluenceApi.uploadFile(url, {
            name: fileName,
            content: fileContent,
            type: fileType,
            comment: comment,
            contentType: fileType === "image" ? "image/png" : "text/plain"
        }, {
            method: method,
            headers: {
                'X-Atlassian-Token': 'no-check'
            },
            ...opts
        });

        return {
            id: response.data.results[0].id,
            title: response.data.results[0].title,
            version: response.data.results[0].version.number
        };
    } catch (error) {
        console.error("Error attaching file:", error.message);
        throw error;
    }
}

module.exports = {
    getPageInfo,
    updateConfluencePage,
    attachFile,
    readConfluenceSettings,
    getAttachmentInfo
};