# Anime Recommendation Frontend - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Method 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your `animerec` repository
   - Vercel will auto-detect it's a React app

3. **Configure Environment Variables:**
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add: `REACT_APP_FLASK_API_URL` = `https://anime-recommend-backend.vercel.app`
   - Set for: Production, Preview, and Development

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a live URL like: `https://animerec-yourusername.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   cd "d:\coding\TryingCopilot\animerec"
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name: `anime-recommend-frontend` (or your choice)
   - Directory: `./` (current directory)

5. **Set environment variable:**
   ```bash
   vercel env add REACT_APP_FLASK_API_URL production
   # Enter: https://anime-recommend-backend.vercel.app
   ```

6. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

## 🔧 Project Configuration

### Build Settings (Auto-detected by Vercel)
- **Framework Preset:** Create React App
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### Environment Variables Required:
| Variable | Value | Description |
|----------|--------|-------------|
| `REACT_APP_FLASK_API_URL` | `https://anime-recommend-backend.vercel.app` | Your Flask API endpoint |

## 📝 Deployment Checklist

- [x] Updated `.gitignore` for Vercel
- [x] Created `vercel.json` configuration
- [x] Environment variables configured
- [x] Flask API URL properly set
- [x] Build optimization enabled
- [x] Security headers configured

## 🎯 Post-Deployment

1. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Performance Monitoring:**
   - Vercel provides analytics in the dashboard
   - Monitor build times and deployment success

3. **Auto-Deployments:**
   - Every push to `main` branch will trigger a new deployment
   - Preview deployments for pull requests

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Check for syntax errors

2. **Environment Variables Not Working:**
   - Ensure variables start with `REACT_APP_`
   - Redeploy after adding environment variables
   - Check they're set for the correct environment

3. **API Requests Failing:**
   - Verify Flask API URL is correct
   - Check CORS configuration on Flask backend
   - Test API endpoints directly

4. **Images Not Loading:**
   - Check console for CORS errors
   - Verify image URLs are accessible
   - Test with placeholder images

## 📱 Mobile Optimization

Your app is already mobile-responsive with:
- Responsive Material-UI components
- Mobile-friendly card layouts
- Touch-friendly interactions
- Proper viewport configuration

## 🚦 Go Live!

Once deployed, your anime recommendation app will be available at:
`https://your-project-name.vercel.app`

Share this URL to let others discover amazing anime recommendations powered by your ML model! 🎌✨