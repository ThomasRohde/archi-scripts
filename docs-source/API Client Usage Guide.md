# Updated API Client Library Usage Guide

## Introduction

The `apiClient` library is a robust HTTP client for making API requests in JArchi scripts, inspired by the popular Axios library. This guide reflects the latest updates and provides suggestions for future improvements.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Creating an Instance](#creating-an-instance)
4. [Making Requests](#making-requests)
5. [Request Configuration](#request-configuration)
6. [Response Schema](#response-schema)
7. [Error Handling](#error-handling)
8. [File Uploads](#file-uploads)
9. [Suggestions for Improvement](#suggestions-for-improvement)

## Installation

To use the `apiClient` library in your JArchi scripts, place the `apiClient.js` file in your `scripts/lib` directory. Then, you can require it in your scripts like this:

```javascript
const apiClient = require('./lib/apiClient');
```

## Basic Usage

Here's a simple example of using the `apiClient`:

```javascript
apiClient.get('https://api.example.com/data')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

## Creating an Instance

You can create a custom instance of the `apiClient` with default settings:

```javascript
const api = apiClient.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});

// Now use the custom instance
api.get('/users')
  .then(response => console.log(response.data));
```

## Making Requests

The `apiClient` supports various HTTP methods:

```javascript
// GET request
apiClient.get('/users');

// POST request
apiClient.post('/users', { name: 'John Doe' });

// PUT request
apiClient.put('/users/1', { name: 'Jane Doe' });

// DELETE request
apiClient.delete('/users/1');

// PATCH request
apiClient.patch('/users/1', { email: 'new@example.com' });
```

## Request Configuration

You can pass a config object to make requests:

```javascript
apiClient.request({
  method: 'post',
  url: '/users',
  data: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  headers: {
    'Content-Type': 'application/json'
  },
  params: {
    source: 'api'
  },
  auth: {
    username: 'admin',
    password: 'password123'
  }
});
```

### Config Options

- `method`: request method (`'get'`, `'post'`, etc.)
- `url`: the server URL
- `baseURL`: will be prepended to `url`
- `headers`: custom headers
- `params`: URL parameters
- `data`: data to be sent as the request body
- `auth`: authentication credentials
- `timeout`: request timeout in milliseconds
- `validateStatus`: function that determines if the status code is successful

## Response Schema

The response object has the following properties:

- `data`: the response body
- `status`: the HTTP status code
- `statusText`: the HTTP status message
- `headers`: the response headers
- `config`: the original request configuration
- `request`: the Java HttpURLConnection object

## Error Handling

When a request fails, the `apiClient` throws an error. You can catch and handle these errors:

```javascript
apiClient.get('/users')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  });
```

## File Uploads

For file uploads, particularly for Confluence attachments, use the `uploadFile` method:

```javascript
apiClient.uploadFile('/attachments', {
  name: 'file.png',
  content: fileContent,
  type: 'image',
  comment: 'File attachment',
  contentType: 'image/png'
})
.then(response => {
  console.log('File uploaded successfully:', response.data);
})
.catch(error => {
  console.error('Error uploading file:', error.message);
});
```

## Suggestions for Improvement

1. **Detailed Logging**: Implement more comprehensive logging options to facilitate debugging:

   ```javascript
   apiClient.setLogLevel('debug');
   ```

2. **Specific Error Handling**: Add methods to handle specific HTTP status codes:

   ```javascript
   apiClient.onStatus(404, (error) => {
     console.error('Resource not found:', error.config.url);
   });
   ```

3. **Retry Mechanism**: Implement automatic retries for transient network errors:

   ```javascript
   apiClient.create({
     retry: {
       retries: 3,
       retryDelay: 1000,
       retryCondition: (error) => error.code === 'ECONNABORTED'
     }
   });
   ```

4. **Request Queuing**: Add the ability to queue requests and execute them sequentially:

   ```javascript
   apiClient.queue()
     .add(() => apiClient.get('/users'))
     .add(() => apiClient.post('/posts', { title: 'New Post' }))
     .execute()
     .then(results => console.log(results));
   ```

5. **Response Caching**: Implement a caching mechanism for GET requests:

   ```javascript
   apiClient.get('/users', { cache: { maxAge: 300000 } });
   ```

6. **Request Throttling**: Add the ability to throttle requests to avoid hitting rate limits:

   ```javascript
   apiClient.create({
     throttle: {
       limit: 10,
       interval: 60000
     }
   });
   ```

By implementing these improvements, the `apiClient` library can become even more powerful and flexible for various use cases in JArchi scripts.

Remember to refer to the source code and inline documentation in the `apiClient.js` file for the most up-to-date information on available features and usage.