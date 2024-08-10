/**
 * @module anthropicClient
 * @description A client library for the Anthropic API, using settings from Settings.ajs
 * @version 1.6
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-10
 */

const apiClient = require('./apiClient');

// Initialize logger
const jarchiLogger = require('./jarchiLogger');
const log = jarchiLogger.createLogger('AnthropicClient');

// Load settings from preference store
const preferenceStore = workbench.getPreferenceStore();
const API_KEY = preferenceStore.getString('anthropicApiKey') || '';
const BASE_URL = preferenceStore.getString('anthropicBaseUrl') || 'https://api.anthropic.com';
const API_VERSION = preferenceStore.getString('anthropicApiVersion') || '2023-06-01';
const DEFAULT_MODEL = preferenceStore.getString('anthropicDefaultModel') || 'claude-3-sonnet-20240229';
const MAX_TOKENS = parseInt(preferenceStore.getString('anthropicMaxTokens') || '1024');
const TEMPERATURE = parseFloat(preferenceStore.getString('anthropicTemperature') || '0.7');
const TOP_P = parseFloat(preferenceStore.getString('anthropicTopP') || '0.9');
const TOP_K = parseInt(preferenceStore.getString('anthropicTopK') || '40');

// Constants
const ROLES = Object.freeze({
    USER: 'user',
    ASSISTANT: 'assistant'
});

// Predefined list of models (update manually as needed)
const MODELS = Object.freeze([
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307'
]);

class Message {
    constructor(role, content) {
        if (!Object.values(ROLES).includes(role)) {
            throw new Error(`Invalid role: ${role}. Must be one of: ${Object.values(ROLES).join(', ')}`);
        }
        this.role = role;
        this.content = content;
    }
}

class Tool {
    constructor(name, description, inputSchema) {
        this.name = name;
        this.description = description;
        this.input_schema = inputSchema;
    }
}

class GenerateOptions {
    constructor(options = {}) {
        Object.assign(this, {
            model: options.model || DEFAULT_MODEL,
            max_tokens: options.maxTokens || MAX_TOKENS,
            temperature: options.temperature || TEMPERATURE,
            top_p: options.topP || TOP_P,
            top_k: options.topK || TOP_K,
            stop_sequences: options.stopSequences,
            stream: options.stream,
            system: options.system,
            metadata: options.metadata
        });
    }
}

class AnthropicClient {
    constructor() {
        if (!API_KEY) {
            log.error('Anthropic API key is not set in preferences');
            throw new Error('Anthropic API key is not set');
        }

        this.api = apiClient.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
                'anthropic-version': API_VERSION
            },
            debug: true
        });
    }

    async generateChatCompletion(messages, tools = [], options = {}) {
        const generateOptions = new GenerateOptions(options);
        
        if (!MODELS.includes(generateOptions.model)) {
            log.warn(`Model ${generateOptions.model} not in predefined list. Proceeding anyway.`);
        }

        log.info('Generating chat completion', { model: generateOptions.model, messagesCount: messages.length });
        const formattedMessages = messages.map(msg => {
            if (msg instanceof Message) return msg;
            return new Message(msg.role, msg.content);
        });

        if (formattedMessages.length === 0 || formattedMessages[0].role !== ROLES.USER) {
            throw new Error('The first message must use the user role');
        }

        try {
            const response = await this.api.post('/v1/messages', {
                messages: formattedMessages,
                tools,
                ...generateOptions
            });
            log.debug('Chat completion generated successfully');
            return response.data;
        } catch (error) {
            log.error('Error generating chat completion', { error: error.toString() });
            throw error;
        }
    }

    getModels() {
        return MODELS;
    }
}

module.exports = {
    AnthropicClient,
    Message,
    Tool,
    GenerateOptions,
    ROLES,
    MODELS
};