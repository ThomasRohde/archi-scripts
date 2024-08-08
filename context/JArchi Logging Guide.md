# JArchi Logging Guide

This guide explains how to use the updated logging system in JArchi scripts.

## Setting Up Logging

1. Ensure you have the `jarchiLogger.js` file in your `lib` directory.
2. At the beginning of your script, include the following setup:

```javascript
console.clear();
console.show();

const jarchiLogger = require('./lib/jarchiLogger');
const log = jarchiLogger.createLogger('YourScriptName');
```

Replace 'YourScriptName' with a descriptive name for your script.

## Using Logging Functions

After setup, you can use the logging functions throughout your script:

```javascript
log.debug('This is a debug message');
log.info('This is an info message');
log.warn('This is a warning message');
log.error('This is an error message');
```

## Adding Additional Data

You can include additional data with your log messages:

```javascript
log.info('Processing complete', { itemsProcessed: 10, duration: '5s' });
```

## Best Practices

1. **Use appropriate log levels:**
   - DEBUG: Detailed information, typically of interest only when diagnosing problems.
   - INFO: Confirmation that things are working as expected.
   - WARN: An indication that something unexpected happened, or indicative of some problem in the near future.
   - ERROR: A serious problem that needs to be addressed.

2. **Log at the start and end of major operations:**

```javascript
function processElements() {
    log.debug('Starting element processing');
    // ... processing logic ...
    log.debug('Element processing complete', { elementsProcessed: count });
}
```

3. **Log errors with additional information:**

```javascript
try {
    // ... some operation ...
} catch (error) {
    log.error('An error occurred during operation', { 
        error: error.toString(),
        stackTrace: error.stack
    });
}
```

4. **Use logging in main execution flow:**

```javascript
function main() {
    log.info('Script started');
    try {
        // ... main script logic ...
        log.info('Script completed successfully');
    } catch (error) {
        log.error('Script execution failed', { error: error.toString() });
    }
}

main();
```

## Console Output

The console output is color-coded for easy identification:
- DEBUG: Dark gray
- INFO: Green
- WARN: Orange
- ERROR: Red

## Remote Logging

If enabled in the JArchi settings, logs will also be sent to a remote logging server. This allows for centralized log collection and analysis.

## Configuring Logging

Logging behavior can be configured in the JArchi settings dialog. You can control:
- Whether logging is enabled
- The log level (DEBUG, INFO, WARN, ERROR)
- Whether to log to console
- The remote logging server URL (if applicable)

Remember to check these settings if you're not seeing the expected logging behavior.

## Using in Multiple Scripts or Modules

If you have multiple scripts or modules in your project, you can create a separate logger for each:

```javascript
// In script1.js
const log = jarchiLogger.createLogger('Script1');

// In script2.js
const log = jarchiLogger.createLogger('Script2');
```

This allows for more granular logging and easier identification of the source of each log message.

By following these guidelines, you can effectively use logging in your JArchi scripts to aid in debugging, monitoring, and maintaining your scripts.