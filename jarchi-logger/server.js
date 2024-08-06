require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const API_PORT = process.env.API_PORT || 3000;
const WEB_PORT = process.env.WEB_PORT || 3001;

const apiServer = express();
const webServer = express();
const webServerHttp = http.createServer(webServer);
const io = socketIo(webServerHttp);

webServer.set('view engine', 'ejs');
webServer.set('views', path.join(__dirname, 'views'));

apiServer.use(express.json());
webServer.use(express.static('public'));

// Initialize an object to store logs grouped by application and module
const logs = {};

// Helper function to get a valid application name
function getValidAppName(name) {
    return name || 'Unspecified Application';
}

// Helper function to get a valid module name
function getValidModuleName(name) {
    return name || 'General';
}

// Helper function to process and store a log entry
function processLogEntry(application, module, message, additionalData) {
    const timestamp = new Date().toISOString();
    application = getValidAppName(application);
    module = getValidModuleName(module);

    if (!message) {
        message = 'Log entry (no message provided)';
        additionalData = { ...additionalData, originalPayload: { application, module, ...additionalData } };
    }

    const logEntry = { timestamp, message, ...additionalData };

    if (!logs[application]) {
        logs[application] = {};
    }
    if (!logs[application][module]) {
        logs[application][module] = [];
    }
    logs[application][module].push(logEntry);

    io.emit('newLog', { application, module, logEntry });
    return { application, module, logEntry };
}

// API Routes
apiServer.post('/log', (req, res) => {
    const { application, module, message, ...additionalData } = req.body;
    processLogEntry(application, module, message, additionalData);
    res.sendStatus(200);
});

apiServer.get('/log', (req, res) => {
    const { application, module, message, ...additionalData } = req.query;
    processLogEntry(application, module, message, additionalData);
    res.sendStatus(200);
});

// Endpoint to get all logs
apiServer.get('/logs', (req, res) => {
    res.json(logs);
});

// Web Routes
webServer.get('/', (req, res) => {
    res.render('index', { logs });
});

// Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected');
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