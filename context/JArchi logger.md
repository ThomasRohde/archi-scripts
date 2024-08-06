# JArchi Logger

JArchi Logger is a real-time logging system designed to work with JArchi scripts. It provides a flexible API for logging messages and a dynamic web interface for viewing logs in real-time.

## Tech Stack

- **Node.js**: The runtime environment for the server.
- **Express.js**: Web application framework for both the API and web servers.
- **Socket.IO**: Real-time, bidirectional communication between web clients and server.
- **EJS**: Templating engine for rendering the web interface.
- **Tailwind CSS**: Utility-first CSS framework for styling the web interface.
- **dotenv**: Module for loading environment variables from a .env file.
- **Luxon**: Library for working with dates and times.

## Project Structure

```
jarchi-logger/
├── server.js
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
├── public/
│   ├── styles.css
│   └── client.js
├── views/
│   └── index.ejs
└── README.md
```

## Setup and Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file based on `.env.example` and set your desired ports
4. Run `npm run build-css` to generate the Tailwind CSS file
5. Start the server with `npm start`

## Usage

### Logging API

The logging API is accessible at `http://localhost:3000` (or the port specified in your .env file).

#### GET Request
Log a message using a GET request:
```
http://localhost:3000/log?application=YourApp&module=YourModule&message=Your%20message%20here
```

#### POST Request
Log a message using a POST request with a JSON body:
```
POST http://localhost:3000/log
Content-Type: application/json

{
  "application": "YourApp",
  "module": "YourModule",
  "message": "Your message here",
  "additionalData": {
    "key": "value"
  }
}
```

### Web Interface

The web interface for viewing logs is accessible at `http://localhost:3001` (or the port specified in your .env file).

Features of the web interface:
- Real-time log updates
- Collapsible sections for applications and modules
- Expandable individual log entries
- Filtering capabilities for timestamp, application, module, and message
- Automatic cleanup of old logs

## Integrating with JArchi

To use this logger with JArchi scripts, you can use the `jarchiLogger.js` module:

```javascript
const jarchiLogger = require('./lib/jarchiLogger');

// Set the application and module (optional)
jarchiLogger.setApplication('YourApp', 'YourModule');

// Log a message
jarchiLogger.log('YourApp', 'YourModule', 'Your message here', { additionalData: 'value' });

// Or use the shorthand method if application and module are set
jarchiLogger.slog('Your message here', { additionalData: 'value' });
```

The `jarchiLogger.js` module uses Java's HttpClient to send log messages asynchronously to the logging server.

## Customization

- Modify `views/index.ejs` to change the layout of the web interface
- Update `tailwind.config.js` to customize the styling
- Extend `server.js` to add more logging endpoints or additional features
- Modify `jarchiLogger.js` to change the logging behavior in JArchi scripts

## Environment Variables

- `API_PORT`: The port for the logging API server (default: 3000)
- `WEB_PORT`: The port for the web interface server (default: 3001)

Set these in your `.env` file to customize the ports used by the application.

## Features

1. **Real-time Updates**: The web interface updates in real-time without requiring page refresh.
2. **Flexible Logging**: Support for both GET and POST requests, with intelligent handling of missing application or module names.
3. **Expandable Log Entries**: Individual log entries can be clicked to show full details.
4. **Filtering**: The web interface supports filtering logs by timestamp, application, module, and message content.
5. **Log Retention**: Automatic cleanup of old logs based on a configurable retention period.
6. **Asynchronous Logging**: The JArchi logging module sends logs asynchronously to avoid blocking script execution.

## Troubleshooting

- If you're not seeing real-time updates, check the browser console for any connection errors.
- Ensure that your firewall is not blocking the WebSocket connection used by Socket.IO.
- If logs are not appearing, verify that the correct ports are being used for both the API and web interface.
- Check the JArchi console for any errors related to sending logs.

## Future Enhancements

- Add authentication for the logging API and web interface
- Implement log persistence (database storage)
- Add more advanced filtering and search functionality to the web interface
- Create a downloadable log export feature
- Implement log level support (e.g., INFO, WARN, ERROR)

Remember to regularly check for updates and improvements to the JArchi Logger system.