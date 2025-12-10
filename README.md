# Encryption & Decryption Web Application

A modern web application for encrypting and decrypting data using multiple encryption methods.

## Features

- **Multiple Encryption Methods:**
  - AES-256-GCM (Advanced Encryption Standard)
  - ChaCha20-Poly1305 (Modern stream cipher)
  - RSA-OAEP (Asymmetric encryption)
  - Caesar Cipher (Educational)
  - Substitution Cipher (Educational)
  - Base64 Encoding

- **User-Friendly Interface:**
  - Clean, modern design with dark/light mode
  - Text and file encryption support
  - Real-time password strength indicator
  - Copy to clipboard and download results

- **Security:**
  - All encryption performed server-side with Node.js crypto module
  - No data stored on server
  - Secure key derivation using PBKDF2

## Tech Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Backend:** Node.js with serverless functions
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run locally with Vercel CLI:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

### Deployment

Deploy to Vercel:
```bash
vercel
```

## Usage

1. Select an encryption method from the dropdown
2. Enter your text or upload a file
3. Provide a password or key
4. Click "Encrypt" or "Decrypt"
5. Copy or download the result

## Security Notes

- **Caesar and Substitution ciphers** are for educational purposes only - NOT secure for real data
- **Base64** is encoding, not encryption - provides no security
- Use **AES-256-GCM** or **ChaCha20-Poly1305** for secure encryption
- Use **RSA** for key exchange or small data
- Always use strong, unique passwords

## License

MIT
