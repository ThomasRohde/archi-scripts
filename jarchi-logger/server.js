/**
 * @fileoverview JArchi Logger Server
 * @description This file contains the server-side code for the JArchi Logger application.
 * It sets up both an API server for receiving logs and a web server for displaying them.
 * The application uses Express for HTTP routing, Socket.IO for real-time communication,
 * and EJS for server-side rendering.
 * 
 * @author Claude AI Assistant, and Thomas Klok Rohde
 * @copyright 2024
 * @license MIT
 * @version 1.0.0
 */

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

webServer.use(express.static('public'));

/** @type {Array<Object>} Array to store log entries */
const logs = [];

/** @type {Array<string>} Array to store console content */
let consoleContent = [];

/**
 * Processes a log entry, adds it to the logs array, and emits it to connected clients.
 * @param {Object} logData - The log data to process.
 * @param {string} logData.level - The log level (e.g., 'INFO', 'ERROR').
 * @param {string} logData.script - The script or module that generated the log.
 * @param {string} logData.message - The log message.
 * @param {string} logData.timestamp - The timestamp of the log entry.
 * @param {string} logData.fileName - The name of the file where the log was generated.
 * @param {number} logData.lineNo - The line number where the log was generated.
 * @returns {Object} The processed log entry.
 */
function processLogEntry(logData) {
    const { level, script, message, timestamp, fileName, lineNo, ...additionalData } = logData;
    
    const logEntry = { 
        level, 
        script, 
        message, 
        timestamp,
        fileName,
        lineNo,
        additionalData: Object.keys(additionalData).length > 0 ? additionalData : null 
    };

    logs.push(logEntry);
    io.emit('newLog', logEntry);
    return logEntry;
}

// API Routes

/**
 * POST endpoint to receive and process new log entries.
 * @route POST /log
 */
apiServer.post('/log', (req, res) => {
    const logEntry = processLogEntry(req.body);
    res.sendStatus(200);
});

/**
 * GET endpoint to retrieve all logs.
 * @route GET /logs
 */
apiServer.get('/logs', (req, res) => {
    res.json(logs);
});

/**
 * POST endpoint to receive and process new console content.
 * @route POST /console
 */
apiServer.post('/console', (req, res) => {
    const { markdown } = req.body;
    if (!markdown) {
        return res.status(400).json({ error: 'Markdown content is required' });
    }
    consoleContent.push(markdown);
    io.emit('newConsoleContent', markdown);
    res.sendStatus(200);
});

/**
 * GET endpoint to retrieve all console content.
 * @route GET /console-content
 */
apiServer.get('/console-content', (req, res) => {
    res.json(consoleContent);
});

// Web Routes

/**
 * GET endpoint to render the main page with logs.
 * @route GET /
 */
webServer.get('/', (req, res) => {
    res.render('index', { logs });
});

/**
 * GET endpoint to render the console page.
 * @route GET /console
 */
webServer.get('/console', (req, res) => {
    res.render('console', { initialContent: consoleContent });
});

/**
 * Socket.IO connection handler.
 * @param {Object} socket - The Socket.IO socket object.
 */
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('initialLogs', logs);
    
    socket.on('resetConsole', () => {
        consoleContent = [];
        io.emit('consoleReset');
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

/**
 * POST endpoint to clear all logs.
 * @route POST /clear-logs
 */
webServer.post('/clear-logs', (req, res) => {
    logs.length = 0;
    io.emit('logsCleared');
    console.log('Logs cleared on server');
    res.sendStatus(200);
});

// Start servers

/**
 * Start the API server.
 * @listens {number} API_PORT
 */
apiServer.listen(API_PORT, () => {
    console.log(`API Server running on http://localhost:${API_PORT}`);
});

/**
 * Start the Web server.
 * @listens {number} WEB_PORT
 */
webServerHttp.listen(WEB_PORT, () => {
    console.log(`Web Server running on http://localhost:${WEB_PORT}`);
});