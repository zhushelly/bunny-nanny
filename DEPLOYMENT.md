# Deployment Guide - Bunny Nanny

This guide walks you through deploying the Bunny Nanny application with the backend on Railway and the frontend on Vercel.

## Prerequisites

1. GitHub account
2. Railway account (https://railway.app)
3. Vercel account (https://vercel.com)
4. Firebase project with Firestore and Storage enabled
5. Google Maps API key

## Part 1: Backend Deployment on Railway

### Step 1: Prepare the Backend for Deployment

The backend code has been updated to support Railway deployment with the following changes:
- Port configuration from environment variable
- CORS configuration for production domains
- Firebase service account from environment variable
- Health check endpoint at `/health`

### Step 2: Prepare Firebase Service Account

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key" and download the JSON file
3. Convert the JSON to a single-line string (you'll need this for Railway):
   ```bash
   # On Mac/Linux:
   cat serviceAccountKey.json | jq -c '.'

   # Or use an online JSON minifier
   ```

### Step 3: Deploy to Railway

1. **Create a new GitHub repository for the backend:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin https://github.com/YOUR_USERNAME/bunny-nanny-backend.git
   git push -u origin main
   ```

2. **Set up Railway:**
   - Go to https://railway.app
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your backend repository
   - Railway will automatically detect it's a Node.js app

3. **Configure Environment Variables in Railway:**
   - Go to your project settings → Variables
   - Add the following variables:

   ```
   NODE_ENV=production
   FIREBASE_SERVICE_ACCOUNT=<paste your minified JSON here>
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```

   Note: Railway automatically provides the PORT variable

4. **Deploy:**
   - Railway will automatically deploy when you push to GitHub
   - Your backend will be available at a URL like: `https://your-app.railway.app`
   - Test the health endpoint: `https://your-app.railway.app/health`

### Step 4: Configure Custom Domain (Optional)

1. In Railway project settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Part 2: Frontend Deployment on Vercel

### Step 1: Prepare the Frontend

The frontend has been updated with:
- API service module for centralized API calls
- Environment-based API URL configuration
- Vercel configuration file

### Step 2: Update Environment Variables

1. Copy your current `.env` values to `.env.production`
2. Update `REACT_APP_API_URL` with your Railway backend URL:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

### Step 3: Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will detect it's a Create React App

3. **Configure Environment Variables in Vercel:**
   - In the deployment configuration, add all environment variables:

   ```
   REACT_APP_FIREBASE_API_KEY=your_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

4. **Deploy:**
   - Click "Deploy"
   - Your app will be available at: `https://your-app.vercel.app`

### Step 4: Configure Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

## Part 3: Post-Deployment Configuration

### Update CORS Settings

After your frontend is deployed, update the Railway backend environment variable:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
```

### Configure Firebase Security Rules

1. **Firestore Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to nanny collection
       match /nanny/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

2. **Storage Rules:**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /profilePhotos/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null
           && request.resource.size < 5 * 1024 * 1024; // 5MB limit
       }
     }
   }
   ```

### Configure Google Maps API Restrictions

1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Click on your API key
4. Add application restrictions:
   - HTTP referrers
   - Add your production domains:
     - `https://your-app.vercel.app/*`
     - `https://your-custom-domain.com/*`

## Monitoring and Maintenance

### Railway Monitoring

- View logs: Railway Dashboard → Your Project → Logs
- Monitor metrics: Railway Dashboard → Your Project → Metrics
- Set up alerts for downtime

### Vercel Monitoring

- View deployment logs: Vercel Dashboard → Your Project → Functions
- Monitor analytics: Vercel Dashboard → Your Project → Analytics
- Set up error tracking with Vercel Analytics

### Debugging Common Issues

1. **CORS Errors:**
   - Ensure `ALLOWED_ORIGINS` in Railway includes your Vercel URL
   - Check that the frontend is using the correct API URL

2. **Firebase Authentication Issues:**
   - Verify Firebase configuration in Vercel environment variables
   - Check Firebase Console for authentication errors

3. **API Connection Issues:**
   - Test the Railway backend health endpoint
   - Verify `REACT_APP_API_URL` is set correctly in Vercel

4. **Google Maps Not Loading:**
   - Verify API key restrictions
   - Check browser console for errors

## Continuous Deployment

### Backend (Railway)

Railway automatically deploys when you push to the connected GitHub branch:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

### Frontend (Vercel)

Vercel automatically deploys when you push to the connected GitHub branch:

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

## Rollback Procedures

### Railway Rollback

1. Go to Railway Dashboard → Your Project → Deployments
2. Find the previous working deployment
3. Click "Rollback to this deployment"

### Vercel Rollback

1. Go to Vercel Dashboard → Your Project → Deployments
2. Find the previous working deployment
3. Click the three dots → "Promote to Production"

## Security Checklist

- [ ] Firebase service account is stored as environment variable, not in code
- [ ] All API keys are in environment variables
- [ ] CORS is configured to only allow your production domains
- [ ] Firebase security rules are properly configured
- [ ] Google Maps API key is restricted to your domains
- [ ] HTTPS is enabled on both Railway and Vercel (automatic)
- [ ] Sensitive files are in .gitignore

## Support and Troubleshooting

### Railway
- Documentation: https://docs.railway.app
- Community: https://discord.gg/railway
- Status: https://status.railway.app

### Vercel
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/next.js/discussions
- Status: https://vercel-status.com

### Firebase
- Documentation: https://firebase.google.com/docs
- Console: https://console.firebase.google.com
- Status: https://status.firebase.google.com

## Cost Considerations

### Railway
- Free tier: $5 credit per month
- Pricing: https://railway.app/pricing

### Vercel
- Free tier: Suitable for personal projects
- Pricing: https://vercel.com/pricing

### Firebase
- Free tier: Generous limits for small apps
- Pricing: https://firebase.google.com/pricing

---

Remember to test your application thoroughly after deployment and monitor logs for any issues!