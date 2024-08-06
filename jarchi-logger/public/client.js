const socket = io();
const logContainer = document.getElementById('logContainer');

socket.on('newLog', ({ application, module, logEntry }) => {
    let appSection = findOrCreateAppSection(application);
    let moduleSection = findOrCreateModuleSection(appSection, module);
    
    const logEntries = moduleSection.querySelector('.log-entries');
    const logElement = createLogElement(logEntry);
    logEntries.prepend(logElement);
});

function findOrCreateAppSection(appName) {
    let appSection = Array.from(logContainer.children).find(el => el.querySelector('h2').textContent.trim() === appName);
    if (!appSection) {
        appSection = createAppSection(appName);
        logContainer.prepend(appSection);
    }
    return appSection;
}

function findOrCreateModuleSection(appSection, moduleName) {
    let moduleSection = Array.from(appSection.querySelectorAll('.module-section'))
        .find(el => el.querySelector('h3').textContent.trim() === moduleName);
    if (!moduleSection) {
        moduleSection = createModuleSection(moduleName);
        appSection.querySelector('.app-content').appendChild(moduleSection);
    }
    return moduleSection;
}

function createAppSection(appName) {
    const appSection = document.createElement('div');
    appSection.className = 'app-section bg-white shadow-md rounded-lg p-4 mb-4';
    appSection.innerHTML = `
        <h2 class="text-xl font-semibold mb-2 cursor-pointer flex items-center">
            <span class="transform transition-transform duration-200 inline-block mr-2">▶</span>
            ${appName}
        </h2>
        <div class="app-content hidden"></div>
    `;
    return appSection;
}

function createModuleSection(moduleName) {
    const moduleSection = document.createElement('div');
    moduleSection.className = 'module-section mb-2';
    moduleSection.innerHTML = `
        <h3 class="text-lg font-medium mb-1 cursor-pointer flex items-center">
            <span class="transform transition-transform duration-200 inline-block mr-2">▶</span>
            ${moduleName}
        </h3>
        <div class="log-entries space-y-1 hidden"></div>
    `;
    return moduleSection;
}

function createLogElement(logEntry) {
    const logElement = document.createElement('div');
    logElement.className = 'log-entry p-2 bg-gray-50 rounded cursor-pointer';
    logElement.innerHTML = `
        <div class="log-header flex items-center">
            <span class="transform transition-transform duration-200 inline-block mr-2">▶</span>
            <span class="text-sm text-gray-500">${logEntry.timestamp}</span>
            <span class="ml-2 text-sm">${logEntry.message.substring(0, 50)}${logEntry.message.length > 50 ? '...' : ''}</span>
        </div>
        <pre class="text-sm mt-1 hidden">${JSON.stringify(logEntry, null, 2)}</pre>
    `;
    return logElement;
}

function toggleCollapse(header) {
    const content = header.nextElementSibling;
    const arrow = header.querySelector('span');
    
    content.classList.toggle('hidden');
    arrow.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)';
}

// Add click event listeners using event delegation
document.addEventListener('click', function(event) {
    let target = event.target;

    // For app and module headers
    if (target.matches('.app-section h2, .module-section h3') || 
        target.matches('.app-section h2 *, .module-section h3 *')) {
        let header = target.closest('h2, h3');
        toggleCollapse(header);
    }

    // For log entries
    if (target.closest('.log-entry')) {
        let logEntry = target.closest('.log-entry');
        let logHeader = logEntry.querySelector('.log-header');
        let logContent = logEntry.querySelector('pre');
        let arrow = logHeader.querySelector('span');

        logContent.classList.toggle('hidden');
        arrow.style.transform = logContent.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)';
    }
});

// Ensure connection is established
socket.on('connect', () => {
    console.log('Connected to server');
});

// Handle potential disconnection
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Log any connection errors
socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});