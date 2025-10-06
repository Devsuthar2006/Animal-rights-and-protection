const express = require('express');
require('dotenv').config(); // Load environment variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://api.qrserver.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://api.stripe.com"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Payment-specific rate limiting
const paymentLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 payment requests per minute
    message: 'Too many payment attempts, please try again later.'
});

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com', 'https://www.your-domain.com']
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.static('.'));
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Serve static files (your HTML pages)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    stripe: process.env.STRIPE_SECRET_KEY ? 'Connected' : 'Not configured',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Create payment intent endpoint
app.post('/create-payment-intent', paymentLimiter, async (req, res) => {
  try {
    const { amount, currency = 'usd', isMonthly, customerInfo } = req.body;
    
    // Validation
    if (!amount || amount < 1 || amount > 50000) {
      return res.status(400).json({
        error: { message: 'Invalid amount. Must be between $1 and $50,000.' }
      });
    }

    if (!customerInfo || !customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
      return res.status(400).json({
        error: { message: 'Customer information is required.' }
      });
    }

    console.log('Creating payment intent for:', customerInfo.firstName, customerInfo.lastName);
    console.log('Amount:', amount, 'Currency:', currency, 'Monthly:', isMonthly);
    
    if (isMonthly) {
      // Create customer first for subscriptions
      const customer = await stripe.customers.create({
        email: customerInfo.email,
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        phone: customerInfo.phone,
        metadata: {
          source: 'Animal Rights Website',
          donationType: 'monthly'
        }
      });
      
      console.log('Created customer:', customer.id);
      
      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price_data: {
            currency: currency,
            product_data: {
              name: 'Monthly Donation - Animal Rights & Protection',
              description: 'Monthly recurring donation to support animal welfare',
              images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80']
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
            recurring: {
              interval: 'month'
            }
          }
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          donorName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          donorEmail: customerInfo.email,
          donationType: 'monthly-subscription'
        }
      });
      
      console.log('Created subscription:', subscription.id);
      
      res.json({
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        subscriptionId: subscription.id,
        customerId: customer.id
      });
      
    } else {
      // Create one-time payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: customerInfo.email,
        metadata: {
          donorName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          donorEmail: customerInfo.email,
          donorPhone: customerInfo.phone || '',
          donorMessage: customerInfo.message || '',
          donationType: 'one-time',
          source: 'Animal Rights Website'
        },
        description: `Donation from ${customerInfo.firstName} ${customerInfo.lastName} - Animal Rights & Protection`
      });
      
      console.log('Created payment intent:', paymentIntent.id);
      
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    }
    
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(400).json({
      error: {
        message: error.message,
        type: error.type || 'api_error'
      }
    });
  }
});

// Get payment status
app.get('/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.paymentIntentId);
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      created: new Date(paymentIntent.created * 1000)
    });
  } catch (error) {
    console.error('Error retrieving payment:', error);
    res.status(400).json({ error: error.message });
  }
});

// Webhook endpoint for Stripe events
app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Use webhook secret from environment variables
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return res.status(400).send('Webhook secret not configured');
    }
    
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  console.log('Received webhook event:', event.type);
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ One-time payment succeeded!');
      console.log(`Amount: $${paymentIntent.amount / 100}`);
      console.log(`Donor: ${paymentIntent.metadata.donorName}`);
      console.log(`Email: ${paymentIntent.metadata.donorEmail}`);
      
      // TODO: Send thank you email
      // TODO: Update your database
      // TODO: Send receipt
      
      break;
      
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('✅ Monthly donation payment succeeded!');
      console.log(`Amount: $${invoice.amount_paid / 100}`);
      console.log(`Subscription: ${invoice.subscription}`);
      
      // TODO: Send monthly thank you email
      // TODO: Update subscriber status
      
      break;
      
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('🔄 New monthly subscription created!');
      console.log(`Subscription ID: ${subscription.id}`);
      console.log(`Customer ID: ${subscription.customer}`);
      
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('❌ Payment failed!');
      console.log(`Payment ID: ${failedPayment.id}`);
      console.log(`Error: ${failedPayment.last_payment_error?.message}`);
      
      // TODO: Send payment failure notification
      
      break;
      
    case 'customer.subscription.deleted':
      const canceledSubscription = event.data.object;
      console.log('🛑 Subscription canceled:', canceledSubscription.id);
      
      // TODO: Handle subscription cancellation
      
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
  console.log('💳 Stripe integration:', process.env.STRIPE_SECRET_KEY ? 'Active ✅' : 'Not configured ❌');
  console.log('🌐 Visit http://localhost:3000 to view your website');
  console.log('📊 Health check: http://localhost:3000/health');
  console.log('🔒 Environment:', process.env.NODE_ENV || 'development');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Server shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Server shutting down gracefully...');
  process.exit(0);
});