# JArchi Logger

JArchi Logger is a real-time logging system designed to work with JArchi scripts. It provides a flexible API for logging messages and a dynamic web interface for viewing logs in real-time.

## Tech Stack

- **Node.js**: The runtime environment for the server.
- **Express.js**: Web application framework for both the API and web servers.
- **Socket.IO**: Real-time, bidirectional communication between web clients and server.
- **EJS**: Templating engine for rendering the web interface.
- **Tailwind CSS**: Utility-first CSS framework for styling the web interface.
- **dotenv**: Module for loading environment variables from a .env file.

## Project Structure

```
jarchi-logger/
├── server.js
├── .env
├── .env.example
├── package.json
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
4. Run `npm run build-css` to generate the Tailwind CSS file (if you're using Tailwind)
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

New features of the web interface:
- Collapsible sections for applications and modules
- Expandable individual log entries
- Real-time updates without page refresh

## Integrating with JArchi

To use this logger with JArchi scripts, you can add a logging function to your `apiClient.js`:

```javascript
function logToServer(data) {
    const queryString = Object.entries(data)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    
    fetch(`http://localhost:3000/log?${queryString}`, {
        method: 'GET',
    }).catch(error => console.error('Error logging to server:', error));
}
```

Then, use this function in your API client to log requests and responses:

```javascript
logToServer({
    application: 'JArchi',
    module: 'apiClient',
    message: 'API request initiated',
    additionalData: JSON.stringify({ method: 'GET', url: '/example' })
});
```

## Customization

- Modify `views/index.ejs` to change the layout of the web interface
- Update `public/styles.css` and `tailwind.config.js` (if using Tailwind) to customize the styling
- Extend `server.js` to add more logging endpoints or additional features
- Modify `public/client.js` to change the behavior of the web interface

## Environment Variables

- `API_PORT`: The port for the logging API server (default: 3000)
- `WEB_PORT`: The port for the web interface server (default: 3001)

Set these in your `.env` file to customize the ports used by the application.

## New Features and Improvements

1. **Collapsible Sections**: Application and module sections can be expanded or collapsed for better organization of logs.
2. **Expandable Log Entries**: Individual log entries can be clicked to show full details.
3. **Real-time Updates**: The web interface now updates in real-time without requiring page refresh.
4. **Flexible Logging**: Support for both GET and POST requests, with intelligent handling of missing application or module names.
5. **Improved Error Handling**: Better error logging for Socket.IO connections.

## Troubleshooting

- If you're not seeing real-time updates, check the browser console for any connection errors.
- Ensure that your firewall is not blocking the WebSocket connection used by Socket.IO.
- If logs are not appearing, verify that the correct ports are being used for both the API and web interface.

## Future Enhancements

- Add authentication for the logging API and web interface
- Implement log persistence (database storage)
- Add filtering and search functionality to the web interface
- Create a downloadable log export feature

Remember to regularly check for updates and improvements to the JArchi Logger system.