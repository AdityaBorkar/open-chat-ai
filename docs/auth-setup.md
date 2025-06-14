# Authentication Setup Guide

This guide will help you set up all the authentication methods available in T3 Chat.

## 🔧 Environment Variables

Add these to your `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/t3-chat"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Social Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id" # Same as GOOGLE_CLIENT_ID

# hCaptcha (Bot Protection)
HCAPTCHA_SECRET_KEY="your-hcaptcha-secret-key"
NEXT_PUBLIC_HCAPTCHA_SITE_KEY="your-hcaptcha-site-key"
```

## 🛡️ hCaptcha Setup (Free Plan)

1. **Sign up**: Go to [hCaptcha.com](https://www.hcaptcha.com/) and create a free account
2. **Create a sitekey**:
   - Dashboard → Sites → Add New Site
   - Enter your domain (`localhost` for development)
   - Copy the **Site Key** → `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
3. **Get secret key**:
   - Profile → Settings
   - Copy the **Secret Key** → `HCAPTCHA_SECRET_KEY`

### hCaptcha Features
- ✅ **Free Plan**: 1,000,000 requests/month
- ✅ **Bot Protection**: Automatically protects sign-in/sign-up forms
- ✅ **Privacy-First**: GDPR compliant, no user tracking
- ✅ **Global Support**: Works in all countries (unlike reCAPTCHA)

## 🔍 Google One Tap Setup

1. **Google Cloud Console**: Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. **Create/Select Project**: Create a new project or select existing
3. **Enable APIs**:
   - APIs & Services → Library
   - Search "Google Identity Services API" → Enable
4. **Create Credentials**:
   - APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application Type: Web Application
   - Authorized origins: `http://localhost:3000` (dev), your domain (prod)
   - Copy **Client ID** → `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

### One Tap Features
- ✅ **Seamless**: Auto-appears for Google users
- ✅ **Privacy**: No password required
- ✅ **Fast**: One-click authentication
- ✅ **Smart**: Remembers user preference

## 👤 Anonymous Authentication

No setup required! Anonymous authentication allows users to:

- ✅ **Browse as guest**: No registration needed
- ✅ **Try your app**: Lower friction for new users
- ✅ **Seamless upgrade**: Link to real account later
- ✅ **Data persistence**: Keep user data when linking accounts

## 🔐 Passkeys (WebAuthn)

No additional setup required! Passkeys provide:

- ✅ **Biometric auth**: Fingerprint, Face ID, Touch ID
- ✅ **Hardware keys**: YubiKey, security keys
- ✅ **Phishing-resistant**: Domain-bound authentication
- ✅ **Password-free**: No passwords to remember

## 📱 GitHub Setup

1. **GitHub Settings**: Go to GitHub → Settings → Developer settings → OAuth Apps
2. **New OAuth App**:
   - Application name: T3 Chat
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. **Copy credentials**:
   - **Client ID** → `GITHUB_CLIENT_ID`
   - **Client Secret** → `GITHUB_CLIENT_SECRET`

## 🚀 Usage Examples

### Anonymous Sign-In
```tsx
const response = await authClient.signIn.anonymous();
```

### Google One Tap
```tsx
await authClient.oneTap({
  fetchOptions: {
    onSuccess: () => router.push('/dashboard')
  }
});
```

### Passkey Registration
```tsx
const response = await authClient.passkey.addPasskey();
```

### Captcha Protection
Captcha is automatically added to sign-in/sign-up forms when configured.

## 🔄 Account Linking

Users can link their anonymous accounts to real accounts:

```tsx
// When anonymous user signs up with email
const response = await authClient.signUp.email({
  email: 'user@example.com',
  password: 'secure-password',
  name: 'User Name'
});
// Anonymous data is automatically transferred
```

## 📊 Security Features

| Feature | Protection | User Experience |
|---------|------------|-----------------|
| hCaptcha | Bot detection | Invisible for humans |
| Passkeys | Phishing-resistant | Biometric auth |
| One Tap | OAuth security | One-click sign-in |
| Anonymous | No PII exposure | Instant access |

## 🧪 Testing

For development and testing:

### hCaptcha Test Keys
```env
# Test keys (always pass)
HCAPTCHA_SECRET_KEY="0x0000000000000000000000000000000000000000"
NEXT_PUBLIC_HCAPTCHA_SITE_KEY="10000000-ffff-ffff-ffff-000000000001"
```

### Google Test Environment
- Use `localhost:3000` for development
- Test One Tap in incognito mode for best results

## 🚨 Security Best Practices

1. **Environment Variables**: Never commit secrets to git
2. **HTTPS Required**: All production auth requires HTTPS
3. **Domain Validation**: Configure proper authorized domains
4. **Rate Limiting**: Better Auth includes built-in rate limiting
5. **Session Security**: Sessions are httpOnly and secure by default

## 📈 Production Deployment

1. **Update domains** in all OAuth provider settings
2. **Set production environment variables**
3. **Enable HTTPS** (required for WebAuthn/Passkeys)
4. **Configure CSP headers** for hCaptcha:
   ```
   script-src: https://hcaptcha.com https://*.hcaptcha.com
   frame-src: https://hcaptcha.com https://*.hcaptcha.com
   style-src: https://hcaptcha.com https://*.hcaptcha.com
   connect-src: https://hcaptcha.com https://*.hcaptcha.com
   ```

Your authentication system is now ready with multiple secure, user-friendly options! 🎉