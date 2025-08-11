# GitHub Actions Setup for Kooreh

This directory contains GitHub Actions workflows for the Kooreh project. The workflows are configured to work with the project structure where the main source code is located in the `koor/` directory.

## Workflows

### 1. Main CI/CD (`main.yml`)
- **Triggers**: Push/PR to main, master, or develop branches
- **Path filters**: Only runs when files in `koor/**` or `.github/workflows/**` change
- **Jobs**:
  - `test`: Runs tests, linting, and builds the project
  - `deploy-staging`: Deploys to staging on develop branch
  - `deploy-production`: Deploys to production on main/master branch

### 2. Firebase Deploy (`firebase-deploy.yml`)
- **Triggers**: Push to main/master branches or manual workflow dispatch
- **Path filters**: Only runs when files in `koor/**` or `.github/workflows/**` change
- **Jobs**:
  - `deploy`: Deploys to Firebase Hosting, Cloud Functions, and Firestore Rules

## Key Configuration

### Source Directory
The workflows are configured to work with the `koor/` directory structure:

```yaml
env:
  SOURCE_DIR: './koor'
```

### Path Filters
Workflows only trigger when relevant files change:

```yaml
paths:
  - 'koor/**'           # Any file in the koor directory
  - '.github/workflows/**'  # Workflow file changes
```

### Working Directory
All npm commands use the correct working directory:

```yaml
working-directory: ${{ env.SOURCE_DIR }}
```

## Setup Instructions

### 1. Repository Structure
Ensure your repository has this structure:
```
your-repo/
├── .github/
│   └── workflows/
│       ├── main.yml
│       └── firebase-deploy.yml
├── koor/                    # Main project directory
│   ├── package.json
│   ├── server.js
│   ├── public/
│   └── ...
└── README.md
```

### 2. Required Secrets
Set these secrets in your GitHub repository settings:

#### For Firebase Deployment:
- `FIREBASE_TOKEN`: Your Firebase CI token
  - Generate with: `firebase login:ci`
  - Or: `firebase login:ci --no-localhost`

**Note**: This project requires Node.js 20+ due to Firebase and other dependencies.

#### Optional Environment Secrets:
- `STAGING_FIREBASE_TOKEN`: Separate token for staging
- `PRODUCTION_FIREBASE_TOKEN`: Separate token for production

### 3. Firebase Configuration
Ensure your `koor/firebase-config/.firebaserc` has the correct project IDs:

```json
{
  "projects": {
    "default": "your-production-project-id",
    "staging": "your-staging-project-id"
  }
}
```

## Usage

### Automatic Triggers
- **Push to develop**: Runs tests and deploys to staging
- **Push to main/master**: Runs tests and deploys to production
- **Pull Request**: Runs tests only

### Manual Deployment
1. Go to Actions tab in GitHub
2. Select "Firebase Deploy" workflow
3. Click "Run workflow"
4. Choose environment (staging/production)
5. Click "Run workflow"

## Customization

### Adding New Paths
If you want to trigger workflows for other directories:

```yaml
paths:
  - 'koor/**'
  - 'shared/**'           # Add shared components
  - 'docs/**'             # Add documentation
  - '.github/workflows/**'
```

### Environment-Specific Deployments
Modify the Firebase deploy workflow to use different projects:

```yaml
- name: Set Firebase Project
  run: |
    if [ "$ENV" = "staging" ]; then
      firebase use staging --token $FIREBASE_TOKEN
    else
      firebase use production --token $FIREBASE_TOKEN
    fi
```

### Adding More Jobs
You can add additional jobs like:

```yaml
security-scan:
  needs: test
  runs-on: ubuntu-latest
  steps:
    - name: Security scan
      working-directory: ${{ env.SOURCE_DIR }}
      run: npm audit
```

## Troubleshooting

### Common Issues

1. **Workflow not triggering**
   - Check path filters in workflow file
   - Ensure files are in the `koor/` directory
   - Verify branch names match

2. **Build failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in `package.json`
   - Check for syntax errors in source code

3. **Firebase deployment failures**
   - Verify `FIREBASE_TOKEN` secret is set
   - Check Firebase project configuration
   - Ensure Firebase CLI is accessible

### Debug Information
Workflows include debug steps that show:
- Current working directory
- Directory contents
- Environment variables

## Best Practices

1. **Keep workflows focused**: Each workflow should have a single responsibility
2. **Use path filters**: Only run workflows when relevant files change
3. **Cache dependencies**: Use npm cache to speed up builds
4. **Environment separation**: Use different Firebase projects for staging/production
5. **Manual triggers**: Allow manual deployment for testing

## Support

If you encounter issues:
1. Check the Actions tab for detailed logs
2. Verify all secrets are properly configured
3. Ensure Firebase project setup is correct
4. Check for syntax errors in workflow files
