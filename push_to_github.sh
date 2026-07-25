#!/bin/bash
# Push changes to Barksdale-Music-Group using GitHub PAT

if [ -z "$GITHUB_TOKEN" ]; then
  echo "=========================================================================="
  echo "⚠️  ERROR: GITHUB_TOKEN environment variable is not defined."
  echo "=========================================================================="
  echo "To push your production-ready Barksdale Music Group workspace to GitHub,"
  echo "please add your GitHub Personal Access Token (PAT) under the Settings menu:"
  echo ""
  echo "1. Go to Settings in your AI Studio Build workspace."
  echo "2. Add a new secret/environment variable named: GITHUB_TOKEN"
  echo "3. Set the value to your GitHub PAT (with 'repo' write permissions)."
  echo "4. Once saved, run './push_to_github.sh' or request pushing again."
  echo "=========================================================================="
  exit 1
fi

echo "🚀 GitHub Personal Access Token detected. Setting up remote authentication..."
# Create a secure authenticated URL (token hidden from standard git configs)
AUTH_URL="https://${GITHUB_TOKEN}@github.com/barksdale410/Barksdale-Music-Group.git"

echo "Staging any final unstaged workspace files..."
git add .

echo "Checking for local commits..."
if git diff-index --quiet HEAD --; then
  echo "No uncommitted local changes."
else
  git commit -m "chore: Synchronized workspace with active development build"
fi

echo "Pushing active 'master' branch to GitHub..."
git push -f "$AUTH_URL" master:master

if [ $? -eq 0 ]; then
  echo "=========================================================================="
  echo "🎉 SUCCESS: Workspace successfully synchronized with Barksdale-Music-Group!"
  echo "=========================================================================="
  exit 0
else
  echo "=========================================================================="
  echo "❌ ERROR: Git push failed. Please verify that your GITHUB_TOKEN has write"
  echo "permissions for the 'barksdale410/Barksdale-Music-Group' repository."
  echo "=========================================================================="
  exit 1
fi
