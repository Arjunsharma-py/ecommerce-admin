# Product Image Upload Guide

## Overview

The admin panel now supports **multiple product images** with two upload methods:
1. **Image URL** (Recommended - Works immediately)
2. **File Upload** (Requires API key setup)

---

## Method 1: Using Image URLs (Recommended)

### Step 1: Upload to Free Image Hosting

#### Option A: Imgur (Best for product images)

1. Go to **https://imgur.com**
2. Click "New post" (no account needed)
3. Upload your product image
4. Right-click the uploaded image → "Copy image address"
5. Paste the URL in the admin panel

**Example URL:**
```
https://i.imgur.com/abc123.jpg
```

#### Option B: ImgBB

1. Go to **https://imgbb.com**
2. Upload image (no account needed)
3. Copy the "Direct link"
4. Paste in admin panel

**Example URL:**
```
https://i.ibb.co/xyz789/product.jpg
```

#### Option C: Unsplash (Free stock photos)

1. Go to **https://unsplash.com**
2. Search for product category (e.g., "laptop", "shoes")
3. Click on image
4. Click "Download free" button
5. Right-click downloaded image → Upload to Imgur
6. Use Imgur URL

### Step 2: Add Images in Admin Panel

1. Open product create/edit form
2. Scroll to "Add Image URL" field
3. Paste image URL
4. Click "Add" button
5. Image preview will appear
6. Repeat for up to 5 images
7. First image = Primary product image

---

## Method 2: Direct File Upload

### Requirements

To enable file upload, you need an ImgBB API key:

1. Go to **https://api.imgbb.com/**
2. Sign up for free account
3. Get your API key
4. Update `ImageUpload.jsx`:

```javascript
// Line 47 in ImageUpload.jsx
const response = await fetch(
  'https://api.imgbb.com/1/upload?key=YOUR_API_KEY_HERE',
  ...
);
```

Replace `YOUR_API_KEY_HERE` with your actual API key.

### Using File Upload

Once configured:

1. Click the upload area or drag & drop files
2. Select up to 5 images (PNG, JPG, GIF)
3. Images will be uploaded automatically
4. Wait for upload confirmation

---

## Managing Product Images

### Image Grid Features

- **Preview**: See all images in a grid
- **Primary Image**: First image is marked as "Primary"
- **Remove Images**: Hover and click X button
- **Reorder**: Drag images to change order (coming soon)
- **Max Images**: Up to 5 images per product

### Image Requirements

- **Formats**: PNG, JPG, GIF
- **Size**: Up to 10MB per image
- **Dimensions**: Any size (recommended: 800x800 or 1200x1200)
- **Aspect Ratio**: Square works best

### Best Practices

1. **Use high quality images** (at least 800x800px)
2. **White/neutral background** works best
3. **Multiple angles**: Show product from different views
4. **Consistent style**: Use same lighting/background
5. **Compress images** before uploading (use tinypng.com)

---

## Quick Example

### Creating a Product with Images

```
Product: MacBook Pro 16"
Price: $2,499
Category: Laptops

Images:
1. https://i.imgur.com/laptop-front.jpg  (Primary - front view)
2. https://i.imgur.com/laptop-angle.jpg  (Angled view)
3. https://i.imgur.com/laptop-side.jpg   (Side view)
4. https://i.imgur.com/laptop-keyboard.jpg (Keyboard detail)
5. https://i.imgur.com/laptop-ports.jpg  (Ports/connections)
```

---

## Troubleshooting

### Image Not Loading

**Problem**: Image shows "Invalid Image" placeholder

**Solutions**:
- Make sure URL is a direct image link (ends with .jpg, .png, .gif)
- Check if URL is publicly accessible
- Try opening URL in new browser tab
- Use a different image hosting service

### Upload Not Working

**Problem**: File upload shows error

**Solutions**:
- Make sure you've added ImgBB API key
- Check internet connection
- Try using image URL method instead
- Make sure file is under 10MB

### Images Not Saving

**Problem**: Images disappear after saving product

**Solutions**:
- Check browser console for errors
- Verify backend is receiving images array
- Make sure you click "Add" button after pasting URL
- Images must be added before clicking "Create Product"

---

## Alternative: Backend File Upload

For a more permanent solution, implement file upload on your backend:

### Option 1: Local Storage

Store images in `/static/images/` folder:

```python
# Add to FastAPI backend
from fastapi import File, UploadFile
import shutil

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    file_path = f"static/images/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"url": f"/static/images/{file.filename}"}
```

### Option 2: Cloud Storage (AWS S3, Cloudinary)

Use cloud services for scalable image hosting:

- **AWS S3**: https://aws.amazon.com/s3/
- **Cloudinary**: https://cloudinary.com/ (Free tier available)
- **Google Cloud Storage**: https://cloud.google.com/storage

---

## Image Hosting Comparison

| Service | Free Tier | Speed | Reliability | Best For |
|---------|-----------|-------|-------------|----------|
| Imgur | Unlimited | Fast | High | Quick testing |
| ImgBB | 32MB/image | Fast | High | Production |
| Unsplash | Unlimited | Fast | High | Stock photos |
| AWS S3 | 5GB/month | Very Fast | Very High | Large scale |
| Cloudinary | 25GB/month | Fast | High | Production |

---

## Tips for Better Product Images

### Photography Tips

1. **Natural lighting** or soft light box
2. **Clean background** (white/gray works best)
3. **Sharp focus** on product details
4. **Multiple angles** (front, back, sides, top)
5. **Show scale** (include common object for size reference)

### Image Editing

Free tools for image editing:
- **Remove background**: https://remove.bg
- **Resize/compress**: https://tinypng.com
- **Batch editing**: https://www.photopea.com (free Photoshop alternative)

### SEO-Friendly Images

- Use descriptive filenames: `macbook-pro-16-space-gray.jpg`
- Optimize file size (50-200KB ideal)
- Keep consistent dimensions across products
- Add alt text in product description

---

## Need Help?

Common image URLs for testing:

```
https://via.placeholder.com/800x800.png?text=Product+Image
https://picsum.photos/800/800
https://source.unsplash.com/800x800/?product
```

These will generate random placeholder images for testing.

---

**Ready to add amazing product images!** 📸
