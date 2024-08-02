/**
 * @module ollamaClient
 * @description A client library for the Ollama server
 * @version 1.0
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-01
 */

const apiClient = require('./apiClient');

// Constants
const ROLES = Object.freeze({
    SYSTEM: 'system',
    USER: 'user',
    ASSISTANT: 'assistant',
    TOOL: 'tool'
});

const MODEL_FORMATS = Object.freeze({
    GGUF: 'gguf',
    GGML: 'ggml'
});

const QUANTIZATION_LEVELS = Object.freeze({
    Q4_0: 'Q4_0',
    Q4_1: 'Q4_1',
    Q5_0: 'Q5_0',
    Q5_1: 'Q5_1',
    Q8_0: 'Q8_0'
});

// Request Object Models
class Message {
    constructor(role, content, images = null, toolCalls = null) {
        this.role = role;
        this.content = content;
        if (images) this.images = images;
        if (toolCalls) this.tool_calls = toolCalls;
    }
}

class ToolCall {
    constructor(name, args) {
        this.function = {
            name: name,
            arguments: JSON.stringify(args)
        };
    }
}

class GenerateOptions {
    constructor(options = {}) {
        Object.assign(this, {
            temperature: options.temperature,
            top_k: options.topK,
            top_p: options.topP,
            num_predict: options.numPredict,
            stop: options.stop,
            seed: options.seed,
            num_ctx: options.numCtx,
            repeat_penalty: options.repeatPenalty,
            repeat_last_n: options.repeatLastN,
            presence_penalty: options.presencePenalty,
            frequency_penalty: options.frequencyPenalty,
            tfs_z: options.tfsZ,
            mirostat: options.mirostat,
            mirostat_tau: options.mirostatTau,
            mirostat_eta: options.mirostatEta,
            num_thread: options.numThread,
            num_gpu: options.numGpu,
            num_keep: options.numKeep,
            stream: options.stream,
            prompt_template: options.promptTemplate,
            raw: options.raw
        });
    }
}

class EmbedOptions {
    constructor(options = {}) {
        this.prompt = options.prompt;
        this.options = new GenerateOptions(options);
    }
}

class ModelDetails {
    constructor(details = {}) {
        Object.assign(this, {
            format: details.format,
            family: details.family,
            families: details.families,
            parameter_size: details.parameterSize,
            quantization_level: details.quantizationLevel
        });
    }
}

class OllamaClient {
    constructor(baseURL = 'http://localhost:11434') {
        this.api = apiClient.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    async generateCompletion(model, prompt, options = {}) {
        const generateOptions = new GenerateOptions(options);
        const response = await this.api.post('/api/generate', {
            model,
            prompt,
            ...generateOptions
        });
        return response.data;
    }

    async generateChatCompletion(model, messages, options = {}) {
        const generateOptions = new GenerateOptions(options);
        const formattedMessages = messages.map(msg => {
            if (msg instanceof Message) return msg;
            return new Message(msg.role, msg.content, msg.images, msg.toolCalls);
        });
        const response = await this.api.post('/api/chat', {
            model,
            messages: formattedMessages,
            ...generateOptions
        });
        return response.data;
    }

    async generateChatCompletionWithTools(model, messages, tools, options = {}) {
        const generateOptions = new GenerateOptions(options);
        const formattedMessages = messages.map(msg => {
            if (msg instanceof Message) return msg;
            return new Message(msg.role, msg.content, msg.images, msg.toolCalls);
        });
        const response = await this.api.post('/api/chat', {
            model,
            messages: formattedMessages,
            tools,
            ...generateOptions
        });
        return response.data;
    }

    async listModels() {
        const response = await this.api.get('/api/tags');
        return response.data.models.map(model => ({
            ...model,
            details: new ModelDetails(model.details)
        }));
    }

    async showModel(name, verbose = false) {
        const response = await this.api.post('/api/show', { name, verbose });
        return {
            ...response.data,
            details: new ModelDetails(response.data.details)
        };
    }

    async copyModel(source, destination) {
        const response = await this.api.post('/api/copy', { source, destination });
        return response.data;
    }

    async deleteModel(name) {
        const response = await this.api.delete('/api/delete', { data: { name } });
        return response.data;
    }

    async pullModel(name, options = {}) {
        const response = await this.api.post('/api/pull', { name, ...options });
        return response.data;
    }

    async pushModel(name, options = {}) {
        const response = await this.api.post('/api/push', { name, ...options });
        return response.data;
    }

    async generateEmbeddings(model, input, options = {}) {
        const embedOptions = new EmbedOptions(options);
        const response = await this.api.post('/api/embed', {
            model,
            input,
            ...embedOptions
        });
        return response.data;
    }

    async listRunningModels() {
        const response = await this.api.get('/api/ps');
        return response.data.models.map(model => ({
            ...model,
            details: new ModelDetails(model.details)
        }));
    }

    async checkBlobExists(digest) {
        try {
            await this.api.head(`/api/blobs/${digest}`);
            return true;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return false;
            }
            throw error;
        }
    }

    async createBlob(digest, file) {
        const response = await this.api.post(`/api/blobs/${digest}`, file, {
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });
        return response.data;
    }
}

module.exports = {
    OllamaClient,
    Message,
    ToolCall,
    GenerateOptions,
    EmbedOptions,
    ModelDetails,
    ROLES,
    MODEL_FORMATS,
    QUANTIZATION_LEVELS
};