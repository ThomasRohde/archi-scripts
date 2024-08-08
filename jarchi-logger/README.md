# JArchi Logger

JArchi Logger is a real-time logging application designed to capture, display, and manage log entries. It consists of two main components: an API server for receiving log data and a web server for displaying logs in a user-friendly interface.

## Features

- Real-time log updates using Socket.IO
- Log filtering by timestamp, level, script, and message
- Log level color coding (DEBUG, INFO, WARN, ERROR)
- Expandable log entries for additional data
- Log cleanup after 1 hour (configurable)
- Clear logs functionality
- Console view for displaying formatted markdown content
- Responsive design using Tailwind CSS

## Technology Stack

- Backend: Node.js with Express
- Frontend: HTML, CSS (Tailwind), JavaScript
- Real-time Communication: Socket.IO
- Templating: EJS
- Styling: Tailwind CSS
- Date/Time Handling: Luxon
- CLI Argument Parsing: Commander.js
- Markdown Parsing: Marked

## Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/jarchi-logger.git
   cd jarchi-logger
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and set the following variables (or use the provided `.env.example` as a template):
   ```
   API_PORT=4000
   WEB_PORT=4001
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. Access the web interface:
   Open a web browser and navigate to `http://localhost:4001` (or the port you specified for WEB_PORT)

3. To send logs to the API server, make POST requests to `http://localhost:4000/log` (or the port you specified for API_PORT) with the following JSON structure:
   ```json
   {
     "level": "INFO",
     "script": "example-script",
     "message": "This is a log message",
     "timestamp": "2023-04-20T12:34:56Z",
     "additionalData": {
       "key1": "value1",
       "key2": "value2"
     }
   }
   ```

4. To send console content, make POST requests to `http://localhost:4000/console` with the following JSON structure:
   ```json
   {
     "markdown": "# Heading\n\nThis is some **markdown** content."
   }
   ```

## Configuration

You can configure the server ports using command-line arguments:

```
node server.js --api-port 5000 --web-port 5001
```

## Project Structure

- `server.js`: Main server file (API and Web servers)
- `views/index.ejs`: Main web interface template
- `views/console.ejs`: Console view template
- `public/styles.css`: Tailwind CSS import file
- `public/output.css`: Generated Tailwind CSS file
- `package.json`: Project dependencies and scripts
- `tailwind.config.js`: Tailwind CSS configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. See the `LICENSE` file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.IO](https://socket.io/)
- [Express](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [Luxon](https://moment.github.io/luxon/)
- [Commander.js](https://github.com/tj/commander.js/)
- [Marked](https://marked.js.org/)

## Support

For support, please open an issue in the GitHub repository or contact the project maintainers.