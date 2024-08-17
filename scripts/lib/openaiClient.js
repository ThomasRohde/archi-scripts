/**
 * @module openaiClient
 * @description A client library for the OpenAI API with support for structured outputs and image uploads
 * @version 1.4
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-16
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
    TOOL: 'tool'
});

const PRICING = {
    'gpt-4o': {
        input: 5 / 1000000,  // $5 per million tokens
        output: 15 / 1000000 // $15 per million tokens
    },
    'gpt-4o-2024-08-06': {
        input: 2.5 / 1000000,  // $2.50 per million tokens
        output: 10 / 1000000   // $10 per million tokens
    },
    'gpt-4o-2024-05-13': {
        input: 5 / 1000000,  // $5 per million tokens
        output: 15 / 1000000 // $15 per million tokens
    },
    'gpt-4o-mini': {
        input: 0.15 / 1000000,  // $0.15 per million tokens
        output: 0.6 / 1000000   // $0.60 per million tokens
    },
    'gpt-4o-mini-2024-07-18': {
        input: 0.15 / 1000000,  // $0.15 per million tokens
        output: 0.6 / 1000000   // $0.60 per million tokens
    }
};

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
                model: generateOptions.model,
                messages: formattedMessages.map(msg => {
                    if (typeof msg.content === 'string') {
                        return {
                            role: msg.role,
                            content: msg.content
                        };
                    } else if (Array.isArray(msg.content)) {
                        return {
                            role: msg.role,
                            content: msg.content.map(part => {
                                if (part.type === 'text') {
                                    return {
                                        type: 'text',
                                        text: part.text
                                    };
                                } else if (part.type === 'image_url') {
                                    return {
                                        type: 'image_url',
                                        image_url: {
                                            url: part.image_url.url,
                                            detail: part.image_url.detail || 'auto'
                                        }
                                    };
                                }
                            })
                        };
                    }
                })
            };

            // Only include non-null options
            const optionsToInclude = [
                'max_tokens', 'temperature', 'top_p', 'frequency_penalty', 'presence_penalty',
                'stream', 'n', 'stop', 'logit_bias', 'user', 'response_format'
            ];

            optionsToInclude.forEach(option => {
                if (generateOptions[option] != null) {
                    requestBody[option] = generateOptions[option];
                }
            });

            if (tools.length > 0) {
                requestBody.tools = tools;
            }
    
            const response = await this.api.post('/chat/completions', requestBody);
            log.debug('Chat completion generated successfully');
    
            // Calculate and log the cost
            if (response.data.usage && PRICING[generateOptions.model]) {
                const inputTokens = response.data.usage.prompt_tokens;
                const outputTokens = response.data.usage.completion_tokens;
                const pricing = PRICING[generateOptions.model];
                const cost = inputTokens * pricing.input + outputTokens * pricing.output;
                log.info('API call cost', {
                    model: generateOptions.model,
                    inputTokens,
                    outputTokens,
                    costUSD: cost.toFixed(4)
                });
            } else {
                log.info('Cost calculation not available for this model', {
                    model: generateOptions.model
                });
            }
    
            return response.data;
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
}

module.exports = {
    OpenAIClient,
    Message,
    Tool,
    GenerateOptions,
    ROLES
};