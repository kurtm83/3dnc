# gcode.supply Pre-Launch Checklist

## 🚨 CRITICAL - Must Complete Before Launch

### 1. Domain Configuration
- [ ] **Update CNAME file**: Change from `preview.gcode.supply` to `gcode.supply` (or `www.gcode.supply`)
  - File location: `CNAME` in root directory
  - Current value: `preview.gcode.supply`
  - Should be: `gcode.supply` OR `www.gcode.supply` (choose one)

### 2. GitHub Pages Settings
- [ ] Verify repository is public (or upgrade to GitHub Pro for private repos)
- [ ] Enable GitHub Pages in repository Settings > Pages
- [ ] Set source branch (usually `main` or `master`)
- [ ] Ensure "Enforce HTTPS" is enabled
- [ ] Wait for DNS propagation (can take 24-48 hours)

### 3. DNS Configuration (at your domain registrar)
If using apex domain (gcode.supply):
- [ ] Add A records pointing to GitHub Pages IPs:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

To make www.gcode.supply also work (recommended):
- [ ] Add CNAME record: `www` → `kurtm83.github.io`
- [ ] This will redirect www.gcode.supply to gcode.supply automatically

## ✅ Already Configured (Should be Good)

### Content
- ✅ YouTube API key configured and restricted (AIzaSyDW_j3p_EgbFKevryeBZWrq69WD-a6yFBg)
- ✅ API restrictions set for: localhost:5500, 127.0.0.1:5500, gcode.supply
- ✅ Formspree contact form configured (xaqdblee)
- ✅ Gallery videos configured (6 videos in youtube-videos.txt)
- ✅ Featured project configured in featured-project.txt
- ✅ All project images added (drawer pull original, print, completed)
- ✅ Services page with randomized video playlist
- ✅ Thank you page for form submissions
- ✅ Mobile navigation working
- ✅ Mobile responsive design fixed

### Technical
- ✅ All navigation links working
- ✅ Smooth scrolling for anchor links
- ✅ YouTube metadata loading automatically
- ✅ Contact form redirects to thank-you.html
- ✅ All HTML/CSS/JS files in place

## 📝 Optional Enhancements (Can Do Later)

### Content
- [ ] Add meta descriptions for SEO (in `<head>` of each HTML file)
- [ ] Add Open Graph tags for social media sharing
- [ ] Create favicon.ico for browser tabs
- [ ] Add Google Analytics tracking code (if desired)
- [ ] Create sitemap.xml for search engines
- [ ] Add robots.txt file

### Portfolio Section
- [ ] Delete `portfolio/index.html` if not using it (currently just placeholder)
- [ ] Or replace with actual portfolio content

### Images
- [ ] Optimize all images for web (compress, resize)
- [ ] Add WebP versions for better performance
- [ ] Consider lazy loading for images

## 🚀 Launch Steps

1. **Update CNAME**
   - Edit the CNAME file
   - Change `preview.gcode.supply` to `gcode.supply`
   - Commit and push to GitHub

2. **Configure DNS**
   - Log into your domain registrar (where you bought gcode.supply)
   - Add the A records or CNAME record as listed above
   - Save changes

3. **Enable GitHub Pages**
   - Go to your GitHub repository
   - Settings > Pages
   - Select source branch (main/master)
   - Save
   - Custom domain: `gcode.supply`
   - Wait for SSL certificate to provision (can take a few minutes)

4. **Test**
   - Wait 10-15 minutes after enabling GitHub Pages
   - Visit https://gcode.supply
   - Test all pages and links
   - Test contact form submission
   - Test on mobile device
   - Clear cache and test again (Ctrl+F5)

5. **DNS Propagation**
   - Full propagation can take 24-48 hours
   - Check status at: https://www.whatsmydns.net/
   - Enter your domain to see global DNS status

## 📞 Support

If you need help with:
- **GitHub Pages**: https://docs.github.com/en/pages
- **DNS Configuration**: Contact your domain registrar's support
- **YouTube API**: https://console.cloud.google.com/
- **Formspree**: https://formspree.io/

## Current Status Summary

✅ **Working**: Site structure, content, mobile navigation, gallery, services, contact form, all images
🔴 **Blocking**: CNAME needs update for production domain
🟡 **Optional**: SEO tags, analytics, image optimization

**Estimated time to launch**: 15 minutes (update CNAME + enable GitHub Pages) + DNS propagation time
