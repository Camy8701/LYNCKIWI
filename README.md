# Lynck Services

## Project Overview

Lynck Services is a professional marketplace connecting homeowners with verified contractors in Hessen and North Rhine-Westphalia, Germany. The platform offers free quote comparisons for services including heating, solar, roofing, plumbing, electrical work, and renovations.

**URL**: https://lynckservices.com

## Technologies Used

This project is built with modern web technologies:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI component library
- **shadcn/ui** - Beautiful, accessible component system
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend and database
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

Install Node.js using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) (recommended):

```sh
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 18
nvm use 18
```

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd LYNCKSERVICES
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
LYNCKSERVICES/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and helpers
│   ├── contexts/       # React contexts
│   ├── integrations/   # Third-party integrations
│   └── main.tsx        # Application entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── tailwind.config.ts  # Tailwind CSS configuration
```

## Features

- 🔍 **Service Search** - Find contractors by service type and location
- 📝 **Quote Requests** - Submit free quote requests to multiple contractors
- ✅ **Verified Contractors** - All contractors are verified professionals
- 🌍 **Multi-language** - German and English support
- 📱 **Responsive Design** - Works on all devices
- 🎯 **SEO Optimized** - Built for German local search
- 🔒 **Secure** - Built with modern security practices

## Deployment

### Build for Production

```sh
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Hosting

You can deploy to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Connect your GitHub repository
- **AWS S3 + CloudFront**: Upload `dist/` folder
- **DigitalOcean App Platform**: Connect your GitHub repository

## Environment Variables

Create a `.env` file in the root directory (not included in git):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Create a Pull Request

## License

Copyright © 2024 Lynck Services. All rights reserved.

## Support

For support, please contact: support@lynckservices.com
