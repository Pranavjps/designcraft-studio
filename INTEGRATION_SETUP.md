# OAuth Integration Setup Guide

## Overview
This frontend application supports real OAuth integrations for:
- **Google Calendar** - Schedule meetings and manage events
- **Google Sheets** - Log sales data and create reports  
- **Shopify** - Access customer orders and product catalog

## Architecture

### Flow Diagram
```
User clicks "Connect Google Calendar"
    ↓
Frontend calls: POST /v1/integrations/google_calendar/connect
    ↓
Backend returns: { redirect_url: "https://accounts.google.com/..." }
    ↓
Frontend redirects: window.location.href = redirect_url
    ↓
User authorizes on Google
    ↓
Google redirects back: /settings/integrations?status=success&integration=google_calendar
    ↓
Frontend shows success toast and refreshes integration list
```

## Implementation Details

### 1. API Client (`src/lib/api.ts`)

#### OAuth Methods
```typescript
// Initiate OAuth flow - returns redirect URL
async initiateOAuthConnection(type: string, metadata?: Record<string, string>): Promise<{ redirect_url: string }>

// Handle OAuth callback - check URL params for status
async handleOAuthCallback(type: string, queryParams: URLSearchParams): Promise<{ success: boolean; message: string }>

// Disconnect integration
async disconnectIntegration(type: string): Promise<{ success: boolean }>
```

### 2. Integration Types

#### Google Calendar (`google_calendar`)
- **OAuth Scopes**: `https://www.googleapis.com/auth/calendar.events`
- **No pre-connection fields required**
- **Flow**: Direct OAuth redirect → Google authorization → Callback

#### Google Sheets (`google_sheets`)
- **OAuth Scopes**: `https://www.googleapis.com/auth/spreadsheets`
- **No pre-connection fields required**
- **Flow**: Direct OAuth redirect → Google authorization → Callback

#### Shopify (`shopify`)
- **OAuth Type**: Store-specific OAuth
- **Pre-connection field**: Shop URL (e.g., `your-store.myshopify.com`)
- **Flow**: User enters shop URL → OAuth redirect → Shopify authorization → Callback

### 3. Frontend Components

#### Integration Icons
```typescript
const integrationIcons: Record<string, any> = {
  google_calendar: Calendar,    // lucide-react Calendar icon
  google_sheets: Sheet,         // lucide-react Sheet icon
  shopify: ShoppingBag,         // lucide-react ShoppingBag icon
};
```

#### OAuth Callback Handling
```typescript
useEffect(() => {
  // Check for OAuth callback in URL params
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  const integration = urlParams.get('integration');
  
  if (status === 'success' && integration) {
    toast.success(`${integration} connected successfully! 🎉`);
    window.history.replaceState({}, '', window.location.pathname);
  }
  
  loadIntegrations();
}, []);
```

#### Connect Handler
```typescript
const handleConnect = async () => {
  const oauthIntegrations = ['google_calendar', 'google_sheets', 'shopify'];
  
  if (oauthIntegrations.includes(connectDialog.type)) {
    // OAuth Flow
    const metadata = connectDialog.type === 'shopify' ? connectionConfig : undefined;
    const response = await api.initiateOAuthConnection(connectDialog.type, metadata);
    window.location.href = response.redirect_url;
  } else {
    // Legacy flow for non-OAuth integrations
    await api.connectIntegration({ ... });
  }
};
```

## Backend Requirements

### Required Endpoints

#### 1. List Integrations
```
GET /v1/integrations
Response: {
  data: [
    {
      id: "uuid",
      type: "google_calendar",
      name: "Google Calendar",
      description: "Schedule meetings automatically",
      status: "connected" | "available",
      enabled: true,
      config: { ... }
    }
  ]
}
```

#### 2. Initiate OAuth
```
POST /v1/integrations/{type}/connect
Body: { metadata: { shop_url: "..." } }  // Optional, for Shopify
Response: { redirect_url: "https://..." }
```

#### 3. OAuth Callback (Backend handles this)
```
GET /v1/integrations/{type}/callback?code=...&state=...
Backend:
  1. Validates state (CSRF protection)
  2. Exchanges code for tokens
  3. Stores encrypted tokens in database
  4. Redirects to: /settings/integrations?status=success&integration={type}
```

