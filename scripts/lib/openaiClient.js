/**
 * @module openaiClient
 * @description A client library for the OpenAI API with support for structured outputs
 * @version 1.2
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-15
 */

const apiClient = require('./apiClient');

// Initialize logger
const jarchiLogger = require('./jarchiLogger');
const log = jarchiLogger.createLogger('OpenAIClient', __DIR__);

// Load settings from preference store
const preferenceStore = workbench.getPreferenceStore();
const API_KEY = preferenceStore.getString('openaiApiKey') || '';
const BASE_URL = preferenceStore.getString('openaiBaseUrl') || 'https://api.openai.com/v1';
const DEFAULT_MODEL = preferenceStore.getString('openaiModel') || 'gpt-4o-mini';
const MAX_TOKENS = parseInt(preferenceStore.getString('openaiMaxTokens') || '1024');
const TEMPERATURE = parseFloat(preferenceStore.getString('openaiTemperature') || '0.7');
const TOP_P = parseFloat(preferenceStore.getString('openaiTopP') || '1');

// Constants
const ROLES = Object.freeze({
    SYSTEM: 'system',
    USER: 'user',
    ASSISTANT: 'assistant',
    FUNCTION: 'function'
});

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
    constructor(type, functionDetails) {
        this.type = type;
        this.function = functionDetails;
    }
}

class GenerateOptions {
    constructor(options = {}) {
        Object.assign(this, {
            model: options.model || DEFAULT_MODEL,
            max_tokens: options.maxTokens || MAX_TOKENS,
            temperature: options.temperature || TEMPERATURE,
            top_p: options.topP || TOP_P,
            frequency_penalty: options.frequencyPenalty || 0,
            presence_penalty: options.presencePenalty || 0,
            stream: options.stream || false,
            n: options.n || 1,
            stop: options.stop || null,
            logit_bias: options.logitBias || null,
            user: options.user || null,
            response_format: options.response_format || null
        });
    }
}

class OpenAIClient {
    constructor() {
        if (!API_KEY) {
            log.error('OpenAI API key is not set in preferences');
            throw new Error('OpenAI API key is not set');
        }

        this.api = apiClient.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            debug: true
        });
    }

    async generateChatCompletion(messages, tools = [], options = {}) {
        const generateOptions = new GenerateOptions(options);
        log.info('Generating chat completion', { options: generateOptions, tools: tools, messagesCount: messages.length });
        const formattedMessages = messages.map(msg => {
            if (msg instanceof Message) return msg;
            return new Message(msg.role, msg.content);
        });
    
        try {
            const requestBody = {
                messages: formattedMessages,
                ...generateOptions
            };
    
            if (tools.length > 0) {
                requestBody.tools = tools;
            }
    
            const response = await this.api.post('/chat/completions', requestBody);
            log.debug('Chat completion generated successfully');
            return this.normalizeResponse(response.data);
        } catch (error) {
            log.error('Error generating chat completion', { error: error.toString() });
            throw error;
        }
    }

    async listModels() {
        try {
            log.info('Fetching available models');
            const response = await this.api.get('/models');
            log.debug('Models fetched successfully');
            return response.data.data;
        } catch (error) {
            log.error('Error fetching models', { error: error.toString() });
            throw error;
        }
    }

    normalizeResponse(response) {
        const choice = response.choices[0];
        if (choice.message.refusal) {
            return {
                content: null,
                refusal: choice.message.refusal,
                usage: response.usage
            };
        }
        return {
            content: choice.message.content,
            parsed: choice.message.parsed,  // For structured outputs
            usage: response.usage
        };
    }

    createStructuredOutputSchema(schema, name) {
        return {
            type: "json_schema",
            json_schema: {
                name: name,
                type: "object",
                properties: schema,
                required: Object.keys(schema),
                additionalProperties: false
            }
        };
    }
}

module.exports = {
    OpenAIClient,
    Message,
    Tool,
    GenerateOptions,
    ROLES
};