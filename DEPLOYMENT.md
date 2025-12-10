# Deployment Guide

## Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your deployment

5. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Using Vercel Dashboard

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Configure project:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: public
5. Click "Deploy"

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run with Vercel dev server (recommended):
   ```bash
   npm run dev
   ```
   This simulates the Vercel environment locally

3. Or run with Node.js:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser

## Environment Variables

No environment variables are required for this application. All configuration is handled through the code.

## Project Structure

```
Encryption_Decryption/
├── api/                    # Vercel serverless functions
│   ├── encrypt.js         # Encryption endpoint
│   ├── decrypt.js         # Decryption endpoint
│   └── generate-key.js    # Key generation endpoint
├── lib/                    # Backend crypto logic
│   ├── cryptoHandlers.js  # AES, ChaCha20, RSA handlers
│   └── classicalCiphers.js # Caesar, Substitution, Base64
├── public/                 # Frontend static files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Styling with dark/light mode
│   ├── app.js             # Main application logic
│   └── utils.js           # Utility functions
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies
├── server.js              # Local development server
└── README.md              # Documentation
```

## API Endpoints

### POST /api/encrypt
Encrypts plaintext using the specified method.

**Request:**
```json
{
  "method": "aes",
  "plaintext": "Hello World",
  "password": "mypassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": "encrypted_base64_string"
}
```

### POST /api/decrypt
Decrypts ciphertext using the specified method.

**Request:**
```json
{
  "method": "aes",
  "ciphertext": "encrypted_base64_string",
  "password": "mypassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": "Hello World"
}
```

### GET /api/generate-key?type=rsa
Generates encryption keys.

**Response:**
```json
{
  "success": true,
  "publicKey": "-----BEGIN PUBLIC KEY-----...",
  "privateKey": "-----BEGIN PRIVATE KEY-----..."
}
```

## Troubleshooting

### Build fails on Vercel
- Ensure all dependencies are in `package.json`
- Check that `vercel.json` is properly configured
- Verify Node.js version compatibility (18.x recommended)

### API endpoints not working
- Check CORS configuration in API files
- Verify routes in `vercel.json`
- Check browser console for errors

### Local development issues
- Make sure port 3000 is not in use
- Install dependencies: `npm install`
- Try clearing node_modules and reinstalling

## Security Notes

- All encryption happens server-side
- No data is stored on the server
- Keys are never logged or saved
- Use HTTPS in production (automatic with Vercel)
- Implement rate limiting for production use

## Performance

- API functions have a 10-second timeout on Vercel
- Maximum request size: 10MB
- Consider implementing chunking for large files

## Support

For issues or questions, refer to the main README.md file.
