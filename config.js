// Configuration for Animal Rights Payment System
// This file contains NON-SENSITIVE configuration only
// Sensitive keys should be in environment variables

const CONFIG = {
    // Stripe Configuration (Publishable key is safe to expose)
    STRIPE: {
        PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PUBLISHABLE_KEY_HERE',
        CURRENCY: 'usd'
    },
    
    // UPI Configuration (Safe to expose)
    UPI: {
        ID: 'suthardevilal132@oksbi',
        DISPLAY_NAME: 'Animal Rights Protection',
        CURRENCY: 'INR',
        USD_TO_INR_RATE: 83 // Approximate conversion rate
    },
    
    // API Endpoints
    API: {
        CREATE_PAYMENT: '/create-payment-intent',
        PAYMENT_STATUS: '/payment-status',
        WEBHOOK: '/webhook'
    },
    
    // UI Configuration
    UI: {
        QR_CODE_SIZE: '250x250',
        DONATION_AMOUNTS: [25, 50, 100, 250, 500],
        ORGANIZATION_NAME: 'Animal Rights & Protection'
    },
    
    // Payment Methods
    PAYMENT_METHODS: {
        STRIPE: {
            name: 'Credit Card',
            icon: 'fas fa-credit-card',
            enabled: true
        },
        PAYPAL: {
            name: 'PayPal',
            icon: 'fab fa-paypal',
            enabled: true
        },
        GOOGLE_PAY: {
            name: 'Google Pay',
            icon: 'fab fa-google-pay',
            enabled: true
        },
        UPI: {
            name: 'UPI/QR',
            icon: 'fas fa-mobile-alt',
            enabled: true
        },
        BANK_TRANSFER: {
            name: 'Bank Transfer',
            icon: 'fas fa-university',
            enabled: true
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}