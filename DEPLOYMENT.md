# Deployment Guide

This guide will help you deploy your Guess Your Spending app to GitHub and Vercel.

## Prerequisites

- Git installed on your computer
- A GitHub account
- A Vercel account (free tier is sufficient)

## Step 1: Initialize Git Repository

If you haven't already initialized a git repository:

```bash
cd /Users/mbcolby/Coding/guess-your-spending
git init
git add .
git commit -m "Initial commit: Guess Your Spending app"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `guess-your-spending`)
4. Choose whether to make it public or private
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 3: Push to GitHub

Copy the commands from GitHub's "push an existing repository" section:

```bash
git remote add origin https://github.com/YOUR_USERNAME/guess-your-spending.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [Vercel](https://vercel.com) and log in
2. Click "Add New" → "Project"
3. Import your GitHub repository (you may need to grant Vercel access to your GitHub account first)
4. Select the `guess-your-spending` repository
5. Vercel will automatically detect it's a Next.js project
6. Click "Deploy"
7. Wait for the deployment to complete (usually takes 1-2 minutes)
8. Your app is now live! 🎉

### Option B: Deploy via Vercel CLI

Install the Vercel CLI:

```bash
npm i -g vercel
```

Deploy from your project directory:

```bash
cd /Users/mbcolby/Coding/guess-your-spending
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- What's your project's name? **guess-your-spending**
- In which directory is your code located? **./**
- Want to override the settings? **N**

Your app will be deployed and you'll get a production URL!

## Step 5: Custom Domain (Optional)

To add a custom domain:

1. Go to your project in the Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure your DNS

## Environment Variables

This app doesn't require any environment variables! Everything runs client-side.

## Updating Your Deployment

Whenever you push changes to your GitHub repository, Vercel will automatically rebuild and redeploy your app:

```bash
git add .
git commit -m "Description of your changes"
git push
```

## Troubleshooting

### Build fails on Vercel
- Check the build logs in the Vercel dashboard
- Make sure all dependencies are listed in `package.json`
- Try building locally first: `npm run build`

### App doesn't load
- Check the browser console for errors
- Verify that the deployment completed successfully in Vercel

### CSV parsing issues
- Make sure the CSV file is in the correct YNAB Register format
- Check that the CSV has the required columns (Payee, Category, Outflow, etc.)

## Support

If you encounter any issues, please open an issue on the GitHub repository.

---

Happy deploying! 🚀

