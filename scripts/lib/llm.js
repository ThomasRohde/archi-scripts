/**
 * @module llm
 * @description A simplified wrapper library for LLM providers (currently Anthropic and Ollama)
 * @version 1.2
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-12
 */

const { AnthropicClient, Message: AnthropicMessage, GenerateOptions: AnthropicGenerateOptions, ROLES } = require('./anthropicClient');
const { OllamaClient, Message: OllamaMessage, GenerateOptions: OllamaGenerateOptions } = require('./ollamaClient');
const { OpenAIClient, Message: OpenAIMessage, GenerateOptions: OpenAIGenerateOptions } = require('./openaiClient');

// Initialize logger
const jarchiLogger = require('./jarchiLogger');
const log = jarchiLogger.createLogger('LLM', __DIR__);

class LLMMessage {
    constructor(role, content) {
        this.role = role;
        this.content = content;
    }
}

class LLMGenerateOptions {
    constructor(options = {}) {
        this.model = options.model || 'default';
        this.maxTokens = options.maxTokens || 1000;
        this.temperature = options.temperature || 0.7;
        this.topP = options.topP || 1;
        this.topK = options.topK || 40;
        this.stop = options.stop || null;
        this.stream = options.stream || false;
    }
}

class LLMClient {
    constructor(provider = 'anthropic') {
        this.provider = provider;
        
        if (provider === 'anthropic') {
            this.client = new AnthropicClient();
        } else if (provider === 'ollama') {
            this.client = new OllamaClient();
        } else if (provider === 'openai') {
            this.client = new OpenAIClient();
        } else {
            throw new Error(`Unsupported LLM provider: ${provider}`);
        }
    }

    async generateChatCompletion(messages, options = {}) {
        const generateOptions = new LLMGenerateOptions(options);
        
        // Ensure messages is always an array
        const messageArray = Array.isArray(messages) ? messages : [messages];
        
        let providerMessages;
        let providerOptions;

        if (this.provider === 'anthropic') {
            providerMessages = messageArray.map(msg => new AnthropicMessage(msg.role, msg.content));
            providerOptions = new AnthropicGenerateOptions({
                maxTokens: generateOptions.maxTokens,
                temperature: generateOptions.temperature,
                topP: generateOptions.topP,
                topK: generateOptions.topK,
                stopSequences: generateOptions.stop,
                stream: generateOptions.stream
            });

            try {
                log.info(`Generating chat completion using Anthropic`, { model: generateOptions.model, messagesCount: messageArray.length });
                const response = await this.client.generateChatCompletion(providerMessages, [], providerOptions);
                log.debug("Anthropic chat completion generated successfully");
                return this.normalizeResponse(response);
            } catch (error) {
                log.error(`Error generating chat completion with Anthropic`, { error: error.toString() });
                throw error;
            }
        } else if (this.provider === 'ollama') {
            providerMessages = messageArray.map(msg => new OllamaMessage(msg.role, msg.content));
            providerOptions = new OllamaGenerateOptions({
                num_predict: generateOptions.maxTokens,
                temperature: generateOptions.temperature,
                top_p: generateOptions.topP,
                top_k: generateOptions.topK,
                stop: generateOptions.stop,
                stream: generateOptions.stream
            });

            try {
                log.info(`Generating chat completion using Ollama`, { model: generateOptions.model, messagesCount: messageArray.length });
                const response = await this.client.generateChatCompletion(generateOptions.model, providerMessages, providerOptions);
                log.debug("Ollama chat completion generated successfully");
                return this.normalizeResponse(response);
            } catch (error) {
                log.error(`Error generating chat completion with Ollama`, { error: error.toString() });
                throw error;
            }
        } else if (this.provider === 'openai') {
            providerMessages = messageArray.map(msg => new OpenAIMessage(msg.role, msg.content));
            providerOptions = new OpenAIGenerateOptions({
                maxTokens: generateOptions.maxTokens,
                temperature: generateOptions.temperature,
                topP: generateOptions.topP,
                stop: generateOptions.stop,
                stream: generateOptions.stream
            });
    
            try {
                log.info(`Generating chat completion using OpenAI`, { model: generateOptions.model, messagesCount: messageArray.length });
                const response = await this.client.generateChatCompletion(providerMessages, [], providerOptions);
                log.debug("OpenAI chat completion generated successfully");
                return this.normalizeResponse(response);
            } catch (error) {
                log.error(`Error generating chat completion with OpenAI`, { error: error.toString() });
                throw error;
            }
        }
        
    }

    normalizeResponse(response) {
        if (this.provider === 'anthropic') {
            return {
                content: response.content[0].text,
                usage: response.usage
            };
        } else if (this.provider === 'ollama') {
            return {
                content: response.message.content,
                usage: {
                    prompt_tokens: response.prompt_eval_count,
                    completion_tokens: response.eval_count,
                    total_tokens: response.prompt_eval_count + response.eval_count
                }
            };
        } else if (this.provider === 'openai') {
            return {
                content: response.choices[0].message.content,
                usage: response.usage
            };
        }
    }
}

module.exports = {
    LLMClient,
    LLMMessage,
    LLMGenerateOptions,
    ROLES
};