# DevDeploy - Static GitHub Repository Deployment Tool

A static website that allows users to authenticate with GitHub and deploy their repositories using Walrus or Oasis platforms.

## Features

- 🔐 GitHub OAuth authentication (client-side)
- 📦 Repository listing and selection
- 🚀 Deployment platform selection (Walrus/Oasis)
- 📱 Responsive design with modern UI
- ⚡ Static export ready

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: GitHub OAuth (client-side)
- **Deployment**: Static export compatible

## Getting Started

### Prerequisites

1. Create a GitHub OAuth App:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - **Important**: Set the app type to **"Public"** (not "Confidential")
   - Set Authorization callback URL to: `http://localhost:3001/auth/callback` (for development)
   - Copy the Client ID

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
# GitHub OAuth App credentials (Public app only needs Client ID)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
```

**Note**: Since we're using a Public OAuth App, you don't need a Client Secret for client-side authentication.

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static files
npm run export
```

## Development

The development server runs on `http://localhost:3001`

## Static Export

This project is configured for static export. After building, the static files will be in the `out/` directory.

```bash
npm run export
```

The exported files can be deployed to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Cloudflare Pages

## Project Structure

```
├── app/
│   ├── auth/callback/     # OAuth callback page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/
│   ├── providers.tsx      # App providers
│   └── ui/                # shadcn/ui components
├── hooks/
│   └── useGitHubAuth.ts   # GitHub authentication hook
└── public/                # Static assets
```

## Authentication Flow

1. User clicks "Continue with GitHub"
2. Redirected to GitHub OAuth
3. User authorizes the application
4. GitHub redirects back to `/auth/callback`
5. Code is exchanged for access token (client-side)
6. Token and user data stored in localStorage
7. User redirected back to main page

## Deployment

### For Production

1. Update the GitHub OAuth App callback URL to your production domain
2. Set environment variables in your hosting platform
3. Build and deploy the static files

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `NEXT_PUBLIC_GITHUB_CLIENT_ID`

## Security Notes

- This implementation uses a **Public** GitHub OAuth App
- Client Secret is not required for Public OAuth Apps
- All authentication happens client-side
- Tokens are stored in localStorage (consider security implications)

## License

MIT
