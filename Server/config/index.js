const fs = require('fs');
const path = require('path');

const configDir = __dirname; // Directory where config files are located

// Read all files from the config directory
const files = fs.readdirSync(configDir);

// Initialize an empty object to hold all configurations
const configs = {};

// Iterate over each file and require it, except for the index.js file itself
files.forEach(file => {
    if (file !== 'index.js' && path.extname(file) === '.js') {
        const configName = path.basename(file, '.js');
        configs[configName] = require(path.join(configDir, file));
    }
});

module.exports = configs;
