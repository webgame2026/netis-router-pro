
# Netis Router Pro Deployment Guide

This app is optimized for GitHub Pages and PWA support.

## Automatic Deployment

1.  **Push to GitHub:** Upload all files to a new GitHub repository.
2.  **Add API Key:** 
    *   Go to your Repo Settings -> Secrets and variables -> Actions.
    *   Create a New Repository Secret called `API_KEY` and paste your Gemini API key there.
3.  **Enable Pages:**
    *   Go to Settings -> Pages.
    *   Under "Build and deployment" -> "Source", select **GitHub Actions**.
4.  **Sit back:** The next time you push code, GitHub will automatically build and host your app.

## PWA Installation
Once deployed, open the URL on your phone (Chrome for Android or Safari for iOS). Select "Add to Home Screen" to install it as a native app with the Netis icon.
