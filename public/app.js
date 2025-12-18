// Main Application Logic

// State
let currentTheme = localStorage.getItem('theme') || 'dark';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeEventListeners();
    updateMethodUI();
});

// Helper: simple wrapper marker
const PASSWORD_MARKER = 'ENC-PASS:v1|';

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

    // Landing choose
    const landing = document.getElementById('landing');
    const main = document.querySelector('.main-content');
    if (landing) {
        document.getElementById('chooseEncrypt').addEventListener('click', () => {
            landing.style.display = 'none';
            main.style.display = '';
            showSection('encrypt');
        });
        document.getElementById('chooseDecrypt').addEventListener('click', () => {
            landing.style.display = 'none';
            main.style.display = '';
            showSection('decrypt');
        });
    }

    // Modal events
    const modal = document.getElementById('passwordModal');
    if (modal) {
        document.getElementById('modalCancel').addEventListener('click', () => closeModal());
        document.getElementById('modalConfirm').addEventListener('click', async () => {
            const pwd = document.getElementById('modalPasswordInput').value || '';
            await confirmModalPassword(pwd);
        });
    }
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
            let output = result.data;
            const password = document.getElementById('encryptPassword').value || '';
            if (password) {
                // wrap ciphertext with password protection (AES-GCM on client)
                output = await wrapWithPassword(output, password);
            }
            document.getElementById('encryptOutput').value = output;
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
    let data = getDecryptData();
    if (!data.ciphertext) {
        showStatus('Please enter text to decrypt', 'error');
        return;
    }

    // If ciphertext appears password-wrapped, handle separately
    if (data.ciphertext.startsWith(PASSWORD_MARKER)) {
        // if user already provided a password in input, use it; otherwise show modal
        const provided = document.getElementById('decryptPassword').value || '';
        if (provided) {
            try {
                const inner = await unwrapWithPassword(data.ciphertext, provided);
                data.ciphertext = inner;
            } catch (err) {
                showStatus('Password unwrap failed: ' + err.message, 'error');
                return;
            }
        } else {
            // store ciphertext pending and show modal
            window.__pendingWrappedCipher = data.ciphertext;
            openModal();
            return;
        }
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
 * Show only the requested side (encrypt/decrypt)
 */
function showSection(which) {
    const encryptCard = document.getElementById('encryptInput')?.closest('.card');
    const decryptCard = document.getElementById('decryptInput')?.closest('.card');
    if (encryptCard && decryptCard) {
        if (which === 'encrypt') {
            encryptCard.style.display = '';
            decryptCard.style.display = 'none';
        } else {
            encryptCard.style.display = 'none';
            decryptCard.style.display = '';
        }
    }
}

/** Modal helpers **/
function openModal() {
    const modal = document.getElementById('passwordModal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('modalPasswordInput').value = '';
}

function closeModal() {
    const modal = document.getElementById('passwordModal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    window.__pendingWrappedCipher = null;
}

async function confirmModalPassword(pwd) {
    const wrapped = window.__pendingWrappedCipher;
    if (!wrapped) {
        closeModal();
        return;
    }
    try {
        const inner = await unwrapWithPassword(wrapped, pwd);
        closeModal();
        // populate decrypt input then proceed to decrypt automatically
        document.getElementById('decryptInput').value = inner;
        document.getElementById('decryptPassword').value = pwd;
        await handleDecrypt();
    } catch (err) {
        showStatus('Incorrect password or corrupted data', 'error');
    }
}

/**
 * Client-side AES-GCM wrap/unwrap
 */
function ab2b64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function b642ab(str) {
    const bin = atob(str);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr.buffer;
}

async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), {name: 'PBKDF2'}, false, ['deriveKey']);
    return crypto.subtle.deriveKey({name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256'}, keyMaterial, {name: 'AES-GCM', length: 256}, false, ['encrypt', 'decrypt']);
}

async function wrapWithPassword(plaintext, password) {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt.buffer);
    const ct = await crypto.subtle.encrypt({name: 'AES-GCM', iv}, key, enc.encode(plaintext));
    // return marker + saltB64 + '|' + ivB64 + '|' + ctB64
    return PASSWORD_MARKER + [ab2b64(salt.buffer), ab2b64(iv.buffer), ab2b64(ct)].join('|');
}

async function unwrapWithPassword(wrapped, password) {
    if (!wrapped.startsWith(PASSWORD_MARKER)) throw new Error('Not wrapped');
    const body = wrapped.slice(PASSWORD_MARKER.length);
    const parts = body.split('|');
    if (parts.length !== 3) throw new Error('Invalid format');
    const salt = b642ab(parts[0]);
    const iv = b642ab(parts[1]);
    const ct = b642ab(parts[2]);
    const key = await deriveKey(password, salt);
    const plainBuf = await crypto.subtle.decrypt({name: 'AES-GCM', iv: new Uint8Array(iv)}, key, ct);
    const dec = new TextDecoder();
    return dec.decode(plainBuf);
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




