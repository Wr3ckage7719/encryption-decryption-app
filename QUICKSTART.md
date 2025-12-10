# Quick Start Guide

## Your Encryption & Decryption App is Ready! 🎉

### What You Have

A fully functional web application with:

✅ **Multiple Encryption Methods:**
- AES-256-GCM (Military-grade encryption)
- ChaCha20-Poly1305 (Modern stream cipher)
- RSA-2048 (Public key encryption)
- Caesar Cipher (Educational)
- Substitution Cipher (Educational)
- Base64 Encoding

✅ **Features:**
- 🌓 Dark/Light mode toggle
- 📁 Text and file encryption
- 🔑 Automatic key generation
- 📋 Copy to clipboard
- 💾 Download results
- 🎨 Modern, responsive UI
- ⌨️ Keyboard shortcuts (Ctrl+E, Ctrl+D)
- 🔒 Password strength indicator

### Running Locally

The server is currently running at: **http://localhost:3000**

To start the server manually:
```bash
cd "c:\Users\balon nga pala\Documents\Encryption_Decryption"
node server.js
```

Or use npm:
```bash
npm start
```

### How to Use

1. **Select Encryption Method** - Choose from the dropdown
2. **Enter Text or Upload File** - Type or drag & drop
3. **Provide Password/Key** - Enter password (or generate keys for RSA/Substitution)
4. **Click Encrypt or Decrypt** - Process your data
5. **Copy or Download** - Get your results

### Keyboard Shortcuts

- `Ctrl + E` - Encrypt
- `Ctrl + D` - Decrypt
- `Esc` - Clear all fields

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd "c:\Users\balon nga pala\Documents\Encryption_Decryption"
   vercel
   ```

4. Follow the prompts and your app will be live!

### Security Notes

⚠️ **Important:**
- Caesar and Substitution ciphers are NOT secure (educational only)
- Base64 is encoding, NOT encryption
- Use AES-256-GCM or ChaCha20 for real data protection
- Keep your RSA private keys secret!

### Project Structure

```
Encryption_Decryption/
├── api/              - Serverless API endpoints
├── lib/              - Encryption logic
├── public/           - Frontend files
│   ├── index.html    - Main page
│   ├── styles.css    - Styling
│   ├── app.js        - Application logic
│   └── utils.js      - Utilities
├── server.js         - Local dev server
├── package.json      - Dependencies
└── vercel.json       - Vercel config
```

### Testing the App

Try these examples:

**AES Encryption:**
1. Select "AES-256-GCM"
2. Enter text: "Hello World"
3. Enter password: "mySecretPassword123"
4. Click Encrypt
5. Copy the result
6. Click Clear
7. Paste the encrypted text
8. Enter same password
9. Click Decrypt

**RSA Encryption:**
1. Select "RSA-2048"
2. Click "Generate RSA Key Pair"
3. Copy both keys (save private key securely!)
4. Enter text to encrypt
5. Public key is auto-filled
6. Click Encrypt
7. To decrypt, paste encrypted text
8. Replace with private key
9. Click Decrypt

### Troubleshooting

**Server won't start:**
- Check if port 3000 is in use
- Run: `npm install` to ensure dependencies are installed

**Page not loading:**
- Ensure server is running
- Check browser console for errors
- Try clearing browser cache

**API errors:**
- Check browser console
- Verify password/key is correct
- Ensure input is not empty

### Next Steps

- Customize the UI colors in `public/styles.css`
- Add more encryption methods in `lib/`
- Implement rate limiting for production
- Add user authentication if needed
- Create API documentation

### Support

For detailed deployment instructions, see `DEPLOYMENT.md`
For general information, see `README.md`

---

**Enjoy your encryption tool! 🔒**
