const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Import API routes
const encryptRoute = require('./api/encrypt');
const decryptRoute = require('./api/decrypt');
const generateKeyRoute = require('./api/generate-key');

// API Routes
app.post('/api/encrypt', encryptRoute);
app.post('/api/decrypt', decryptRoute);
app.get('/api/generate-key', generateKeyRoute);
app.post('/api/generate-key', generateKeyRoute);

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server (only for local development)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('Press Ctrl+C to stop');
    });
}

module.exports = app;
