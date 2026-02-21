# Product Creation Guide

## Enhanced Admin Dashboard

The store admin dashboard now includes a powerful product creation interface with drag-and-drop media uploads, material options, and pricing management.

## Accessing the Admin Dashboard

1. Navigate to `/secretstorebackdoor.html`
2. Enter your admin password (default: `changeme123` - please change this!)
3. Click on the **Products** tab
4. Click **+ Add Product** to create a new listing

## Creating a Product Listing

### 1. Product Media (Left Column)

#### Images
- **Drag & Drop Zone**: Drag multiple images directly onto the upload area, or click to browse
- **Primary Image**: The first image uploaded becomes the primary/featured image
- **Preview Grid**: All uploaded images appear in a grid with a "Primary" badge on the first image
- **Remove Images**: Click the × button on any image to remove it
- **Best Practice**: Upload high-quality photos of your PLA prototypes

#### Timelapse Video
- **Video Upload**: Add a timelapse video of the print process
- **Format**: Supports MP4 and most common video formats
- **Purpose**: Showcases the manufacturing process and emphasizes PLA prototyping
- **Display**: Video appears below the main product image on the product page

### 2. Product Details (Right Column)

#### Basic Information
- **Product Name** *: Clear, descriptive name
- **Description** *: Detailed description of the product, features, and use cases
- **Category** *: Select from Parts, Accessories, Tools, or Custom
- **Dimensions**: Size specifications (e.g., "50mm x 50mm x 25mm")

#### Pricing & Materials

##### Base Price - PLA
- **Price** *: Set the base price for PLA material
- This is your default material and the one used for prototypes
- All other materials are priced as a percentage markup over this base price

##### PLA Color Options
- List available PLA colors (comma-separated)
- Example: "Black, White, Red, Blue, Green"
- These are the colors you can produce in-house

##### Additional Material Options

The system supports offering alternative materials through your fulfillment partner (Craftcloud3D):

1. **PETG**
   - Check the box to enable PETG as an option
   - Enter percentage markup (e.g., "20" for 20% more than PLA)
   - Example: $10 PLA base + 20% = $12 PETG

2. **ABS**
   - Check the box to enable ABS as an option
   - Enter percentage markup (e.g., "25" for 25% more than PLA)
   - Example: $10 PLA base + 25% = $12.50 ABS

3. **Other/Custom Material**
   - Check the box to enable a custom material
   - Enter the material name (e.g., "TPU", "Nylon", "Wood PLA")
   - Enter percentage markup
   - Useful for specialty materials

**Pricing Strategy**:
- Keep markups simple (10%, 20%, 25%, 30%)
- Research Craftcloud3D material costs to ensure profitability
- PLA is always emphasized as the prototyped material

#### Other Settings
- **STL File Path**: Optional link to the 3D model file
- **In Stock/Available**: Check if the product is available for purchase
- **Featured Product**: Check to highlight this product on the store homepage

### 3. Saving Your Product

1. Click **Save Product**
2. You'll see an alert reminding you to download the updated `products.json` file
3. Click the **Download JSON** button that appears at the top of the page
4. Replace `/store/products.json` with the downloaded file
5. The product now appears in your store!

## How Materials Display to Customers

### Product Detail Page

When a customer views a product with multiple material options:

1. **Material Options Section** appears with radio buttons
2. **PLA is pre-selected** and marked with a green "PROTOTYPED" badge
3. Each material shows its calculated price
4. **Price updates dynamically** when customer selects a different material
5. Green callout emphasizes: "🌱 PLA is our default material - eco-friendly and perfect for most applications. All items are prototyped in PLA."

### Timelapse Video

If you uploaded a timelapse video:
- Appears below the main product image
- Labeled "⏱️ Timelapse - PLA Prototype"
- Video player with standard controls
- Showcases your printing process and quality

### Shopping Cart & Checkout

- Cart items show the selected material: "Product Name (PETG)"
- Price reflects the material-specific pricing
- Each material variant is tracked separately in the cart
- Checkout summary shows material selections

## Best Practices

### Photography
- Use consistent lighting and backgrounds
- Show product from multiple angles
- Include scale references when helpful
- Highlight unique features

### Video Timelapses
- Keep videos short (30-90 seconds)
- Show full print process or most interesting parts
- Good lighting and camera positioning
- Compress videos to reasonable file sizes

### Material Pricing
1. **Research First**: Check Craftcloud3D for actual material costs
2. **Simple Markups**: Use round percentages (10%, 20%, 25%, 30%)
3. **PLA Emphasis**: Always present PLA as the default/recommended option
4. **Limited Options**: Don't overwhelm customers - 2-4 material options is ideal

### Descriptions
- Emphasize that prototypes are made in PLA
- Mention print quality and layer height
- List practical applications
- Note if other materials offer specific benefits (PETG for outdoors, etc.)

## Material Pricing Examples

### Example 1: Simple Bracket
- PLA Base: $8.00
- PETG: $9.60 (20% markup)
- ABS: $10.00 (25% markup)

### Example 2: Lamp Shade
- PLA Base: $25.00
- PETG: $27.50 (10% markup - less price-sensitive)
- TPU/Flexible: $32.50 (30% markup - specialty option)

### Example 3: Custom Part
- PLA Base: $15.00
- PETG: $18.00 (20% markup)
- ABS: $19.50 (30% markup)
- Nylon: $22.50 (50% markup - high-performance option)

## Technical Notes

### File Storage
- **Images**: Stored as base64 data URLs in `products.json`
- **Videos**: Stored as base64 data URLs in `products.json`
- **Warning**: Large files will increase JSON file size
- **Recommendation**: Optimize images (max 1MB each) and compress videos

### Browser Compatibility
- Drag-and-drop works in all modern browsers
- Mobile: Use "click to browse" functionality
- Progressive enhancement ensures fallback support

### Data Persistence
- Products are saved to localStorage initially
- **Must download and replace products.json** to persist changes
- Admin dashboard provides download button automatically
- Future: Backend integration will automate persistence

## Troubleshooting

### Images not uploading
- Check file format (JPG, PNG, GIF, WebP supported)
- Reduce file sizes if dragging multiple large images
- Try clicking the zone instead of dragging

### Video not displaying
- Ensure video is in MP4 format (most compatible)
- Compress large videos (under 10MB recommended)
- Check browser console for specific errors

### Material prices not calculating
- Ensure base PLA price is set
- Verify markup percentages are numbers (not text)
- Check that material checkbox is enabled

### Changes not appearing on storefront
- Did you download the updated products.json?
- Did you replace the file in /store/ folder?
- Try hard-refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for loading errors

## Next Steps

### Phase 1 (Current)
- ✅ Drag-and-drop image uploads
- ✅ Video timelapse support
- ✅ Material options with dynamic pricing
- ✅ PLA emphasis throughout

### Phase 2 (Future Enhancement)
- Backend API for automatic persistence
- Image compression and optimization
- Bulk product import/export
- Customer material preferences tracking
- Analytics on material selection trends

### Phase 3 (Advanced)
- Direct Craftcloud3D API integration
- Real-time material cost updates
- Automated fulfillment based on material
- Custom material profiles per product category
- International pricing and currency support

## Support

For questions or issues with product creation:
1. Check this guide first
2. Review STORE-README.md for general store setup
3. Check browser console for technical errors
4. Test with simple products first before complex listings
