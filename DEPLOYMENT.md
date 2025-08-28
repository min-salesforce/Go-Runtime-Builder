# Deployment Guide: How to Go AI Integration

## Overview

The "How to Go" AI experience supports both local development and production deployment with different AI backend configurations:

- **Local Development**: Smart pattern matching system (simulates AI behavior)
- **Production (Heroku)**: GPT-OSS-20b via Heroku Inference

## Local Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Visit: `http://localhost:3000/how-to-go`

The AI service automatically uses intelligent pattern matching in development mode, referencing `canonical.md` and `decision tree.md` for contextual responses.

## Production Deployment with Heroku Inference

### Step 1: Set up Heroku Inference

1. **Create Heroku App** (if not already done):
   ```bash
   heroku create your-app-name
   ```

2. **Add Heroku Inference Add-on**:
   ```bash
   heroku addons:create heroku-inference:standard -a your-app-name
   ```

3. **Create AI Model Resource** (GPT-OSS-20b):
   ```bash
   # Install Heroku AI plugin
   heroku plugins:install @heroku-cli/plugin-ai
   
   # Create GPT-OSS-20b model resource
   heroku ai:models:create gpt-oss-20b --alias how-to-go-ai -a your-app-name
   ```

4. **Attach Model to App**:
   ```bash
   heroku ai:models:attach how-to-go-ai -a your-app-name
   ```

### Step 2: Configure Environment Variables

Set the required environment variables for production:

```bash
# Set production environment
heroku config:set NODE_ENV=production -a your-app-name

# Heroku Inference will automatically set these:
# HEROKU_AI_MODEL_URL - AI model endpoint URL
# HEROKU_AI_API_KEY - API authentication key
```

### Step 3: Deploy Application

```bash
# Deploy to Heroku
git push heroku master

# Verify deployment
heroku open -a your-app-name
```

### Step 4: Test AI Integration

1. Visit your deployed app's `/how-to-go` route
2. Start a conversation with the AI assistant
3. Verify intelligent responses based on Salesforce Go guidelines

## Environment Detection

The application automatically detects the environment:

- **Development** (`NODE_ENV=development`): Uses pattern matching system
- **Production** (`NODE_ENV=production` + Heroku variables): Uses Heroku Inference

## AI Model Configuration

### GPT-OSS-20b Model Settings

The application uses these settings for GPT-OSS-20b:

```javascript
{
  model: 'gpt-oss-20b',
  max_tokens: 500,
  temperature: 0.7,
  stream: false
}
```

### System Prompt Integration

The AI assistant uses comprehensive system prompts that include:

- Complete `canonical.md` content (Salesforce Go guidelines)
- Full `decision tree.md` content (setup type logic)
- Conversation context and user intent detection
- Structured response formatting for UI integration

## Monitoring and Troubleshooting

### Check AI Model Status
```bash
heroku ai:models:info how-to-go-ai -a your-app-name
```

### View Logs
```bash
heroku logs --tail -a your-app-name
```

### Monitor Usage
```bash
# View AI usage stats
heroku ai:models:info how-to-go-ai -a your-app-name
```

## Cost Considerations

- **Development**: No AI costs (uses pattern matching)
- **Production**: Heroku Inference billing by usage
  - Charges per API call to GPT-OSS-20b
  - Monitor usage through Heroku dashboard
  - Consider implementing rate limiting for high-traffic scenarios

## Fallback Behavior

If AI service encounters errors:
1. Application logs the error
2. Returns user-friendly error message
3. Suggests manual approach via Simple Generator
4. Maintains conversation state for retry

## Security

- API keys managed by Heroku automatically
- No sensitive data stored in conversation logs
- All AI communication over HTTPS
- Environment variables secured through Heroku config

## Performance

- **Response Time**: ~2-5 seconds per AI interaction
- **Context Retention**: Full conversation history maintained
- **Streaming**: Not currently implemented (considers timeout limitations)
- **Caching**: Context files cached on startup

## Future Enhancements

- **Local GPT-OSS-20b**: Direct model integration for development
- **Streaming Responses**: Real-time response updates
- **Multi-language Support**: Extended canonical guidelines
- **Custom Training**: Fine-tuned models for Salesforce-specific use cases
