# 3DNC Store Setup Guide

## Overview
This is a scalable ecommerce store built to start with Craftcloud3D manual fulfillment and easily upgrade to automated fulfillment with Shapeways or Slant3D.

## Access Points

### Customer Facing
- **Store:** `/store.html` (not in navbar - access directly)
- **Product Pages:** `/store/product.html?id={product-id}`
- **Checkout:** `/store/checkout.html`

### Admin Dashboard
- **URL:** `/secretstorebackdoor.html`
- **Default Password:** `changeme123`
- **⚠️ IMPORTANT:** Change this password immediately in Settings!

## Getting Started

### 1. Admin Setup
1. Navigate to `/secretstorebackdoor.html`
2. Login with default password
3. Go to Settings and:
   - Change admin password
   - Set your notification email
   - Adjust tax rate and shipping
   - Keep Craftcloud3D selected initially

### 2. Add Products
1. In admin dashboard, go to Products tab
2. Click "+ Add Product"
3. Fill in product details:
   - Name, description, price
   - Category (Parts, Accessories, Tools, Custom)
   - Material and color
   - Upload image to `/images/store/` first
   - Add STL file path if available
4. Save product

### 3. Managing Orders
Currently orders are sent to your email. You'll receive:
- Customer contact information
- Order details and items
- Manual fulfillment instructions

**Order Process:**
1. Customer submits order on checkout page
2. You receive email with order details
3. Upload STL files to Craftcloud3D manually
4. Get quote and place order
5. Craftcloud ships directly to customer
6. Send payment request to customer (PayPal/Venmo/Bitcoin on-chain/Lightning)

## Fulfillment Providers

### Craftcloud3D (Current - FREE)
- **Cost:** $0 fees, just manufacturing cost
- **Process:** Manual order fulfillment
- **Best for:** Starting out, testing market
- **Setup:** No API key needed

### Shapeways API (Upgrade Option)
- **Cost:** 5% transaction fee
- **Process:** Semi-automated via API
- **Best for:** 50-500 orders/month
- **Setup:** Get API key from Shapeways, add in Settings

### Slant3D Teleport (Scale Option)
- **Cost:** Contact for pricing
- **Process:** Fully automated
- **Best for:** 500+ orders/month
- **Setup:** Get API key from Slant3D, add in Settings

## File Structure
```
/store.html                 - Main store page
/secretstorebackdoor.html   - Admin dashboard
/store/
  products.json             - Product database
  product.html              - Product detail template
  checkout.html             - Checkout page
/css/store.css              - Store styles
/js/store.js                - Store functionality
/js/store-admin.js          - Admin functionality
/images/store/              - Product images (create this folder)
```

## Adding Products - Step by Step

1. **Prepare Product:**
   - Create or obtain STL file
   - Take/find product image (recommended: 800x800px)
   - Upload image to `/images/store/your-product.jpg`
   - Calculate pricing (cost + markup)

2. **Add in Admin:**
   - Login to admin dashboard
   - Click "Add Product"
   - Fill all fields
   - Set "In Stock" if ready to sell
   - Mark "Featured" for homepage display

3. **Save and Download:**
   - After saving, click "Download products.json"
   - Replace `/store/products.json` with downloaded file
   - Refresh store page to see changes

## Pricing Strategy

### Craftcloud3D Phase:
1. Upload STL to Craftcloud3D
2. Get manufacturing quote (e.g., $8)
3. Add your markup (e.g., 2.5x = $20)
4. Set product price at $20
5. Profit: $12 per sale

### Formula:
```
Retail Price = (Manufacturing Cost × Markup) + Shipping Buffer
Example: ($8 × 2.5) + $0 = $20
```

## Upgrading Fulfillment

### When to Upgrade to Shapeways:
- Processing 50+ orders/month manually is tedious
- Want semi-automation
- Willing to pay 5% for convenience

### When to Upgrade to Slant3D:
- Processing 500+ orders/month
- Need full automation
- Want print-on-demand integration

### Migration Steps:
1. Login to admin dashboard
2. Go to Settings
3. Enter API key for new provider
4. Select new provider as active
5. Test with one order
6. Switch all products over

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change Default Password Immediately**
2. **Admin URL:** The URL `/secretstorebackdoor.html` is "security through obscurity" - not true security
3. **For Production:** Implement proper authentication:
   - Backend server with user sessions
   - Database for products (not JSON file)
   - Proper password hashing
   - HTTPS/SSL certificate

## Future Enhancements

This MVP can be enhanced with:
- Real authentication system
- Database backend (Firebase, MongoDB, etc.)
- Payment processing (Stripe, PayPal)
- Order tracking dashboard
- Automated email notifications
- Customer accounts
- Inventory management
- Analytics dashboard

## Troubleshooting

**Products not showing:**
- Check browser console for errors
- Verify `products.json` is valid JSON
- Ensure file paths are correct

**Can't login to admin:**
- Check password in `products.json`
- Clear browser cache
- Check browser console

**Images not loading:**
- Verify images exist in `/images/store/`
- Check file paths in product data
- Ensure correct file extensions

## Support

For issues or questions:
- Check browser console for errors
- Review this README
- Verify all file paths are correct
- Ensure JSON syntax is valid

## Cost Breakdown Example

**Monthly Costs (Starting Out with Craftcloud3D):**
- Platform: $0 (static HTML)
- Fulfillment: $0 (no fees, pay per order)
- Hosting: $0-10/month (GitHub Pages, Netlify, etc.)
- Domain: $12/year
- SSL: Free (Let's Encrypt)

**Total: ~$10-20/month maximum**

Compare to:
- Shopify: $29-299/month
- WooCommerce: $15-50/month (hosting + plugins)
- Printful/Printify: 20-30% fees per order

## Next Steps

1. ✅ Change admin password
2. ✅ Add your first product
3. ✅ Test the checkout flow
4. ✅ Set up email forwarding
5. ✅ Add more products
6. 📢 Add link to navbar when ready to go live
7. 📈 Start marketing!
