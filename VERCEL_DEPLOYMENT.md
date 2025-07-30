# 🚀 Vercel Frontend + Railway Backend Deployment Guide

## 📋 Overview
This guide will help you deploy the React frontend to Vercel while keeping the Node.js backend on Railway.

## 🎯 Benefits of Vercel for Frontend
- **Fast CDN** - Global edge network
- **Automatic HTTPS** - SSL certificates included
- **Zero Configuration** - Works out of the box with React/Vite
- **Preview Deployments** - Automatic previews for PRs
- **No Port Issues** - No more 502 Bad Gateway errors!

## 🔧 Setup Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Configure Environment Variables
In your Vercel dashboard or via CLI, set:
```
VITE_API_BASE_URL=https://your-railway-backend-url.railway.app/api
```

### 3. Deploy to Vercel

#### Option A: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable `VITE_API_BASE_URL`
5. Deploy!

#### Option B: Vercel CLI
```bash
cd frontend
vercel
```

### 4. Update Railway Backend CORS
Add your Vercel domain to Railway backend CORS:

```javascript
// In backend/server.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
```

## 🔗 Connecting Frontend to Railway Backend

### Environment Variables
```bash
# Vercel Environment Variables
VITE_API_BASE_URL=https://your-railway-backend-url.railway.app/api
```

### API Configuration
The frontend is already configured to use Railway backend:
- `frontend/src/services/api.js` - API service
- `frontend/src/utils/image.jsx` - Image URLs
- `frontend/vercel.json` - Vercel configuration

## 🚀 Deployment Commands

### Deploy Frontend to Vercel
```bash
cd frontend
vercel --prod
```

### Update Railway Backend CORS
```bash
# After getting your Vercel URL, update backend CORS
git add .
git commit -m "Update CORS for Vercel frontend"
git push origin deployment
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Add Vercel domain to Railway backend CORS
   - Check environment variables

2. **Image Loading Issues**
   - Ensure `VITE_API_BASE_URL` is set correctly
   - Check Railway backend uploads directory

3. **API Connection Issues**
   - Verify Railway backend is running
   - Check Railway backend URL in environment variables

### Debug Commands
```bash
# Check Vercel deployment
vercel ls

# Check environment variables
vercel env ls

# Redeploy with debug
vercel --debug
```

## 📊 Monitoring

### Vercel Analytics
- Automatic performance monitoring
- Real-time analytics
- Error tracking

### Railway Backend Monitoring
- Check Railway dashboard for backend status
- Monitor API response times
- Check database connections

## 🎉 Success Indicators

✅ **Frontend loads without errors**
✅ **Images display correctly**
✅ **API calls work**
✅ **Authentication works**
✅ **Voting functionality works**

## 🔄 Continuous Deployment

### Automatic Deployments
- Push to `main` branch = automatic Vercel deployment
- Railway backend auto-deploys from `deployment` branch

### Manual Deployments
```bash
# Frontend
cd frontend && vercel --prod

# Backend
git push origin deployment
```

## 📝 Notes

- Vercel handles all the complex server setup
- No more Docker issues or port conflicts
- Automatic HTTPS and CDN included
- Much faster deployment and updates
- Better error handling and monitoring

## 🆘 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test Railway backend separately
4. Check CORS configuration 