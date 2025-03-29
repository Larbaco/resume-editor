/**
 * ==============================================
 * Server Configuration
 * ==============================================
 */

// Core dependencies
const express = require('express');
const path = require('path');
const cors = require('cors');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001;

/**
 * ==============================================
 * File System Setup
 * ==============================================
 */

// File system modules
const fs = require('fs');          // Synchronous operations
const fsp = require('fs').promises; // Async/Promise operations

// Ensure data directory exists
const dataDir = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`Created data directory: ${dataDir}`);
}

/**
 * ==============================================
 * Middleware Configuration
 * ==============================================
 */

// Enable CORS for cross-origin requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve resume JSON files from data directory
app.use('/data', express.static(path.join(__dirname, 'public', 'data')));

/**
 * ==============================================
 * API Endpoints
 * ==============================================
 */

/**
 * GET /api/resume/:lang
 * Retrieves resume data for specified language
 */
app.get('/api/resume/:lang', async (req, res) => {
    const lang = req.params.lang;
    const filePath = path.join(dataDir, `${lang}.json`);
    
    console.log(`[SERVER] Loading resume: ${lang}.json`);
    
    try {
        // Read and parse JSON file
        const rawData = await fsp.readFile(filePath, 'utf8');
        const data = JSON.parse(rawData);
        
        console.log(`[SERVER] Successfully loaded ${lang} resume`);
        res.json(data);
        
    } catch (err) {
        console.error(`[SERVER] Error loading ${lang}.json:`, err.message);
        res.status(404).json({ 
            error: 'Resume not found',
            message: `Could not load ${lang} resume data`
        });
    }
});

/**
 * POST /api/resume/:lang
 * Saves resume data for specified language
 */
app.post('/api/resume/:lang', express.json(), async (req, res) => {
    const lang = req.params.lang;
    const filePath = path.join(dataDir, `${lang}.json`);
    
    console.log(`[SERVER] Saving resume: ${lang}.json`);

    try {
        // Validate and save data
        if (!req.body || typeof req.body !== 'object') {
            throw new Error('Invalid resume data format');
        }
        
        await fsp.writeFile(filePath, JSON.stringify(req.body, null, 2));
        console.log(`[SERVER] Successfully saved ${lang} resume`);
        res.json({ success: true });
        
    } catch (err) {
        console.error(`[SERVER] Error saving ${lang}.json:`, err.message);
        res.status(500).json({ 
            error: 'Failed to save resume',
            message: err.message || 'Unknown server error'
        });
    }
});

/**
 * ==============================================
 * Client Routing
 * ==============================================
 */

// Serve SPA entry point for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * ==============================================
 * Server Initialization
 * ==============================================
 */

app.listen(PORT, () => {
    console.log(`
    ==============================================
    Server running on http://localhost:${PORT}
    ==============================================
    `);
});