# OpenAI API Module Documentation

## Overview

The OpenAI API module provides a client for interacting with OpenAI's API services, focusing on chat completions, tool usage, and structured outputs. This module is designed to work within the JArchi environment, integrating with its logging system and preference store.

## Classes

### OpenAIClient

The main class for interacting with the OpenAI API.

#### Constructor

```javascript
const client = new OpenAIClient();
```

Initializes a new OpenAIClient instance. It reads the API key and other settings from JArchi's preference store.

#### Methods

##### generateChatCompletion(messages, tools = [], options = {})

Generates a chat completion based on the provided messages, tools, and options.

- `messages`: An array of Message objects representing the conversation.
- `tools`: An optional array of Tool objects for function calling.
- `options`: An optional GenerateOptions object for customizing the request.

Returns a normalized response object containing the generated content, parsed structured output (if applicable), and usage statistics.

##### listModels()

Fetches the list of available models from the OpenAI API.

Returns an array of model objects, each containing details about an available model.

##### createStructuredOutputSchema(schema)

Creates a structured output schema for use with the `response_format` option.

- `schema`: An object representing the desired output structure.

Returns an object that can be used as the `response_format` in GenerateOptions.

### Message

Represents a message in the chat completion context.

#### Constructor

```javascript
const message = new Message(role, content);
```

- `role`: The role of the message sender (system, user, assistant, or function).
- `content`: The content of the message.

### Tool

Represents a tool (function) that can be used in function calling.

#### Constructor

```javascript
const tool = new Tool(type, functionDetails);
```

- `type`: The type of the tool (currently only "function" is supported).
- `functionDetails`: An object containing the function's name, description, and parameters.

### GenerateOptions

Represents options for generating chat completions.

#### Constructor

```javascript
const options = new GenerateOptions({
  model: 'gpt-4',
  maxTokens: 100,
  temperature: 0.7,
  // ... other options
});
```

## Constants

### ROLES

An object containing the possible roles for messages:

- `SYSTEM`
- `USER`
- `ASSISTANT`
- `FUNCTION`

## Usage Example

```javascript
const { OpenAIClient, Message, Tool, GenerateOptions, ROLES } = require('./lib/openaiClient');

const client = new OpenAIClient();

// List available models
const models = await client.listModels();
console.log("Available models:", models.map(m => m.id));

// Generate a chat completion
const response = await client.generateChatCompletion([
  new Message(ROLES.SYSTEM, "You are a helpful assistant."),
  new Message(ROLES.USER, "What's the capital of France?")
]);

console.log("Response:", response.content);

// Generate a structured output
const schema = {
  capital: { type: "string" },
  country: { type: "string" }
};

const structuredResponse = await client.generateChatCompletion([
  new Message(ROLES.USER, "What's the capital of France?")
], [], {
  responseFormat: client.createStructuredOutputSchema(schema)
});

console.log("Structured output:", structuredResponse.parsed);
```

## Error Handling

The module uses JArchi's logging system to log errors and important information. Always wrap API calls in try-catch blocks to handle potential errors gracefully.

## Configuration

The module reads its configuration from JArchi's preference store. Ensure the following preferences are set:

- `openaiApiKey`: Your OpenAI API key
- `openaiBaseUrl`: The base URL for the OpenAI API (default: https://api.openai.com/v1)
- `openaiDefaultModel`: The default model to use (e.g., 'gpt-4-0125-preview')
- `openaiMaxTokens`: Maximum number of tokens to generate
- `openaiTemperature`: Temperature setting for generation
- `openaiTopP`: Top P setting for generation

You can set these preferences in JArchi's settings dialog.