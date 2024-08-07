require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const API_PORT = process.env.API_PORT || 4000;
const WEB_PORT = process.env.WEB_PORT || 4001;

const apiServer = express();
const webServer = express();
const webServerHttp = http.createServer(webServer);
const io = socketIo(webServerHttp);

webServer.set('view engine', 'ejs');
webServer.set('views', path.join(__dirname, 'views'));

apiServer.use(express.json());
webServer.use(express.static('public'));

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