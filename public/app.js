// Main Application Logic

// State
let currentTheme = localStorage.getItem('theme') || 'dark';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeEventListeners();
    updateMethodUI();
});

/**
 * Initialize theme
 */
function initializeTheme() {
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('themeToggle').textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').textContent = '🌙';
    }
}

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Method selector
    document.getElementById('methodSelect').addEventListener('change', updateMethodUI);
    
    // Action buttons
    document.getElementById('encryptBtn').addEventListener('click', handleEncrypt);
    document.getElementById('decryptBtn').addEventListener('click', handleDecrypt);
    
    // Copy buttons
    document.getElementById('copyEncryptBtn').addEventListener('click', () => handleCopy('encrypt'));
    document.getElementById('copyDecryptBtn').addEventListener('click', () => handleCopy('decrypt'));
}

/**
 * Toggle theme
 */
function toggleTheme() {
    if (currentTheme === 'dark') {
        currentTheme = 'light';
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('themeToggle').textContent = '☀️';
    } else {
        currentTheme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').textContent = '🌙';
    }
    localStorage.setItem('theme', currentTheme);
}

/**
 * Update UI based on selected method
 */
function updateMethodUI() {
    const method = document.getElementById('methodSelect').value;
    
    // Update method info
    const info = {
        'caesar': 'Caesar Cipher shifts each letter by 3 positions. Classic encryption!',
        'reverse': 'Reverses your text character by character.',
        'base64': 'Encodes text in Base64 format - commonly used for data transfer.',
        'hex': 'Converts text to hexadecimal (base-16) representation.',
        'morse': 'Converts text to Morse code (dots and dashes).',
        'binary': 'Converts text to 8-bit binary representation.',
        'atbash': 'Reverses the alphabet - A↔Z, B↔Y, C↔X, etc.',
        'rot13': 'Rotates letters by 13 positions - encrypts and decrypts with same operation!'
    };
    
    document.getElementById('methodInfo').innerHTML = `<p>${info[method] || 'Select a method'}</p>`;
}

/**
 * Get encrypt input data
 */
function getEncryptData() {
    const method = document.getElementById('methodSelect').value;
    const plaintext = document.getElementById('encryptInput').value;
    
    return {
        method,
        plaintext,
        shift: 3  // Fixed shift for caesar
    };
}

/**
 * Get decrypt input data
 */
function getDecryptData() {
    const method = document.getElementById('methodSelect').value;
    const ciphertext = document.getElementById('decryptInput').value;
    
    return {
        method,
        ciphertext,
        shift: 3  // Fixed shift for caesar
    };
}

/**
 * Handle encryption
 */
async function handleEncrypt() {
    const data = getEncryptData();
    
    if (!data.plaintext) {
        showStatus('Please enter text to encrypt', 'error');
        return;
    }
    
    // Show loading
    showLoading(true);
    
    try {
        const result = await apiCall('encrypt', data);
        
        if (result.success) {
            document.getElementById('encryptOutput').value = result.data;
            showStatus('✓ Encrypted!', 'success');
        } else {
            showStatus(result.error || 'Encryption failed', 'error');
        }
    } catch (error) {
        showStatus('Error: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Handle decryption
 */
async function handleDecrypt() {
    const data = getDecryptData();
    
    if (!data.ciphertext) {
        showStatus('Please enter text to decrypt', 'error');
        return;
    }
    
    // Show loading
    showLoading(true);
    
    try {
        const result = await apiCall('decrypt', data);
        
        if (result.success) {
            document.getElementById('decryptOutput').value = result.data;
            showStatus('✓ Decrypted!', 'success');
        } else {
            showStatus(result.error || 'Decryption failed', 'error');
        }
    } catch (error) {
        showStatus('Error: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Handle copy to clipboard
 */
async function handleCopy(section) {
    const output = document.getElementById(`${section}Output`).value;
    if (!output) {
        showStatus('Nothing to copy', 'error');
        return;
    }
    
    const success = await copyToClipboard(output);
    if (success) {
        showStatus('✓ Copied to clipboard!', 'success');
    } else {
        showStatus('Failed to copy', 'error');
    }
}




