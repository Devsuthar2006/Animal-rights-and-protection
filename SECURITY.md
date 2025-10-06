# 🔒 Security Guide for Animal Rights Payment System

## 🚨 CRITICAL SECURITY RULES

### ❌ NEVER COMMIT THESE TO GIT:
- **.env files** (contains secret keys)
- **Secret API keys** (sk_live_*, sk_test_*)  
- **Webhook secrets** (whsec_*)
- **Database passwords**
- **Private certificates**

### ✅ SAFE TO COMMIT:
- **Publishable keys** (pk_live_*, pk_test_*)
- **UPI IDs** (suthardevilal132@oksbi)
- **QR codes** (public payment info)
- **Configuration files** (without secrets)

## 🛡️ Secure Setup Process

### Step 1: Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Edit with your actual keys (NEVER commit this file)
nano .env
```

### Step 2: Git Security
```bash
# Ensure .gitignore is working
git status
# .env should NOT appear in the list

# If .env is already tracked, remove it:
git rm --cached .env
git commit -m "Remove .env from tracking"
```

### Step 3: Server Deployment

#### Option A: Heroku (Recommended)
```bash
# Set environment variables in Heroku dashboard
heroku config:set STRIPE_SECRET_KEY=sk_test_your_key_here
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

#### Option B: Vercel
```bash
# Set environment variables in Vercel dashboard
# Or use CLI:
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY  
vercel env add STRIPE_WEBHOOK_SECRET
```

#### Option C: Your Own Server
```bash
# Create .env file on server (not in git repo)
sudo nano /var/www/your-app/.env

# Set proper file permissions
sudo chmod 600 /var/www/your-app/.env
sudo chown www-data:www-data /var/www/your-app/.env
```

## 🔐 Production Security Checklist

### Before Going Live:

- [ ] **Replace test keys** with live keys
- [ ] **Use HTTPS only** (SSL certificate)
- [ ] **Set up webhook endpoints** in Stripe Dashboard
- [ ] **Enable webhook signature verification**
- [ ] **Set up monitoring** for failed payments
- [ ] **Configure CORS** properly
- [ ] **Enable rate limiting**
- [ ] **Set up backup systems**
- [ ] **Configure CSP headers**
- [ ] **Enable security headers**

### Environment Variables Needed:
```bash
# Production Environment
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key  
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
PORT=443
```

## 🚀 Safe Deployment Commands

### Initial Deployment:
```bash
# 1. Ensure .env is ignored
echo ".env" >> .gitignore

# 2. Commit code (without secrets)
git add .
git commit -m "Add secure payment system"
git push origin main

# 3. Set environment variables on your hosting platform
# (Never include them in git commits)
```

### Updates:
```bash
# Always check what you're committing
git status
git diff

# Make sure no .env or secret files are included
git add .
git commit -m "Update payment system"
git push origin main
```

## 🛠️ Development vs Production

### Development (Current):
- **Test API keys** (safe for development)
- **Local .env file** (not in git)
- **HTTP allowed** (localhost only)

### Production:
- **Live API keys** (handle real money)
- **Environment variables** (on server)
- **HTTPS required** (SSL certificate)
- **Security headers enabled**
- **Rate limiting active**

## 🔍 Security Monitoring

### What to Monitor:
- **Failed payment attempts**
- **Unusual transaction patterns**  
- **API key usage** (Stripe Dashboard)
- **Server access logs**
- **Error rates and alerts**

### Stripe Dashboard Alerts:
- Set up email notifications for:
  - Failed payments
  - Suspicious activity
  - API errors
  - Webhook failures

## 🆘 If Keys Are Compromised

### Immediate Actions:
1. **Regenerate API keys** in Stripe Dashboard
2. **Update environment variables** on all servers
3. **Check for unauthorized transactions**
4. **Review access logs**
5. **Change webhook secrets**
6. **Force new deployment**

## 📞 Support Contacts

- **Stripe Security**: security@stripe.com
- **Heroku Security**: security@heroku.com
- **Your hosting provider's security team**

Remember: **Security is not optional** when handling payments! 🔒