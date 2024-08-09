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

const logs = [];
let consoleContent = [];

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

apiServer.post('/log', (req, res) => {
    const logEntry = processLogEntry(req.body);
    res.sendStatus(200);
});

apiServer.get('/logs', (req, res) => {
    res.json(logs);
});

// Updated to send raw markdown instead of HTML
apiServer.post('/console', (req, res) => {
    const { markdown } = req.body;
    if (!markdown) {
        return res.status(400).json({ error: 'Markdown content is required' });
    }
    consoleContent.push(markdown);
    io.emit('newConsoleContent', markdown);
    res.sendStatus(200);
});

apiServer.get('/console-content', (req, res) => {
    res.json(consoleContent);
});

webServer.get('/', (req, res) => {
    res.render('index', { logs });
});

webServer.get('/console', (req, res) => {
    res.render('console', { initialContent: consoleContent });
});

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

webServer.post('/clear-logs', (req, res) => {
    logs.length = 0;
    io.emit('logsCleared');
    console.log('Logs cleared on server');
    res.sendStatus(200);
});

apiServer.listen(API_PORT, () => {
    console.log(`API Server running on http://localhost:${API_PORT}`);
});

webServerHttp.listen(WEB_PORT, () => {
    console.log(`Web Server running on http://localhost:${WEB_PORT}`);
});