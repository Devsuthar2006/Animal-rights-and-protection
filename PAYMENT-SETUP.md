# 🐾 Animal Rights & Protection - Complete Payment System

## 🚀 Quick Start Guide

Your donation website is now fully configured with secure Stripe integration! Here's how to get it running:

### ✅ What's Already Set Up

1. **Frontend Payment System** - Multiple payment options in `donate.html`
2. **Backend Server** - `server.js` with full Stripe integration  
3. **Dependencies** - `package.json` with all required packages
4. **Enhanced Puppy System** - Realistic puppy following on all pages
5. **Security Configuration** - Environment variables and .gitignore

### 🖥️ Running Your Server

**Step 1: Install Dependencies**
```bash
cd "/Users/devilalsuthar/Downloads/animal rights and protection"
npm install
```

**Step 2: Configure Environment**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your actual Stripe keys
nano .env
```

**Step 3: Start the Server**
```bash
npm start
```

Your website will be available at: **http://localhost:3000**

### 💳 Testing Payments

**Test Credit Cards (Stripe Test Mode):**
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002` 
- **Requires SCA**: `4000 0025 0000 3155`
- **Expired**: `4000 0000 0000 0069`

**Use any:**
- Future expiry date (12/28, 01/30, etc.)
- Any 3-digit CVC (123, 456, etc.)
- Any billing postal code

### 🔧 Server Features

✅ **One-time Donations** - Instant credit card processing  
✅ **Monthly Subscriptions** - Recurring donations  
✅ **Payment Confirmation** - Webhook handling  
✅ **Error Handling** - Comprehensive error messages  
✅ **Customer Management** - Stripe customer creation  
✅ **Receipt Generation** - Automatic email receipts  
✅ **Static File Serving** - Serves your HTML pages  
✅ **Security Features** - Rate limiting, CORS, CSP headers
✅ **Google Pay/UPI** - QR code integration for Indian users

### 📊 Server Endpoints

- **`GET /`** - Your homepage (index.html)
- **`POST /create-payment-intent`** - Creates Stripe payments
- **`GET /health`** - Server health check
- **`POST /webhook`** - Stripe webhook handler
- **`GET /payment-status/:id`** - Check payment status

### 🎯 What Works Right Now

1. **Visit**: http://localhost:3000/donate.html
2. **Select Amount**: Choose donation amount
3. **Fill Form**: Enter donor information  
4. **Choose Method**: Credit Card, Google Pay, UPI, PayPal, Bank Transfer
5. **Pay Securely**: Use test card numbers or scan QR codes
6. **See Success**: Get confirmation message
7. **Check Console**: See payment logs in terminal

### 🔐 Security Features

- **Environment Variables**: No hardcoded API keys
- **Rate Limiting**: Prevents abuse
- **CORS Protection**: Secure cross-origin requests
- **CSP Headers**: Content Security Policy
- **Webhook Verification**: Secure payment confirmation
- **Input Validation**: Prevents malicious data
- **Error Handling**: Graceful error management

### 💰 Payment Methods Available

1. **Credit/Debit Cards** (Stripe) - Global
2. **Google Pay QR Code** - Your actual QR code
3. **UPI Payment** - Your UPI ID: `suthardevilal132@oksbi`
4. **PayPal** - International payments
5. **Bank Transfer** - Direct bank transfer with details

### 🚢 Going Live

When ready for real donations:

1. **Get Live Keys** from Stripe Dashboard
2. **Update .env file**:
   ```bash
   NODE_ENV=production
   STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
   STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
   ```
3. **Deploy to Production** (Heroku, Vercel, etc.)
4. **Set up Webhooks** in Stripe Dashboard
5. **Use HTTPS** for production

### 📧 Next Steps (Optional)

- **Email Integration**: Add SendGrid/Mailgun for receipts
- **Database**: Store donation records  
- **Admin Panel**: View donation analytics
- **Tax Receipts**: Generate tax-deductible receipts
- **Donor Portal**: Let donors manage subscriptions

### 🆘 Troubleshooting

**Server won't start?**
```bash
# Check if dependencies are installed
npm install
# Check if port 3000 is free
lsof -i :3000
```

**Payment fails?**
- Check test card numbers
- Verify Stripe keys in .env
- Check browser console for errors
- Ensure server is running

**Environment issues?**
- Make sure .env file exists
- Check .env has correct Stripe keys
- Verify .env is not committed to Git

### 📞 Support

Your payment system is production-ready! The server handles:
- Payment processing
- Subscription management  
- Error handling
- Security measures
- Webhook confirmation
- Multiple payment methods

**Test it now**: Run `npm start` and visit http://localhost:3000/donate.html

🎉 **Your animal rights organization can now accept donations securely worldwide!**

### 🔗 Important Files

- **`donate.html`** - Main donation page with all payment options
- **`server.js`** - Backend server handling payments
- **`.env.example`** - Template for environment variables
- **`config.js`** - Non-sensitive configuration
- **`SECURITY.md`** - Security guidelines and best practices