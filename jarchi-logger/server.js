require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { program } = require('commander');

program
  .option('--api-port <port>', 'API server port')
  .option('--web-port <port>', 'Web server port')
  .parse(process.argv);

const options = program.opts();

const API_PORT = options.apiPort || process.env.API_PORT || 4000;
const WEB_PORT = options.webPort || process.env.WEB_PORT || 4001;

const apiServer = express();
const webServer = express();
const webServerHttp = http.createServer(webServer);
const io = socketIo(webServerHttp);

webServer.set('view engine', 'ejs');
webServer.set('views', path.join(__dirname, 'views'));

apiServer.use(express.json());

// Middleware to set correct MIME type for JavaScript files
webServer.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.type('application/javascript');
  }
  next();
});

// Serve static files from the 'public' directory
webServer.use(express.static('public'));

// Serve specific JavaScript files
webServer.get('/json-formatter.umd.min.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'node_modules/json-formatter-js/dist/json-formatter.umd.js'));
});

webServer.get('/luxon.min.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'node_modules/luxon/build/global/luxon.min.js'));
});

// Initialize an object to store logs
const logs = [];

// Helper function to process and store a log entry
function processLogEntry(logData) {
    const { level, script, message, timestamp, ...additionalData } = logData;
    
    const logEntry = { 
        level, 
        script, 
        message, 
        timestamp, 
        additionalData: Object.keys(additionalData).length > 0 ? additionalData : null 
    };

    logs.push(logEntry);
    io.emit('newLog', logEntry);
    return logEntry;
}

// API Routes
apiServer.post('/log', (req, res) => {
    const logEntry = processLogEntry(req.body);
    res.sendStatus(200);
});

// Endpoint to get all logs
apiServer.get('/logs', (req, res) => {
    res.json(logs);
});

// Clear logs endpoint
webServer.post('/clear-logs', (req, res) => {
    logs.length = 0; // Clear the logs array
    io.emit('logsCleared'); // Emit an event to all connected clients
    console.log('Logs cleared on server');
    res.sendStatus(200);
});

// Web Routes
webServer.get('/', (req, res) => {
    res.render('index', { logs });
});

io.on('connection', (socket) => {
    console.log('A user connected');
    // Send current logs to the newly connected client
    socket.emit('initialLogs', logs);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start servers
apiServer.listen(API_PORT, () => {
    console.log(`API Server running on http://localhost:${API_PORT}`);
});

webServerHttp.listen(WEB_PORT, () => {
    console.log(`Web Server running on http://localhost:${WEB_PORT}`);
});