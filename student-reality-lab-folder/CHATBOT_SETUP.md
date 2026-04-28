# Student Loan Advisor Setup Guide

## Enabling the AI Chatbot

The student loan advisor chatbot supports **OpenAI** and **Google Gemini**.

### Step 1: Get an API Key

Choose one provider (or both):

- OpenAI: [OpenAI API Keys](https://platform.openai.com/api-keys)
- Gemini: [Google AI Studio API Keys](https://aistudio.google.com/app/apikey)

### Step 2: Add Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and set at least one key:
   ```
   VITE_AI_PROVIDER=openai
   VITE_OPENAI_API_KEY=your_openai_key_here
   VITE_GEMINI_API_KEY=your_gemini_key_here
   ```

Notes:
- `VITE_AI_PROVIDER` is optional (`openai` or `gemini`).
- If it is omitted, the app uses OpenAI when available, otherwise Gemini.

### Step 4: Set Up Backend (Choose One)

#### Option A: Vercel Functions (Recommended)
If deploying to Vercel:

```bash
npm install @vercel/functions
```

Move `src/api/chat.ts` to `api/chat.ts` and Vercel will handle it automatically.

#### Option B: Local Express/Node Server

Install Express:
```bash
npm install express cors body-parser
```

Create `server.js`:
```javascript
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// Import your chat handler
import { POST as chatHandler } from './src/api/chat.ts'

app.post('/api/chat', async (req, res) => {
  const response = await chatHandler(req)
  res.status(response.status || 200).json(await response.json())
})

app.listen(3001, () => console.log('API running on port 3001'))
```

Then run both:
```bash
npm run dev  # Your Vite dev server
node server.js # In another terminal
```

Update `src/components/ChatBot.tsx` to point to the right port:
```typescript
const response = await fetch('http://localhost:3001/api/chat', {
```

#### Option C: Node/Express with TypeScript

```bash
npm install -D ts-node tsconfig-paths
npm install express cors body-parser
```

See Option B but with proper TypeScript setup.

### Step 5: Run the App

```bash
npm run dev
```

Visit the app and scroll to the "Ask the advisor" section. You should now be able to chat with the AI advisor!

### Troubleshooting

- **"API error: 401"**: Your API key is invalid or expired
- **"CORS error"**: Your backend needs proper CORS headers (handled if using Vercel/serverless)
- **"No AI provider configured"**: Set `VITE_OPENAI_API_KEY` or `VITE_GEMINI_API_KEY` in `.env`
- **Chat not responding**: Check browser console for errors and verify `/api/chat` is reachable

## Cost

Pricing depends on the model you use:
- OpenAI: [Pricing](https://platform.openai.com/docs/pricing)
- Gemini: [Pricing](https://ai.google.dev/gemini-api/docs/pricing)
