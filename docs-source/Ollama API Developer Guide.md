# Ollama API Developer Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Client Library Overview](#client-library-overview)
4. [Basic Usage](#basic-usage)
5. [Advanced Features](#advanced-features)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [API Reference](#api-reference)

## Introduction

Ollama is a powerful tool for running large language models locally. This guide will help you integrate Ollama into your applications using our JavaScript client library. Whether you're building a chatbot, a content generation tool, or any other AI-powered application, this guide will provide you with the knowledge to effectively use the Ollama API.

## Getting Started

### Prerequisites

- Node.js (v12 or later)
- Ollama installed and running on your local machine or a remote server

### Installation

First, install the Ollama client library:

```bash
npm install ollama-client
```

Then, in your JavaScript file:

```javascript
const { OllamaClient } = require('ollama-client');
```

## Client Library Overview

Our client library provides a simple interface to interact with the Ollama API. It includes the following main components:

- `OllamaClient`: The main class for interacting with the API
- `Message`: A class representing a chat message
- `GenerateOptions`: A class for specifying generation options
- `ROLES`: An object containing constants for message roles

## Basic Usage

### Initializing the Client

```javascript
const ollama = new OllamaClient('http://localhost:11434');
```

### Generating a Completion

```javascript
ollama.generateCompletion('llama3', 'Once upon a time')
    .then(response => console.log(response))
    .catch(error => console.error(error));
```

### Generating a Chat Completion

```javascript
const { Message, ROLES } = require('ollama-client');

const messages = [
    new Message(ROLES.SYSTEM, "You are a helpful assistant."),
    new Message(ROLES.USER, "What's the weather like today?")
];

ollama.generateChatCompletion('llama3', messages)
    .then(response => console.log(response))
    .catch(error => console.error(error));
```

## Advanced Features

### Custom Generation Options

You can customize the generation process using the `GenerateOptions` class:

```javascript
const { GenerateOptions } = require('ollama-client');

const options = new GenerateOptions({
    temperature: 0.7,
    topK: 40,
    topP: 0.9,
    numPredict: 100,
    stop: ["\n", "User:"],
    repeatPenalty: 1.1
});

ollama.generateCompletion('llama3', 'Once upon a time', options)
    .then(response => console.log(response))
    .catch(error => console.error(error));
```

### Working with Models

List available models:

```javascript
ollama.listModels()
    .then(models => console.log(models))
    .catch(error => console.error(error));
```

### Generating Embeddings

```javascript
ollama.generateEmbeddings('llama3', 'Hello, world!')
    .then(response => console.log(response))
    .catch(error => console.error(error));
```

## Best Practices

1. **Error Handling**: Always use try-catch blocks or .catch() methods to handle potential errors.
2. **Resource Management**: Use the `listRunningModels()` method to monitor and manage your running models.
3. **Prompt Engineering**: Craft your prompts carefully to get the best results from the model.
4. **Model Selection**: Choose the appropriate model for your task. Smaller models are faster but may be less capable.
5. **Rate Limiting**: Implement rate limiting in your application to avoid overwhelming the Ollama server.

## Troubleshooting

Common issues and their solutions:

1. **Connection Refused**: Ensure Ollama is running and the port is correct.
2. **Model Not Found**: Check if the model is downloaded and available using `listModels()`.
3. **Out of Memory**: Try using a smaller model or reducing the `numPredict` option.
4. **Slow Responses**: Consider using a smaller model or adjusting the generation options.

## API Reference

For a full list of methods and their parameters, refer to the following:

- `generateCompletion(model, prompt, options)`
- `generateChatCompletion(model, messages, options)`
- `listModels()`
- `showModel(name, verbose)`
- `copyModel(source, destination)`
- `deleteModel(name)`
- `pullModel(name, options)`
- `pushModel(name, options)`
- `generateEmbeddings(model, input, options)`
- `listRunningModels()`
- `checkBlobExists(digest)`
- `createBlob(digest, file)`

Each method returns a Promise that resolves with the API response or rejects with an error.

For more detailed information about each method and its parameters, refer to the inline documentation in the `ollamaClient.js` file.

---

This guide should help you get started with using the Ollama API through our client library. For more advanced usage or specific questions, please refer to the official Ollama documentation or reach out to the community for support.