#### 4. Disconnect Integration
```
DELETE /v1/integrations/{type}
Response: { success: true }
```

### Security Requirements

1. **State Parameter**: Generate random UUID, store in Redis with 5-minute TTL
2. **HMAC Validation**: For Shopify, validate HMAC signature
3. **Token Encryption**: Store access/refresh tokens encrypted in database
4. **HTTPS Only**: OAuth redirects must use HTTPS in production

## Environment Variables

### Backend (.env)
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8001/v1/integrations/google_calendar/callback

# Shopify OAuth
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_REDIRECT_URI=http://localhost:8001/v1/integrations/shopify/callback

# Token Encryption
ENCRYPTION_KEY=your_fernet_encryption_key
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8001
VITE_AUTH_BASE_URL=http://localhost:8000
```

## Testing

### Manual Testing Flow

1. **Start Backend Services**
   ```bash
   cd core-api-service
   uvicorn app.main:app --reload --port 8001
   ```

2. **Start Frontend**
   ```bash
   cd designcraft-studio
   npm run dev
   ```

3. **Test Google Calendar Integration**
   - Navigate to `/settings/integrations`
   - Click "Connect" on Google Calendar
   - Should redirect to Google OAuth consent screen
   - After authorization, should redirect back with success message
   - Integration should show as "Connected"

4. **Test Shopify Integration**
   - Click "Connect" on Shopify
   - Enter shop URL: `your-store.myshopify.com`
   - Should redirect to Shopify OAuth
   - After authorization, should redirect back with success message

5. **Test Disconnect**
   - Click "Disconnect" on connected integration
   - Should show confirmation and remove connection

## Troubleshooting

### Issue: "Failed to connect integration"
- **Check**: Backend is running and accessible
- **Check**: OAuth credentials are configured correctly
- **Check**: Redirect URI matches exactly (including http/https)

### Issue: OAuth redirect fails
- **Check**: CORS settings allow the OAuth provider domain
- **Check**: Redirect URI is whitelisted in OAuth app settings
- **Check**: State parameter is valid and not expired

### Issue: "Connection test failed"
- **Check**: Tokens are stored correctly in database
- **Check**: Token encryption/decryption is working
- **Check**: API credentials have correct permissions

## Production Deployment

### Pre-deployment Checklist

- [ ] Update `GOOGLE_REDIRECT_URI` to production domain
- [ ] Update `SHOPIFY_REDIRECT_URI` to production domain
- [ ] Generate new `ENCRYPTION_KEY` for production
- [ ] Enable HTTPS for all OAuth redirects
- [ ] Whitelist production redirect URIs in OAuth app settings
- [ ] Test OAuth flow on staging environment
- [ ] Set up monitoring for OAuth failures
- [ ] Configure rate limiting for OAuth endpoints

### OAuth App Setup

#### Google Cloud Console
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable Google Calendar API and Google Sheets API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:8001/v1/integrations/google_calendar/callback`
   - Production: `https://yourdomain.com/v1/integrations/google_calendar/callback`
6. Copy Client ID and Client Secret to backend `.env`

#### Shopify Partner Dashboard
1. Go to https://partners.shopify.com
2. Create new app
3. Set OAuth redirect URL:
   - Development: `http://localhost:8001/v1/integrations/shopify/callback`
   - Production: `https://yourdomain.com/v1/integrations/shopify/callback`
4. Copy API Key and API Secret to backend `.env`

## Status Indicators

The integration cards show different statuses:

- **🟢 Connected**: Integration is active and working
- **⚪ Available**: Integration can be connected
- **🔴 Needs Reconnect**: Token expired or invalid, user must reconnect

## Features

### Connected Integrations
- Toggle enable/disable
- Test connection
- Configure settings
- Disconnect

### Available Integrations
- View description
- Connect with OAuth flow
- See required permissions

## Next Steps

1. **Backend Implementation**: Follow `PLAN_CORE_API_INTEGRATIONS.md` to implement backend OAuth endpoints
2. **AI Service Integration**: Implement token storage and tool execution in AI service
3. **Testing**: Set up OAuth apps in Google Cloud Console and Shopify Partner Dashboard
4. **Deployment**: Configure production OAuth redirect URIs

## Support

For issues or questions:
- Check backend logs for OAuth errors
- Verify OAuth app configuration
- Test with mock mode first before real OAuth
- Review network tab for API call failures
